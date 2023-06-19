let button;
let mode = -1;
let modeButton;
let permissionGranted = false;
let scaleFactor = 16;
let scaleUpButton;
let scaleDownButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    button = createButton("Click to grant access to sensors");
    button.style("font-size", "48px");
    button.center();
    button.mousePressed(requestAccess);
    
  } else {
    background(250); 
    text('Please open this URL on a smartphone or tablet.', 50, 60);
  }
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      console.log(response);
      if (response == "granted") {
        permissionGranted = true;
      }
    })
    .catch(console.error);
  button.remove();
  scaleUpButton = createButton("+");
  scaleUpButton.style("font-size", "32px");
  scaleUpButton.position(12, 175);
  scaleUpButton.style("transform", "rotate(90deg)");
  scaleUpButton.style("text-align", "center");
  scaleUpButton.mousePressed(() => {
    scaleFactor = scaleFactor * 1.2;
  });

  scaleDownButton = createButton("-");
  scaleDownButton.style("font-size", "32px");
  scaleDownButton.position(13, 35);
  scaleDownButton.style("padding", "0px");
  scaleDownButton.style("margin", "0px");
  scaleDownButton.style("transform", "rotate(90deg)");
  scaleDownButton.mousePressed(() => {
    scaleFactor = scaleFactor / 1.2;
  });
  modeButton = createButton("Toggle Mode");
  modeButton.style("font-size", "32px");
  modeButton.style("transform", "rotate(90deg)");
  modeButton.position(-75, height - 230);
  modeButton.mousePressed(changeMode);
}

function changeMode() {
  mode = -mode;
}

function drawArrow(x, y) {
  strokeWeight(10);
  stroke(0);
  push();
  translate(width / 2, height / 2);
  rotate(atan2(y, -x));
  line(0, 0, scaleFactor * mag(x, y), 0);
  line(
    scaleFactor * mag(x, y),
    0,
    scaleFactor * mag(x, y) - (scaleFactor / 4) * mag(x, y),
    (scaleFactor / 4) * mag(x, y)
  );
  line(
    scaleFactor * mag(x, y),
    0,
    scaleFactor * mag(x, y) - (scaleFactor / 4) * mag(x, y),
    (-scaleFactor / 4) * mag(x, y)
  );
  pop();
}

function drawCrosshairs() {
  strokeWeight(2);
  stroke(100);
  line(width / 2, 0, width / 2, height);
  line(0, height / 2, width, height / 2);
}


function drawBar(y) {
  push();
  translate(width / 2, height / 2);
  noStroke();
  let boxNumber = round(y)
  if (y > 0) {
    fill(250, 0, 0);
    for (let i = 0; i < abs(boxNumber); i++) {
      rect(-60, i*scaleFactor+0.1*scaleFactor, 120, scaleFactor*.8);
    }
  } else {
    fill(0, 235, 0);
    for (let i = 0; i < abs(boxNumber); i++) {
      rect(-60, Math.sign(y)*(i+1)*scaleFactor+0.1*scaleFactor, 120, scaleFactor*.8);
    }
  }
  pop();
}

function drawCircles() {
  push();
  noFill();
  translate(width / 2, height / 2);
  strokeWeight(1);
  stroke(100);
  ellipse(0, 0, scaleFactor * 10);
  ellipse(0, 0, 2 * scaleFactor * 10);
  ellipse(0, 0, 3 * scaleFactor * 10);
  pop();
}

function drawMarks() {
  push();
  translate(width / 2, height / 2);
  strokeWeight(1);
  stroke(100);
  for (let i = -8; i < 9; i++) {
    line(-width, 5 * scaleFactor * i, width, 5 * scaleFactor * i);
  }
  pop();
}


function draw() {
  if (!permissionGranted) {
   
    return;
  }
  background(255);
  let x = (accelerationX + pAccelerationX);
  let y = (accelerationY + pAccelerationY);
  drawCrosshairs();
  if (mode > 0) {
    drawCircles();
    drawArrow(x, y);
  } else {
    drawBar(y);
    drawMarks();
  }
}
