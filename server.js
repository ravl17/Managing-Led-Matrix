// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();

// //Arduino part
// const { SerialPort } = require('serialport')
// const { ReadlineParser } = require('@serialport/parser-readline')


// const PORT = 3000;
// app.use(express.static('public'));

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// app.use(bodyParser.json());

// app.post('/submit-data', (req, res) => {
//   const data = req.body; // Data sent from the client
//   console.log('Received data:', data);
//   // You can process the data here.
//   res.json({ message: 'Data received successfully' });
//   console.log(typeof data);
// //   port.write(Buffer.from(data.buffer), (err) => {
// //     if (err) {
// //       console.error('Error writing data:', err);
// //     }
// //   });
// });

// //Arduino part
// const port = new SerialPort(
//     {path: "COM5",baudRate: 9600}
// )
// const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

// parser.on('data', (line)=>{
//     console.log('Arduino dice: ' + line)
//     port.write('Era una vez ')
// })

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
  // const receivedData = req.body.data; // Assuming the data is sent as JSON
  // Process the received data as needed
  const receivedData = new Uint16Array(req.body);

  res.json({ message: 'Data received successfully' });
  // port.write(Buffer.from(receivedData.buffer), (err) => {
  port.write(Buffer.from(receivedData), (err) => {
    if (err) {
      console.error('Error writing to the serial port:', err);
    } else {
      console.log('Data sent to Arduino:', receivedData);
    }
  });
});
parser.on('data', (line)=>{
    console.log('Arduino dice: ' + line)
    // port.write('Era una vez ')
})