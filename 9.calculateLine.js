/**
 * The equation of a line is
 *
 * Y = A*X + C - where A and C are constants and X is a variable.
 *
 * This demo will show you how to draw a line on the screen based off that function
 */

// Play arround with these numbers to see what happens
const A = 1;
const C = 100;

// Given the value of X return the value of Y using the equation of a line to calculate
const getY = x => A * x + C;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  const x1 = 0; // Start on the furthest left
  const y1 = getY(x1); // Get the y value for this
  const x2 = windowWidth; // End on the furthest right
  const y2 = getY(x2); // Get the y value for this
  stroke(51);
  strokeWeight(10);
  line(x1, y1, x2, y2);
}
