function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // We can add text with these functions
  // background(51);
  fill(0);
  textFont("monospace");
  textSize(40);
  text("Hello World!", 15, 40);
  textSize(20);
  text("I like ice-cream", 15, windowHeight - 20);
  noFill(); // This resets our fill color
}
