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

function setup() {
  // Create a canvas with a specified size of 1000x1000
  createCanvas(size, size);
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
  background(colors)
  // Draw all circle based on coordinates
  for (let i = 0; i < coordinates.length; i++) {
    if (dist(mouseX, mouseY, coordinates[i][0], coordinates[i][1]) < radius) {
        let angle = atan2(coordinates[i][1] - mouseY, coordinates[i][0] - mouseX); // 计算鼠标和椭圆之间的角度
        ellipseOffsets[i][0] += cos(angle) * 5;  // 使用cos和sin函数沿该角度移动椭圆
        ellipseOffsets[i][1] += sin(angle) * 5;
    } else {
        ellipseOffsets[i][0] = lerp(ellipseOffsets[i][0], 0, 0.05); // 平滑地将椭圆返回到其原始位置
        ellipseOffsets[i][1] = lerp(ellipseOffsets[i][1], 0, 0.05);
    }
    drawCircle(coordinates[i][0] + ellipseOffsets[i][0], coordinates[i][1] + ellipseOffsets[i][1], i);
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
  // background circle
  stroke(0, 0, 0, 0)
  fill(colors[index * 10]);
  circle(x, y, radius);
  // center circle
  fill(colors[index * 10 + 1]);
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

  for (let i = 0; i < steps; i++) {
    let theta = map(i, 0, steps, 0, TWO_PI);
    let x = cos(theta) * radius;
    let y = sin(theta) * radius;
    fill(contrastColors);
    noStroke();
    ellipse(x, y, dotDiameter);
  }
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

