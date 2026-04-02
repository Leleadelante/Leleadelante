import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SISTEMA_DERECHOS_NINO = `Eres un EXPERTO EN DERECHOS DEL NIÑO Y DERECHO FAMILIAR ARGENTINO con profundo conocimiento en psicología del desarrollo infantil.

MARCO LEGAL APLICABLE:
- Convención sobre los Derechos del Niño (CDN) - Ley 23.849 (rango constitucional)
- Ley 26.061 (Protección Integral de los Derechos de las Niñas, Niños y Adolescentes)
- Código Civil y Comercial - Libro II (Relaciones de familia)
- Ley 26.579 (Mayoría de edad)
- Art. 3 CDN: Interés Superior del Niño
- Art. 8 CDN: Derecho a la identidad
- Art. 9 CDN: Derecho a no ser separado de sus padres
- CADH Art. 17 (Protección a la familia) y Art. 19 (Derechos del niño)
- Observaciones Generales del Comité de los Derechos del Niño (ONU)
- Principios de Yogyakarta

CONOCIMIENTO PSICOLÓGICO:
- Teoría del Apego (Bowlby/Ainsworth)
- DSM-5: Trastorno de Estrés Postraumático, Trastorno de Ansiedad por Separación
- CIE-11 (OMS): Clasificación de daños psicológicos
- Daño institucional: impacto de separación forzada
- Síndrome de Alienación Parental (SAP) y sus controversias
- Evaluación forense del testimonio infantil (NICHD Protocol)

FORMATO DE RESPUESTA (JSON):
{
  "evaluacion_situacion": "...",
  "derechos_vulnerados": [
    { "derecho": "...", "norma": "Art. X CDN / Ley Y", "descripcion": "...", "gravedad": "alta/media/baja" }
  ],
  "daño_psicologico": {
    "tipo": "...",
    "base_cientifica": "DSM-5 / CIE-11 / Bowlby",
    "descripcion": "...",
    "consecuencias_largo_plazo": ["..."],
    "evidencia_requerida": ["..."]
  },
  "violaciones_institucionales": ["..."],
  "indemnizacion": {
    "daño_moral": "$...",
    "daño_psicologico": "$...",
    "daño_al_proyecto_de_vida": "$...",
    "total_estimado": "$...",
    "base_calculo": "..."
  },
  "medidas_restauracion": [
    { "medida": "...", "urgencia": "alta/media/baja", "fundamento": "..." }
  ],
  "estrategia_reunificacion": {
    "viable": true/false,
    "pasos": ["paso 1"],
    "organismos_a_involucrar": ["..."],
    "plazo_estimado": "..."
  },
  "acciones_inmediatas": ["acción 1"]
}`;

export async function POST(request) {
  try {
    const { descripcion_situacion, edad_nino, tiempo_separacion, tipo_vulneracion } =
      await request.json();

    if (!descripcion_situacion) {
      return Response.json(
        { error: "Se requiere descripción de la situación del niño" },
        { status: 400 }
      );
    }

    const prompt = `ANALIZAR SITUACIÓN DE DERECHOS DEL NIÑO:

Descripción de la situación: ${descripcion_situacion}
Edad del niño/a: ${edad_nino || "No especificada"}
Tiempo de separación (si aplica): ${tiempo_separacion || "No especificado"}
Tipo de vulneración: ${tipo_vulneracion || "A determinar"}

Analiza los derechos vulnerados, el daño psicológico causado, y diseña un plan de restauración.
Aplica el principio del INTERÉS SUPERIOR DEL NIÑO como eje central.
Responde con el JSON completo en el formato indicado.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SISTEMA_DERECHOS_NINO },
        { role: "user", content: prompt },
      ],
      model: "llama-3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
    });

    const respuesta = completion.choices[0].message.content;

    let analisis;
    try {
      const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
      analisis = jsonMatch ? JSON.parse(jsonMatch[0]) : { texto_completo: respuesta };
    } catch {
      analisis = { texto_completo: respuesta };
    }

    return Response.json({
      analisis,
      tokens_usados: completion.usage?.total_tokens,
      disclaimer:
        "⚠️ Análisis orientativo. El interés superior del niño debe determinarse caso por caso con profesionales.",
    });
  } catch (error) {
    console.error("Error en derechos-nino:", error);
    return Response.json({ error: "Error procesando análisis de derechos del niño" }, { status: 500 });
  }
}
