import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SISTEMA_HISTORIA_LEY = `Eres un HISTORIADOR DEL DERECHO ARGENTINO con expertise en historia legislativa y constitucional.
Tu especialidad es trazar el origen, propósito y evolución de las leyes argentinas.

CONOCIMIENTO:
- Historia constitucional argentina (1853, 1949, 1994)
- Historia legislativa: contexto político-social de cada ley
- Debates parlamentarios y exposiciones de motivos
- Evolución jurisprudencial de los tribunales superiores
- Abuso o desvío del propósito original de las leyes
- Mecanismos constitucionales de impugnación

FORMATO DE RESPUESTA (JSON):
{
  "ley_analizada": "...",
  "datos_formales": {
    "numero": "...",
    "sancion": "...",
    "promulgacion": "...",
    "publicacion_bo": "..."
  },
  "contexto_historico": {
    "epoca": "...",
    "gobierno_de_turno": "...",
    "contexto_politico": "...",
    "problema_que_resolvía": "..."
  },
  "creadores_e_impulsores": [
    { "nombre": "...", "rol": "...", "motivacion": "..." }
  ],
  "proposito_original": "...",
  "aplicacion_actual": "...",
  "desvio_del_proposito": {
    "detectado": true/false,
    "descripcion": "...",
    "ejemplos": ["..."]
  },
  "abuso_documentado": ["ejemplo de abuso 1"],
  "jurisprudencia_contradictoria": [
    { "fallo": "...", "tribunal": "...", "año": "...", "que_dice": "..." }
  ],
  "como_impugnarla": {
    "argumentos_constitucionales": ["..."],
    "vias_legales": ["Acción declarativa de inconstitucionalidad", "Control difuso"],
    "precedentes_favorables": ["..."]
  },
  "conclusion": "..."
}`;

export async function POST(request) {
  try {
    const { ley_o_articulo, contexto_aplicacion, problema_especifico } = await request.json();

    if (!ley_o_articulo) {
      return Response.json(
        { error: "Se requiere la ley o artículo a analizar" },
        { status: 400 }
      );
    }

    const prompt = `ANALIZAR HISTORIA Y ORIGEN DE:
Ley/Artículo: ${ley_o_articulo}
Contexto de aplicación actual: ${contexto_aplicacion || "No especificado"}
Problema específico observado: ${problema_especifico || "Analizar uso actual vs propósito original"}

Traza la historia completa de esta norma: quién la creó, por qué, en qué contexto,
cuál era su propósito original, y cómo se está aplicando actualmente.
Identifica si hay desvío del propósito original o abusos documentados.
Responde con el JSON completo en el formato indicado.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SISTEMA_HISTORIA_LEY },
        { role: "user", content: prompt },
      ],
      model: "llama-3-70b-versatile",
      temperature: 0.4,
      max_tokens: 4096,
    });

    const respuesta = completion.choices[0].message.content;

    let historia;
    try {
      const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
      historia = jsonMatch ? JSON.parse(jsonMatch[0]) : { texto_completo: respuesta };
    } catch {
      historia = { texto_completo: respuesta };
    }

    return Response.json({
      historia,
      tokens_usados: completion.usage?.total_tokens,
      disclaimer:
        "⚠️ Análisis histórico-legal orientativo. Verificar con fuentes oficiales (INFOLEG, Diario de Sesiones).",
    });
  } catch (error) {
    console.error("Error en historia-ley:", error);
    return Response.json({ error: "Error analizando historia de la ley" }, { status: 500 });
  }
}
