function makeLevel(){

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

   const LEVEL_NR = 3;
   const GOAL = [2,1,3]; // 1 tomatoes, 2 salad
   let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
   const NBLOCKS_STARS = [6,5]; // you get 1 star for winning
                              // 6 or less blocks gets you the second star
                              // 5 or less blocks gets you the third star

   const HELP_MESSAGE = 
`In this level the robot should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
to put between two slices of bread.
Help the robot visit the right ingredients in the right sequence :)

[HINT] Try going forward then turn clockwise, many times... 
           or perhaps consider the REPEAT blocks...`;


   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}