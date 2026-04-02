import Groq from "@groq/sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
 try {
 const { pregunta, tipo_consulta } = await request.json();
 if (!pregunta || !tipo_consulta) {
 return Response.json({ error: "Falta pregunta o tipo de consulta" }, { status: 400 });
 }
 const contextoLegal = `Eres un ABOGADO ESPECIALIZADO EN DERECHO ARGENTINO. CONOCIMIENTO: Constitución Nacional Argentina (1994), Código Civil y Comercial (2015), Código Penal, Leyes Federales, Jurisprudencia Corte Suprema. INSTRUCCIONES: 1. Cita ESPECÍFICAMENTE la ley/artículo 2. Explica en lenguaje simple 3. Ofrece alternativas legales 4. Advierte sobre riesgos 5. Recomienda consultar abogado si es complejo. FORMATO: 📜 LEY APLICABLE: [Artículo] ⚖️ ANÁLISIS: [Tu análisis] ✅ RECOMENDACIÓN: [Qué hacer] ⚠️ ADVERTENCIA: [Si aplica] Tipo: ${tipo_consulta}`;
 const completion = await groq.chat.completions.create({
 messages: [{ role: "system", content: contextoLegal }, { role: "user", content: pregunta }],
 model: "llama-3-70b-versatile",
 temperature: 0.5,
 max_tokens: 2048,
 });
 return Response.json({ respuesta: completion.choices[0].message.content, tipo: tipo_consulta, tokens: completion.usage.total_tokens, disclaimer: "⚠️ Información orientativa. Consulta con abogado profesional.", });
 } catch (error) {
 console.error("Error:", error);
 return Response.json({ error: "Error procesando consulta" }, { status: 500 });
 }
}