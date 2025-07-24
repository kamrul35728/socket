// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
const clients = new Map(); // store clients and their IDs

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'register') {
      clients.set(data.id, ws);
      console.log(`Registered client: ${data.id}`);
    }

    if (data.type === 'message') {
      const target = clients.get(data.to);
      if (target) {
        target.send(JSON.stringify({ from: data.from, message: data.message }));
      }
    }
  });

  ws.on('close', () => {
    for (const [id, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(id);
        break;
      }
    }
    console.log('Client disconnected');
  });
});
