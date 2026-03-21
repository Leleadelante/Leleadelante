import React, { useState } from 'react';
import './AbogadoChat.css';

const AbogadoChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        if (input.trim()) {
            const newMessages = [...messages, { sender: 'user', text: input }];
            setMessages(newMessages);
            setInput('');
            // Call the API for legal consultation
            const response = await fetch('/api/legal-consultation', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ query: input })
            });
            const data = await response.json();
            setMessages([...newMessages, { sender: 'lawyer', text: data.response }]);
        }
    };

    return (
        <div className="abogado-chat">
            <div className="messages">{
                messages.map((msg, index) => (
                    <div key={index} className={msg.sender}> {msg.text} </div>
                ))
            }</div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default AbogadoChat;