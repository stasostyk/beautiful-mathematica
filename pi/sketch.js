let block1;
let block2;
let count = 0;
let digits = 1;
const timeSteps = 100000;
let pulsed = false;
let vel = -2;
let gph;
let vslider;
let dslider;

var pulses = [];

function setup() {
  createCanvas(windowWidth, windowHeight/2);

  block1 = new Block(100, 20, 1, 0, 0);
  var m2 = pow(100,digits);
  block2 = new Block(300, 150, m2, vel/timeSteps, 20);

  gph = new Graph(sqrt(m2)*vel);

  vslider = createSlider(-10, -1, -2, 1);
  vslider.position(10, 10);
  vslider.style('width', '80px');

  dslider = createSlider(0, 4, 1, 1);
  dslider.position(10, 30);
  dslider.style('width', '80px');
}

function draw() {
  if (vel != vslider.value()) {
    restartAll();
  }
  else if (digits != dslider.value()) {
    restartAll();
  }

    background(20);
  if (block1.v < block2.v && block1.v > 0 && block2.v > 0 && block1.x+block1.w != block2.x && block1.x >= width){
//     not gonna touch anymore
    // noLoop();
  }
  noStroke();
  fill(255);
  text('Velocity', 100, 25);
  text('Digits of Pi', 100, 45);

  push();
  textSize(20);
  text('Collisions: ' + count, 20, 80);
  pop();

  gph.show();


  for (let i = 0; i < timeSteps; i++) {

    if (block1.collide(block2)) {
      const v1 = block1.bounce(block2);
      const v2 = block2.bounce(block1);
      block1.v = v1;
      block2.v = v2;
      count++;
      addPulse(block1.x + block1.w, 100);
      pulsed = true;
    }
    if (block1.hitWall()) {
      block1.reverse();
      count++;
      addPulse(0, 100);
      pulsed = true;
    }

    block1.update();
    block2.update();
  }
  pulsed = false;

  block1.show();
  block2.show();

  for (let p = 0; p < pulses.length; p++) {
    pulses[p].update();

    if (pulses[p].rad >= pulses[p].mag) {
      pulses.splice(p, 1)
    } else {
     pulses[p].show();
    }
  }
}

function addPulse(x, mag) {
  gph.update(block1.v, block2.v, block1.m, block2.m);
  if (!pulsed) {
   pulses.push(new Pulse(x, mag));
  }
}

function restartAll() {
  vel = vslider.value();
  digits = dslider.value();

  block1 = new Block(100, 20, 1, 0, 0);
  var m2 = pow(100,digits);
  block2 = new Block(300, 150, m2, vel/timeSteps, 20);

  count = 0;
  gph = new Graph(sqrt(m2)*vel);

}
