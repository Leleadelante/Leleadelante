'use client';
import { useState } from 'react';

export default function EstrategiaCompleta() {
  const [descripcion, setDescripcion] = useState('');
  const [violaciones, setViolaciones] = useState('');
  const [juez, setJuez] = useState('');
  const [urgencia, setUrgencia] = useState('alta');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleGenerar = async () => {
    if (!descripcion.trim()) {
      setError('Por favor describa su caso');
      return;
    }
    setCargando(true);
    setError('');
    setResultado(null);
    try {
      const res = await fetch('/api/abogado/estrategia-multinivel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          descripcion_caso: descripcion,
          violaciones_identificadas: violaciones,
          juez_asignado: juez,
          urgencia,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error al generar la estrategia');
    } finally {
      setCargando(false);
    }
  };

  const estrategia = resultado?.estrategia;

  const ProbabilidadBar = ({ valor, label }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold">{(valor * 100).toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${valor >= 0.6 ? 'bg-green-500' : valor >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${(valor * 100).toFixed(0)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-green-900 mb-1">🎯 Estrategia Legal Multinivel</h2>
        <p className="text-sm text-green-700">
          Diseñe una estrategia legal completa combinando recursos nacionales e internacionales.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Caso *</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describa su situación legal en detalle: qué ocurrió, cuándo, quiénes están involucrados, qué decisiones se han tomado..."
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Violaciones ya Identificadas</label>
          <textarea
            value={violaciones}
            onChange={(e) => setViolaciones(e.target.value)}
            placeholder="Liste las violaciones legales que ya detectó: Art. X Ley Y, incumplimiento de la CDN, etc."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Juez Asignado</label>
            <input
              type="text"
              value={juez}
              onChange={(e) => setJuez(e.target.value)}
              placeholder="Nombre del juez (si aplica)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Urgencia</label>
            <select
              value={urgencia}
              onChange={(e) => setUrgencia(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="critica">🔴 Crítica (riesgo inmediato)</option>
              <option value="alta">🟠 Alta (requiere acción urgente)</option>
              <option value="media">🟡 Media (plazo de semanas)</option>
              <option value="baja">🟢 Baja (planificación a largo plazo)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      <button
        onClick={handleGenerar}
        disabled={cargando}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {cargando ? '⏳ Diseñando estrategia...' : '🎯 Generar Estrategia Multinivel'}
      </button>

      {resultado && estrategia && (
        <div className="space-y-4 border-t pt-6">
          {estrategia.resumen_situacion && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">📋 Situación</h3>
              <p className="text-sm text-gray-700">{estrategia.resumen_situacion}</p>
            </div>
          )}

          {estrategia.prioridad_maxima && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <p className="font-bold text-red-800">⚡ ACCIÓN PRIORITARIA AHORA:</p>
              <p className="text-red-700 mt-1">{estrategia.prioridad_maxima}</p>
            </div>
          )}

          {estrategia.probabilidad_exito_global !== undefined && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">📊 Probabilidad de Éxito Global</h3>
              <ProbabilidadBar valor={estrategia.probabilidad_exito_global} label="Probabilidad global" />
            </div>
          )}

          {estrategia.leyes_violadas?.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-bold text-red-800 mb-3">⚠️ Leyes Violadas</h3>
              <div className="space-y-2">
                {estrategia.leyes_violadas.map((l, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-red-100">
                    <p className="font-semibold text-sm text-red-700">{l.norma} - {l.articulo}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{l.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {estrategia.estrategia_nacional && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-blue-800 mb-3">🇦🇷 Estrategia Nacional</h3>

              {estrategia.estrategia_nacional.acciones_inmediatas?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-blue-700 mb-2">🔴 Acciones Inmediatas</p>
                  <div className="space-y-2">
                    {estrategia.estrategia_nacional.acciones_inmediatas.map((a, i) => (
                      <div key={i} className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-sm">{a.accion}</p>
                          {a.probabilidad_exito !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.probabilidad_exito >= 0.6 ? 'bg-green-100 text-green-700' : a.probabilidad_exito >= 0.4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {(a.probabilidad_exito * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                        {a.plazo && <p className="text-xs text-gray-500">⏱️ Plazo: {a.plazo}</p>}
                        {a.descripcion && <p className="text-xs text-gray-600 mt-1">{a.descripcion}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {estrategia.estrategia_nacional.acciones_mediano_plazo?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-blue-700 mb-2">🟡 Mediano Plazo</p>
                  <ul className="space-y-1">
                    {estrategia.estrategia_nacional.acciones_mediano_plazo.map((a, i) => (
                      <li key={i} className="text-sm text-gray-700">• {typeof a === 'string' ? a : a.accion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {estrategia.escalada_internacional && (
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="font-bold text-purple-800 mb-3">🌎 Escalada Internacional</h3>
              {estrategia.escalada_internacional.organos_disponibles?.length > 0 && (
                <div className="space-y-2 mb-3">
                  {estrategia.escalada_internacional.organos_disponibles.map((o, i) => (
                    <div key={i} className="bg-white rounded-lg p-3 border border-purple-100">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-purple-700">{o.organo}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${o.viabilidad === 'alta' ? 'bg-green-100 text-green-700' : o.viabilidad === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {o.viabilidad?.toUpperCase()}
                        </span>
                      </div>
                      {o.requisitos && <p className="text-xs text-gray-500">Requisitos: {o.requisitos}</p>}
                      {o.plazo_respuesta && <p className="text-xs text-gray-500">Respuesta estimada: {o.plazo_respuesta}</p>}
                    </div>
                  ))}
                </div>
              )}
              {estrategia.escalada_internacional.orden_recomendado?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-purple-700 mb-1">Orden recomendado:</p>
                  <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                    {estrategia.escalada_internacional.orden_recomendado.map((paso, i) => (
                      <li key={i}>{paso}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {estrategia.cronograma?.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">📅 Cronograma</h3>
              <div className="space-y-2">
                {estrategia.cronograma.map((semana, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                      Sem. {semana.semana || i + 1}
                    </span>
                    <ul className="text-sm text-gray-700 space-y-0.5">
                      {(semana.acciones || []).map((a, j) => (
                        <li key={j}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {estrategia.texto_completo && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">📄 Análisis Completo</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{estrategia.texto_completo}</pre>
            </div>
          )}

          <p className="text-xs text-gray-500 italic">{resultado.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
