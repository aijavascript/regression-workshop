/**
 * The equation of a line is
 *
 * Y = MX + C
 *
 * This demo will show you how to draw a line based off that function
 */

// Play arround with these numbers to see what happens
let M = 1;
let C = 100;

const getY = x => windowHeight - (M * x + C); // We have to take it away from windowHeight because 0 is the top of the screen instead of the bottom

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  const startX = 0;
  const startY = getY(startX);
  const endX = windowWidth;
  const endY = getY(endX);
  stroke(51);
  strokeWeight(10);
  line(startX, startY, endX, endY);
}
