function makeLevel(){

   // level A ///////////////////////////////////

   let ROBOT_LEVEL_A = {
      robotPos: [1,3], // row,col
      level: [  [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,2,0,0],
                [0,0,0,1,0,0],
                [0,0,0,3,0,0]
                 ],
      ROWS: 5,
      COLS: 6,
      kx: 74,
      ky: 68,
      dx: 0,
      dy: 100,
      ENV: null
   }
   ROBOT_LEVEL_A.ENV = {facing:"S",pos:ROBOT_LEVEL_A.robotPos,thinking:[],line:null};

   //////////////////////////////////////////////
   let ROBOT_LEVELS = [ROBOT_LEVEL_A];
   //////////////////////////////////////////////

   const LEVEL_NR = 1;
   const GOAL = [2,1];  // 1 tomatoes, 2 salad
   let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
   const NBLOCKS_STARS = [3,2]; // you get 1 star for winning
                           // 3 or less blocks gets you the second star
                           // 2 or less blocks gets you the third star

   const HELP_MESSAGE = 
`In this level the robot should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
to put between two slices of bread.
Help the robot visit the right ingredients in the right sequence :)

[HINT] Try with: forward and forward; click the "RUN CODE" button...`;


   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}