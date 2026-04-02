import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const PLANTILLAS = {
  amparo: {
    nombre: "Amparo Constitucional",
    sistema: `Eres un REDACTOR EXPERTO DE AMPAROS CONSTITUCIONALES ARGENTINOS.
Genera un amparo constitucional completo y riguroso basado en el Art. 43 de la CN.
El escrito debe incluir: encabezado formal, hechos, derecho, petitorio, y citas jurisprudenciales.
Usa formato legal argentino estándar con numeración y secciones correctas.`,
  },
  denuncia_penal: {
    nombre: "Denuncia Penal",
    sistema: `Eres un REDACTOR EXPERTO DE DENUNCIAS PENALES ARGENTINAS.
Genera una denuncia penal formal contra funcionarios públicos.
Incluye: identificación del denunciante, hechos, calificación legal, artículos del CP violados (248, 249, 250, 269), y solicitud de investigación.`,
  },
  daños_perjuicios: {
    nombre: "Demanda por Daños y Perjuicios",
    sistema: `Eres un EXPERTO EN RESPONSABILIDAD CIVIL ARGENTINA.
Genera una demanda formal por daños y perjuicios conforme al CCCN (Arts. 1708-1780).
Incluye: legitimación activa/pasiva, hechos, daños (emergente, lucro cesante, moral, psicológico), cuantificación y petitorio.`,
  },
  cidh: {
    nombre: "Petición ante la CIDH",
    sistema: `Eres un EXPERTO EN SISTEMA INTERAMERICANO DE DDHH.
Genera una petición formal ante la Comisión Interamericana de Derechos Humanos.
Incluye: datos del peticionario, Estado demandado (Argentina), hechos, derechos violados de la CADH, agotamiento de recursos internos, y petitorio.`,
  },
  onu: {
    nombre: "Presentación ante Comités ONU",
    sistema: `Eres un EXPERTO EN SISTEMA UNIVERSAL DE DDHH DE LA ONU.
Genera una comunicación individual ante el Comité de Derechos Humanos (PIDCP) o el Comité de los Derechos del Niño.
Incluye: identificación, hechos, artículos violados del tratado, y medidas solicitadas.`,
  },
  recurso_extraordinario: {
    nombre: "Recurso Extraordinario Federal",
    sistema: `Eres un EXPERTO EN RECURSO EXTRAORDINARIO ANTE LA CSJN.
Genera un recurso extraordinario federal conforme al Art. 14 de la Ley 48.
Incluye: cuestión federal, arbitrariedad de sentencia, gravedad institucional si aplica, y petitorio ante la CSJN.`,
  },
};

export async function POST(request) {
  try {
    const { tipo_escrito, datos_caso, partes, hechos, derechos_violados, petitorio } =
      await request.json();

    if (!tipo_escrito || !datos_caso) {
      return Response.json(
        { error: "Se requiere tipo de escrito y datos del caso" },
        { status: 400 }
      );
    }

    const plantilla = PLANTILLAS[tipo_escrito];
    if (!plantilla) {
      return Response.json(
        {
          error: `Tipo de escrito no válido. Opciones: ${Object.keys(PLANTILLAS).join(", ")}`,
        },
        { status: 400 }
      );
    }

    const prompt = `GENERAR ${plantilla.nombre.toUpperCase()}:

DATOS DEL CASO: ${datos_caso}
PARTES: ${partes || "A completar"}
HECHOS PRINCIPALES: ${hechos || "A completar"}
DERECHOS VIOLADOS: ${derechos_violados || "A determinar"}
PETITORIO: ${petitorio || "A definir según el análisis"}

Genera el escrito legal COMPLETO con todos los requisitos formales argentinos.
Incluye citas de jurisprudencia relevante de la CSJN y tribunales superiores.
El documento debe estar listo para presentar ante el tribunal correspondiente.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: plantilla.sistema },
        { role: "user", content: prompt },
      ],
      model: "llama-3-70b-versatile",
      temperature: 0.2,
      max_tokens: 4096,
    });

    const escrito = completion.choices[0].message.content;

    return Response.json({
      escrito,
      tipo: plantilla.nombre,
      plantillas_disponibles: Object.entries(PLANTILLAS).map(([key, val]) => ({
        id: key,
        nombre: val.nombre,
      })),
      tokens_usados: completion.usage?.total_tokens,
      disclaimer:
        "⚠️ Escrito generado por IA. Debe ser revisado y firmado por abogado matriculado antes de su presentación.",
    });
  } catch (error) {
    console.error("Error en generar-escritos:", error);
    return Response.json({ error: "Error generando el escrito legal" }, { status: 500 });
  }
}
