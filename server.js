const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos HTML
app.use(express.static(__dirname));

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', (message) => {
    const text = message.toString(); // Convertir mensaje a texto
    console.log(`Mensaje recibido: ${text}`);

    // Reenviar mensaje a todos los clientes
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text); // Envía el mensaje como texto
      }
    });
  });

  ws.on('close', () => console.log('Cliente desconectado'));
});

server.listen(3000, () => console.log('Servidor corriendo en http://54.224.215.163:3000'));
