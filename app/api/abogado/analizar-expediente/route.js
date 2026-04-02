import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SISTEMA_ANALISIS_EXPEDIENTE = `Eres un ABOGADO EXPERTO EN DERECHO ARGENTINO especializado en análisis de expedientes judiciales.
Tu tarea es analizar el contenido de expedientes y extraer información crítica.

CONOCIMIENTO BASE:
- Constitución Nacional Argentina (1994)
- Código Civil y Comercial de la Nación (Ley 26.994)
- Código Penal de la Nación
- Ley 26.061 (Protección Integral de Derechos del Niño)
- Ley 24.417 (Protección contra la Violencia Familiar)
- Ley 26.485 (Violencia de Género)
- Convención sobre los Derechos del Niño (CDN)
- Convención Americana sobre Derechos Humanos (CADH)
- Pacto Internacional de Derechos Civiles y Políticos (PIDCP)
- Jurisprudencia CSJN y Corte Interamericana de DDHH

FORMATO DE RESPUESTA (JSON):
{
  "resumen_ejecutivo": "Descripción breve del caso",
  "partes": { "actora": "...", "demandada": "...", "menores": "..." },
  "hechos_clave": ["hecho 1", "hecho 2"],
  "violaciones_legales": [
    { "norma": "Art. X, Ley Y", "descripcion": "...", "gravedad": "alta/media/baja" }
  ],
  "contradicciones": ["contradicción 1"],
  "negligencia_institucional": ["ejemplo 1"],
  "estrategias_recomendadas": ["estrategia 1"],
  "recursos_internacionales": ["CIDH", "ONU"],
  "estimacion_daños": {
    "psicologico": "$...",
    "moral": "$...",
    "economico": "$...",
    "total_estimado": "$..."
  },
  "urgencia": "alta/media/baja",
  "proximo_paso": "Acción inmediata recomendada"
}`;

export async function POST(request) {
  try {
    const { texto_expediente, tipo_caso, partes_involucradas } = await request.json();

    if (!texto_expediente) {
      return Response.json({ error: "Se requiere el texto del expediente" }, { status: 400 });
    }

    const prompt = `EXPEDIENTE A ANALIZAR:
${texto_expediente}

Tipo de caso: ${tipo_caso || "No especificado"}
Partes involucradas: ${partes_involucradas || "No especificadas"}

Analiza este expediente en detalle y devuelve un JSON con el análisis completo según el formato indicado.
Identifica TODAS las violaciones legales, negligencias institucionales y oportunidades estratégicas.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SISTEMA_ANALISIS_EXPEDIENTE },
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
        "⚠️ Análisis orientativo generado por IA. Debe ser revisado por un abogado matriculado.",
    });
  } catch (error) {
    console.error("Error en analizar-expediente:", error);
    return Response.json({ error: "Error procesando el expediente" }, { status: 500 });
  }
}
