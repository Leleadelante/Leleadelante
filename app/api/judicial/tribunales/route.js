import {
  juzgadosFamilia,
  juzgadosCiviles,
  juzgadosPenales,
  juzgadosContencioso,
  juzgadosComerciales,
} from "@/app/lib/judicial-data";

const TIPOS = {
  familia: juzgadosFamilia,
  civil: juzgadosCiviles,
  penal: juzgadosPenales,
  "contencioso administrativo": juzgadosContencioso,
  comercial: juzgadosComerciales,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tipo = searchParams.get("tipo") || "";
  const direccion = searchParams.get("direccion") || "";

  // Resumen de todos los tipos
  if (!tipo && !direccion) {
    return Response.json({
      resumen: Object.entries(TIPOS).map(([nombre, lista]) => ({
        tipo: nombre,
        cantidad: lista.length,
        direcciones: [...new Set(lista.map((j) => j.direccion))],
      })),
      totalTribunales: Object.values(TIPOS).reduce((s, l) => s + l.length, 0),
    });
  }

  let resultados = [];
  if (tipo) {
    const key = Object.keys(TIPOS).find((k) =>
      k.toLowerCase().includes(tipo.toLowerCase())
    );
    resultados = key ? TIPOS[key] : [];
  } else {
    resultados = Object.values(TIPOS).flat();
  }

  if (direccion) {
    resultados = resultados.filter((j) =>
      j.direccion.toLowerCase().includes(direccion.toLowerCase())
    );
  }

  return Response.json({ total: resultados.length, resultados });
}
