'use client';
import { useState } from 'react';

const PLANTILLAS = [
  { id: 'amparo', nombre: '⚡ Amparo Constitucional', descripcion: 'Art. 43 CN - Acción urgente por violación de derechos', color: 'blue' },
  { id: 'denuncia_penal', nombre: '🚔 Denuncia Penal', descripcion: 'Contra funcionarios públicos (Arts. 248-250 CP)', color: 'red' },
  { id: 'daños_perjuicios', nombre: '💰 Daños y Perjuicios', descripcion: 'Demanda civil por daños (Arts. 1708-1780 CCCN)', color: 'purple' },
  { id: 'cidh', nombre: '🌎 Petición ante CIDH', descripcion: 'Sistema Interamericano de DDHH - OEA', color: 'green' },
  { id: 'onu', nombre: '🇺🇳 Presentación ante ONU', descripcion: 'Comités ONU (PIDCP, CDN, CEDAW)', color: 'indigo' },
  { id: 'recurso_extraordinario', nombre: '⚖️ Recurso Extraordinario', descripcion: 'Ante la Corte Suprema de Justicia (Art. 14 Ley 48)', color: 'orange' },
];

const colorClasses = {
  blue: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100',
  red: 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100',
  purple: 'border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100',
  green: 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100',
  orange: 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100',
};

export default function GeneradorEscritos() {
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState('');
  const [datosCaso, setDatosCaso] = useState('');
  const [partes, setPartes] = useState('');
  const [hechos, setHechos] = useState('');
  const [derechosViolados, setDerechosViolados] = useState('');
  const [petitorio, setPetitorio] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  const handleGenerar = async () => {
    if (!plantillaSeleccionada) {
      setError('Por favor seleccione un tipo de escrito');
      return;
    }
    if (!datosCaso.trim()) {
      setError('Por favor ingrese los datos del caso');
      return;
    }
    setCargando(true);
    setError('');
    setResultado(null);
    try {
      const res = await fetch('/api/abogado/generar-escritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo_escrito: plantillaSeleccionada,
          datos_caso: datosCaso,
          partes,
          hechos,
          derechos_violados: derechosViolados,
          petitorio,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error al generar el escrito');
    } finally {
      setCargando(false);
    }
  };

  const handleCopiar = async () => {
    if (resultado?.escrito) {
      await navigator.clipboard.writeText(resultado.escrito);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleDescargar = () => {
    if (!resultado?.escrito) return;
    const blob = new Blob([resultado.escrito], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plantillaSeleccionada}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-purple-900 mb-1">📝 Generador de Escritos Legales</h2>
        <p className="text-sm text-purple-700">
          Genere escritos legales completos con citas jurisprudenciales para presentar ante tribunales.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Seleccione el Tipo de Escrito</label>
        <div className="grid grid-cols-2 gap-3">
          {PLANTILLAS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlantillaSeleccionada(p.id)}
              className={`border rounded-xl p-3 text-left transition-all ${colorClasses[p.color]} ${plantillaSeleccionada === p.id ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
            >
              <p className="font-semibold text-sm">{p.nombre}</p>
              <p className="text-xs opacity-75 mt-0.5">{p.descripcion}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Datos del Caso *</label>
          <textarea
            value={datosCaso}
            onChange={(e) => setDatosCaso(e.target.value)}
            placeholder="Describa el caso completo: número de expediente (si lo tiene), fecha de los hechos, juzgado interviniente, historia del caso..."
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Partes del Proceso</label>
            <textarea
              value={partes}
              onChange={(e) => setPartes(e.target.value)}
              placeholder="Actora: [nombre, DNI, domicilio]&#10;Demandada: [nombre/organismo]"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Derechos Violados</label>
            <textarea
              value={derechosViolados}
              onChange={(e) => setDerechosViolados(e.target.value)}
              placeholder="Art. 43 CN, Art. 3 CDN, Art. 8 CADH..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hechos Principales</label>
          <textarea
            value={hechos}
            onChange={(e) => setHechos(e.target.value)}
            placeholder="Describa los hechos en orden cronológico con fechas específicas..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Petitorio (lo que solicita)</label>
          <textarea
            value={petitorio}
            onChange={(e) => setPetitorio(e.target.value)}
            placeholder="¿Qué medidas solicita al tribunal? Ej: que se ordene la restitución inmediata, que se declare la inconstitucionalidad..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {cargando ? '⏳ Generando escrito legal...' : '📝 Generar Escrito Legal'}
      </button>

      {resultado && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">📄 {resultado.tipo}</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopiar}
                className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copiado ? '✅ Copiado' : '📋 Copiar'}
              </button>
              <button
                onClick={handleDescargar}
                className="flex items-center gap-1 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                💾 Descargar
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-[600px] overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
              {resultado.escrito}
            </pre>
          </div>

          <p className="text-xs text-gray-500 italic">{resultado.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
