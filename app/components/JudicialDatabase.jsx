'use client';
import { useState, useEffect, useCallback } from 'react';

const BIAS_COLORS = {
  Bajo: 'text-green-400 bg-green-900/30 border-green-700',
  Medio: 'text-yellow-400 bg-yellow-900/30 border-yellow-700',
  Alto: 'text-orange-400 bg-orange-900/30 border-orange-700',
  Crítico: 'text-red-400 bg-red-900/30 border-red-700',
};

const TABS = [
  { id: 'jueces', label: '👨‍⚖️ Jueces', icon: '⚖️' },
  { id: 'tribunales', label: '🏛️ Tribunales', icon: '🏛️' },
  { id: 'fiscalias', label: '🔍 Fiscalías', icon: '🔍' },
  { id: 'instituciones', label: '🏢 CIF / OVD', icon: '🏢' },
  { id: 'estadisticas', label: '📊 Estadísticas', icon: '📊' },
  { id: 'denuncia', label: '🚨 Denuncias', icon: '🚨' },
];

function Badge({ nivel }) {
  const cls = BIAS_COLORS[nivel] || 'text-gray-400 bg-gray-900/30 border-gray-700';
  return (
    <span className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold ${cls}`}>
      {nivel}
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function AlertBox({ alerts }) {
  if (!alerts || alerts.length === 0) return null;
  return (
    <div className="mt-2 space-y-1">
      {alerts.map((a, i) => (
        <div key={i} className="text-xs text-red-300 bg-red-950/40 border border-red-800 rounded px-2 py-1">
          ⚠️ {a}
        </div>
      ))}
    </div>
  );
}

// ── Tab: Jueces ───────────────────────────────────────────────
function TabJueces() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ nombre: '', tipo: 'Familia', numero: '', bias: '' });
  const [selected, setSelected] = useState(null);

  const buscar = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.nombre) params.set('nombre', filters.nombre);
    if (filters.tipo) params.set('tipo', filters.tipo);
    if (filters.numero) params.set('numero', filters.numero);
    if (filters.bias) params.set('bias', filters.bias);
    const res = await fetch(`/api/judicial/jueces?${params}`);
    const data = await res.json();
    setResults(data.resultados || []);
    setLoading(false);
  }, [filters]);

  useEffect(() => { buscar(); }, [buscar]);

  return (
    <div>
      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <input
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          placeholder="Buscar por nombre..."
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && buscar()}
        />
        <select
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          <option value="Familia">Familia</option>
          <option value="Civil">Civil</option>
          <option value="Penal">Penal</option>
          <option value="Contencioso">Contencioso Adm.</option>
          <option value="Comercial">Comercial</option>
        </select>
        <input
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          placeholder="Número de juzgado"
          type="number"
          value={filters.numero}
          onChange={(e) => setFilters({ ...filters, numero: e.target.value })}
        />
        <select
          className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          value={filters.bias}
          onChange={(e) => setFilters({ ...filters, bias: e.target.value })}
        >
          <option value="">Todos los niveles</option>
          <option value="Bajo">Bajo</option>
          <option value="Medio">Medio</option>
          <option value="Alto">Alto</option>
          <option value="Crítico">Crítico</option>
        </select>
      </div>

      <p className="text-gray-400 text-sm mb-3">{loading ? 'Buscando...' : `${results.length} resultado(s) encontrado(s)`}</p>

      {/* Resultados */}
      <div className="space-y-3">
        {results.map((j) => (
          <div
            key={j.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-600 transition-colors"
            onClick={() => setSelected(selected?.id === j.id ? null : j)}
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-white">{j.juez || `Juzgado ${j.tipo} N°${j.numero}`}</h3>
                <p className="text-sm text-gray-400">Juzgado {j.tipo} N°{j.numero} — {j.direccion}</p>
              </div>
              {j.estadisticas?.nivelBiasDetectado && (
                <Badge nivel={j.estadisticas.nivelBiasDetectado} />
              )}
            </div>

            {selected?.id === j.id && (
              <div className="mt-4 pt-4 border-t border-gray-700 grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 font-medium mb-2">📞 Contacto</p>
                  <p className="text-gray-300">📧 {j.email}</p>
                  <p className="text-gray-300">☎️ {j.telefono}</p>
                  <p className="text-gray-300">🕐 {j.horario}</p>
                  {j.secretaria && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <p className="text-gray-400">Secretaría: {j.secretaria}</p>
                      <p className="text-gray-300">📧 {j.emailSecretaria}</p>
                    </div>
                  )}
                </div>
                {j.estadisticas && (
                  <div>
                    <p className="text-gray-400 font-medium mb-2">📊 Estadísticas</p>
                    <p className="text-gray-300">Causas activas: <span className="text-white font-semibold">{j.estadisticas.causasActivas}</span></p>
                    <p className="text-gray-300">Tiempo promedio resolución: <span className="text-white font-semibold">{j.estadisticas.tiempoPromedioResolucionDias} días</span></p>
                    {j.estadisticas.tasaApelacionesExitosas !== undefined && (
                      <p className="text-gray-300">Apelaciones exitosas (contra el juez): <span className="text-yellow-400 font-semibold">{(j.estadisticas.tasaApelacionesExitosas * 100).toFixed(0)}%</span></p>
                    )}
                    {j.estadisticas.patronesDetectados && (
                      <div className="mt-2">
                        <p className="text-gray-400 text-xs mb-1">Patrones detectados:</p>
                        {j.estadisticas.patronesDetectados.map((p, i) => (
                          <p key={i} className="text-xs text-gray-400">• {p}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Tribunales ───────────────────────────────────────────
function TabTribunales() {
  const [resumen, setResumen] = useState([]);
  const [detalle, setDetalle] = useState([]);
  const [tipoSel, setTipoSel] = useState('');

  useEffect(() => {
    fetch('/api/judicial/tribunales')
      .then((r) => r.json())
      .then((d) => setResumen(d.resumen || []));
  }, []);

  const verDetalle = async (tipo) => {
    setTipoSel(tipo);
    const res = await fetch(`/api/judicial/tribunales?tipo=${encodeURIComponent(tipo)}`);
    const data = await res.json();
    setDetalle(data.resultados || []);
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {resumen.map((r) => (
          <button
            key={r.tipo}
            onClick={() => verDetalle(r.tipo)}
            className={`p-4 rounded-lg border text-left transition-all ${tipoSel === r.tipo ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800 hover:border-gray-500'}`}
          >
            <p className="text-xs text-gray-400 capitalize mb-1">{r.tipo}</p>
            <p className="text-2xl font-bold text-white">{r.cantidad}</p>
            <p className="text-xs text-gray-500 mt-1">juzgados</p>
          </button>
        ))}
      </div>

      {detalle.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 capitalize">Juzgados {tipoSel} ({detalle.length})</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {detalle.map((j) => (
              <div key={j.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm">
                <p className="font-medium text-white">Juzgado N°{j.numero}</p>
                <p className="text-gray-400">📧 {j.email}</p>
                <p className="text-gray-400">☎️ {j.telefono}</p>
                <p className="text-gray-500 text-xs mt-1">📍 {j.direccion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Fiscalías ─────────────────────────────────────────────
function TabFiscalias() {
  const [data, setData] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('Especializada');
  const [espFiltro, setEspFiltro] = useState('');

  const buscar = useCallback(async () => {
    const params = new URLSearchParams();
    if (tipoFiltro) params.set('tipo', tipoFiltro);
    if (espFiltro) params.set('especialidad', espFiltro);
    const res = await fetch(`/api/judicial/fiscalias?${params}`);
    const d = await res.json();
    setData(d);
  }, [tipoFiltro, espFiltro]);

  useEffect(() => { buscar(); }, [buscar]);

  return (
    <div>
      {data && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Fiscalías Federales" value={data.resumen.federales} />
          <StatCard label="Fiscalías Ordinarias" value={data.resumen.ordinarias} />
          <StatCard label="Fiscalías Especializadas" value={data.resumen.especializadas} />
        </div>
      )}

      <div className="flex gap-3 mb-4 flex-wrap">
        {['', 'Federal', 'Ordinaria', 'Especializada'].map((t) => (
          <button
            key={t}
            onClick={() => setTipoFiltro(t)}
            className={`px-4 py-2 rounded text-sm transition-colors ${tipoFiltro === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {t || 'Todas'}
          </button>
        ))}
      </div>

      {tipoFiltro === 'Especializada' && (
        <input
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 mb-4 focus:outline-none focus:border-blue-500"
          placeholder="Buscar por especialidad (ej: violencia, abuso, trata...)"
          value={espFiltro}
          onChange={(e) => setEspFiltro(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && buscar()}
        />
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {(data?.resultados || []).map((f) => (
          <div key={f.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm">
            <div className="flex items-start justify-between">
              <p className="font-medium text-white">{f.especialidad || `Fiscalía ${f.tipo} N°${f.numero}`}</p>
              <span className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">{f.tipo}</span>
            </div>
            <p className="text-gray-400 mt-1">📧 {f.email}</p>
            <p className="text-gray-400">☎️ {f.telefono}</p>
            <p className="text-gray-500 text-xs mt-1">📍 {f.direccion}</p>
            <p className="text-gray-500 text-xs">🕐 {f.horario}</p>
            {f.estadisticas && (
              <div className="mt-2 pt-2 border-t border-gray-700 flex gap-4 text-xs text-gray-400">
                <span>Causas: <strong className="text-white">{f.estadisticas.causasActivas}</strong></span>
                <span>Resolución: <strong className="text-white">{f.estadisticas.tiempoPromedioResolucionDias}d</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Instituciones (CIF / OVD) ────────────────────────────
function TabInstituciones() {
  const [data, setData] = useState(null);
  const [vista, setVista] = useState('CIF');

  useEffect(() => {
    fetch('/api/judicial/instituciones')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-gray-400">Cargando...</p>;

  const inst = vista === 'CIF' ? data.instituciones?.CIF : data.instituciones?.OVD;

  return (
    <div>
      <div className="flex gap-3 mb-6">
        {['CIF', 'OVD'].map((v) => (
          <button
            key={v}
            onClick={() => setVista(v)}
            className={`px-6 py-2 rounded font-semibold text-sm transition-colors ${vista === v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            {v}
          </button>
        ))}
      </div>

      {inst && (
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{inst.nombre}</h3>
          <p className="text-sm text-gray-400 mb-2">{inst.descripcion}</p>
          <p className="text-xs text-blue-400 mb-4">📋 Marco legal: {inst.marcoLegal}</p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {inst.sedes?.map((sede) => (
              <div key={sede.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">{sede.nombre}</h4>
                <p className="text-sm text-gray-400">📍 {sede.direccion}</p>
                <p className="text-sm text-gray-400">☎️ {sede.telefono}</p>
                <p className="text-sm text-gray-400">📧 {sede.email}</p>
                <p className="text-sm text-gray-400">🕐 {sede.horario}</p>
                <p className="text-sm text-gray-400">👤 {sede.responsable}</p>
                {sede.lineaUrgencias && (
                  <p className="text-sm text-green-400 font-semibold">🆘 Urgencias: {sede.lineaUrgencias}</p>
                )}

                {sede.estadisticas && (
                  <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-2 gap-2 text-xs">
                    {sede.estadisticas.expedientesIngresadosMensual && (
                      <div>
                        <p className="text-gray-500">Ing. mensual</p>
                        <p className="text-white font-semibold">{sede.estadisticas.expedientesIngresadosMensual}</p>
                      </div>
                    )}
                    {sede.estadisticas.expedientesPendientes && (
                      <div>
                        <p className="text-gray-500">Pendientes</p>
                        <p className="text-orange-400 font-semibold">{sede.estadisticas.expedientesPendientes}</p>
                      </div>
                    )}
                    {sede.estadisticas.tiempoPromedioRespuestaDias && (
                      <div>
                        <p className="text-gray-500">Tiempo respuesta</p>
                        <p className={`font-semibold ${sede.estadisticas.demoraSuperaLegal ? 'text-red-400' : 'text-green-400'}`}>
                          {sede.estadisticas.tiempoPromedioRespuestaDias}d (legal: {sede.estadisticas.tiempoLegalMaximoDias}d)
                        </p>
                      </div>
                    )}
                    {sede.estadisticas.denunciasRecibidas && (
                      <div>
                        <p className="text-gray-500">Denuncias/mes</p>
                        <p className="text-white font-semibold">{sede.estadisticas.denunciasRecibidas}</p>
                      </div>
                    )}
                    {sede.estadisticas.casosNinosInvolucrados && (
                      <div>
                        <p className="text-gray-500">Con menores</p>
                        <p className="text-yellow-400 font-semibold">{sede.estadisticas.casosNinosInvolucrados}</p>
                      </div>
                    )}
                  </div>
                )}
                <AlertBox alerts={sede.alertas} />
              </div>
            ))}
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-sm font-semibold text-gray-300 mb-2">📞 Contacto Jerárquico</p>
            <p className="text-sm text-gray-400">{inst.contactoJerarquico?.autoridad}</p>
            <p className="text-sm text-gray-400">📧 {inst.contactoJerarquico?.email}</p>
            <p className="text-sm text-gray-400">☎️ {inst.contactoJerarquico?.telefono}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Estadísticas ─────────────────────────────────────────
function TabEstadisticas() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/judicial/estadisticas')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Fuero de Familia — CABA</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Juzgados" value={data.resumenFueroFamilia?.totalJuzgados} />
        <StatCard label="Causas Activas" value={data.resumenFueroFamilia?.causasTotales?.toLocaleString()} />
        <StatCard label="Tiempo Promedio" value={`${data.resumenFueroFamilia?.tiempoPromedioResolucionDias}d`} sub="resolución" />
        <StatCard label="Tasa Apelaciones" value={`${(data.resumenFueroFamilia?.tasaApelacionesExitosasPromedio * 100).toFixed(1)}%`} sub="exitosas contra juez" />
      </div>

      {data.alertasBias?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-red-400 mb-3">🚨 Alertas de Bias Judicial ({data.alertasBias.length} juzgados)</h4>
          <div className="space-y-3">
            {data.alertasBias.map((a) => (
              <div key={a.id} className="bg-red-950/30 border border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">{a.juez}</span>
                  <Badge nivel={a.nivel} />
                  <span className="text-xs text-gray-400">Apelaciones exitosas: {(a.tasaApelaciones * 100).toFixed(0)}%</span>
                </div>
                {a.patrones?.map((p, i) => (
                  <p key={i} className="text-xs text-red-300">• {p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <h4 className="text-md font-semibold text-white mb-3">📈 Ranking por Velocidad (más rápido → más lento)</h4>
      <div className="space-y-2">
        {data.rankingPorVelocidad?.map((j) => (
          <div key={j.id} className="bg-gray-800 border border-gray-700 rounded p-3 flex items-center gap-4 flex-wrap text-sm">
            <span className="text-gray-500 w-6 text-right">#{j.posicion}</span>
            <span className="text-white flex-1">{j.juez} (N°{j.numero})</span>
            <span className="text-blue-300">{j.tiempoPromedioResolucionDias}d</span>
            <span className="text-gray-400">{j.causasActivas} causas</span>
            <Badge nivel={j.nivelBias} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Organismos de Denuncia ───────────────────────────────
function TabDenuncia() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/judicial/instituciones?entidad=DENUNCIA')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-gray-400">Cargando...</p>;

  return (
    <div>
      <div className="bg-yellow-950/30 border border-yellow-700 rounded-lg p-4 mb-6">
        <p className="text-yellow-300 font-semibold text-sm">⚖️ Organismos donde denunciar jueces, fiscales y agentes judiciales por inacción, abuso de autoridad o violación de DDHH</p>
      </div>

      <div className="space-y-4">
        {data.organismosDenuncia?.map((org) => (
          <div key={org.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
            <h3 className="font-bold text-white text-base mb-1">{org.nombre}</h3>
            <p className="text-sm text-gray-400 mb-3">{org.funcion}</p>

            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {org.email && <p className="text-gray-300">📧 {org.email}</p>}
              {org.telefono && <p className="text-gray-300">☎️ {org.telefono}</p>}
              {org.direccion && <p className="text-gray-300">📍 {org.direccion}</p>}
              {org.horario && <p className="text-gray-300">🕐 {org.horario}</p>}
              {org.web && <p className="text-blue-400">🌐 {org.web}</p>}
              {org.tiempoPromedioResolucion && <p className="text-gray-400">⏱️ Resolución: {org.tiempoPromedioResolucion}</p>}
              {org.requisito && <p className="text-orange-300">⚠️ {org.requisito}</p>}
            </div>

            {org.herramientasLegales?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-1">Herramientas disponibles:</p>
                <div className="flex flex-wrap gap-2">
                  {org.herramientasLegales.map((h, i) => (
                    <span key={i} className="text-xs bg-blue-900/40 border border-blue-700 text-blue-300 px-2 py-0.5 rounded">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {org.como_denunciar && (
              <div className="mt-3 bg-green-950/30 border border-green-800 rounded p-2 text-xs text-green-300">
                💡 {org.como_denunciar}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente Principal ──────────────────────────────────────
export default function JudicialDatabase() {
  const [activeTab, setActiveTab] = useState('jueces');

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5">
        <h1 className="text-2xl font-bold text-white">⚖️ Base de Datos Judicial CABA</h1>
        <p className="text-gray-400 text-sm mt-1">
          Sistema integral de consulta judicial — Juzgados, Fiscalías, CIF, OVD y Organismos de Denuncia
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-6xl mx-auto">
        {activeTab === 'jueces' && <TabJueces />}
        {activeTab === 'tribunales' && <TabTribunales />}
        {activeTab === 'fiscalias' && <TabFiscalias />}
        {activeTab === 'instituciones' && <TabInstituciones />}
        {activeTab === 'estadisticas' && <TabEstadisticas />}
        {activeTab === 'denuncia' && <TabDenuncia />}
      </div>
    </div>
  );
}
