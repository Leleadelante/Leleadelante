import { juzgadosFamilia, juzgadosCiviles, juzgadosPenales, juzgadosContencioso, juzgadosComerciales, calcularProbabilidadExito } from "@/app/lib/judicial-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nombre = searchParams.get("nombre") || "";
  const tipo = searchParams.get("tipo") || "";
  const numero = searchParams.get("numero") || "";
  const bias = searchParams.get("bias") || "";
  const juezId = searchParams.get("juezId") || "";

  // Calcular probabilidad de éxito si se solicita
  if (juezId) {
    const probabilidad = calcularProbabilidadExito(juezId);
    if (!probabilidad) {
      return Response.json({ error: "Juez no encontrado" }, { status: 404 });
    }
    return Response.json({ probabilidad });
  }

  // Construir conjunto de todos los juzgados
  let todos = [
    ...juzgadosFamilia,
    ...juzgadosCiviles,
    ...juzgadosPenales,
    ...juzgadosContencioso,
    ...juzgadosComerciales,
  ];

  // Filtrar por tipo
  if (tipo) {
    todos = todos.filter((j) =>
      j.tipo.toLowerCase().includes(tipo.toLowerCase())
    );
  }

  // Filtrar por nombre de juez
  if (nombre) {
    todos = todos.filter((j) =>
      j.juez.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  // Filtrar por número
  if (numero) {
    const n = parseInt(numero, 10);
    if (!isNaN(n)) {
      todos = todos.filter((j) => j.numero === n);
    }
  }

  // Filtrar por nivel de bias
  if (bias) {
    todos = todos.filter(
      (j) =>
        j.estadisticas?.nivelBiasDetectado &&
        j.estadisticas.nivelBiasDetectado.toLowerCase() === bias.toLowerCase()
    );
  }

  return Response.json({
    total: todos.length,
    resultados: todos,
  });
}
