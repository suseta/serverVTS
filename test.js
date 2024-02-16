const path = require('path');
const fs = require('fs')
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const storeDataFile = async (port, decodedData) => {
    const fileName = `data_${new Date().toISOString().slice(0, 10)}.json`;
    const filePath = path.join(dataDir, fileName);
    let fileData = [];
  
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      fileData = JSON.parse(fs.readFileSync(filePath));
    }
  
    const lines = decodedData.split('\n');
    lines.forEach((line) => {
      if (line.trim() !== '') {
        // Create an object containing both the decoded data and the port number
        const dataObject = {
          port: port,
          decodedData: line.trim()
        };
        fileData.push(dataObject);
      }
    });
  
    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));
  };

  storeDataFile(123,"help")