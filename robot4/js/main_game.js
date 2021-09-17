let [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE] = makeLevel();
document.getElementById('LEVEL_NUMBER').innerHTML = 'Level '+LEVEL_NR;

let glassPanel = document.getElementById('glassPanel');

const move = {"S":[+1,0],  // row,col
              "N":[-1,0],
              "E":[0,+1],
              "W":[0,-1] }

function wait(ms) {
    var start = new Date();
    var now;
    while (true) {
        now = new Date();
        if (now - start >= ms) {
            break;
        }
    }
}

// execution speed --------------------------------------------------------------
let SPEED = 800;
document.getElementById('speedSlider').addEventListener('change' , (evt)=>{  
  // DEBUG console.log( parseInt(evt.target.value) );
  let spd = parseInt(evt.target.value);
  if (spd==3) SPEED = 200;
  if (spd==2) SPEED = 800;
  if (spd==1) SPEED = 1800;
});
// execution speed --------------------------------------------------------------


/* --ASSEMBLY--

MOVE ROBOT:
- forward
- turnCW
- turnACW

COUNTERS STACK:
- PUSH n
- POP
- DECR_TOP
- IF_TOP_NOT_0_JMP n

FLOW CONTROL:
- ifLast_turnCW item
- IF_LAST_JMP , "ham" , blockId , JMP_ADDR
- JMP , JPM_ADDR , blockId|null


INSTRUCTION FORMAT:
[ instrCode , parameter | -1, indexOfBlock | null , listOfNestedInstructions? ]

*/
function compile(code,compiledCode){
  // to do

  for (let i=0;i<code.length;i++){

    let instr = code[i];
    let blockId = instr[0];
    let type = instr[1];
    switch (type){ // the type
      case "forward": {
        compiledCode.push( [type,-1,blockId] );
      } break;
      case "turnCW": {
        compiledCode.push( [type,-1,blockId] );
      } break;
      case "turnACW": {
        compiledCode.push( [type,-1,blockId] );
      } break;
      case "repeatNtimes": {
        compiledCode.push( ["PUSH",instr[2],blockId] ); 
        let K = compiledCode.length; // back-patching step 1

        compile(instr[3],compiledCode); // list of nested statements

        compiledCode.push( ["DECR_TOP",-1,null] ); // no id for this instructions, tau-execute!
        compiledCode.push( ["IF_TOP_NOT_0_JMP",K,blockId] ); // back-patching step 2
        compiledCode.push( ["POP",-1,null] );
      } break;
      case "ifLast_turnCW": {
        compiledCode.push( [type,instr[2],blockId] );
      } break;
      case "whileLastNot": {
        //                                 ham              jmp out of loop
        compiledCode.push( ["IF_LAST_JMP",instr[2],blockId,null] );
        let label1 = compiledCode.length; // back-patching step 1
        compile(instr[3],compiledCode); // list of nested statements
        compiledCode.push( ["JMP",label1-1,null] ); // tau-instruction
        let label2 = compiledCode.length; // back-patching step 2
        compiledCode[label1-1][3] = label2; // back-patching step 3        
      } break;
    }
  }  

  return compiledCode;
}

// converts the blocks into a list of instructions, with params and nesting!
function blocksToList(){
  let dom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  function visit(n){
    let type = n.getAttribute("type");
    let blockId = n.getAttribute("id");
    let blockList = [];

    // 3 possiblities:
    // 1- a node has 0 children and it's a leaf
    // 2- a node has 1 child, and it's "NEXT"
    // 3- a node has 2 children, a "STATEMENT" and a "NEXT"
    // OR: a node can have a "FIELD" field with a value in it
    let names = {};
    for (let child of n.children){
      names[child.nodeName] = child;
    }
    // DEBUG console.log( type , "=> names:",names );

    /*
    // DEBUG 
    console.log( n.getAttribute("id") , 
      Blockly.getMainWorkspace().getBlockById( n.getAttribute("id") ) );
    */

    switch (type){
      case "forward": { // basic block
        blockList.push( [blockId,type] );
      } break;
      case "turnCW": { // basic block
        blockList.push( [blockId,type] );
      } break;
      case "turnACW": { // basic block
        blockList.push( [blockId,type] );
      } break;
      case "repeatNtimes": {
        blockList.push( [blockId,type,
                      ~~names["FIELD"].innerText ,
                      visit(names["STATEMENT"].children[0])
                    ]);
      } break;
      case "ifLast_turnCW": {
        blockList.push( [blockId,type,
                      JSON.parse(names["FIELD"].innerText)
                      ]);
      } break;
      case "whileLastNot": {
        blockList.push( [blockId,type,
                      JSON.parse(names["FIELD"].innerText) ,
                      visit(names["STATEMENT"].children[0])
                    ]);
      } break;
    }

    let nextChild = names["NEXT"];
    if (nextChild)
      blockList = blockList.concat( visit(nextChild.children[0]) );

    return blockList;
  }

  //console.log("DOM:", dom);
  return visit(dom.firstChild);
}


