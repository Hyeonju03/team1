// server.js
const WebSocket = require('ws');
const http = require('http');

// HTTP 서버 생성
const server = http.createServer((req, res) => {
    res.write('WebSocket server is running');
    res.end();
});

// WebSocket 서버 생성
const wss = new WebSocket.Server({ server });

// WebSocket 연결이 생성될 때마다 호출되는 이벤트
wss.on('connection', (ws) => {
    console.log('A user connected');

    // 클라이언트에서 메시지를 수신하면
    ws.on('message', (message) => {
        console.log('Received from client:', message);

        // 클라이언트로 메시지 전송 (데이터 갱신 알림)
        ws.send(JSON.stringify({ updatedData: 'New message added' }));
    });

    // 연결 종료 시 처리
    ws.on('close', () => {
        console.log('A user disconnected');
    });
});

// HTTP 서버와 WebSocket 서버 동시에 실행
server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
