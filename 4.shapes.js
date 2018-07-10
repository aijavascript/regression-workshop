function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // 1
  // ellipse(20, 20, 10);
  // 2
  // fill(250);
  // ellipse(windowWidth / 2, windowHeight / 2, 100);
  //   // 3
  strokeWeight(10);
  stroke(250);
  ellipse(windowWidth / 2, windowHeight / 2, 100);
  noStroke();
}
