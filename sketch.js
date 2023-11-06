// arrays to store colors, deviations, and coordinates, and set the base values of Size and radius
let colors = [];
let deviations = [];
let coordinates = [];
let contrastColors = [];
// canvas size
let size = 1000;
let radius = size * 0.27;

let originalCoordinates = [];
let ellipseOffsets = [];
let isMousePressed = false;


let spreading = false;
// viriables that contol the spread speed
let spreadSpeed = 1; 
// spread angle
let spreadAngle = 0; 
let spreadRadius = 0; 
let spreadDiameter = 4; 
let spreadMaxRadius = 200; 
let spreadExpansionRate = 2; 

let gradientMode = false;
let gradientColors = [];

function mousePressed() {
  isMousePressed = true;
}

function mouseReleased() {
  isMousePressed = false;
}
//Creates an array of colours that fade from a start colour to an end colour:
function generateGradient(startColor, endColor, steps) {
  let gradient = [];
  for (let i = 0; i < steps; i++) {
    let r = lerp(startColor[0], endColor[0], i / steps);
    let g = lerp(startColor[1], endColor[1], i / steps);
    let b = lerp(startColor[2], endColor[2], i / steps);
    gradient.push([r, g, b]);
  }
  return gradient;
}
function keyPressed() {
  if (keyCode === 32) { // 32 is the ASCII code of space
    gradientMode = !gradientMode;
    if (gradientMode) {
      //start and end color
      let startColor = [255, 0, 0]; // red
      let endColor = [0, 0, 255]; // blue
      // create gradientcolor array
      gradientColors = generateGradient(startColor, endColor, coordinates.length);
    }
  }
}

function setup() {

  // Create a canvas with a specified size of 1000x1000
  createCanvas(size, size);
  loop();
  for (let i = 0; i < 500; i++) {
    // generate a number from range 0 t0 232
    let gray = Math.floor(Math.random() * 233);
  
    // all the channel use the same grey value
    colors.push([gray, gray, gray]);
    let contrastColor = gray > 127 ? [0, 0, 0] : [255, 255, 255];
    contrastColors.push(contrastColor);
    deviations.push(Math.floor(Math.random() * 13) - 6);
  }
  //Generates a set of coordinates for the circle
  for (let i = 0; i < 6; i++) {
    let diff = i % 2 === 0 ? 0 : radius / 2;
    for (let j = 0; j < 6; j++) {
      coordinates.push([radius * j + j * 20 + diff, radius * i - i * 10])
    }
  }
  originalCoordinates = coordinates.map(coord => [...coord]);

  for (let i = 0; i < coordinates.length; i++) {
    ellipseOffsets.push([0, 0]);
}
}

function draw() {
  // rotate and translate canvas
  rotate(-PI / 11);
  translate(-350, -100);
  // Set the background color to a dark blue
  background(contrastColors)

  if (isMousePressed) {
    spreadAngle += spreadSpeed; // increase the spread angle to spread
  }
    // caculate the postion of the mouse on the canvas
    const canvasMouseX = mouseX + 350;
    const canvasMouseY = mouseY + 100;
  
    for (let i = 0; i < coordinates.length; i++) {
      // check the postion of the mouse from the canvas
      if (dist(canvasMouseX, canvasMouseY, coordinates[i][0], coordinates[i][1]) < radius) {
        let angle = atan2(coordinates[i][1] - canvasMouseY, coordinates[i][0] - canvasMouseX); 
        ellipseOffsets[i][0] += cos(angle) * 5;  
        ellipseOffsets[i][1] += sin(angle) * 5;
      } else {
        ellipseOffsets[i][0] = lerp(ellipseOffsets[i][0], 0, 0.05); 
        ellipseOffsets[i][1] = lerp(ellipseOffsets[i][1], 0, 0.05);
      }
      drawCircle(coordinates[i][0] + ellipseOffsets[i][0], coordinates[i][1] + ellipseOffsets[i][1], i);
    }

      
  if (spreading) {
    spreadAngle += spreadSpeed; 
    spreadRadius += spreadExpansionRate; 
    if (spreadRadius > spreadMaxRadius) {
      spreading = false; 
    }
    dashedCircle(spreadRadius, spreadDiameter, spreadDiameter * 2);
  }
  if (gradientMode) {
    redraw(); 
  }
}

