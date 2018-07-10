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
// TODO: Maybe we need to store another coefficient here?
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
//TODO: Maybe another tensorfor variable here?
const c = tf.variable(tf.scalar(Math.random()));

// Setup the optimiser
const learningRate = 0.5;

// Crete an optimiser, this will be used to change the weights (m and c) to minimise the loss function
const optimizer = tf.train.sgd(learningRate);

// Is passed in an array of X values and returns an array of predicted Y values based on the current values of m and c weights
function predict(x) {
  // TODO: This might need changing to be a polynomial equation, HINT - x.square() squares x
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
        // TODO: Maybe we need to exract the value from another tensor flow variable here?
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
    // console.log(y);
    // console.log(x, denormY(y));
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

// /**
//  *  This does the same but for a curve
//  */

// let LOSS = 0;
// let ITERATION = 0;

// // Play arround with these numbers to see what happens
// let A = 0.1;
// let B = 0.1;
// let C = 1;

// // This will store mouse x,y points that have been scaled from 0->1
// X = [];
// Y = [];

// // Calculate Y from X
// const getY = x => A * (x * x) + B * x + C; // We have to take it away from windowHeight because 0 is the top of the screen instead of the bottom

// // This scales a value from 0 to max to 0 to 1
// const norm = (x, max) => map(x, 0, max, 0, 1);

// // This scales a value from 0 to 1 to 0 to max
// const denorm = (x, max) => map(x, 0, 1, 0, max);

// const denormX = x => map(x, 0, 1, 0, windowWidth);
// const denormY = y => map(y, 0, 1, 0, windowHeight);

// const normX = x => map(x, 0, windowWidth, 0, 1);
// const normY = y => map(y, 0, windowHeight, 0, 1);

// // /**
// //  * The loss is calculated as the squred difference between the Y value of the mouse clicks and the actual Y value from the line which we then turn into a mean.
// //  *
// //  * The closer the mouse clicks are to the line the lower the value of the loss!
// //  */
// // function calculateLoss() {
// //   let squaredDiff = 0;

// //   for (let i = 0; i < X.length; i++) {
// //     let x = X[i];
// //     let y = Y[i];
// //     let actualY = norm(getY(x), windowHeight);
// //     squaredDiff += Math.pow(actualY - y, 2);
// //   }
// //   LOSS = squaredDiff / X.length;
// //   console.log(LOSS);
// // }

// /** TENSORFLOW */

// // Create tensors to store the weights of `m` and `c`
// const a = tf.variable(tf.scalar(Math.random()));
// const b = tf.variable(tf.scalar(Math.random()));
// const c = tf.variable(tf.scalar(Math.random()));

// // Setup the optimiser
// const learningRate = 0.5;

// // Crete an optimiser, this will be used to change the weights (m and c) to minimise the loss function
// const optimizer = tf.train.sgd(learningRate);

// // Is passed in an array of X values and returns an array of predicted Y values based on the current values of m and c weights
// function predict(x) {
//   return a
//     .mul(x.square())
//     .add(b.mul(x))
//     .add(c);
// }

// // When passed in the array of predictedYs calculates the mean square loss compared to the actualYs
// function loss(predictedYs, actualYs) {
//   // Mean Squared Error
//   let x = predictedYs
//     .sub(actualYs)
//     .square()
//     .mean();
//   LOSS = x.dataSync()[0];
//   return x;
// }

// // Pass in the actualXs and the actualYs (from the mouse clicks)
// // use the actualXs to calculate the prdictedYs
// // pass predictedYs and actualYs to the optimiser and try to minimise that value
// async function train(numIterations = 1) {
//   if (X.length) {
//     for (ITERATION = 0; ITERATION < numIterations; ITERATION++) {
//       tf.tidy(() => {
//         const actualXs = tf.tensor(X, [X.length, 1]);
//         const actualYs = tf.tensor(Y, [Y.length, 1]);

//         optimizer.minimize(() => loss(predict(actualXs), actualYs));

//         A = a.dataSync()[0];
//         B = b.dataSync()[0];
//         C = c.dataSync()[0];
//         console.table([[A, B, C]]);
//       });
//       await tf.nextFrame();
//     }
//   }
// }

// /** TENSORFLOW */

// function mouseClicked() {
//   console.log("Clicked", `${mouseX}, ${mouseY}`);
//   let Xnorm = norm(mouseX, windowWidth);
//   let Ynorm = norm(mouseY, windowHeight);
//   X.push(Xnorm);
//   Y.push(Ynorm);
//   train(10);
// }

// /*************************************************************** */

// function setup() {
//   createCanvas(windowWidth, windowHeight);
// }

// function draw_points() {
//   stroke(51);
//   // fill(51);
//   for (let i = 0; i < X.length; i++) {
//     let denormX = denorm(X[i], windowWidth);
//     let denormY = denorm(Y[i], windowHeight);
//     ellipse(denormX, denormY, 10);
//   }
//   noStroke();
// }

// function draw_line() {
//   const startX = 0;
//   const startY = getY(startX);
//   const endX = windowWidth;
//   const endY = getY(endX);

//   const denormStartX = denorm(startX, windowWidth);
//   const denormStartY = denorm(startY, windowHeight);
//   const denormEndX = denorm(endX, windowWidth);
//   const denormEndY = denorm(endY, windowHeight);

//   stroke(51);
//   strokeWeight(2);
//   line(denormStartX, denormStartY, denormEndX, denormEndY);
// }

// function draw_loss() {
//   noStroke();
//   fill(0);
//   textSize(20);
//   textFont("monospace");
//   text(LOSS.toFixed(5), 15, windowHeight - 20);
//   noFill(); // This resets our fill color
// }

// function draw_iteration() {
//   noStroke();
//   fill(0);
//   textSize(20);
//   textFont("monospace");
//   text(ITERATION, windowWidth - 40, windowHeight - 20);
//   noFill();
// }

// function draw_curve() {
//   for (let x = 0; x < windowWidth; x += 10) {
//     const y = getY(normX(x));
//     // console.log(y);
//     // console.log(x, denormY(y));
//     fill(51);
//     ellipse(x, denormY(y), 5);
//   }
// }

// function draw() {
//   background(255);
//   draw_points();
//   draw_loss();
//   draw_curve();
//   draw_iteration();
// }

// /*** KEEP */

// function draw_curve_old() {
//   const X1 = 0;
//   const Y1 = getY(X1);

//   const X2 = 0.25;
//   const Y2 = getY(X2);

//   const X3 = 0.5;
//   const Y3 = getY(X3);

//   const X4 = 1;
//   const Y4 = getY(X4);

//   console.log(
//     denormX(X1),
//     denormY(Y1),
//     denormX(X2),
//     denormY(Y2),
//     denormX(X3),
//     denormY(Y3),
//     denormX(X4),
//     denormY(Y4)
//   );

//   // const

//   // const denormStartX = denorm(startX, windowWidth);
//   // const denormStartY = denorm(startY, windowHeight);
//   // const denormEndX = denorm(endX, windowWidth);
//   // const denormEndY = denorm(endY, windowHeight);

//   stroke(51);
//   strokeWeight(2);
//   curve(
//     denormX(X1),
//     denormY(Y1),
//     denormX(X2),
//     denormY(Y2),
//     denormX(X3),
//     denormY(Y3),
//     denormX(X4),
//     denormY(Y4)
//   );
//   // curve(0, 480, 120, 495, 240, 516, 480, 576);
//   curve(0, 100, 120, 10, 240, 400, 800, 480);
// }
