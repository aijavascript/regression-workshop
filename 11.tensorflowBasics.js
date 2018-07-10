/**
 * Let's cover the basics of tensorflow.js
 */

// 1 Can create variables (single values) and tensors like so
const x = tf.variable(tf.scalar(4.12));
const ys = tf.tensor([2, 2, 2, 2, 2], [5, 1]);

// 2 We can then perform maths operations between the tensors like so
const res = ys.mul(x); // This multiplies each value in the ys tensor by 2

// 3 To get the value of a tensor, we can't just print out the tensor object we need to call dataSync
console.log(res);
console.log(res.dataSync());

// 4 We want to optimise the x variable
// We want tensorflow to iteratively adjust the value of x so that x = ys return 0.
// So basically we expect x to to go to 0

const learningRate = 0.001; // TODO: Play arround with the learning weight. Show how a low value for learning rate will get us closer to 0 but will take a long time doing so. If we choose a high value the learning speed will be faster but won't get close to 0.
const optimizer = tf.train.sgd(learningRate); // We create the optimiser, this is a version called stochastic gradient decent

// We call optimiser.minimse and pass it a function
// - This function needs to return a scalar tensor (i.e. a tensor that is just 1 value, like the x variable)
// - We call this function a loss function, because we want to minimise the `loss`
// - The loss function needs to use the variable we are trying to minimise in the equation somewhere

console.log(x.dataSync());
optimizer.minimize(() => {
  return ys
    .mul(x)
    .mean()
    .abs();
});
console.log(x.dataSync()); // You can see the second time it runs through the value of x should go down

// 5 This is one epoch, one single iteration where it tries to optimise.
// normally however we run multiple epochs

for (let i = 0; i < 1000; i++) {
  tf.tidy(() => {});
  optimizer.minimize(() => {
    return ys
      .mul(x)
      .mean()
      .abs();
  });
  console.log(x.dataSync());
}

// 6 And because tensors use your GPU, it doesn't handle memory the same way as javascript running on the CPU does. So we need to be careful we don't run out.
// We either wrap code that is calculating using tensors in a tf.tidy or we can call dispose

for (let i = 0; i < 200; i++) {
  tf.tidy(() => {
    optimizer.minimize(() => {
      return ys
        .mul(x)
        .mean()
        .abs();
    });
    console.log(x.dataSync());
  });
}
