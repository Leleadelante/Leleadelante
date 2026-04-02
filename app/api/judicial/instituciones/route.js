import { instituciones, organismosDenuncia, marcosLegales } from "@/app/lib/judicial-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const entidad = searchParams.get("entidad") || "";

  if (entidad.toUpperCase() === "CIF") {
    return Response.json({ entidad: instituciones.CIF });
  }

  if (entidad.toUpperCase() === "OVD") {
    return Response.json({ entidad: instituciones.OVD });
  }

  if (entidad.toUpperCase() === "DENUNCIA") {
    return Response.json({ organismosDenuncia });
  }

  if (entidad.toUpperCase() === "LEYES") {
    return Response.json({ marcosLegales });
  }

  // Sin filtro: devolver todo
  return Response.json({
    instituciones,
    organismosDenuncia,
    marcosLegales,
  });
}
