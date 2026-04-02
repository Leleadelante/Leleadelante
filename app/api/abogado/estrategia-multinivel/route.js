import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SISTEMA_ESTRATEGIA = `Eres un ESTRATEGA LEGAL EXPERTO EN DERECHO ARGENTINO E INTERNACIONAL.
Tu especialidad es diseñar estrategias legales multinivel que combinan recursos nacionales e internacionales.

HERRAMIENTAS LEGALES DISPONIBLES:
NACIONALES:
- Acción de Amparo (Art. 43 CN)
- Habeas Corpus (Art. 43 CN)
- Recurso Extraordinario Federal (Art. 14 Ley 48)
- Queja por denegación de recurso
- Denuncia penal (Arts. 248-250 CP)
- Juicio Político (Constitución Nacional)
- Denuncia ante el Consejo de la Magistratura
- Medidas cautelares urgentes

INTERNACIONALES:
- Comisión Interamericana de DDHH (CIDH) - OEA
- Corte Interamericana de DDHH
- Comité de Derechos del Niño - ONU
- Comité de DDHH - PIDCP
- Relatoría Especial ONU (niños, violencia, familia)
- Alto Comisionado ONU para DDHH

TRATADOS APLICABLES:
- CADH (Pacto de San José de Costa Rica)
- PIDCP (Pacto Internacional de Derechos Civiles y Políticos)
- CDN (Convención sobre los Derechos del Niño)
- CEDAW (Eliminación de todas las formas de discriminación contra la mujer)

FORMATO DE RESPUESTA (JSON):
{
  "resumen_situacion": "...",
  "leyes_violadas": [
    { "norma": "...", "articulo": "...", "descripcion": "..." }
  ],
  "estrategia_nacional": {
    "acciones_inmediatas": [
      { "accion": "...", "plazo": "...", "probabilidad_exito": 0.0, "descripcion": "..." }
    ],
    "acciones_mediano_plazo": [],
    "acciones_largo_plazo": []
  },
  "escalada_internacional": {
    "organos_disponibles": [
      { "organo": "CIDH", "requisitos": "...", "plazo_respuesta": "...", "viabilidad": "alta/media/baja" }
    ],
    "orden_recomendado": ["paso 1", "paso 2"]
  },
  "probabilidad_exito_global": 0.0,
  "cronograma": [
    { "semana": 1, "acciones": ["..."] }
  ],
  "recursos_necesarios": ["recurso 1"],
  "prioridad_maxima": "Acción más urgente a tomar HOY"
}`;

export async function POST(request) {
  try {
    const { descripcion_caso, violaciones_identificadas, juez_asignado, urgencia } =
      await request.json();

    if (!descripcion_caso) {
      return Response.json({ error: "Se requiere descripción del caso" }, { status: 400 });
    }

    const prompt = `DISEÑAR ESTRATEGIA LEGAL MULTINIVEL PARA:

Descripción del caso: ${descripcion_caso}
Violaciones identificadas: ${violaciones_identificadas || "A determinar"}
Juez asignado: ${juez_asignado || "No especificado"}
Nivel de urgencia: ${urgencia || "Alta"}

Diseña una estrategia legal COMPLETA que incluya todas las opciones nacionales e internacionales disponibles.
Ordena las acciones por urgencia y probabilidad de éxito.
Responde con el JSON completo en el formato indicado.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SISTEMA_ESTRATEGIA },
        { role: "user", content: prompt },
      ],
      model: "llama-3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
    });

    const respuesta = completion.choices[0].message.content;

    let estrategia;
    try {
      const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
      estrategia = jsonMatch ? JSON.parse(jsonMatch[0]) : { texto_completo: respuesta };
    } catch {
      estrategia = { texto_completo: respuesta };
    }

    return Response.json({
      estrategia,
      tokens_usados: completion.usage?.total_tokens,
      disclaimer:
        "⚠️ Estrategia orientativa generada por IA. Debe ser validada por abogado matriculado.",
    });
  } catch (error) {
    console.error("Error en estrategia-multinivel:", error);
    return Response.json({ error: "Error generando estrategia" }, { status: 500 });
  }
}
