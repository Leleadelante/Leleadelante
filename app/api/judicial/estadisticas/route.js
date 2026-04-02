import { juzgadosFamilia } from "@/app/lib/judicial-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const juezId = searchParams.get("juezId") || "";

  // Estadísticas de un juez específico
  if (juezId) {
    const juez = juzgadosFamilia.find((j) => j.id === juezId);
    if (!juez) {
      return Response.json({ error: "Juez no encontrado" }, { status: 404 });
    }
    return Response.json({
      juez: juez.juez,
      juzgado: `Juzgado de Familia N°${juez.numero}`,
      estadisticas: juez.estadisticas,
      especialidades: juez.especialidades,
    });
  }

  // Ranking general del fuero de familia
  const total = juzgadosFamilia.length;
  const causasTotal = juzgadosFamilia.reduce((s, j) => s + j.estadisticas.causasActivas, 0);
  const tiempoPromedio = Math.round(
    juzgadosFamilia.reduce((s, j) => s + j.estadisticas.tiempoPromedioResolucionDias, 0) / total
  );
  const tasaApelacionPromedio = (
    juzgadosFamilia.reduce((s, j) => s + j.estadisticas.tasaApelacionesExitosas, 0) / total
  ).toFixed(3);

  const ranking = [...juzgadosFamilia]
    .sort((a, b) => a.estadisticas.tiempoPromedioResolucionDias - b.estadisticas.tiempoPromedioResolucionDias)
    .map((j, idx) => ({
      posicion: idx + 1,
      id: j.id,
      juez: j.juez,
      numero: j.numero,
      causasActivas: j.estadisticas.causasActivas,
      tiempoPromedioResolucionDias: j.estadisticas.tiempoPromedioResolucionDias,
      tasaApelacionesExitosas: j.estadisticas.tasaApelacionesExitosas,
      nivelBias: j.estadisticas.nivelBiasDetectado,
    }));

  const alertasBias = juzgadosFamilia
    .filter((j) => ["Alto", "Crítico"].includes(j.estadisticas.nivelBiasDetectado))
    .map((j) => ({
      id: j.id,
      juez: j.juez,
      nivel: j.estadisticas.nivelBiasDetectado,
      patrones: j.estadisticas.patronesDetectados,
      tasaApelaciones: j.estadisticas.tasaApelacionesExitosas,
    }));

  return Response.json({
    resumenFueroFamilia: {
      totalJuzgados: total,
      causasTotales: causasTotal,
      tiempoPromedioResolucionDias: tiempoPromedio,
      tasaApelacionesExitosasPromedio: tasaApelacionPromedio,
    },
    rankingPorVelocidad: ranking,
    alertasBias,
  });
}
