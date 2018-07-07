function setup() {
  createCanvas(windowWidth, windowHeight);
}
/**
 * We don't want to have to scale everything to the windowHeight and width all the time.
 *
 * This let's us stat doing things like keeping all the numbers between 0 and 1 instead of dealing with each window hight/width.
 *
 * Can also perhaps let us to responsive design?
 */
function draw() {
  // 1
  // This scales 500 from 0 -> 1000 to 0 -> 1.
  // let foo = map(500, 0, 1000, 0, 1);
  // console.log(foo); // 0.5
  // 2
  // This scales 200 from 0 -> windowWidth to 0 -> 100.
  // (Basically figures out what % of the way across the scroon 200 px is)
  // let normX = map(200, 0, windowWidth, 0, 100);
  // console.log(normX);
  // 3
  // This scales 0.3 from 0 -> 1 to  0 -> windowWidth
  // (Figures out how many pixels across 30% of the window is.)
  // let normX = map(0.3, 0, 1, 0, windowWidth);
  // console.log(normX);
  // 4
  // We can then easily draw a line from 30% across to 60% across half way up the screen
  // let startX = map(0.3, 0, 1, 0, windowWidth); // 30% of the way across
  // let endX = map(0.6, 0, 1, 0, windowWidth); // 60% of the way across
  // let [startY, endY] = [windowHeight / 2, windowHeight / 2]; // Half way up
  // console.log(startX, startY, endX, endY);
  // stroke(51);
  // line(startX, startY, endX, endY);
  // noStroke();
}
