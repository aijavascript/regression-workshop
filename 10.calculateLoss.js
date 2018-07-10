/**
 *
 * We now combine the code for collectPoints and calculateLine.
 *
 * For each mouse click, (x,y) find the corresponding point on the line (x, y1) and then calculate the mean squared error from y and y1
 *
 * Basically calculate how far off all the mouse clicks are from the calculated line.
 *
 * If you click on the line the error should be close to 0, if you click far from the line the error should be higher.
 *
 * This is the "loss" function
 *
 * The best fit line is the line which has the lowest loss value.
 */

let LOSS = 0;

// Play arround with these numbers to see what happens
const A = -0.4;
const C = 200;

// This will store mouse x,y points that have been scaled from 0->1
let Xs = [];
let Ys = [];

// Calculate Y from X
const getY = x => A * x + C; // We have to take it away from windowHeight because 0 is the top of the screen instead of the bottom

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);
const normX = x => norm(x, windowWidth);
const normY = x => norm(x, windowHeight);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);
const denormX = x => denorm(x, windowWidth);
const denormY = x => denorm(x, windowHeight);

function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  // Get the x and y values scaled from 0 -> 1
  let x = normX(mouseX);
  let y = normY(mouseY);
  Xs.push(x);
  Ys.push(y);

  // Now calcualte the loss across all points
  loss();
}

/**
 * The loss is calculated as the mean squared difference between the Y value of the mouse clicks and the actual Y value from the line.
 *
 * The closer the mouse clicks are to the line the lower the value of the loss!
 */
function loss() {
  let squaredDiff = 0;

  // For each point the user clicked
  for (let i = 0; i < Xs.length; i++) {
    // Get the normalised value of x for the click
    let x = Xs[i];
    // Get the nromalised value of y for the click
    let y = Ys[i];
    // Then use the equation of the line to get a value for y of the line
    let predictedY = normY(getY(x));

    // For each mouse click, the x of the mouse click and the x of the line is going to be the same. What is different is the y of the mouse click and the y of the line. We figure out the squared distance between those
    squaredDiff += Math.pow(predictedY - y, 2);
  }
  let mean = (LOSS = squaredDiff / Xs.length);
  console.log(LOSS);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw_points() {
  noStroke();
  fill(51);
  for (let i = 0; i < Xs.length; i++) {
    let x = denormX(Xs[i]);
    let y = denormY(Ys[i]);
    ellipse(x, y, 10);
  }
  noFill();
}

function draw_line() {
  stroke(51);
  const x1 = 0; // Start on the furthest left
  const y1 = getY(x1); // Get the y value for this
  const x2 = windowWidth; // End on the furthest right
  const y2 = getY(x2); // Get the y value for this
  line(x1, y1, x2, y2);
  noStroke();
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
