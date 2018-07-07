// This will store mouse x,y points that have been scaled from 0->1
X = [];
Y = [];

// This scales a value from 0 to max to 0 to 1
const norm = (x, max) => map(x, 0, max, 0, 1);

// This scales a value from 0 to 1 to 0 to max
const denorm = (x, max) => map(x, 0, 1, 0, max);

function setup() {
  createCanvas(windowWidth, windowHeight);
}

/*
This function is called every time a mouse is clicked.
*/
function mouseClicked() {
  console.log("Clicked", `${mouseX}, ${mouseY}`);
  // 3
  // We can print an elipse for each mouse click
  let Xnorm = norm(mouseX, windowWidth);
  let Ynorm = norm(mouseY, windowHeight);
  X.push(Xnorm);
  Y.push(Ynorm);
  console.log([X, Y]);
}
