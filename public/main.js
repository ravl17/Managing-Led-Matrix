var pulsado = false;

function crearPixel(tableX, tableY) {
    //Falta cambiar nombre variables y cambiar X por Y jeje
    var divPixel = document.getElementById("tabl");
    divPixel.addEventListener("mousedown", botonPulsado);
    divPixel.addEventListener("mouseup", botonSoltado);


    document.getElementById("tabl").innerHTML = "";
    var tab = document.getElementById("tabl");

    for (i = 0; i < tableY; i++) {
        var trtr = document.createElement("tr");

        for (j = 0; j < tableX; j++) {
            var a = document.createElement("td");
            a.setAttribute("id", "led_" + j + "_" + i);

            var ledColor = document.createElement("BUTTON");
            ledColor.setAttribute("id", "buttonLedColor" + j + "_" + i);
            ledColor.addEventListener('mouseover', function onClick(event) {
                if (pulsado) {
                    event.target.style.backgroundColor = document.getElementById("colorSeleccionado").value;
                }

            });
            ledColor.addEventListener('click', function onClick(event) {
                event.target.style.backgroundColor = document.getElementById("colorSeleccionado").value;

            });
            a.appendChild(ledColor);
            // arr.push(a);
            trtr.appendChild(a);
        }
        tab.appendChild(trtr);
    }
}

function sendData(tableX, tableY) {
    const bitmap = createBitmap(tableX, tableY);
    const bitmap565 = rgbToUint16Array(bitmap);
    // console.log(rgbToUint16Array(bitmap));
    // enviarDato(bitmap565);
    fetch('/submit-data', {
        method: 'POST',
        headers: {
            // 'Content-Type': 'application/json',
            'Content-Type': 'application/octet-stream',
        },
        // body: JSON.stringify({ data: Array.from(array) }),
        body: bitmap565.buffer,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // You can handle the server response here.
        })
        .catch(error => console.error('Error:', error));
}
function createBitmap(tableX, tableY) {
    const bitmap = new Array();
    for (let i = 0; i < tableY; i++) {
        for (let j = 0; j < tableX; j++) {
            const cell = document.getElementById("buttonLedColor" + j + "_" + i);
            const color = cell.style.backgroundColor;
            const rgbValues = rgbToRgb565(color);
            // Store the RGB values in the bitmap
            // bitmap[i][j] = rgbValues;
            // Store the color in the bitmap
            bitmap.push(rgbValues);
        }
    }
    // console.log(bitmap);

    return bitmap;
}
function rgbToRgb565(color) {
    rgb = color.replace(/[^\d,]/g, '').split(',');
    if (rgb.length == 3) {

        red = rgb[0];
        green = rgb[1];
        blue = rgb[2];

        red = Math.round(red / 255 * 31);
        green = Math.round(green / 255 * 63);
        blue = Math.round(blue / 255 * 31);

        const rgb565Value = (red << 11) | (green << 5) | (blue);
        // console.log(rgb565Value);
        const rgb565Hex = rgb565Value.toString(16).toUpperCase();
        return "0x" + rgb565Hex;
    } else {
        return "0x0";
    }
}
function botonPulsado() {
    pulsado = true;
}

function botonSoltado() {
    pulsado = false;
}


// function createBitmapBinaryData(tableX, tableY) {
//     // Convert the bitmap to binary data and return it as an array of bytes.
//     const bitmap = createBitmap(tableX, tableY);
//     // console.log(rgbToUint16Array(bitmap));
//     enviarDato(rgbToUint16Array(bitmap));
//     // enviarDato(bitmap);
//     const binaryData = new Uint8Array(tableX * tableY*2); // Assuming 16-bit RGB565 format

//     for (let i = 0; i < tableY; i++) {
//         for (let j = 0; j < tableX; j++) {
//             const index = (i * tableX + j) * 2;
//             const rgb565Value = bitmap[i * tableX + j];
//             binaryData[index] = (rgb565Value >> 8) & 0xFF;
//             binaryData[index + 1] = rgb565Value & 0xFF;
//         }
//     }
//     // console.log(binaryData);

//     return binaryData;
// }

function rgbToUint16Array(colors) {
    console.log(colors);
    const uint16Array = new Uint16Array(colors.length);

    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        uint16Array[i] = hexStringToBinary(color);
    }

    return uint16Array;
}

function hexStringToBinary(hexString) {
    try {
        // Remove the '0x' prefix if it exists
        if (hexString.startsWith("0x")) {
            hexString = hexString.slice(2);
        }
        // Convert the hexadecimal string to a binary string
        let binaryString = (parseInt(hexString, 16) >>> 0);

        return binaryString;
    } catch (error) {
        console.log(error);
        return null;
    }
}