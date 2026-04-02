import Groq from "groq-sdk";
import judicialData from "@/app/lib/judicial-data";
const { jueces } = judicialData;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SISTEMA_ANALISIS_JUEZ = `Eres un ABOGADO EXPERTO EN DERECHO PROCESAL ARGENTINO especializado en análisis de patrones judiciales y detección de arbitrariedad.

CONOCIMIENTO BASE:
- Código Procesal Civil y Comercial de la Nación
- Código de Ética Judicial
- Art. 248, 249, 250 del Código Penal (abuso de autoridad, incumplimiento de deberes)
- Art. 269 CP (prevaricato)
- Ley de Juicio Político (Ley 25.320)
- CSJN: Doctrina de arbitrariedad de sentencias
- CADH Art. 8 (garantías judiciales) y Art. 25 (protección judicial)
- PIDCP Art. 14 (igualdad ante la ley)
- Acordada CSJN 1/2004 (Reglamento para la Justicia Nacional)

FORMATO DE RESPUESTA (JSON):
{
  "perfil_juez": {
    "nombre": "...",
    "tribunal": "...",
    "estadisticas": {}
  },
  "patrones_detectados": [
    { "patron": "...", "frecuencia": "alta/media/baja", "ejemplos": ["..."] }
  ],
  "discriminacion_sistematica": { "detectada": true/false, "descripcion": "..." },
  "contradicciones_jurisprudencia": ["contradicción 1"],
  "argumentos_recusacion": ["argumento 1", "argumento 2"],
  "denuncia_penal": {
    "articulos_aplicables": ["Art. 248 CP", "Art. 249 CP"],
    "fundamentos": "...",
    "borrador": "..."
  },
  "juicio_politico": {
    "viable": true/false,
    "causales": ["causal 1"],
    "procedimiento": "..."
  },
  "probabilidad_imparcialidad": 0.0,
  "recomendacion": "..."
}`;

export async function POST(request) {
  try {
    const { nombre_juez, resoluciones, tipo_caso, descripcion_sesgo } = await request.json();

    if (!nombre_juez) {
      return Response.json({ error: "Se requiere el nombre del juez" }, { status: 400 });
    }

    // Buscar juez en base de datos local
    const juezEncontrado = jueces.find(
      (j) =>
        j.nombre.toLowerCase().includes(nombre_juez.toLowerCase()) ||
        nombre_juez.toLowerCase().includes(j.nombre.toLowerCase().split(" ").slice(-1)[0])
    );

    const datosJuezLocal = juezEncontrado
      ? `
DATOS DEL JUEZ EN BASE DE DATOS:
- Nombre: ${juezEncontrado.nombre}
- Juzgado N°: ${juezEncontrado.nro_juzgado} (${juezEncontrado.tipo})
- Ubicación: ${juezEncontrado.ubicacion}
- Causas activas: ${juezEncontrado.causas_activas}
- Días promedio de resolución: ${juezEncontrado.dias_resolucion_promedio}
- Tasa de éxito en apelaciones: ${(juezEncontrado.tasa_exito_apelacion * 100).toFixed(0)}%
- Patrones de sesgo registrados: ${juezEncontrado.patrones_sesgo.join("; ") || "Ninguno registrado"}
`
      : "";

    const prompt = `ANALIZAR AL SIGUIENTE JUEZ:
Nombre: ${nombre_juez}
${datosJuezLocal}
Resoluciones/comportamientos a analizar: ${resoluciones || "No especificadas"}
Tipo de caso: ${tipo_caso || "No especificado"}
Descripción del sesgo observado: ${descripcion_sesgo || "No especificada"}

Analiza los patrones de conducta judicial, detecta posibles sesgos o arbitrariedad, 
y genera argumentos de recusación y posibles denuncias penales según corresponda.
Responde con el JSON completo en el formato indicado.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SISTEMA_ANALISIS_JUEZ },
        { role: "user", content: prompt },
      ],
      model: "llama-3-70b-versatile",
      temperature: 0.4,
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
      datos_locales: juezEncontrado || null,
      tokens_usados: completion.usage?.total_tokens,
      disclaimer:
        "⚠️ Análisis orientativo. Las denuncias deben ser presentadas por abogado matriculado.",
    });
  } catch (error) {
    console.error("Error en analizar-juez:", error);
    return Response.json({ error: "Error procesando análisis del juez" }, { status: 500 });
  }
}
