function makeLevel(){

   // level A ///////////////////////////////////

   let ROBOT_LEVEL_A = {
      robotPos: [0,1], // row,col
      level: [    [11, 0, 0,11,11,11,11, 0],
                  [11, 0, 0, 0, 0, 0, 0, 0],
                  [ 0, 0, 0, 0, 0, 0, 0, 0],
                  [ 0, 0, 0,11,11, 0, 0, 0],

                  [11, 0, 0,11,11, 0, 0,11],
                  [11, 0, 0, 0, 0, 0, 0,11],
                  [11, 1, 0, 0, 0, 0, 2,11],
                  [11,11,11, 0, 0,11,11,11]                
                 ],
      ROWS: 8,
      COLS: 8,
      kx: 74*3/5, // 74
      ky: 68*3/5, // 68
      dx: 0,
      dy: 100,
      ENV: null
   }
   ROBOT_LEVEL_A.ENV = {facing:"S",pos:ROBOT_LEVEL_A.robotPos,thinking:[],line:null};

   //////////////////////////////////////////////
   let ROBOT_LEVELS = [ROBOT_LEVEL_A];
   //////////////////////////////////////////////

   const LEVEL_NR = 7;
   const GOAL = [1,2,1]; // 1 tomatoes, 2 salad, 3 ham
   let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
   const NBLOCKS_STARS = [15,9]; // you get 1 star for winning
                           // 15 or less blocks gets you the second star
                           // 9 or less blocks gets you the third star


   const HELP_MESSAGE = 
`The robot should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
Help the robot visit the right ingredients in the right sequence :)

[HINT] What happens when the robot reaches the end of the board or walks into a wall?
This level is large: use the speed slider to make your robot run faster!
To collect more stars, consider using REPEAT or WHILE blocks...`;


   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}