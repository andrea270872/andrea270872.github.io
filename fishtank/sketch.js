class Queue{
  constructor(maxSize){
    this.q = [];
    this.maxSize = maxSize;
  }
  
  queue(element){
    this.q.unshift(element); // add at last
    if (this.q.length>this.maxSize){
      this.q.pop();
    }
  }
  
  dequeue(){
    return this.q.pop();
  }
  
  average(){
    let avg = 0;
    this.q.map( e => avg += e);
    avg = avg / this.q.length;
    return avg;
  }
}
  
/////////////////////////

let fish = []; // image strip
let fishFrames = [];
let C_POINT;
let dx,dy;
let bkgrImg;
let bkgrSound;
let anglesQueue = new Queue(100);

function preload() {
  bkgrSound = loadSound('329622__loveburd__aquarium-1.mp3');

  bkgrImg = loadImage('bkgr.png');
  
  fish.push( loadImage('yellowFish3.png') );
  fishFrames.push( [
    [0,0,682,558],
    [1644,0,537,558],
    [1174,0,422,558],
    [ 697,0,478,558],
  ] );
  fish.push( loadImage('blueFish2.png') );
  fishFrames.push( [
    [0,0,549,444],      // side facing right
    [1585,0, 372,444],   // half turned, facing left
    [1164,0, 291,444],   // facing forward
    [ 715,0, 336,444],   // starting to turn
  ] );
  fish.push( loadImage('Aquarium-clownfish_2.png') );
  fishFrames.push( [
    [22,0,437,298],   // side facing right
    [1674,0, 259,444],// half turned, facing left
    [1229,0, 218,444], // facing forward
    [713,0, 235,444],// starting to turn
  ] );
  fish.push( loadImage('Aquarium-seahorse_2.png') );
  fishFrames.push( [/*
    [0,28,322,525],     // side facing right
    [531,0, 341,533],   // half turned, facing left
    [1115,0, 191,533],  // facing forward
    [1534,0, 189,533],  // starting to turn*/

    [0,28,322,525],
    [1534,0, 189,533], 
    [1115,0, 191,533],
    [531,0, 341,533], 
  ] );  
    
  C_POINT = new p5.Vector(windowWidth/2,windowHeight/2,7);
  
  dx = windowWidth*1/24;
  dy = windowHeight*1/24;
}

// z goes from 1 to 15
// type is from 0 to 3;
const changeFacingDelay = 8; // in FPS
class Fish{
  
  constructor(x,y,z,type){
    this.pos = new p5.Vector(x,y,z);
    this.vel = new p5.Vector(1/z + random(-.5,.5) ,0,
                             random(-.1,.5) );
    this.isFacingRight = this.vel.x>=0;
    this.color = color( ~~(random(255)),
                          ~~(random(255)),
                            ~~(random(255)) );
    this.type = type;

    this.sizeScaling = random(0.9,1.1); // +-10% variation 
    this.fishW = windowWidth/12 * this.sizeScaling;
    this.fishH = windowWidth/12 * this.sizeScaling;
    if ((type==2) || (type==3)) { // clown fish or seahorse
      this.fishW /= 2;
      this.fishH /= 2;
    }
    
    this.turingState = 0; 
    /* 0 facing sideways
       1 half turned 
       2 facing forwards
       3 half turned back
    */
    this.turingTimer = 0;
    
    // when somebody clicks ...
    this.target = null;
    this.timeToTarget = 300;

  }
  
