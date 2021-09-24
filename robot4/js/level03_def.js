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
`In this level both robots should prepare their sandwichs using:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
Both robot will follow the SAME instructions... so be careful: 
the kitchens are a bit different!
Help the robots visit the right ingredients in the right sequence :)

[HINT] Both robots should go forward, but then one should turn while the other should continue...
Consider that IF a robot does not pick a tomato up, then it should turn...`;


   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}