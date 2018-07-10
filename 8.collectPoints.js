/**
 * In this example we start collecting X,Y point from the mouse clicks.
 * We store them in global variables X,Y as normalised values, instead of (22,333) it will be something like (0.1212, 0.21212) with the max height as 1 and the max width as 1
 */

// This will store mouse x,y points that have been scaled from 0->1
let Xs = [];
let Ys = [];

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);
const normX = x => norm(x, windowWidth);
const normY = x => norm(x, windowHeight);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);
const denormX = x => denorm(x, windowWidth);
const denormY = x => denorm(x, windowHeight);

function setup() {
  createCanvas(windowWidth, windowHeight);
}

/*
This function is called every time a mouse is clicked.
*/
function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  const x = normX(mouseX);
  const y = normY(mouseY);
  Xs.push(x);
  Ys.push(y);
  console.log([Xs, Ys]);
}