function listAllBlocks(){
  let dom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  let blockList = [];
  function visit(n,level=0){
     blockList.push( '-'.repeat(level) + n.getAttribute("type") );

     // 3 possiblities:
     // 1- a node has 0 children and it's a leaf
     // 2- a node has 1 child, and it's "NEXT"
     // 3- a node has 2 children, a "STATEMENT" and a "NEXT"
     let names = {};
     for (let child of n.children){
        names[child.nodeName] = child;
     }

     let statementChild = names["STATEMENT"];
     if (statementChild)
        visit(statementChild.children[0],level+1);

     let nextChild = names["NEXT"];
     if (nextChild)
        visit(nextChild.children[0],level);
  }

  //console.log("DOM:", dom);
  visit(dom.firstChild);
  blockList.shift();
  return blockList;
}


function SAVE_TO_MONGO(victory){
  let blocklyXml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());      
  let text = new XMLSerializer().serializeToString(blocklyXml);

  //console.log(listAllBlocks());
  let data = {"userId": userId,
                  "timeStamp": Date.now(),
                  "timeStampReadable": new Date().toGMTString(),
                  "XMLcode": text,
                  "code": listAllBlocks(),
                  "level":LEVEL_NR,
                  "victory":victory,
                  "nr_stars":numberOfStars|0,
                  "click_times": JSON.stringify(mouseSpy.clicksAt)
                 };
  // *****************************************************
  // dump and reset mouseSpy ;)
  //    time from last click, in ms, and mouse position when clicked
  //console.log( "Mouse data for this run", JSON.stringify(mouseSpy) );
  mouseSpy.clicksAt = [];
  mouseSpy.lastClickTime = new Date().getTime();
  // *****************************************************
  //console.log( saveData );

  // AJAX call to cloud-DB
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      //console.log(this.responseText);
      console.log("attempt saved on cloud DB");
    }
  });
  xhr.open("POST", "https://guessrobot-2e5c.restdb.io/rest/users-solutions");
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("x-apikey", "60801f0928bf9b609975a4b5");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.send(JSON.stringify(data));
}

// 0<=t<=1
const lerp = (v0,v1,t) => {
  return (1-t)*v0+t*v1;
}

// if workspace is empty, place a "Start"-block
if (Blockly.getMainWorkspace().getTopBlocks().length==0){
  //let newBlock = Blockly.Block.obtain(Blockly.getMainWorkspace(),'GuessRobot');
  let newBlock = Blockly.getMainWorkspace().newBlock('start');
  newBlock.moveBy(50,50);
  newBlock.initSvg();
  newBlock.render();
  //console.log( newBlock );
}


// get the userId
let userId = localStorage.getItem('userId');
if (userId==null){
  window.location.replace("index.html"); // redirect if no userId
}
//console.log( userId );

////////////////////////////////////////////////////////////////////////////
// draw on canvas, implement movements ...
let timer = null;
const canvas = document.getElementById('theCanvas');
  let ctx = canvas.getContext("2d");
  ctx._W = 800;
  ctx._H = 600;
  ctx._X = canvas.offsetLeft;
  ctx._Y = canvas.offsetTop;

