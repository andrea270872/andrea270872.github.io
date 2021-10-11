function makeLevel(){

   // level A ///////////////////////////////////

   let ROBOT_LEVEL_A = {
      robotPos: [0,3], // row,col
      level: [    [0,0,0,0,0],
                  [0,0,0,1,0],
                  [0,0,0,0,0],
                  [0,0,0,2,0],

                  [0,0,3,0,0],
                  [0,0,1,0,0],
                  [0,0,0,0,0],
                  [0,0,0,0,0],
                  [0,0,0,0,0],
                 ],
      ROWS: 9,
      COLS: 5,
      kx: 74/2,
      ky: 68/2,
      dx: 0,
      dy: 110,
      ENV: null
   }
   ROBOT_LEVEL_A.ENV = {facing:"S",pos:ROBOT_LEVEL_A.robotPos,thinking:[],line:null};

   // level B ///////////////////////////////////
   let ROBOT_LEVEL_B = {
      robotPos: [0,3], // row,col
      level: [    [0,0,0,0,0],
                  [0,0,0,1,0],
                  [0,0,0,0,0],
                  [0,0,0,0,0],

                  [0,0,0,2,0],
                  [0,0,0,0,0],
                  [0,0,0,0,0],
                  [0,0,3,0,0],
                  [0,0,1,0,0],
                 ],
      ROWS: 9,
      COLS: 5,
      kx: 74/2,
      ky: 68/2,
      dx: 200,
      dy: 120,
      ENV: null
   }
   ROBOT_LEVEL_B.ENV = {facing:"S",pos:ROBOT_LEVEL_B.robotPos,thinking:[],line:null};

   //////////////////////////////////////////////
   let ROBOT_LEVELS = [ROBOT_LEVEL_A,ROBOT_LEVEL_B];
   //let ROBOT_LEVELS = [ROBOT_LEVEL_A];
   //////////////////////////////////////////////

   // these are still global
   const LEVEL_NR = 8; // level 10
   const GOAL = [1,2,3]; // 1 tomatoes, 2 salad
   let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
   const NBLOCKS_STARS = [10,7]; // you get 1 star for winning
                              // 10 or less blocks gets you the second star
                              // 7 or less blocks gets you the third star

   const HELP_MESSAGE = 
`In this level there are 2 robots moving at the same time. 
They should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
Help the robots visit the right ingredients in the right sequence :)
Remember: now you control BOTH robots!

[HINT] To collect more stars, consider using WHILE blocks...`;



   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}