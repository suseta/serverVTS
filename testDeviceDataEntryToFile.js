const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');

const HTTP_PORT = 3300;
const TCP_PORT = 3303;
const BUFFER_SIZE = 4096;
const IST = 'Asia/Kolkata';

const dataQueue = [];
const wsConnections = []; // Array to store WebSocket connections

function processData() {
  console.log(`Data Process thread started... on port ${HTTP_PORT}`);
  setInterval(() => {
    while (dataQueue.length > 0) {
      const { receiveTime, data } = dataQueue.shift();
      console.log(`${data} ${receiveTime}`);
    }
  }, 1000);
}

processData();

// Create WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Event handler when a new WebSocket connection is established
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // processCommand(message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  const dataToSend = 'Hello from the server!';
  ws.send(dataToSend);

  // Store the WebSocket connection in the array
  wsConnections.push(ws);
});

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server\n');
});

// Event handler when an upgrade request is received
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Start listening on the HTTP server
server.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`HTTP Server listening on port ${HTTP_PORT}`);
});

// Function to handle incoming TCP connections
async function handleConnection(socket) {
  console.log(`New connection from ${socket.remoteAddress}`);

  const receiveTime = new Date().toLocaleString('en-US', { timeZone: IST });
  let timeoutId;

  const scheduleClosure = () => {
    console.log(`Closing connection from ${socket.remoteAddress} after 1 hour`);
    socket.end();
  };

  timeoutId = setTimeout(scheduleClosure, 1 * 60 * 60 * 1000);

  socket.on('data', async (data) => {
    const decodedData = data.toString('utf-8');
    console.log(`Received ${decodedData.length} bytes of data from ${socket.remoteAddress}`);
    console.log(`Data: ${decodedData}`);

    // Store data in the database and process as needed
    await storeDataFile(decodedData);

    // Push data to the WebSocket connections
    wsConnections.forEach((ws) => {
      ws.send(decodedData);
    });

    dataQueue.push({ receiveTime, data: decodedData });
    clearTimeout(timeoutId);
    timeoutId = setTimeout(scheduleClosure, 1 * 60 * 60 * 1000);
  });

  socket.on('close', () => {
    console.log(`Connection from ${socket.remoteAddress} closed`);
    clearTimeout(timeoutId);
  });

  socket.on('error', (err) => {
    console.error(`Socket error from ${socket.remoteAddress}: ${err.message}`);
  });
}

// Create TCP server
const serverSocket = net.createServer(async (socket) => {
  socket.setNoDelay(true);
  socket.setKeepAlive(true, 300 * 1000);
  await handleConnection(socket);
});

// Start listening on the TCP server
serverSocket.listen(TCP_PORT, '0.0.0.0', () => {
  console.log(`TCP Server listening on port ${TCP_PORT}`);
});

//write to file

const dataDir = './data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}


const storeDataFile = async(decodedData) =>{
  const fileName = `data_${new Date().toISOString().slice(0, 10)}.json`;
  const filePath = path.join(dataDir, fileName);

  // Check if file exists, if not create new
  let fileData = [];
  if (fs.existsSync(filePath)) {
      fileData = JSON.parse(fs.readFileSync(filePath));
  }

  // Append new data
  fileData.push(decodedData);

  // Write data to file
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}