// wait until all images have loaded...
document.getElementById('loading').style.display = "block";
let images = new Array(11).fill(null);
let allImagesLoaded = false;
while (!allImagesLoaded){
  images = [
    images[ 0] || document.getElementById('empty'),        // # 0
    images[ 1] || document.getElementById('tomatoes'),     // # 1
    images[ 2] || document.getElementById('salad'),        // # 2
    images[ 3] || document.getElementById('ham'),          // # 3
    images[ 4] || document.getElementById('robot'),        // # 4
    images[ 5] || document.getElementById('arrow'),        // 22x34 pixels, # 5
    images[ 6] || document.getElementById('breadleft'),    // # 6
    images[ 7] || document.getElementById('breadright'),   // # 7
    images[ 8] || document.getElementById('tomatoslice'),  // # 8
    images[ 9] || document.getElementById('saladleaf'),    // # 9
    images[10] || document.getElementById('hamslice'),     // # 10
    images[11] || document.getElementById('wall'),         // # 11
  ];
  allImagesLoaded = images.indexOf(null)==-1;
  console.log("loading...");
  wait(100); // ms
}

document.getElementById('loading').style.display = "none";

let numOfBlocksUsed = 0;
let numberOfStars = null;

let drawLevel = (robot_level,numberOfStars=null)=>{
  let env = robot_level.ENV;
  for (let r=0;r<robot_level.ROWS;r++){
    for (let c=0;c<robot_level.COLS;c++){
      const tile = robot_level.level[r][c];
      if (tile!=0){
        ctx.drawImage(images[0],
              c*robot_level.kx+robot_level.dx,r*robot_level.ky+robot_level.dy, 
            robot_level.kx,robot_level.ky);
      }
      ctx.drawImage(images[tile],
        c*robot_level.kx+robot_level.dx,r*robot_level.ky+robot_level.dy,
        robot_level.kx,robot_level.ky);
    }     
  }

  // show the number of instructions used
  //console.log( "----->" , listAllBlocks() );
  if (numOfBlocksUsed>0){
	ctx.font = "16px Arial";
    	ctx.fillStyle = "black";	  	
  	ctx.fillText(`${numOfBlocksUsed} blocks used`,350,52);     
  }

  // Show the number of stars obtained in this level -> score
  if (numberOfStars!=null){
    // it means the player has won!
    ctx.font = "20px Arial";
    let stars = '\u2b50'.repeat(numberOfStars) + '\u2605'.repeat(3-numberOfStars);
    ctx.fillText(stars,350,85);

    // (1) create a few confetti-DIVs, (2) move them around, (3) then remove them
    // (1)
    const colorOptions = ["DodgerBlue", "OliveDrab", "Gold", "pink", 
                          "SlateBlue", "lightblue", "Violet", "PaleGreen", 
                          "SteelBlue", "SandyBrown", "Chocolate", "Crimson"];
    for(let i=0;i<32*2;i++) {
      let confettiDiv = document.createElement('div');
      confettiDiv.className = 'confetti rotate';
      confettiDiv.style.left = (ctx._X+350+20)+'px'; // x
      confettiDiv.style.top = (ctx._Y+85)+'px';  // y
      confettiDiv.style.backgroundColor = 
                  colorOptions[~~(Math.random()*colorOptions.length)];
      confettiDiv.style.zIndex = 1000;
      let vx = ~~(Math.cos(i/5)*6);
      let vy = ~~(Math.sin(i/5)*6);
      if (i<32){
        vx = vx / 2;
        vy = vy / 2;
      }
      confettiDiv.setAttribute('data-velocity_x',vx);
      confettiDiv.setAttribute('data-velocity_y',vy);
      document.getElementById('confettis').appendChild(confettiDiv);
    }

    let _t_ = 0;
    let animationTimer = setInterval(()=>{
      if (_t_>=1){
        clearInterval(animationTimer);
        // (3)
        document.querySelectorAll('div.confetti').forEach(function(c){
            c.remove();
        });
      } else {
        // (2)
        document.querySelectorAll('div.confetti').forEach(function(c){
            let x = parseInt(c.style.left);
            let y = parseInt(c.style.top);
            x+=parseFloat(c.getAttribute('data-velocity_x'));
            y+=parseFloat(c.getAttribute('data-velocity_y'));
            c.style.left = (~~x)+'px';
            c.style.top = (~~y)+'px';
            //console.log(c.style);
        });
      }
      _t_ += .04;
    }, 15);

  }

  // arrow showing facing
  ctx.save();
  ctx.translate( (env.pos[1]+.5)*robot_level.kx+robot_level.dx,
                  (env.pos[0]+.5)*robot_level.ky+robot_level.dy );
  if (env.facing=="S") ctx.rotate( 0 );
  if (env.facing=="N") ctx.rotate( Math.PI );
  if (env.facing=="E") ctx.rotate( Math.PI*3/2 );
  if (env.facing=="W") ctx.rotate( Math.PI/2 );
  ctx.drawImage(images[5],
      -robot_level.kx/2+5,robot_level.ky*1/4,
      robot_level.kx-4,robot_level.ky-4); // arrow
  ctx.restore();
  ctx.drawImage(images[4],
      env.pos[1]*robot_level.kx+robot_level.dx+10,env.pos[0]*robot_level.ky+robot_level.dy,
      robot_level.kx*2/3-4,robot_level.ky-4); // robot

  // thinking AKA pick-up area
  // ... for all robots!
  let WHICH_ROBOT = -1;
  for (let robLev of ROBOT_LEVELS){
    WHICH_ROBOT++;
    let down = 32*WHICH_ROBOT;
    ctx.strokeStyle = "black";
    ctx.strokeRect(10-2,35-2+down, 26*12+4,24+4);
    let offset=0;
    for(let think of robLev.ENV.thinking){
      offset++;
      ctx.drawImage(images[think],10+offset*26,35+down, 25,24); // thinking
    }
    ctx.drawImage(images[6],10+(0)*26,35+down ,25,24); // breadleft
    ctx.drawImage(images[7],10+(11)*26,35+down ,25,24); // breadright
  }

  // draw goal
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Goal:",20,450+18);
  let goalOffset=-1;
  for(let g of GOAL){
    goalOffset++;
    ctx.drawImage(images[g],70+goalOffset*25,450,50/2,48/2);
  }


/*
  //console.log( ">>>",env.line)
  if (env.line){
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(env.line[0], 0, 18);
  }
*/  

}

