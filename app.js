// // import { SerialPort } from 'serialport'
// // import { ReadlineParser } from '@serialport/parser-readline'
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const port = new SerialPort(
    {path: "COM5",baudRate: 9600}
)
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

parser.on('data', (line)=>{
    console.log('Arduino dice: ' + line)
    port.write('Era una vez ')
})