  move(fingers){
    // Is there a finger on the screen?
    // Of the many fingers, which one is closest?
    let distFromFingers;
    let closestFinger = null;
    let minDis = Infinity;
    let tmp;
    fingers.forEach( finger => {
      tmp = createVector(finger.x,finger.y);
      distFromFingers =  p5.Vector.sub(this.pos,tmp).mag();
      if (distFromFingers<windowWidth/3){
        if (distFromFingers<minDis){
          minDis = distFromFingers;
          closestFinger = tmp;
        }
      }
    });    
    if (closestFinger!=null){ // start chasing the finger!
      this.target = closestFinger;
      this.timeToTarget = 300;
    }
    

    if (this.vel.mag()<.1){ // avoid stopping
      //this.vel.mult(2);
      this.vel.mult(2 / this.sizeScaling);
      // smaller fish moves faster
    }
    
    // avoid collision with walls
    if (((this.pos.x<=dx/2) || (this.pos.x+this.fishW>=windowWidth-dx/2)) ||
        ((this.pos.y<=dy/2) || (this.pos.y+this.fishH>=windowHeight-dy/2))){
      let center = p5.Vector.sub(this.pos,C_POINT);
      this.vel.sub(center.div(200));
      this.vel.mult(.3);
    }
    
    if (Math.abs(this.vel.x/this.vel.mag())<.1){ // avoid stopping and going up/down
      this.vel.x *= 1.2; // 20% faster horizontally
    }
    this.pos.add(this.vel);


    let pc;
    
    if (this.target!=null){
      this.timeToTarget--;
      if (this.timeToTarget<=0){
        this.target = null;
        this.vel.limit(1.5);
      }
      pc = p5.Vector.sub(this.pos,this.target);
      this.vel.sub( pc.normalize().div(20) );
      this.vel.mult(.99);
      
    } else {
      pc = p5.Vector.sub(this.pos,C_POINT);
      pc.y = pc.y/5;
      pc.z = pc.z/3;
      this.vel.sub( pc.normalize().div(200) );
      this.vel.add( p5.Vector.random2D().div(150) );
      this.vel.limit(2.3);
    }
    
    let oldFacingRight = this.isFacingRight;
    this.isFacingRight = this.vel.x>=0;
    let changedFacing = false;
    if (oldFacingRight!=this.isFacingRight){
      changedFacing = true;      
    }
    
    
    switch(this.turingState){
      case 0:{
        if (changedFacing){
          this.turingState = 1;
          this.turingTimer = changeFacingDelay;
        }
      } break;
      case 1:{
        this.turingTimer--;
        if (this.turingTimer<=0){
          this.turingState = 2;
          this.turingTimer = changeFacingDelay;          
        }
      } break;
      case 2:{
        this.turingTimer--;
        if (this.turingTimer<=0){
          this.turingState = 3;
          this.turingTimer = changeFacingDelay;          
        }
      } break;
      case 3:{
        this.turingTimer--;
        if (this.turingTimer<=0){
          this.turingState = 0;
          this.turingTimer = 0;
        }
      } break;
    }

  }
  
  draw(){
    //console.log( this.turingTimer,this.turingState );
    
    let [w,h] = [(15-this.pos.z)/15,(15-this.pos.z)/15];
    w = ~~(w*this.fishW/80)+this.fishW;
    h = ~~(h*this.fishH/80)+this.fishH;
    push();
    translate(this.pos.x, this.pos.y);
    if (!this.isFacingRight){
      translate(w,0);
      scale(-1, 1);
    }

    // tests
    translate(this.fishW/2, this.fishH/2);
    let v = this.vel.copy();
    v.x = Math.abs(v.x);
    let angle = v.heading();
    
    // smooth over a few past values    
    anglesQueue.queue(angle);
    angle = anglesQueue.average();
    angle = ~~(angle*100)/100;
    angle = angle/2;
    rotate( angle );
    translate(-this.fishW/2, -this.fishH/2);

    let [a,b,c,d] = fishFrames[this.type][this.turingState];
    image(fish[this.type], 
         0,0, w,h,
         a,b,c,d);
    pop();
    
    /*
    if (this.target!=null){
      stroke(255,0,0);
      line(this.pos.x, this.pos.y,
          this.target.x, this.target.y);
      fill(255,0,0);
      rect(this.target.x, this.target.y,50,50);
    }*/
  }
}

///////////////////////////////////////////

let fishes = [];

function setup() {
  getAudioContext().suspend();  

  rectMode(CORNER);
  ellipseMode(CORNER);
  createCanvas(windowWidth, windowHeight);
  
  // premade mix of fish
  let mixes = [
    [3,3,3,0],
    [3,0,3,3],
    [0,3,2,4]
  ];
  let f = null;
  let mix = mixes[~~random(3)];
  for (let type=0;type<mix.length;type++){ 
    let howMany = mix[type];
    for (let i=0;i<howMany;i++){
      f = new Fish(~~(random(100,windowWidth-100)),
               ~~(random(100,windowHeight-100)),
                  ~~(random(5,10)) ,
                  type );
      fishes.push( f ); 
    }
  }

}

///////////////////////////////////////////

function draw() {  
  background(100,100,255);  

  stroke(80,80,200);
  image(bkgrImg,dx,dy,
         windowWidth-2*dx,windowHeight-2*dy);        

  line(0,0,dx,dy);
  line(windowWidth,0,windowWidth-dx,dy);  
  line(0,windowHeight,dx,windowHeight-dy);
  line(windowWidth,windowHeight,windowWidth-dx,windowHeight-dy);  
  
  //////////////////////////////////////////
  let fingers = touches.concat([]);
  if (mouseIsPressed) {
    fingers.push({x:mouseX,y:mouseY});
  }
  fill(255);  
  for (let touch of fingers){
    ellipse(touch.x-dx/4,touch.y-dx/4,dx/2,dx/2);
  }

  //////////////////////////////////////////
  if (frameCount%2==0){ // 50% slower
    fishes.forEach( f=> f.move( fingers ) );
    fishes.sort( (a,b) => b.pos.z-a.pos.z );
  }
  fishes.forEach( f=> f.draw() );  
}

// to allow the audio to initialize correctly
function mousePressed() {
  if (getAudioContext().state !== 'running') {     
    getAudioContext().resume();
    bkgrSound.loop();
  }
}