function drawMultiLevels(param=null){
  ctx.clearRect(0,0,ctx._W,ctx._H);
  for (let robLev of ROBOT_LEVELS){
    drawLevel(robLev,param);
  }
}
drawMultiLevels();
////////////////////////////////////////////////////////////////////////////

let runButton = document.getElementById('genCode');
runButton.addEventListener('click' , ()=>{
  if (timer!=null) clearTimeout(timer); // stop execution if it's running

  {
    let blockyDIVrect = Blockly.getMainWorkspace().getParentSvg().getBoundingClientRect();
    console.log(blockyDIVrect);
    glassPanel.style.top = ~~blockyDIVrect.y + "px";
    glassPanel.style.left = ~~blockyDIVrect.x + "px";
    glassPanel.style.width = blockyDIVrect.width + "px";
    glassPanel.style.height = blockyDIVrect.height + "px";
    glassPanel.style.display="block";
  }

  // unselect all blocks!
  Blockly.getMainWorkspace().getAllBlocks().forEach(b=>b.unselect());
  runButton.disabled = true;

  // DEBUG console.log( "======>" , blocksToList() );

  let THE_CODE = blocksToList();
  if (THE_CODE.length==0){
    runButton.disabled = false;
    glassPanel.style.display="none";
    return; // there is nothing to do!
  }

  // compile code into assembly-like, simpler instructions: linear and jump-based
  let COMPILED_CODE = [];
  compile(THE_CODE,COMPILED_CODE);
  THE_CODE = COMPILED_CODE;

  // ------ execute the robots ----------------------------
  // DEBUG 
  console.log( "--->",THE_CODE );

let ctx = canvas.getContext("2d");
ctx._W = 800;
ctx._H = 600;



///////////////////////////////////////////////////
// ASSEMBLY interpreter
///////////////////////////////////////////////////
let STEPS = 0;
let MAX_STEPS = 100; // stop every this-many 

let progCounts = []; // one per robot
let COUNTERS_STACKS = []; // one per robot
const PC_ARROWS_PALETTE = ["blue","red","green","black"]; // up to 4 robots!

let pcArrows = [];
let robNumber = 0;
for (let robLev of ROBOT_LEVELS){
  COUNTERS_STACKS.push([]);
  pcArrows.push(document.getElementById('PC_ARROW').cloneNode(true));  
  pcArrows[pcArrows.length-1].style.color = PC_ARROWS_PALETTE[robNumber];
  document.body.appendChild(pcArrows[pcArrows.length-1]);
  robNumber++;
}
//let blocklyArea = Blockly.getMainWorkspace().getParentSvg().getBBox(); // how big it is
// Coordinates of the actual SVG canvas with the blocks are drawn
// The "flyout" is the toolbar on the right
let blockyDIVrect = Blockly.getMainWorkspace().getParentSvg().getBoundingClientRect();
blockyDIVrect.x += Blockly.getMainWorkspace().getFlyout_().width_;

// reset all robots
// and initialize all program counters, one per robot
for (let robLev of ROBOT_LEVELS){
  robLev.ENV = {facing:"S",pos:robLev.robotPos,thinking:[],line:null};
  progCounts.push(0);
}

// --- move of 1 step all robots (one or 2 usually) ---
let step = (code)=>{
  STEPS++;
  if (STEPS%MAX_STEPS==0){
    let answer = window.confirm(`Your code has been running for a bit...
Are you sure that your code is not stuck in an infinite loop?!

Do you want to CONTINUE RUNNING the code?`);
    if (!answer) {
      // reset all!
      if (timer!=null) clearTimeout(timer); // stop execution if it's running
      glassPanel.style.display="none";
      document.getElementById('genCode').disabled = false;
      // unselect all blocks!
      Blockly.getMainWorkspace().getAllBlocks().forEach(b=>b.unselect());
      // hide pc_arrows 
      document.querySelectorAll('.PC_ARROWS').forEach(el=>el.style.display="none");

      return; // stop the execution and reset;
    }
  }
    
  let nextProgCounts = progCounts.map(x=>null);

  // start for -----------------------------------------
  let WHICH_ROBOT = -1;
  let whatToAnimate = []; // queue of animations for this step, for all existing robots
  for (let ROBOT_LEVEL of ROBOT_LEVELS){
    WHICH_ROBOT+=1;
    let progCount = progCounts[WHICH_ROBOT];
    /* DEBUG
    console.log( "robot:", WHICH_ROBOT, 
          "COUNTERS_STACKS" , COUNTERS_STACKS[0],COUNTERS_STACKS[1] );*/

    // check if this robot is done executing => if so, skip to the next robot
    // assert: at least 1 robot is still running, if we are here in the code
    if (progCount>=code.length){
      // this robot is done executing, skip to next robot
      console.log("robot ",WHICH_ROBOT," is done executing");
      continue;
    }

    // DEBUG console.log( "running...",code,code[progCount][1]);

    // highlight the block that is currently being executed
    if (code[progCount][2]!=null){
      Blockly.getMainWorkspace().getBlockById( code[progCount][2] ).select();
      let pos = Blockly.getMainWorkspace().getBlockById(code[progCount][2]).getRelativeToSurfaceXY();
      // DEBUG console.log( "block at: " , pos );
      pcArrows[WHICH_ROBOT].style.left = (blockyDIVrect.x+pos.x -30+3*WHICH_ROBOT) + "px";
      pcArrows[WHICH_ROBOT].style.top = (blockyDIVrect.y+pos.y+8*WHICH_ROBOT)  + "px";
      pcArrows[WHICH_ROBOT].style.display = "block";
      pcArrows[WHICH_ROBOT].style.color = PC_ARROWS_PALETTE[WHICH_ROBOT];
    }
    // ------------------------------------------------------------

    numOfBlocksUsed = listAllBlocks().length;
    let instr = code[progCount];

    ROBOT_LEVEL.ENV.line = instr;
    // console.log( "+++>", progCount , instr , ENV);
      switch (instr[0]){
        case 'forward': {
          let [dx,dy] = move[ROBOT_LEVEL.ENV.facing];
          let [x,y] = ROBOT_LEVEL.ENV.pos;
          x += dx;
          y += dy;
          if (x<0) x+=ROBOT_LEVEL.ROWS;
          if (x>=ROBOT_LEVEL.ROWS) x-=ROBOT_LEVEL.ROWS;
          if (y<0) y+=ROBOT_LEVEL.COLS;
          if (y>=ROBOT_LEVEL.COLS) y-=ROBOT_LEVEL.COLS;

  //            console.log( ROBOT_LEVEL.level,x,y );
          // wall collision
          if (ROBOT_LEVEL.level[x][y]==11){ // the wall!
            // don'n walk, just stay
            break;
          } 

          // remember what to animate ------ START
          // only when entering a tile while going FD!
          let steppingOn = ROBOT_LEVEL.level[x][y];
          //console.log( "steppingOn" , steppingOn );
          if (steppingOn!=0){
            steppingOn = steppingOn+7; // instead of salad -> salad-leaf
          }

          whatToAnimate.push([
                WHICH_ROBOT,
                ROBOT_LEVEL.ENV.pos[0],ROBOT_LEVEL.ENV.pos[1],x,y,
                steppingOn
          ]);
          // remember what to animate ------ STOP
        } break;
        case 'turnCW': {
          console.log("turn");
          if (ROBOT_LEVEL.ENV.facing=="S"){ 
            ROBOT_LEVEL.ENV.facing = "W"; 
          } else if (ROBOT_LEVEL.ENV.facing=="W"){
            ROBOT_LEVEL.ENV.facing = "N";
          } else if (ROBOT_LEVEL.ENV.facing=="N"){ 
            ROBOT_LEVEL.ENV.facing = "E"; 
          } else if (ROBOT_LEVEL.ENV.facing=="E"){ 
            ROBOT_LEVEL.ENV.facing = "S"; 
          }
        } break;
        case 'turnACW': {
          console.log("turning anticlockwise");
          if (ROBOT_LEVEL.ENV.facing=="S"){ 
            ROBOT_LEVEL.ENV.facing = "E"; 
          } else if (ROBOT_LEVEL.ENV.facing=="E"){
            ROBOT_LEVEL.ENV.facing = "N";
          } else if (ROBOT_LEVEL.ENV.facing=="N"){ 
            ROBOT_LEVEL.ENV.facing = "W"; 
          } else if (ROBOT_LEVEL.ENV.facing=="W"){ 
            ROBOT_LEVEL.ENV.facing = "S"; 
          }
        } break;
        case 'ifLast_turnCW': {
          const index = ["tomato","salad","ham"].indexOf(instr[1]) + 8;
          let l = ROBOT_LEVEL.ENV.thinking.length;
          if (l!=0){
            let think = ROBOT_LEVEL.ENV.thinking[l-1]; // the LAST thing you are thinking!
            // DEBUG console.log( "----->",index, ' vs ' , think);

            if (think==index){
              console.log("turn");
              if (ROBOT_LEVEL.ENV.facing=="S"){ 
                ROBOT_LEVEL.ENV.facing = "W"; 
              } else if (ROBOT_LEVEL.ENV.facing=="W"){
                ROBOT_LEVEL.ENV.facing = "N";
              } else if (ROBOT_LEVEL.ENV.facing=="N"){ 
                ROBOT_LEVEL.ENV.facing = "E"; 
              } else if (ROBOT_LEVEL.ENV.facing=="E"){ 
                ROBOT_LEVEL.ENV.facing = "S"; 
              }
            }
          }
        } break;

        // IF_LAST_JMP , "ham" , blockId , JMP_ADDR
        case 'IF_LAST_JMP': {
          const index = ["tomato","salad","ham"].indexOf(instr[1]) + 8;
          let l = ROBOT_LEVEL.ENV.thinking.length;
          if (l!=0){
            let think = ROBOT_LEVEL.ENV.thinking[l-1]; // the LAST thing you are thinking!
            // DEBUG console.log( "----->",index, ' vs ' , think);
            if (think==index){ // then JMP!
              nextProgCounts[WHICH_ROBOT] = instr[3]; // JMP_ADDR
            } // else continue with next instruction ...
          }
        } break;
        case 'JMP': {
          nextProgCounts[WHICH_ROBOT] = instr[1];
        } break;

  // Counters Stack operations -------------------------------- begin
        case "PUSH":{
          COUNTERS_STACKS[WHICH_ROBOT].push( instr[1] );
        } break;
        case "POP":{
          COUNTERS_STACKS[WHICH_ROBOT].pop();
        } break;
        case "DECR_TOP":{
          let cs = COUNTERS_STACKS[WHICH_ROBOT];
          cs[cs.length-1] -= 1;
        } break;
        case "IF_TOP_NOT_0_JMP":{          
          let cs = COUNTERS_STACKS[WHICH_ROBOT];
          if (cs[cs.length-1]!=0)
            nextProgCounts[WHICH_ROBOT] = instr[1];
        } break;
  // Counters Stack operations -------------------------------- end

      }

  } // end for -----------------------------------------

  if (whatToAnimate.length>0){
  //  whatToAnimate  is array of [ robotId,
  //                               ROBOT_LEVEL.ENV.pos[0],ROBOT_LEVEL.ENV.pos[1],x,y
  //                               whatTheRobotIsSteppingOn ]

  let thenDo = ()=>{
    let _t_ = 0;
    let TIMER2 = setInterval(()=>{
      if (_t_>=1){ // when done...
        clearInterval(TIMER2);
        for (let i=0;i<whatToAnimate.length;i++){
          let [robotId,x1,y1,x2,y2,steppingOn] = whatToAnimate[i];            
          if (steppingOn!=0){
            ROBOT_LEVELS[robotId].ENV.thinking.push(steppingOn); // finally add to the list!
          }
        }
      } else {
        drawMultiLevels();
        for (let i=0;i<whatToAnimate.length;i++){
          let WHICH_ROBOT = i;
          let robotId = whatToAnimate[i][0];
          let steppingOn = whatToAnimate[i][5];

          let offset = ROBOT_LEVELS[robotId].ENV.thinking.length;
          let [x1,y1,x2,y2] = [
              ROBOT_LEVELS[robotId].ENV.pos[1]*ROBOT_LEVELS[robotId].kx+ROBOT_LEVELS[robotId].dx,
              ROBOT_LEVELS[robotId].ENV.pos[0]*ROBOT_LEVELS[robotId].ky+ROBOT_LEVELS[robotId].dy,
              5+(1+offset)*26,28 +32*WHICH_ROBOT 
          ];

          if (steppingOn!=0){
            ctx.drawImage(images[steppingOn],
                lerp(x1,x2,_t_) , lerp(y1,y2,_t_),
                lerp(ROBOT_LEVELS[robotId].kx*2/3,25,_t_),
                lerp(ROBOT_LEVELS[robotId].ky*2/3,24,_t_) );
          }
        }
      }
      _t_ += .04;
    }, ~~(SPEED/50));//15); 
  };  // end of thenDo


  let _t_ = 0;
  let TIMER = setInterval(()=>{
    if (_t_>=1){
      clearInterval(TIMER);
      for (let i=0;i<whatToAnimate.length;i++){ // just to be sure!
        let robotId = whatToAnimate[i][0];
        let [x,y] = ROBOT_LEVELS[robotId].ENV.pos;
        ROBOT_LEVELS[robotId].ENV.pos[0] = Math.round(x);
        ROBOT_LEVELS[robotId].ENV.pos[1] = Math.round(y);
      }
      thenDo();
    } else {
      for (let i=0;i<whatToAnimate.length;i++){
        let [robotId,x1,y1,x2,y2,steppingOn] = whatToAnimate[i];
        ROBOT_LEVELS[robotId].ENV.pos = [ lerp(x1,x2,_t_) , lerp(y1,y2,_t_) ];
      }
      drawMultiLevels();
    }
    _t_ += .1;
  }, ~~(SPEED/50));//15); 
  // **************************************
  }


  drawMultiLevels();
  // calculate which is next instruction for all robots
  WHICH_ROBOT = -1;
  for (let ROBOT_LEVEL of ROBOT_LEVELS){
    WHICH_ROBOT+=1;
    if (nextProgCounts[WHICH_ROBOT]!=null){ 
      // there is a jump 
      progCounts[WHICH_ROBOT] = nextProgCounts[WHICH_ROBOT];
    } else {
      // otherwise just go to next instruction
      progCounts[WHICH_ROBOT]++;
    }
  }
  // DEBUG console.log( "progCounts:",progCounts);

  // are one or more robots done with executing?  
  // any robot won?
  //
  // CASES:
  // 1- one or more robots are still running
  //    1b- was this step a tau-step? -> it's tau <=> all steps are tau!!
  // 2- no robot is running -> then check if the game was won

  // 1- which robot still running?
  let nobodyRunning = true;
  progCounts.forEach(pc=>{
    nobodyRunning = nobodyRunning && (pc>=code.length); 
  });
  // DEBUG console.log( "nobodyRunning:", nobodyRunning);

  if (!nobodyRunning){ // somebody is still running (of all possible robots)
    // 1b - is tau-execution? AKA: are instructions for each robot, tau instructions?
    let isTau = true;
    // if even 1 of the robots has a non-tau instruction, then it is not a tau instruction!
    progCounts.forEach(pc=>{
      // DEBUG console.log( pc, code[pc] );
      if (code[pc]!=undefined) // i.e. if this robot is still running its code...
        isTau = isTau && (code[pc][2]==null);
      // else: just skip it
    });
    /*
    // DEBUG 
    console.log( "code:", code[progCounts[0]][2]);
    console.log( "isTau:", isTau);*/

    if (!isTau){ 
      timer = setTimeout(()=>step(code), SPEED);
    } else { 
      // tau-execution
      // debug console.log( 'tau-execution' );
      timer = setTimeout(()=>step(code), 1);
    }
  } else {
    // 2- no robot is still running
  	timer = setTimeout(()=>{
      // unselect all blocks!
      Blockly.getMainWorkspace().getAllBlocks().forEach(b=>b.unselect());
      // hide pc_arrows 
      document.querySelectorAll('.PC_ARROWS').forEach(el=>el.style.display="none");

      let victory = "you lost!";
      numberOfStars = null;

      let allRobotsReachGoal = true;
      for (let robLev of ROBOT_LEVELS){
        if (robLev.ENV.thinking.join('')!=ACTUAL_GOAL.join('')){
          allRobotsReachGoal = false;
          break;
        }
      }
      if (allRobotsReachGoal){            
        victory = "you WON! ^_^ ";

        // decide how many starts player gets!
        numberOfStars = 1;
        if (numOfBlocksUsed <= NBLOCKS_STARS[0]){
          numberOfStars = 2;
        }
        if (numOfBlocksUsed <= NBLOCKS_STARS[1]){
          numberOfStars = 3;
        }

        SAVE_TO_MONGO(true); // post solution to MongoDB
      } else {
        SAVE_TO_MONGO(false); // post solution to MongoDB
      }

      for (let robLev of ROBOT_LEVELS){
        robLev.ENV.line = null; // no instruction to show
      }
      
      console.log( "numberOfStars" , numberOfStars );
      // draw the stars, juice them up!!
      drawMultiLevels(numberOfStars);
      
      document.getElementById('genCode').disabled = false;
      glassPanel.style.display="none";


      setTimeout(()=>alert("Execution terminated ..." + victory),800);
    },SPEED);
  
  }
} // end  speed  function -----------------------------------------------------

drawMultiLevels();
STEPS = 0; // start executing the code...
timer = setTimeout(()=>{ step(THE_CODE); }, 100); 
});


