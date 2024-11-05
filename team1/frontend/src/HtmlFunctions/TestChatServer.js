const WebSocket = require('ws');
const http = require('http');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket Server\n');
});

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server, path: '/chat' });

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    // 클라이언트로부터 메시지 수신
    ws.on('message', (message) => {
        console.log('Received:', message);
        // 클라이언트에게 메시지 전송
        ws.send(`Server received: ${message}`);
    });

    // 클라이언트 연결 종료
    ws.on('close', () => {
        console.log('Client disconnected.');
    });
});

// 서버 시작
server.listen(3001, () => {
    console.log('WebSocket server running on ws://localhost:3001/chat');
});
