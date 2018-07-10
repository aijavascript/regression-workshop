/**
 * We now use tensorflow to calcualte the values of A and C which give us the lowest mean square loss
 *
 * 1. Add the tensorflow section
 * 2. On mouse click call train
 * - Set A and C so the line is drawn (dataSync)
 * - Add tf.nextFrame so it will animate
 * - Set the iterations higher so it will animate more
 * 3. Expose the LOSS value so it will render
 * 4. Expose the INTERATIONS value so it will render
 */

// We are storing some global variables, current values of things in our calculations so we can show it with p5
let LOSS = 0;
let CURRENT_EPOCH = 0;

// Play arround with these numbers to see what happens
let A = -0.4;
let C = 100;

// This will store mouse x,y points that have been scaled from 0->1
let Xs = [];
let Ys = [];

const MAX_EPOCHS = 300;

// Calculate Y from X
const getY = x => A * x + C;

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);
const normX = x => norm(x, windowWidth);
const normY = x => norm(x, windowHeight);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);
const denormX = x => denorm(x, windowWidth);
const denormY = x => denorm(x, windowHeight);

/*********************** TENSORFLOW START ***********************************/

// Create variables to store the weights of `A` and `C`
const a = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));

// Setup the optimiser
const learningRate = 0.5;

// Crete an optimiser, this will be used to change the weights (m and c) to minimise the loss function
const optimizer = tf.train.sgd(learningRate);

// Is passed in an array of X values and returns an array of predicted Y values based on the current values of m and c weights
function predict(x) {
  // y = m * x + b
  return a.mul(x).add(c);
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
  if (Xs.length) {
    for (CURRENT_EPOCH = 0; CURRENT_EPOCH < numIterations; CURRENT_EPOCH++) {
      tf.tidy(() => {
        const actualXs = tf.tensor(Xs, [Xs.length, 1]);
        const actualYs = tf.tensor(Ys, [Ys.length, 1]);

        optimizer.minimize(() => {
          let predictedYs = predict(actualXs);
          return loss(predictedYs, actualYs);
        });

        A = a.dataSync()[0];
        C = c.dataSync()[0];
        // console.log(A, C);
      });
      await tf.nextFrame();
    }
  }
}

/*********************** TENSORFLOW END ***********************************/

function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  let x = normX(mouseX);
  let y = normY(mouseY);
  Xs.push(x);
  Ys.push(y);
  // Everytime we click a mouse we run for this many epochs
  train(MAX_EPOCHS);
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

/**
 * !NOTE! We now have to use denorm functions because the variables A and C are being calcualted for normalised points
 */
function draw_line() {
  stroke(51);
  const x1 = denormX(0); // Start on the furthest left
  const y1 = denormY(getY(x1)); // Get the y value for this
  const x2 = denormX(1); // End on the furthest right
  const y2 = denormY(getY(1)); // Get the y value for this
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

function draw_iteration() {
  noStroke();
  fill(0);
  textSize(20);
  textFont("monospace");
  text(CURRENT_EPOCH, windowWidth - 40, windowHeight - 20);
  noFill();
}

function draw() {
  background(255);
  draw_points();
  draw_loss();
  draw_line();
  draw_iteration();
}