document.getElementById('helpBtn').addEventListener('click' , ()=>{
  alert(HELP_MESSAGE);
});

// save workspace blocks to file
document.getElementById('saveBlocks').addEventListener('click' , ()=>{    
  let blocklyXml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());      
  var xmlText = new XMLSerializer().serializeToString(blocklyXml);
  // DEGUB console.log( xmlText );


  let yes = true;
  let name = prompt('[SAVING]\nName your project:','level_'+LEVEL_NR+'_savedXML');
  if (localStorage.getItem(name)!=null){
    yes = confirm("Do you want to lose previously saved workspace?");
  }
  if (yes){
    alert('Saved');
    localStorage.setItem(name,xmlText);
  }
});

// load blocks back from file
document.getElementById('loadBlocks').addEventListener('click' , ()=>{  
  let name = prompt('[LOADING]\nWhich project:','level_'+LEVEL_NR+'_savedXML');
  if (name==null){ // user pressed "cancel" 
  	return;
  }
  
  let xmlText = localStorage.getItem(name); 
  if (xmlText==null){
    alert('There is nothing saved to reload...');
    return;
  }
  let blocklyXml = Blockly.Xml.textToDom(xmlText);
  console.log( 'loading ... ' ); // DEGUB + xmlText);
  // DEGUB console.log( blocklyXml);

  let workspace = Blockly.getMainWorkspace();
  // DEGUB console.log( workspace );
  
  workspace.clear();
  Blockly.Xml.domToWorkspace(blocklyXml, workspace);
  //Blockly.Xml.appendDomToWorkspace(blocklyXml, workspace);
});


// ************** spy every mouse click *****************
let mouseSpy = {
    clicksAt: [],
    lastClickTime: new Date().getTime()};
document.body.addEventListener("click",(evt)=>{
    let t = new Date().getTime();
    let dt = t - mouseSpy.lastClickTime;
    mouseSpy.clicksAt.push([dt/1000,[evt.clientX,evt.clientY]]);
    mouseSpy.lastClickTime = t;
});
