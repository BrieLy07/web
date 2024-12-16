const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Cola para almacenar mensajes
let messageQueue = [];

// Servir archivos HTML
app.use(express.static(__dirname));


// Función para procesar la cola de mensajes
function processQueue() {
    if (messageQueue.length > 0) {
      const message = messageQueue.shift(); // Elimina el primer mensaje de la cola
      // Enviar el mensaje a todos los clientes conectados
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
      console.log(`Mensaje enviado: ${message}`);
    }
  }
  

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

   // Añadir el mensaje a la cola
   messageQueue.push(text);
   console.log(`Mensaje añadido a la cola: ${text}`);

   // Procesar la cola para enviar los mensajes
   processQueue();
  ws.on('close', () => console.log('Cliente desconectado'));
});

server.listen(3000, () => console.log('Servidor corriendo en http://54.224.215.163:3000'));
