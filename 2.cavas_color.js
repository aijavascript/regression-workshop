/**
 * This is only called once
 */
function setup() {
  // We normally create a canvas element to the width and height of the screen
  createCanvas(windowWidth, windowHeight);
}

/**
 * This is called many many times and draws the page
 */
function draw() {
  // Then we can draw in this canvas, let's set the background color.
  // background(51); // Gray scale, from 0 (black) to 256 (white)
  // background("red"); // Can give a name
  background(34, 12, 44); // Can give exact red, green, blue values
}
