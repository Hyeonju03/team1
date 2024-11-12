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

        wss.clients.forEach((client) => {
            // 연결된 클라이언트가 열려 있는 상태인 경우에만 메시지를 보냄
            if (client.readyState === WebSocket.OPEN) {
                // 클라이언트에게 메시지 전송 (데이터 갱신 알림)
                client.send(JSON.stringify({ updatedData: message }));
            }
        });
    });

    // 연결 종료 시 처리
    ws.on('close', () => {
        console.log('A user disconnected');
    });
});

// HTTP 서버와 WebSocket 서버 동시에 실행
server.listen(3002, () => {
    console.log('Server is running on http://nextit.or.kr:3002');
});
