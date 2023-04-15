let intensity = 6
let mouseX, mouseY = 0
let theda = 0
var canvas = document.getElementById("myCanvas");
let lastPos = []
let rainToRender = []

function getWidth() { return (canvas.width) }
function getHeight() { return (canvas.height) }

setInterval(update, 1)
setInterval(rainDrop, 1000 / intensity)


onmousemove = function (e) {
  mouseX = e.clientX - 10
  mouseY = e.clientY - 10
}

class Circle {
  constructor(positionX, positionY, radius) {
    this.positionX = positionX
    this.positionY = positionY
    this.radius = radius
    this.circle = canvas.getContext("2d");
    this.color = "#949494"
  }

  draw() {
    this.circle.beginPath();
    this.circle.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    this.circle.strokeStyle = this.color
    this.circle.fillStyle = this.color
    this.circle.stroke();
  }

  fill() {
    this.circle = canvas.getContext("2d");
    this.circle.beginPath();
    this.circle.arc(this.positionX, this.positionY, this.radius, 0, 2 * Math.PI);
    this.circle.fill();
  }
}

function update() {
  for (let i = 0; i < rainToRender.length; i++) {
    rainToRender[i].circle.clearRect(0, 0, canvas.width, canvas.height);
  }

  for (let i = 0; i < rainToRender.length; i++) {
    rainToRender[i].radius += 1
    rainToRender[i].color = colorLuminance(rainToRender[i].color, -0.01)

    if (rainToRender[i].radius > 300) {
      rainToRender[i] = 0
      rainToRender.splice(i, 1)
    }

    rainToRender[i].draw()
  }
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rainDrop() {
  if (Math.random() > 0.8) return

  rainToRender.push(new Circle(Math.random() * canvas.width, Math.random() * canvas.height, 1))
}

function colorLuminance(hex, lum) {
  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }

  return rgb;
}