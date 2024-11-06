import React, { useState, useEffect } from 'react';
import axios from "axios";

export default function ChatTestPage() {
    const socketUrl = 'ws://localhost:3001/chat';
    let [messages, setMessages] = useState([]);
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
    const testFun1 = async () => {
        await axios
            .get("/chatInSelect1", { params: { chatNum : "1" } })
            .then((response) => {
                //content
                setMessages(response.data[1]);
            })
            .catch((error) => console.log(error));
    }
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
    const testFun2 = async (value) => {
        await axios
            .post("/chatInUpdate1", { chatNum:"1", chatContent : `3128143575-alpha001:${value}_2024-11-06 12:45:27.000_1_0` })
            .then((response) => {
                console.log("실행함")
            })
            .catch((error) => console.log(error));
    }
    const handleSendMessage = () => {
        if (message.trim() && ws && ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            setMessage('');
        }
    };

    testFun1();
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
                onChange={(e) => {
                    console.log(e.target.value);
                    setMessage(e.target.value);
                }}
                placeholder="Type a message..."
                className="chatInput"
            />
            <button onClick={()=>{
                handleSendMessage();
                testFun2(document.querySelector(".chatInput").value)
            }}>Send</button>
        </div>
    );
}
