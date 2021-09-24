function makeLevel(){

   // level A ///////////////////////////////////

   let ROBOT_LEVEL_A = {
      robotPos: [0,3], // row,col
      level: [  [11, 0,0,0,0,11],
                [11, 0,0,1,0,11],
                [ 0, 0,0,2,0,11],
                [11, 0,0,3,0,11],
                [11,11,0,0,0,11]
                 ],
      ROWS: 5,
      COLS: 6,
      kx: 74, //60,//74,
      ky: 68, //55,//68,
      dx: 0,
      dy: 100,
      ENV: null
   }
   ROBOT_LEVEL_A.ENV = {facing:"S",pos:ROBOT_LEVEL_A.robotPos,thinking:[],line:null};

   //////////////////////////////////////////////
   let ROBOT_LEVELS = [ROBOT_LEVEL_A];
   //////////////////////////////////////////////

   const LEVEL_NR = 5;
   const GOAL = [1,2,3,2,1]; // 1 tomatoes, 2 salad, 3 ham
   let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
   const NBLOCKS_STARS = [8,6]; // you get 1 star for winning
                           // 6 or less blocks gets you the second star
                           // 4 or less blocks gets you the third star


   const HELP_MESSAGE = 
`In this level the robot should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
Help the robot visit the right ingredients in the right sequence :)

[HINT] What happens when the robot steps on an ingredient, and then rotates?
To collect more stars, consider using REPEAT blocks...`;


   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}