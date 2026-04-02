'use client';
import { useState } from 'react';
import ExpedienteAnalyzer from './ExpedienteAnalyzer';
import JuezAnalyzer from './JuezAnalyzer';
import EstrategiaCompleta from './EstrategiaCompleta';
import GeneradorEscritos from './GeneradorEscritos';
import AbogadoChat from './AbogadoChat';

const TABS = [
  { id: 'chat', label: '💬 Consulta IA', descripcion: 'Chat con abogado IA' },
  { id: 'expediente', label: '📂 Expediente', descripcion: 'Analizar resoluciones' },
  { id: 'juez', label: '⚖️ Juez', descripcion: 'Analizar patrones judiciales' },
  { id: 'estrategia', label: '🎯 Estrategia', descripcion: 'Plan legal multinivel' },
  { id: 'escritos', label: '📝 Escritos', descripcion: 'Generar documentos legales' },
  { id: 'herramientas', label: '🔬 Herramientas', descripcion: 'Historia y psicología' },
];

function HerramientasAvanzadas() {
  const [herramienta, setHerramienta] = useState('historia');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const herramientas = [
    { id: 'historia', label: '📜 Historia de la Ley', endpoint: '/api/abogado/historia-ley' },
    { id: 'psicologia', label: '🧠 Psicología Forense', endpoint: '/api/abogado/psicologia-forense' },
    { id: 'nino', label: '👶 Derechos del Niño', endpoint: '/api/abogado/derechos-nino' },
  ];

  const handleConsultar = async () => {
    if (!input1.trim()) { setError('Por favor complete el campo principal'); return; }
    const herr = herramientas.find((h) => h.id === herramienta);
    setCargando(true);
    setError('');
    setResultado(null);

    let body = {};
    if (herramienta === 'historia') {
      body = { ley_o_articulo: input1, contexto_aplicacion: input2, problema_especifico: input3 };
    } else if (herramienta === 'psicologia') {
      body = { descripcion_situacion: input1, edad_persona: input2, tipo_trauma: input3 };
    } else {
      body = { descripcion_situacion: input1, edad_nino: input2, tipo_vulneracion: input3 };
    }

    try {
      const res = await fetch(herr.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResultado(data);
    } catch (err) {
      setError(err.message || 'Error al consultar');
    } finally {
      setCargando(false);
    }
  };

  const getPlaceholders = () => {
    if (herramienta === 'historia') return {
      p1: 'Ley o artículo a analizar (Ej: Ley 26.061, Art. 3 CDN, Art. 248 CP)',
      p2: 'Contexto de aplicación actual (opcional)',
      p3: 'Problema específico observado (opcional)',
    };
    if (herramienta === 'psicologia') return {
      p1: 'Describa la situación traumática a evaluar',
      p2: 'Edad de la persona afectada',
      p3: 'Tipo de trauma (separación, violencia, abuso institucional...)',
    };
    return {
      p1: 'Describa la situación del niño/a en detalle',
      p2: 'Edad del niño/a',
      p3: 'Tipo de vulneración (separación, negligencia, violencia...)',
    };
  };

  const ph = getPlaceholders();

  const renderResultado = () => {
    if (!resultado) return null;
    const data = resultado.analisis || resultado.historia || resultado.evaluacion;
    if (!data) return null;

    if (data.texto_completo) {
      return (
        <div className="bg-gray-50 rounded-xl p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{data.texto_completo}</pre>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {herramienta === 'historia' && (
          <>
            {data.proposito_original && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-1">🎯 Propósito Original</h4>
                <p className="text-sm text-gray-700">{data.proposito_original}</p>
              </div>
            )}
            {data.contexto_historico && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2">📅 Contexto Histórico</h4>
                <div className="text-sm space-y-1">
                  {Object.entries(data.contexto_historico).map(([k, v]) => (
                    <p key={k}><span className="font-medium capitalize">{k.replace(/_/g, ' ')}:</span> {v}</p>
                  ))}
                </div>
              </div>
            )}
            {data.desvio_del_proposito?.detectado && (
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-bold text-red-800 mb-1">⚠️ Desvío del Propósito Original</h4>
                <p className="text-sm text-gray-700">{data.desvio_del_proposito.descripcion}</p>
              </div>
            )}
            {data.como_impugnarla && (
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-green-800 mb-2">⚖️ Cómo Impugnarla</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {(data.como_impugnarla.argumentos_constitucionales || []).map((a, i) => (
                    <li key={i}>• {a}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        {herramienta === 'psicologia' && (
          <>
            {data.evaluacion_clinica && (
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-2">🧠 Evaluación Clínica</h4>
                <p className="text-sm"><span className="font-medium">Nivel de daño:</span> {data.evaluacion_clinica.nivel_daño}</p>
                {data.evaluacion_clinica.diagnosticos_probables?.map((d, i) => (
                  <div key={i} className="mt-2 bg-white rounded p-2 text-sm">
                    <p className="font-medium">{d.diagnostico} ({d.dsm5})</p>
                    <p className="text-gray-600 text-xs">{d.descripcion}</p>
                  </div>
                ))}
              </div>
            )}
            {data.cuantificacion_daño && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-bold text-purple-800 mb-2">💰 Cuantificación del Daño</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data.cuantificacion_daño)
                    .filter(([k]) => k !== 'tratamiento_necesario')
                    .map(([k, v]) => (
                      <div key={k} className="bg-white rounded p-2 text-center">
                        <p className="text-xs text-gray-500 capitalize">{k.replace(/_/g, ' ')}</p>
                        <p className="font-bold text-purple-700 text-sm">{v}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
        {herramienta === 'nino' && (
          <>
            {data.derechos_vulnerados?.length > 0 && (
              <div className="bg-red-50 rounded-xl p-4">
                <h4 className="font-bold text-red-800 mb-2">⚠️ Derechos Vulnerados</h4>
                {data.derechos_vulnerados.map((d, i) => (
                  <div key={i} className="bg-white rounded p-2 mb-1">
                    <p className="text-sm font-medium text-red-700">{d.derecho} — {d.norma}</p>
                    <p className="text-xs text-gray-600">{d.descripcion}</p>
                  </div>
                ))}
              </div>
            )}
            {data.indemnizacion && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-bold text-purple-800 mb-2">💰 Indemnización Estimada</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data.indemnizacion).map(([k, v]) => (
                    <div key={k} className="bg-white rounded p-2 text-center">
                      <p className="text-xs text-gray-500 capitalize">{k.replace(/_/g, ' ')}</p>
                      <p className="font-bold text-purple-700 text-sm">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <p className="text-xs text-gray-500 italic">{resultado.disclaimer}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h2 className="text-lg font-bold text-indigo-900 mb-1">🔬 Herramientas Especializadas</h2>
        <p className="text-sm text-indigo-700">Historia de leyes, psicología forense y análisis de derechos del niño.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {herramientas.map((h) => (
          <button
            key={h.id}
            onClick={() => { setHerramienta(h.id); setResultado(null); setInput1(''); setInput2(''); setInput3(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${herramienta === h.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {h.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <textarea
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
          placeholder={ph.p1}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
          placeholder={ph.p2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
          placeholder={ph.p3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">❌ {error}</div>
      )}

      <button
        onClick={handleConsultar}
        disabled={cargando}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        {cargando ? '⏳ Consultando...' : '🔬 Analizar'}
      </button>

      {renderResultado()}
    </div>
  );
}

export default function Dashboard() {
  const [tabActiva, setTabActiva] = useState('chat');

  const renderContenido = () => {
    switch (tabActiva) {
      case 'chat': return <AbogadoChat />;
      case 'expediente': return <ExpedienteAnalyzer />;
      case 'juez': return <JuezAnalyzer />;
      case 'estrategia': return <EstrategiaCompleta />;
      case 'escritos': return <GeneradorEscritos />;
      case 'herramientas': return <HerramientasAvanzadas />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">⚖️ Abogado Online IA</h1>
              <p className="text-xs text-gray-500">Sistema Avanzado de Derecho Argentino</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">🇦🇷 Derecho Argentino</p>
              <p className="text-xs text-gray-400">CN · CCCN · CADH · CDN</p>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  tabActiva === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {renderContenido()}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-400">
        ⚠️ Este sistema es orientativo. Siempre consulte con un abogado matriculado para casos específicos.
      </footer>
    </div>
  );
}
