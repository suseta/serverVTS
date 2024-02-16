const WebSocket = require('ws');
const http = require('http');
const net = require('net');
const { Client } = require('pg');

const HTTP_PORT = 3300;
const TCP_PORT = 3303;
const BUFFER_SIZE = 4096;
const IST = 'Asia/Kolkata';

const dataQueue = [];

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

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server\n');
});

const wss = new WebSocket.Server({ noServer: true });

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
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

server.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`HTTP Server listening on port ${HTTP_PORT}`);
});
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
    // ---------------------------------------------start-------------------------------------------
    await storeDataInDb(decodedData)
   // ---------------------------------------------end---------------------------------------------

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

const serverSocket = net.createServer(async (socket) => {
    socket.setNoDelay(true);
 socket.setKeepAlive(true, 300 * 1000);
    await handleConnection(socket);
  });


serverSocket.listen(TCP_PORT, '0.0.0.0', () => {
  console.log(`TCP Server listening on port ${TCP_PORT}`);
});



const connectDb = async () => {
    const connectionString = `postgresql://postgres:root@localhost:5432/vtsdb`;
    const client = new Client({ connectionString });
    await client.connect();
    return client;
}

const getClient = async () => {
 const client = await connectDb();
    return client;
}

const storeDataInDb = async (decodedData) => {
  var assetIdForAssetDeviceMapping; // device_id
  var vehicleIdForAssetDeviceMapping; // vehicle_id

  try {
      if (!decodedData.startsWith('$') || !decodedData.endsWith('*')) {
          console.error('Invalid data format');
          return;
      }

      const dataContent = decodedData.slice(1, -1);
      const dataValues = decodedData.split(',');

      const tableColumns = [
        'start_char', 'packet_header', 'firmware_version', 'packet_type', 'packet_status', 'imei_number',
          'vehicle_number', 'gps_status', 'gps_date','gps_time', 'latitude', 'latitude_direction', 'longitude',
          'longitude_direction', 'altitude', 'speed', 'ground_course', 'satellite_count', 'hdop', 'pdop',
          'network_operator', 'network_type', 'signal_power', 'main_power', 'internal_battery_voltage',
          'ignition_input', 'buzzer_output', 'dynamic_field_1', 'bt_field', 'u_art', 'exact_adc_value',
          'device_state', 'odometer', 'packet_count', 'crc', 'last_char'
      ];

      const dataObject = {};
      assetIdForAssetDeviceMapping = dataValues[5];
      vehicleIdForAssetDeviceMapping = dataValues[6];
      for (let i = 0; i < dataValues.length; i++) {
          const columnName = tableColumns[i];
          const value = dataValues[i].trim();

          if (value === '') {
              dataObject[columnName] = 'NULL';
          } else {
            if (columnName === 'gps_date') {
                const dateComponent = dataValues[i];
                inputDate = dateComponent.toString()
                const day = inputDate.slice(0, 2);
                const month = inputDate.slice(2, 4);
                const year = inputDate.slice(4);
                const dateObject = new Date(`20${year}-${month}-${day}`);
                const formattedDate = dateObject.toISOString().split('T')[0];
                dataObject[columnName] = `'${formattedDate}'`;


              }else if(columnName === 'gps_time'){
                const timeComponent = dataValues[i];
                inputTime = timeComponent.toString();
                const hours = inputTime.slice(0, 2);
                const minutes = inputTime.slice(2, 4);
                const seconds = inputTime.slice(4);
                const formattedTime = `${hours}:${minutes}:${seconds}`;            
                dataObject[columnName] = `'${formattedTime}'`;
            }  
            else if (isNaN(value)) {
                  dataObject[columnName] = `'${value}'`;
                } else {
                    dataObject[columnName] = value;
                }
            }
      }
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
      const dataToInsert = {
          decodedData: decodedData,
          ServerHitTimestamp: formattedDate,
      };

      const query1 = {
          text: `
              INSERT INTO datalog (rawpacket, serverhittimestamp,status)
              VALUES ($1, $2 , $3)
              RETURNING *;
          `,
values: [dataToInsert.decodedData, dataToInsert.ServerHitTimestamp,0],
      };

      let client = await getClient();
      try {
          const dataInsertResult = await client.query(query1);
          const query2 = {
              text: 'SELECT * FROM asset_device_mapping WHERE "assetid" = $1 AND "imeino" = $2 AND "status" = true',
              values: [assetIdForAssetDeviceMapping.toString(), vehicleIdForAssetDeviceMapping.toString()],
          };

          const result = await client.query(query2);
          if (result.rows[0] === undefined) {
              const insertQuery = {
                  text: `
                      INSERT INTO gps_device_data (${Object.keys(dataObject).join(', ')})
                      VALUES (${Object.values(dataObject).join(', ')})
                      RETURNING *;
                  `,
};
              const gpsDeviceDataInsert = await client.query(insertQuery);
              const query3 = {
                  text: 'UPDATE datalog SET "status" = 1 WHERE "rawpacket" = $1',
                  values: [decodedData],
              };

              const updateResult = await client.query(query3);
          } else {
              console.log('Data does not inserted into the gps_device_data');
          }
      } finally {
          await client.end();
      }
  } catch (error) {
      console.error('Error:', error);
  }
};
