import React, { useState, useEffect } from 'react';

export default function ChatTestPage() {
    const socketUrl = 'ws://localhost:3001/chat';
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);

    const connectWebSocket = () => {
        const socket = new WebSocket(socketUrl);

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
            reconnectWebSocket();
        };

        setWs(socket);
    };

    // 재연결 시도
    const reconnectWebSocket = () => {
        setTimeout(() => {
            console.log('Reconnecting WebSocket...');
            connectWebSocket();
        }, 3000);
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim() && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            setMessage('');
        }
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}
