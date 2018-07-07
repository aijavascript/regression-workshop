/**
 *  Calculate how far off all the mouse clicks are from the calculated line,
 *
 * This is the "loss" function
 */

let LOSS = 0;

// Play arround with these numbers to see what happens
let M = -0.4;
let C = 100;

// This will store mouse x,y points that have been scaled from 0->1
X = [];
Y = [];

// Calculate Y from X
const getY = x => windowHeight / 2 - (M * x + C); // We have to take it away from windowHeight because 0 is the top of the screen instead of the bottom

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);

function predict(x) {
  // y = m * x + b
  return m.mul(x).add(b);
}

/**
 * The loss is calculated as the squred difference between the Y value of the mouse clicks and the actual Y value from the line which we then turn into a mean.
 *
 * The closer the mouse clicks are to the line the lower the value of the loss!
 */
function calculateLoss() {
  let squaredDiff = 0;

  for (let i = 0; i < X.length; i++) {
    let x = X[i];
    let y = Y[i];
    let actualY = norm(getY(x), windowHeight);
    squaredDiff += Math.pow(actualY - y, 2);
  }
  LOSS = squaredDiff / X.length;
  console.log(LOSS);
}

function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  let Xnorm = norm(mouseX, windowWidth);
  let Ynorm = norm(mouseY, windowHeight);
  X.push(Xnorm);
  Y.push(Ynorm);
  calculateLoss();
}

/*************************************************************** */

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw_points() {
  noStroke();
  fill(51);
  for (let i = 0; i < X.length; i++) {
    let denormX = denorm(X[i], windowWidth);
    let denormY = denorm(Y[i], windowHeight);
    ellipse(denormX, denormY, 10);
  }
  noFill();
}

function draw_line() {
  const startX = 0;
  const startY = getY(startX);
  const endX = windowWidth;
  const endY = getY(endX);
  stroke(51);
  strokeWeight(2);
  line(startX, startY, endX, endY);
}

function draw_loss() {
  noStroke();
  fill(0);
  textSize(20);
  textFont("monospace");
  text(LOSS.toFixed(5), 15, windowHeight - 20);
  noFill(); // This resets our fill color
}

function draw() {
  background(255); // This blanks the screen and shows it as white again
  draw_line();
  draw_points();
  draw_loss();
}
