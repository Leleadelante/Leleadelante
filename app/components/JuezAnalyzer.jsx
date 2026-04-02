'use client';
import { useState } from 'react';

export default function JuezAnalyzer() {
  const [nombreJuez, setNombreJuez] = useState('');
  const [resoluciones, setResoluciones] = useState('');
  const [tipoCaso, setTipoCaso] = useState('familia');
  const [descripcionSesgo, setDescripcionSesgo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleAnalizar = async () => {
    if (!nombreJuez.trim()) {
      setError('Por favor ingrese el nombre del juez');
      return;
    }
    setCargando(true);
    setError('');
    setResultado(null);
    try {
      const res = await fetch('/api/abogado/analizar-juez', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_juez: nombreJuez,
          resoluciones,
          tipo_caso: tipoCaso,
          descripcion_sesgo: descripcionSesgo,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error al analizar el juez');
    } finally {
      setCargando(false);
    }
  };

  const analisis = resultado?.analisis;
  const datosLocales = resultado?.datos_locales;

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-orange-900 mb-1">⚖️ Analizador de Jueces</h2>
        <p className="text-sm text-orange-700">
          Analice patrones de conducta judicial, detecte sesgos y genere argumentos de recusación.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Juez / Magistrado</label>
          <input
            type="text"
            value={nombreJuez}
            onChange={(e) => setNombreJuez(e.target.value)}
            placeholder="Ej: Dr. Juan Pérez / Dra. María García"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Caso</label>
          <select
            value={tipoCaso}
            onChange={(e) => setTipoCaso(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="familia">⚖️ Familia</option>
            <option value="penal">🔒 Penal</option>
            <option value="civil">📋 Civil</option>
            <option value="administrativo">🏛️ Administrativo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Sesgo / Comportamiento Cuestionable
          </label>
          <textarea
            value={descripcionSesgo}
            onChange={(e) => setDescripcionSesgo(e.target.value)}
            placeholder="Describa el patrón de conducta observado: demoras injustificadas, favoritismo, resoluciones sin fundamento..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Resoluciones Específicas a Analizar (opcional)
          </label>
          <textarea
            value={resoluciones}
            onChange={(e) => setResoluciones(e.target.value)}
            placeholder="Copie aquí el texto de resoluciones o sentencias específicas que desea analizar..."
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      <button
        onClick={handleAnalizar}
        disabled={cargando}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {cargando ? '⏳ Analizando patrones judiciales...' : '🔍 Analizar Juez con IA'}
      </button>

      {datosLocales && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-bold text-blue-800 mb-2">📊 Datos en Base de Datos Local</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-500">Tribunal:</span> <span className="font-medium">{datosLocales.tipo} N°{datosLocales.nro_juzgado}</span></div>
            <div><span className="text-gray-500">Ubicación:</span> <span className="font-medium">{datosLocales.ubicacion}</span></div>
            <div><span className="text-gray-500">Causas activas:</span> <span className="font-medium">{datosLocales.causas_activas}</span></div>
            <div><span className="text-gray-500">Días prom. resolución:</span> <span className="font-medium">{datosLocales.dias_resolucion_promedio} días</span></div>
            <div><span className="text-gray-500">Éxito en apelaciones:</span> <span className="font-medium">{(datosLocales.tasa_exito_apelacion * 100).toFixed(0)}%</span></div>
            <div><span className="text-gray-500">Contacto:</span> <span className="font-medium">{datosLocales.email}</span></div>
          </div>
          {datosLocales.patrones_sesgo?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold text-red-700 mb-1">⚠️ Patrones registrados:</p>
              <ul className="space-y-1">
                {datosLocales.patrones_sesgo.map((p, i) => (
                  <li key={i} className="text-sm text-red-600">• {p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {resultado && analisis && (
        <div className="space-y-4 border-t pt-6">
          {analisis.patrones_detectados?.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="font-bold text-orange-800 mb-3">🔍 Patrones Detectados</h3>
              <div className="space-y-2">
                {analisis.patrones_detectados.map((p, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{p.patron}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.frecuencia === 'alta' ? 'bg-red-100 text-red-700' : p.frecuencia === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {p.frecuencia?.toUpperCase()}
                      </span>
                    </div>
                    {p.ejemplos?.length > 0 && (
                      <ul className="text-xs text-gray-500 space-y-0.5">
                        {p.ejemplos.map((e, j) => <li key={j}>• {e}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analisis.argumentos_recusacion?.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <h3 className="font-bold text-yellow-800 mb-2">🚫 Argumentos de Recusación</h3>
              <ul className="space-y-2">
                {analisis.argumentos_recusacion.map((a, i) => (
                  <li key={i} className="text-sm text-yellow-700 flex items-start gap-2">
                    <span className="font-bold">{i + 1}.</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analisis.denuncia_penal && (
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-bold text-red-800 mb-3">⚖️ Denuncia Penal</h3>
              {analisis.denuncia_penal.articulos_aplicables?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-red-700 mb-1">Artículos aplicables:</p>
                  <div className="flex flex-wrap gap-2">
                    {analisis.denuncia_penal.articulos_aplicables.map((a, i) => (
                      <span key={i} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              {analisis.denuncia_penal.fundamentos && (
                <p className="text-sm text-gray-700 mb-3">{analisis.denuncia_penal.fundamentos}</p>
              )}
              {analisis.denuncia_penal.borrador && (
                <div>
                  <p className="text-sm font-semibold text-red-700 mb-1">Borrador de denuncia:</p>
                  <div className="bg-white rounded-lg p-3 text-xs font-mono text-gray-700 border border-red-100 max-h-48 overflow-y-auto">
                    {analisis.denuncia_penal.borrador}
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(analisis.denuncia_penal.borrador)}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    📋 Copiar borrador
                  </button>
                </div>
              )}
            </div>
          )}

          {analisis.juicio_politico?.viable && (
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="font-bold text-purple-800 mb-2">🏛️ Juicio Político</h3>
              <p className="text-sm text-gray-700 mb-2">{analisis.juicio_politico.procedimiento}</p>
              {analisis.juicio_politico.causales?.length > 0 && (
                <ul className="text-sm text-purple-700 space-y-1">
                  {analisis.juicio_politico.causales.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {analisis.probabilidad_imparcialidad !== undefined && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">📊 Probabilidad de Imparcialidad</h3>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${analisis.probabilidad_imparcialidad < 0.4 ? 'bg-red-500' : analisis.probabilidad_imparcialidad < 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${(analisis.probabilidad_imparcialidad * 100).toFixed(0)}%` }}
                />
              </div>
              <p className="text-sm font-medium mt-1 text-center">
                {(analisis.probabilidad_imparcialidad * 100).toFixed(0)}%
              </p>
            </div>
          )}

          {analisis.texto_completo && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">📄 Análisis Completo</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{analisis.texto_completo}</pre>
            </div>
          )}

          <p className="text-xs text-gray-500 italic">{resultado.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
