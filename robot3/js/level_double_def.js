// level A ///////////////////////////////////

let ROBOT_LEVEL_A = {
   robotPos: [0,3], // row,col
   level: [ [0,0,0,0,0,0],
                [11,11, 0, 2,11,11],
                [11, 2, 0, 1, 0,11],
                [11, 0, 0, 3, 0,11],
                [11, 0, 0,0 ,11,11]
              ],
   ROWS: 5,
   COLS: 6,
   kx: 74/2,
   ky: 68/2,
/*   kx: 74,
   ky: 68,*/
   dx: 0,
   dy: 100,
   ENV: null
}
ROBOT_LEVEL_A.ENV = {facing:"S",pos:ROBOT_LEVEL_A.robotPos,thinking:[],line:null};

// level B ///////////////////////////////////
let ROBOT_LEVEL_B = {
   robotPos: [0,3], // row,col
   level: [ [0,0,0,0,0,0],
                [11,11, 0, 2,11,11],
                [11, 3, 1, 0, 0,11],
                [11, 0, 0, 0, 0,11],
                [11, 0, 0,11,11,11]
              ],
   ROWS: 5,
   COLS: 6,
   kx: 74/2,
   ky: 68/2,
   dx: 200,
   dy: 275,
   ENV: null
}
ROBOT_LEVEL_B.ENV = {facing:"S",pos:ROBOT_LEVEL_B.robotPos,thinking:[],line:null};

//////////////////////////////////////////////
let ROBOT_LEVELS = [ROBOT_LEVEL_A,ROBOT_LEVEL_B];
//let ROBOT_LEVELS = [ROBOT_LEVEL_A];
//////////////////////////////////////////////

// these are still global
const LEVEL_NR = 10; // level 10
const GOAL = [2,1,3]; // 1 tomatoes, 2 salad
let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
const NBLOCKS_STARS = [3,2]; // you get 1 star for winning
                           // 3 or less blocks gets you the second star
                           // 2 or less blocks gets you the third star

const HELP_MESSAGE = 
`In this level there are 2 robots moving at the same time. They should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
to put between two slices of bread.
Help the 2 robots visit the right ingredients in the right sequence :)
Be careful because now you control BOTH robots!

[HINT] Try to go forward a bit, then use the ifLast instruction to make the 2 robots behave differently... Click the "RUN CODE" button`;