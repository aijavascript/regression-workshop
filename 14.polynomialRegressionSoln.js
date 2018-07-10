/**
 * The equation for a polynomial (curved line) is this
 *
 * Y = A*X^2 + B*X + C
 *
 * Very similar to the linear regression example previously except now there are 3 variables to optimise, A, B and C instead of just A + C
 *
 * This file is the same as the linear regression code but has an extra function called draw_curve which will draw a curve instead of a line
 *
 * See if you can change this file so it fits a polynomial curve instead.
 */

// We are storing some global variables, current values of things in our calculations so we can show it with p5
let LOSS = 0;
let CURRENT_EPOCH = 0;

// Play arround with these numbers to see what happens
let A = -0.4;
let B = 1;
let C = 100;

// This will store mouse x,y points that have been scaled from 0->1
let Xs = [];
let Ys = [];

const MAX_EPOCHS = 300;

// Calculate Y from X
const getY = x => A * (x * x) + B * x + C;

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);
const normX = x => norm(x, windowWidth);
const normY = x => norm(x, windowHeight);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);
const denormX = x => denorm(x, windowWidth);
const denormY = x => denorm(x, windowHeight);

/*********************** TENSORFLOW START ***********************************/

// Create variables to store the weights of `A` , `B` and `C`
const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));

// Setup the optimiser
const learningRate = 0.5;

// Crete an optimiser, this will be used to change the weights (m and c) to minimise the loss function
const optimizer = tf.train.sgd(learningRate);

// Is passed in an array of X values and returns an array of predicted Y values based on the current values of a, b and c weights
function predict(x) {
  return a
    .mul(x.square())
    .add(b.mul(x))
    .add(c);
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
        B = b.dataSync()[0];
        C = c.dataSync()[0];
        // console.log(A, B, C);
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

function draw_curve() {
  for (let x = 0; x < windowWidth; x += 10) {
    const y = getY(normX(x));
    fill(51);
    ellipse(x, denormY(y), 5);
  }
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
  draw_curve();
  draw_iteration();
}
