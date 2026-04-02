'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const AbogadoChat = dynamic(() => import('./AbogadoChat'), { ssr: false });
const JudicialDatabase = dynamic(() => import('./JudicialDatabase'), { ssr: false });

const VIEWS = [
  { id: 'chat', label: '🤖 Abogado IA', description: 'Consultas legales con inteligencia artificial' },
  { id: 'judicial', label: '⚖️ Base Judicial CABA', description: 'Juzgados, jueces, fiscalías, CIF y OVD' },
];

export default function AbogadoChatWrapper() {
  const [view, setView] = useState('chat');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top navigation bar */}
      <nav className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-bold text-lg">⚖️ LegalAI Argentina</span>
        </div>
        <div className="flex gap-2">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === v.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <div className="transition-opacity duration-200">
        {view === 'chat' && <AbogadoChatEnhanced />}
        {view === 'judicial' && <JudicialDatabase />}
      </div>
    </div>
  );
}

// Enhanced chat UI that wraps the existing chat with better styling
function AbogadoChatEnhanced() {
  const [messages, setMessages] = useState([
    {
      sender: 'lawyer',
      text: '👋 Hola. Soy tu **Abogado Virtual de Élite** especializado en derecho argentino e internacional.\n\nPuedo ayudarte con:\n• ⚖️ Casos de familia, violencia doméstica, guarda y alimentos\n• 🌍 Recursos ante la CIDH y organismos ONU\n• 🚨 Inacción judicial, abuso de autoridad y violación de DDHH\n• 📋 Estrategias para acelerar expedientes y presionar jueces\n• 🧠 Análisis psicológico-forense de situaciones familiares\n• 📜 Leyes nacionales e internacionales aplicables\n\n¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipoConsulta, setTipoConsulta] = useState('familia');

  const TIPOS = [
    { value: 'familia', label: '👨‍👩‍👧 Familia' },
    { value: 'violencia_institucional', label: '⚠️ Violencia Institucional' },
    { value: 'ddhh_internacional', label: '🌍 DDHH Internacional' },
    { value: 'inaccion_judicial', label: '⏳ Inacción Judicial' },
    { value: 'nna', label: '👶 Derechos NNyA' },
    { value: 'penal', label: '🔒 Penal' },
    { value: 'civil', label: '📋 Civil' },
    { value: 'denuncia_magistrado', label: '🚨 Denunciar Juez' },
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta: input, tipo_consulta: tipoConsulta }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'lawyer',
          text: data.respuesta || data.error || 'Error en la consulta',
          tokens: data.tokens,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'lawyer', text: '❌ Error de conexión. Intente nuevamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-3xl rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-100 border border-gray-700'
              }`}
            >
              {msg.sender === 'lawyer' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 font-semibold text-xs">⚖️ Abogado IA</span>
                  {msg.tokens && <span className="text-gray-600 text-xs">{msg.tokens} tokens</span>}
                </div>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                className="whitespace-pre-wrap"
              />
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                Analizando consulta...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 p-4 bg-gray-900">
        {/* Tipo selector */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTipoConsulta(t.value)}
              className={`px-3 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                tipoConsulta === t.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <textarea
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Describe tu situación legal... (Ej: El juez lleva 8 meses sin resolver mi pedido de régimen de comunicación con mi hijo)"
            value={input}
            rows={3}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Enviar
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          ⚠️ Información orientativa. Siempre consultar con abogado matriculado para su caso específico.
        </p>
      </div>
    </div>
  );
}
