function setup() {
  createCanvas(windowWidth, windowHeight);
}

/*
This function is called every time a mouse is clicked.
*/
function mouseClicked() {
  // 1
  // Can just log mouse events here
  console.log("Clicked");
  // 2
  // Can get the X and Y of the mouse event with mouseX and mouseY
  console.log(mouseX, mouseY);
  // 3
  // We can print an elipse for each mouse click
  ellipse(mouseX, mouseY, 10);
}
