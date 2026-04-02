'use client';
import { useState } from 'react';

export default function ExpedienteAnalyzer() {
  const [texto, setTexto] = useState('');
  const [tipoCaso, setTipoCaso] = useState('familia');
  const [partes, setPartes] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const tiposCaso = [
    { value: 'familia', label: '⚖️ Derecho de Familia' },
    { value: 'penal', label: '🔒 Penal' },
    { value: 'civil', label: '📋 Civil' },
    { value: 'nino', label: '👶 Derechos del Niño' },
    { value: 'administrativo', label: '🏛️ Administrativo' },
    { value: 'violencia', label: '🚨 Violencia Familiar/Género' },
  ];

  const handleAnalizar = async () => {
    if (!texto.trim()) {
      setError('Por favor ingrese el texto del expediente');
      return;
    }
    setCargando(true);
    setError('');
    setResultado(null);
    try {
      const res = await fetch('/api/abogado/analizar-expediente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto_expediente: texto, tipo_caso: tipoCaso, partes_involucradas: partes }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error al analizar el expediente');
    } finally {
      setCargando(false);
    }
  };

  const GravedadBadge = ({ gravedad }) => {
    const colores = { alta: 'bg-red-100 text-red-800', media: 'bg-yellow-100 text-yellow-800', baja: 'bg-green-100 text-green-800' };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colores[gravedad] || 'bg-gray-100 text-gray-700'}`}>
        {gravedad?.toUpperCase()}
      </span>
    );
  };

  const analisis = resultado?.analisis;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-blue-900 mb-1">📂 Analizador de Expedientes</h2>
        <p className="text-sm text-blue-700">
          Pegue el texto del expediente o resolución judicial para obtener un análisis legal completo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Caso</label>
          <select
            value={tipoCaso}
            onChange={(e) => setTipoCaso(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {tiposCaso.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Partes Involucradas</label>
          <input
            type="text"
            value={partes}
            onChange={(e) => setPartes(e.target.value)}
            placeholder="Ej: Actor: Juan Pérez / Demandada: María García"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texto del Expediente / Resolución
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Pegue aquí el texto completo del expediente, resolución, o sentencia..."
          rows={10}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">{texto.length} caracteres</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ❌ {error}
        </div>
      )}

      <button
        onClick={handleAnalizar}
        disabled={cargando}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {cargando ? '⏳ Analizando expediente...' : '🔍 Analizar Expediente con IA'}
      </button>

      {resultado && analisis && (
        <div className="space-y-4 border-t pt-6">
          {analisis.resumen_ejecutivo && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-2">📋 Resumen Ejecutivo</h3>
              <p className="text-sm text-gray-700">{analisis.resumen_ejecutivo}</p>
            </div>
          )}

          {analisis.urgencia && (
            <div className={`rounded-xl p-4 ${analisis.urgencia === 'alta' ? 'bg-red-50 border border-red-200' : analisis.urgencia === 'media' ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
              <p className="font-semibold text-sm">
                ⚡ Urgencia: <GravedadBadge gravedad={analisis.urgencia} />
              </p>
              {analisis.proximo_paso && (
                <p className="text-sm mt-1 font-medium">👉 {analisis.proximo_paso}</p>
              )}
            </div>
          )}

          {analisis.violaciones_legales?.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4">
              <h3 className="font-bold text-red-800 mb-3">⚠️ Violaciones Legales Detectadas</h3>
              <div className="space-y-2">
                {analisis.violaciones_legales.map((v, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-red-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-red-700">{v.norma}</span>
                      <GravedadBadge gravedad={v.gravedad} />
                    </div>
                    <p className="text-xs text-gray-600">{v.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analisis.estrategias_recomendadas?.length > 0 && (
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-bold text-green-800 mb-2">✅ Estrategias Recomendadas</h3>
              <ul className="space-y-1">
                {analisis.estrategias_recomendadas.map((e, i) => (
                  <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                    <span className="mt-0.5">→</span> {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analisis.estimacion_daños && (
            <div className="bg-purple-50 rounded-xl p-4">
              <h3 className="font-bold text-purple-800 mb-3">💰 Estimación de Daños</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(analisis.estimacion_daños).map(([k, v]) => (
                  <div key={k} className="bg-white rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500 capitalize">{k.replace(/_/g, ' ')}</p>
                    <p className="font-bold text-purple-700">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analisis.negligencia_institucional?.length > 0 && (
            <div className="bg-orange-50 rounded-xl p-4">
              <h3 className="font-bold text-orange-800 mb-2">🏛️ Negligencia Institucional</h3>
              <ul className="space-y-1">
                {analisis.negligencia_institucional.map((n, i) => (
                  <li key={i} className="text-sm text-orange-700">• {n}</li>
                ))}
              </ul>
            </div>
          )}

          {analisis.recursos_internacionales?.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-bold text-blue-800 mb-2">🌎 Recursos Internacionales Disponibles</h3>
              <div className="flex flex-wrap gap-2">
                {analisis.recursos_internacionales.map((r, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {r}
                  </span>
                ))}
              </div>
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
