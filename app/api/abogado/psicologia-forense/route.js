import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SISTEMA_PSICOLOGIA_FORENSE = `Eres un PSICÓLOGO FORENSE EXPERTO con amplio conocimiento en psicología del desarrollo, trauma, y evaluación del daño psicológico en contextos legales argentinos.

BASE CIENTÍFICA:
- DSM-5 (Manual Diagnóstico y Estadístico de Trastornos Mentales)
- CIE-11 (Clasificación Internacional de Enfermedades - OMS)
- Teoría del Apego: Bowlby (1969), Ainsworth (1978), Main & Hesse (1990)
- Trauma complejo y desarrollo (Van der Kolk, Herman)
- TEPT en niños y adultos (criterios diagnósticos actualizados)
- Evaluación del daño psíquico en sede judicial (Dr. Mariano Castex, CSJN)
- Baremo de daño psíquico argentino
- Protocolo NICHD para entrevistas forenses a niños
- Daño institucional: impacto de separación forzosa del Estado

MARCO LEGAL:
- Art. 1738 CCCN: Daño resarcible (daño psicológico incluido)
- Art. 1740 CCCN: Reparación plena
- CSJN: "Arostegui" (2008) - cuantificación del daño
- Ley 24.557 y baremos actualizados
- Estándares OMS para evaluación forense

FORMATO DE RESPUESTA (JSON):
{
  "evaluacion_clinica": {
    "sintomas_reportados": ["..."],
    "diagnosticos_probables": [
      { "diagnostico": "TEPT / TAD / ...", "dsm5": "F43.10", "descripcion": "..." }
    ],
    "nivel_daño": "leve/moderado/grave/muy grave"
  },
  "base_cientifica": {
    "teorias_aplicables": ["Teoría del Apego - Bowlby", "..."],
    "estudios_relevantes": ["..."],
    "consenso_cientifico": "..."
  },
  "consecuencias": {
    "corto_plazo": ["..."],
    "mediano_plazo": ["..."],
    "largo_plazo": ["..."],
    "desarrollo_evolutivo": "Impacto en el desarrollo normal del niño/adulto"
  },
  "cuantificacion_daño": {
    "incapacidad_porcentual": "X%",
    "tratamiento_necesario": {
      "tipo": "...",
      "duracion_estimada": "... años",
      "frecuencia": "X sesiones/semana",
      "costo_por_sesion": "$...",
      "costo_total_tratamiento": "$..."
    },
    "daño_psicologico_resarcible": "$...",
    "daño_moral": "$...",
    "proyecto_de_vida_afectado": "$...",
    "total_daño_estimado": "$..."
  },
  "peritaje_recomendado": {
    "tipo_pericia": "...",
    "instrumentos": ["MMPI-2", "Rorschach", "BDI-II", "..."],
    "profesional_requerido": "Psicólogo/Psiquiatra forense matriculado"
  },
  "modelo_informe_pericial": "Texto modelo para informe pericial...",
  "evidencia_para_juicio": ["elemento probatorio 1"],
  "referencias_bibliograficas": ["Bowlby, J. (1969)...", "DSM-5 (2013)..."]
}`;

export async function POST(request) {
  try {
    const { descripcion_situacion, edad_persona, tiempo_exposicion, tipo_trauma, contexto_legal } =
      await request.json();

    if (!descripcion_situacion) {
      return Response.json(
        { error: "Se requiere descripción de la situación psicológica a evaluar" },
        { status: 400 }
      );
    }

    const prompt = `EVALUACIÓN PSICOLÓGICO-FORENSE:

Descripción de la situación: ${descripcion_situacion}
Edad de la persona afectada: ${edad_persona || "No especificada"}
Tiempo de exposición al evento traumático: ${tiempo_exposicion || "No especificado"}
Tipo de trauma/situación: ${tipo_trauma || "A determinar"}
Contexto legal del caso: ${contexto_legal || "No especificado"}

Realiza una evaluación psicológico-forense completa.
Aplica criterios científicos del DSM-5 y CIE-11.
Cuantifica el daño psicológico de manera que sea útil para un reclamo legal en Argentina.
Genera un modelo de informe pericial que pueda ser usado en sede judicial.
Responde con el JSON completo en el formato indicado.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SISTEMA_PSICOLOGIA_FORENSE },
        { role: "user", content: prompt },
      ],
      model: "llama-3-70b-versatile",
      temperature: 0.3,
      max_tokens: 4096,
    });

    const respuesta = completion.choices[0].message.content;

    let evaluacion;
    try {
      const jsonMatch = respuesta.match(/\{[\s\S]*\}/);
      evaluacion = jsonMatch ? JSON.parse(jsonMatch[0]) : { texto_completo: respuesta };
    } catch {
      evaluacion = { texto_completo: respuesta };
    }

    return Response.json({
      evaluacion,
      tokens_usados: completion.usage?.total_tokens,
      disclaimer:
        "⚠️ Evaluación orientativa generada por IA. Un peritaje oficial debe ser realizado por psicólogo/psiquiatra forense matriculado.",
    });
  } catch (error) {
    console.error("Error en psicologia-forense:", error);
    return Response.json(
      { error: "Error procesando evaluación psicológico-forense" },
      { status: 500 }
    );
  }
}
