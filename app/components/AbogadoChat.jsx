'use client';
import { useState, useRef, useEffect } from 'react';

const TIPOS_CONSULTA = [
  { value: 'familia', label: '👨‍👩‍👧 Familia' },
  { value: 'penal', label: '🔒 Penal' },
  { value: 'civil', label: '📋 Civil' },
  { value: 'laboral', label: '💼 Laboral' },
  { value: 'administrativo', label: '🏛️ Administrativo' },
  { value: 'ddhh', label: '🌎 DDHH' },
];

export default function AbogadoChat() {
  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      texto: '👋 Hola! Soy tu Abogado IA especializado en derecho argentino.\n\nPuedo ayudarte con:\n⚖️ Derecho de familia y menores\n🔒 Derecho penal\n📋 Derecho civil\n💼 Derecho laboral\n🏛️ Derecho administrativo\n🌎 Derechos humanos\n\n¿Cuál es tu consulta?',
    },
  ]);
  const [input, setInput] = useState('');
  const [tipoCon, setTipoCon] = useState('familia');
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const handleEnviar = async () => {
    if (!input.trim() || cargando) return;
    const pregunta = input.trim();
    setInput('');
    setMensajes((prev) => [...prev, { tipo: 'user', texto: pregunta }]);
    setCargando(true);
    try {
      const res = await fetch('/api/consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pregunta, tipo_consulta: tipoCon }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMensajes((prev) => [
        ...prev,
        { tipo: 'bot', texto: data.respuesta },
        { tipo: 'disclaimer', texto: data.disclaimer },
      ]);
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        { tipo: 'error', texto: 'Error: ' + (err.message || 'No se pudo procesar la consulta') },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <h2 className="text-lg font-bold text-blue-900 mb-1">Consulta con Abogado IA</h2>
        <p className="text-sm text-blue-700">Seleccione el área legal y haga su consulta.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TIPOS_CONSULTA.map((t) => (
          <button
            key={t.value}
            onClick={() => setTipoCon(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tipoCon === t.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96 pr-1">
        {mensajes.map((msg, i) => (
          <div key={i} className={`flex ${msg.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-4xl rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
              msg.tipo === 'user' ? 'bg-blue-600 text-white rounded-br-none' :
              msg.tipo === 'bot' ? 'bg-gray-100 text-gray-800 rounded-bl-none' :
              msg.tipo === 'disclaimer' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs italic' :
              'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {msg.tipo === 'bot' && <span className="font-bold text-blue-600 block mb-1">Abogado IA</span>}
              {msg.texto}
            </div>
          </div>
        ))}
        {cargando && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-500">
              Analizando su consulta...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escriba su consulta legal aquí... (Enter para enviar)"
          rows={2}
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleEnviar}
          disabled={cargando || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-4 rounded-xl transition-colors text-sm"
        >
          {cargando ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