/*
* Draw circle
* x: the position of the horizontal coordinate axis
* y: the position of the vertical coordinate axis
* index: index of the current circle in the array
*/
function drawCircle(x, y, index) {
  push()
 // choose color mode
 let fillColor;
 if (gradientMode) {
   // gradient
   fillColor = gradientColors[index];
 } else {
   // grey
   fillColor = colors[index * 10];
 }
 
 stroke(0, 0, 0, 0);
 fill(fillColor);
 circle(x, y, radius);
  // center circle
  fill(fillColor);
  circle(x, y, 20);
  // outer rings
  for (let i = 0; i < 8; i++) {
    fill(0, 0, 0, 0);
    stroke(colors[index * 10 + i + 1]);
    strokeWeight(10);
    ellipse(x, y, (i + 1) * 15 + deviations[i], (i + 1) * 15 + + deviations[i + 1])
  }
  translate(x, y);
  // Draw the serration line in the middle of every four circles
  if (index % 4 === 0) {
    circleLine(colors[index * 10 + 10])
  } else {
    // Draw dashed circle
    for (let i = 0; i < 4; i++) {
      fill(colors[index * 10 + 10]); 
      dashedCircle(75 + i * (radius - 180) / 5, 10, 20);
    }
  }
  // Draw the stamen in the middle of every two circles
  if (index % 2 === 0) {
    rotate(Math.PI * 2 / 30 * index);
  }
  pop()
}

function dashedCircle(radius, dotDiameter, dotSpacing) {
  let steps = floor(TWO_PI * radius / dotSpacing);
  push(); 
  rotate(spreadAngle); 
  for (let i = 0; i < steps; i++) {
    let theta = map(i, 0, steps, 0, TWO_PI);
    let x = cos(theta) * radius;
    let y = sin(theta) * radius;
    fill(0);
    noStroke();
    circle(x, y, dotDiameter);
  }
  pop(); 
}

/*
* Draw serration line circle
* color: color of line
*/
function circleLine(color) {
  stroke(color)
  strokeWeight(3);
  // initialize small/large circle points array
  let smallCirclePoints = [[65, 0]];
  let largeCirclePoints = [[132, 0]];
  let angle = Math.PI * 2 / 30;
  // add 30 new point to small circle points array
  for (let i = 0; i <= 30; i++) {
    smallCirclePoints.push([65 * cos(angle * i), 65 * sin(angle * i)])
  }
  // add 30 new point to large circle points array
  for (let i = 0; i <= 30; i++) {
    largeCirclePoints.push([132 * cos(angle * i), 132 * sin(angle * i)])
  }
  // Form a jagged shape based on the interaction and connection of points in two arrays
  for (let i = 0; i < 31; i++) {
    line(smallCirclePoints[i][0], smallCirclePoints[i][1], largeCirclePoints[i][0], largeCirclePoints[i][1]);
    line(largeCirclePoints[i][0], largeCirclePoints[i][1], smallCirclePoints[i + 1][0], smallCirclePoints[i + 1][1]);
  }
}

/*
* Draw stamen line of circle
* currentRadius: radius size of a circle
*/
function drawPetal(currentRadius) {
  const ratio = 3
  // draw bezier line by calc result
  stroke(234, 85, 126);
  strokeWeight(10);
  noFill();
  bezier(0, 0, -currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius);
  // rotate and draw another bezier line by calc result
  rotate(Math.PI * 2 /90);
  stroke(236, 65, 87);
  bezier(0, 0, -currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius);
} 

