// canvas items
let terms;
let speed;
let reset;
let pause;
let paused = false;
let smoothify;

// setup
function setup() {
  createCanvas(700, 500);

//   declaring canvas elements
  terms = createSlider(1, 17);
  terms.position(10, 10);
  speed = createSlider(1, 50, 25);
  speed.position(10, 30);
  reset = createButton("Reset");
  reset.position(10, 70);
  reset.mouseClicked(resetSim);
  pause = createButton("Pause");
  pause.position(80, 70);
  pause.mouseClicked(pauseSim);
  smoothify = createCheckbox('Smooth out timesteps', true);
  smoothify.position(150, 70);
}

// time of animation
let t = 1;
// timestep of animation modified by acceleration
let dt = 0;
// acceleration of animation (to account for progressively larger terms needed)
let ddt = 0.00001;


// main loop
function draw() {
  background(220);


//   setup graph
  stroke(0);
  strokeWeight(0.4);
  line(width/2, 0, width/2, height);
  line(0, height/2, width, height/2);


//   plot base sin function
  strokeWeight(1.4);
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < width; i++) {
    vertex(i,height/2 - 50*sin(10*PI*(i-width/2)/width));
  }
  endShape();


//   move onto next frame
  if (t<terms.value()*2+1 && !paused) {
    if (!smoothify.checked())
//       slowly accelerating timstep
      t += speed.value()/1000 + dt;
    else {
//       timstep is divided by modified coefficient factor, so the further progress to next term, the slower it will move to the next step
      t += (speed.value()/1000 + dt) / ((((t-1)/2) % 1)*floor(t/4)+1);
    }
//     accelerates, because higher terms get boring to wait for
    dt += ddt;
  }


//   display and compute maclaurin polynomial
  stroke(0,0,255);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let i = 0; i < width; i++) {
    vertex(i,height/2 - 50*maclaurin(floor(t), (((t-1)/2) % 1), 10*PI*(i-width/2)/width));
  }
  endShape();


  //   display text
  fill(255);
  stroke(0);
  rect(0,height, width, -100);
  strokeWeight(0.5)
  fill(0);
  textSize(20);
  text("Maclaurin terms computed: " + floor((t-1)/2), 10, height-70);
  text("Progress to next term: " + floor(100*(((t-1)/2) % 1)) + "%", 400, height-70);

  textSize(15);
  text(terms.value() + " terms", 180, 30);
  text("Speed", 180, 50);


//   display maclaurin polynomial terms
  expression = "";
  let sign = 1;
  textSize(18);
  for (let i = 1; i <= floor(t); i+=2) {
    sign*= -1;
    if (i >= 5) {
      if (sign < 0)
        expression += "-      ";
      else
        expression += "+      ";

      displayTerm(i*19-50, height-32, i-2);
    }
    else if (i == 3)
      expression += "x  ";
  }
  text(expression, 10, height-20);

}

// input order of magnitude for series, completion coefficient, xcord, output is ycord
function maclaurin(order, coef, xcord) {
  let ycord = 0;
  let sign = -1;
  for (let i = 1; i <= order; i+=2) {
    sign *= -1;
    if (i >= order-1)
//       this term is getting completed so muliplied by completion coefficient
      ycord += coef * sign * pow(xcord,i) / factorial(i);
    else
//       all other terms
      ycord += sign * pow(xcord,i) / factorial(i);
  }

  return ycord;
}

// compute factorial because ew no in-built function
function factorial(n) {
    return (n != 1) ? n * factorial(n - 1) : 1;
}

// display non-first term of maclaurin series
function displayTerm(xcord, ycord, term) {
  push();
  textSize(15);
  text("x", xcord+4, ycord);
  text("—", xcord, ycord+10);
  text(term + "!", xcord, ycord+20);
  textSize(10);
  text(term, xcord+12, ycord-10);
  pop();

}

// reset simulation by restarting time
function resetSim() {
  t=1;
}

// pause simulation by freezing time
function pauseSim() {
  paused = !paused;
}
