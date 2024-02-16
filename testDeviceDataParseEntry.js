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

const connectDb = async () => {
  const connectionString = `postgresql://postgres:root@localhost:5432/navxdb`;
  const client = new Client({ connectionString });
  await client.connect();
  return client;
}

const getClient = async () => {
const client = await connectDb();
  return client;
}

const dataDir = './data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}


const storeDataFile = async(decodedData) =>{
  const fileName = `data_${new Date().toISOString().slice(0, 10)}.json`;
  const filePath = path.join(dataDir, fileName);
  let fileData = [];
  if (fs.existsSync(filePath)) {
      fileData = JSON.parse(fs.readFileSync(filePath));
  }
  const lines = decodedData.split('\n');
  lines.forEach((line) => {
    if (line.trim() !== '') {
      fileData.push(line.trim()); 
    }
  });
  // Write data to file
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
}

function getLastProcessedPosition(filePath) {
    const posFilePath = filePath + '.pos';
    if (fs.existsSync(posFilePath)) {
        return parseInt(fs.readFileSync(posFilePath, 'utf8'));
    } else {
        return 0;
    }
}

function updateLastProcessedPosition(filePath, position) {
    const posFilePath = filePath + '.pos';
    fs.writeFileSync(posFilePath, position.toString());
}

async function readDataAndStoreInDB(filePath) {
    const lastProcessedPosition = getLastProcessedPosition(filePath);
    const fileData = JSON.parse(fs.readFileSync(filePath));
    for (let i = lastProcessedPosition; i < fileData.length; i++) {
        const data = fileData[i];
    await storeDataInDb(data)
      console.log(`pos = ${i} and Data = ${data}`)
    }
    updateLastProcessedPosition(filePath, fileData.length);
}


schedule.scheduleJob('* * * * *', async () => {
    const currentDate = new Date();
    const fileName = `data_${currentDate.toISOString().slice(0, 10)}.json`;
    const filePath = path.join(dataDir, fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        await readDataAndStoreInDB(filePath);
    }
});

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
        c_start_char,
        s_pkt_hdr,
        s_frmwr_ver,
        s_pkt_typ,
        s_pkt_status,
        s_imei_no,
        s_asset_id,
        i_gps_status,
        gps_dt,
        gps_tm,
        d_lat,
        s_lat_dir,
        d_long,
        s_long_dir,
        d_alt,
        d_spd,
        s_grd_crs,
        i_sat_cnt,
        d_hdop,
        d_pdop,
        s_ntw_op,
        s_ntw_typ,
        d_sgnl_pwr,
        d_int_bat_volt,
        s_ign_ip,
        s_buz_op,
        s_dyn_f1,
        s_bt_f,
        s_u_art,
        s_ext_adc_val,
        s_dvc_state,
        s_odometer,
        s_pkt_cnt,
        s_crc,
        c_last_char        
    ];
    var tableSelectionBasedOnGpsStatus; 
    const dataObject = {};
    assetIdForAssetDeviceMapping = dataValues[5];
    vehicleIdForAssetDeviceMapping = dataValues[6];
    for (let i = 0; i < dataValues.length; i++) {
        const columnName = tableColumns[i];
        const value = dataValues[i].trim();

        if (value === '') {
            dataObject[columnName] = 'NA';
        } else {
          if (columnName === 'gps_dt') {
              const dateComponent = dataValues[i];
              inputDate = dateComponent.toString()
              const day = inputDate.slice(0, 2);
              const month = inputDate.slice(2, 4);
              const year = inputDate.slice(4);
              const dateObject = new Date(`20${year}-${month}-${day}`);
              const formattedDate = dateObject.toISOString().split('T')[0];
              dataObject[columnName] = `'${formattedDate}'`;


            }else if(columnName === 'gps_tm'){
              const timeComponent = dataValues[i];
              inputTime = timeComponent.toString();
              const hours = inputTime.slice(0, 2);
              const minutes = inputTime.slice(2, 4);
              const seconds = inputTime.slice(4);
              const formattedTime = `${hours}:${minutes}:${seconds}`;            
              dataObject[columnName] = `'${formattedTime}'`;

          }else if(columnName === 'i_gps_status'){
            tableSelectionBasedOnGpsStatus = value
          }else if (isNaN(value)) {
                dataObject[columnName] = `'${value}'`;
         } else {
                  dataObject[columnName] = value;
        }
          }
    }

    const dataToInsert = {
        decodedData: decodedData,
        ServerHitTimestamp: new Date(),
    };

    const query1 = {
        text: `
            INSERT INTO datalog (s_raw_pkt,svr_ht_ts,i_status)
            VALUES ($1, $2 , $3)
            RETURNING *;
        `,
values: [dataToInsert.decodedData, dataToInsert.ServerHitTimestamp,0],
    };

    let client = await getClient();
    try {
        const dataInsertResult = await client.query(query1);
        const query2 = {
            text: 'SELECT * FROM asset_device_mapping WHERE "s_asset_id" = $1 AND "i_nw_imei_no" = $2',
            values: [assetIdForAssetDeviceMapping.toString(), vehicleIdForAssetDeviceMapping.toString()],
        };

        const result = await client.query(query2);
        if (result.rows[0] === undefined) {
            if(tableSelectionBasedOnGpsStatus == 0){
                const insertQuery = {
                    text: `
                        INSERT INTO gps_0_parsed_data (${Object.keys(dataObject).join(', ')})
                        VALUES (${Object.values(dataObject).join(', ')})
                        RETURNING *;
                    `,
                };
                const gpsDeviceDataInsert = await client.query(insertQuery);
            }else{
                const insertQuery = {
                    text: `
                        INSERT INTO gps_1_parsed_data (${Object.keys(dataObject).join(', ')})
                        VALUES (${Object.values(dataObject).join(', ')})
                        RETURNING *;
                    `,
                };
                const gpsDeviceDataInsert = await client.query(insertQuery);    
            }            
            const query3 = {
                text: 'UPDATE datalog SET "status" = 1 WHERE "s_raw_pkt" = $1',
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

