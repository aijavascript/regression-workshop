/**
 * We now use tensorflow to calcualte the values of M and C which give us the lowest loss
 *
 * 1. Add the tensorflow section
 * 2. On mouse click call train
 * - Set M and C so the line is drawn (dataSync)
 * - Add tf.nextFrame so it will animate
 * - Set the iterations higher so it will animate more
 * 3. Expose the LOSS value so it will render
 * 4. Expose the INTERATIONS value so it will render
 */

let LOSS = 0;
let ITERATION = 0;

// Play arround with these numbers to see what happens
let M = -0.4;
let C = 100;

// This will store mouse x,y points that have been scaled from 0->1
X = [];
Y = [];

// Calculate Y from X
const getY = x => M * x + C; // We have to take it away from windowHeight because 0 is the top of the screen instead of the bottom

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);

// /**
//  * The loss is calculated as the squred difference between the Y value of the mouse clicks and the actual Y value from the line which we then turn into a mean.
//  *
//  * The closer the mouse clicks are to the line the lower the value of the loss!
//  */
// function calculateLoss() {
//   let squaredDiff = 0;

//   for (let i = 0; i < X.length; i++) {
//     let x = X[i];
//     let y = Y[i];
//     let actualY = norm(getY(x), windowHeight);
//     squaredDiff += Math.pow(actualY - y, 2);
//   }
//   LOSS = squaredDiff / X.length;
//   console.log(LOSS);
// }

/** TENSORFLOW */

// Create tensors to store the weights of `m` and `c`
const m = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));

// Setup the optimiser
const learningRate = 0.5;

// Crete an optimiser, this will be used to change the weights (m and c) to minimise the loss function
const optimizer = tf.train.sgd(learningRate);

// Is passed in an array of X values and returns an array of predicted Y values based on the current values of m and c weights
function predict(x) {
  // y = m * x + b
  return m.mul(x).add(c);
}

// When passed in the array of predictedYs calculates the mean square loss compared to the actualYs
function loss(predictedYs, actualYs) {
  // Mean Squared Error
  let x = predictedYs
    .sub(actualYs)
    .square()
    .mean();
  LOSS = x.dataSync()[0];
  return x;
}

// Pass in the actualXs and the actualYs (from the mouse clicks)
// use the actualXs to calculate the prdictedYs
// pass predictedYs and actualYs to the optimiser and try to minimise that value
async function train(numIterations = 1) {
  if (X.length) {
    for (ITERATION = 0; ITERATION < numIterations; ITERATION++) {
      tf.tidy(() => {
        const actualXs = tf.tensor(X, [X.length, 1]);
        const actualYs = tf.tensor(Y, [Y.length, 1]);

        optimizer.minimize(() => loss(predict(actualXs), actualYs));

        M = m.dataSync()[0];
        C = c.dataSync()[0];
        // console.log(M, C);
      });
      await tf.nextFrame();
    }
  }
}

/** TENSORFLOW */

function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  let Xnorm = norm(mouseX, windowWidth);
  let Ynorm = norm(mouseY, windowHeight);
  X.push(Xnorm);
  Y.push(Ynorm);
  train(100);
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

  const denormStartX = denorm(startX, windowWidth);
  const denormStartY = denorm(startY, windowHeight);
  const denormEndX = denorm(endX, windowWidth);
  const denormEndY = denorm(endY, windowHeight);

  stroke(51);
  strokeWeight(2);
  line(denormStartX, denormStartY, denormEndX, denormEndY);
}

function draw_loss() {
  noStroke();
  fill(0);
  textSize(20);
  textFont("monospace");
  text(LOSS.toFixed(5), 15, windowHeight - 20);
  noFill(); // This resets our fill color
}

function draw_iteration() {
  noStroke();
  fill(0);
  textSize(20);
  textFont("monospace");
  text(ITERATION, windowWidth - 40, windowHeight - 20);
  noFill();
}

function draw() {
  background(255);
  draw_points();
  draw_loss();
  draw_line();
  draw_iteration();
}
