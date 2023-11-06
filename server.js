const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const PORT = 3000;
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(bodyParser.json());

// Define the SerialPort at the top level
const port = new SerialPort({ path: 'COM5', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', (line) => {
  console.log('Arduino dice: ' + line);
});
app.use(bodyParser.raw({ type: 'application/octet-stream' }));
app.post('/submit-data', (req, res) => {
  const receivedData = new Uint16Array(req.body);

    port.write(Buffer.from(receivedData), (err) => {
      if (err) {
        console.error('Error writing to the serial port:', err);
      } else {
        console.log('Data sent to Arduino:', receivedData);
      }
    });
    res.json({ message: 'Data received successfully' });
});
parser.on('data', (line)=>{
    console.log('Arduino dice: ' + line)
})