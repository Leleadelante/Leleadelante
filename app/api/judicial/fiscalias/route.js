import { fiscalias } from "@/app/lib/judicial-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo") || "";
  const especialidad = searchParams.get("especialidad") || "";
  const nombre = searchParams.get("nombre") || "";

  let resultados = fiscalias;

  if (tipo) {
    resultados = resultados.filter((f) =>
      f.tipo.toLowerCase().includes(tipo.toLowerCase())
    );
  }

  if (especialidad) {
    resultados = resultados.filter((f) =>
      (f.especialidad || "").toLowerCase().includes(especialidad.toLowerCase()) ||
      (f.especialidades || []).some((e) =>
        e.toLowerCase().includes(especialidad.toLowerCase())
      )
    );
  }

  if (nombre) {
    resultados = resultados.filter((f) =>
      f.fiscal.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  const resumen = {
    total: fiscalias.length,
    federales: fiscalias.filter((f) => f.tipo === "Federal").length,
    ordinarias: fiscalias.filter((f) => f.tipo === "Ordinaria").length,
    especializadas: fiscalias.filter((f) => f.tipo === "Especializada").length,
  };

  return Response.json({ resumen, total: resultados.length, resultados });
}
