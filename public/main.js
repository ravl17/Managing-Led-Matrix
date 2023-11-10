var pulsado = false;

function crearPixel() {
    let matrixWidth = document.getElementById("matrixWidth").value;
    let matrixHeight = document.getElementById("matrixHeight").value;

    var matrixLed = document.getElementById("matrixLed");
    matrixLed.addEventListener("mousedown", botonPulsado);
    matrixLed.addEventListener("mouseup", botonSoltado);

    document.getElementById("matrixLed").innerHTML = "";

    for (i = 0; i < matrixHeight; i++) {
        var tr = document.createElement("tr");

        for (j = 0; j < matrixWidth; j++) {
            var td = document.createElement("td");
            var ledColor = document.createElement("BUTTON");
            ledColor.setAttribute("id", "buttonLedColor" + j + "_" + i);
            ledColor.setAttribute("class", "button_led");
            ledColor.addEventListener('mouseover', function onClick(event) {
                if (pulsado) {
                    event.target.style.backgroundColor = document.getElementById("colorSeleccionado").value;
                }
            });
            ledColor.addEventListener('click', function onClick(event) {
                event.target.style.backgroundColor = document.getElementById("colorSeleccionado").value;
            });
            td.appendChild(ledColor);
            tr.appendChild(td);
        }
        matrixLed.appendChild(tr);
    }
}
function botonPulsado() {
    pulsado = true;
}

function botonSoltado() {
    pulsado = false;
}
function sendData() {
    let matrixWidth = document.getElementById("matrixWidth").value;
    let matrixHeight = document.getElementById("matrixHeight").value;

    const bitmap = createBitmap(matrixWidth, matrixHeight);
    fetch('/submit-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: bitmap.buffer,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}
function createBitmap(matrixWidth, matrixHeight) {
    const uint16Array = new Uint16Array(matrixWidth * matrixHeight);
    for (let i = 0; i < matrixHeight; i++) {
        for (let j = 0; j < matrixWidth; j++) {
            const cell = document.getElementById("buttonLedColor" + j + "_" + i);
            const color = cell.style.backgroundColor;
            const rgb565 = rgbToRgb565(color);
            uint16Array[matrixWidth * i + j] = rgb565ToUint16(rgb565);
        }
    }

    return uint16Array;
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
        const rgb565Hex = rgb565Value.toString(16).toUpperCase();
        return rgb565Hex;
    } else {
        return "0";
    }
}


function rgb565ToUint16(hexString) {
    try {
        // Convert the hexadecimal string to a binary string
        let binaryString = (parseInt(hexString, 16) >>> 0);

        return binaryString;
    } catch (error) {
        console.log(error);
        return null;
    }
}

function fillMatrix() {
    let leds = document.querySelectorAll('.button_led');
    leds.forEach(led => {
        led.style.backgroundColor = document.getElementById("colorSeleccionado").value;
    })
}
