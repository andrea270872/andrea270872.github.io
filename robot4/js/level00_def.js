function makeLevel(){

   // level A ///////////////////////////////////

   let ROBOT_LEVEL_A = {
      robotPos: [1,3], // row,col
      level: [  [ 0, 0, 0, 0,11, 3],
                [ 2, 0, 0, 0,11, 0],
                [ 0, 0, 0, 0, 0, 0],
                [ 0, 0,11, 0,11,11],
                [ 0, 0, 1, 0, 0, 1]
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

   const LEVEL_NR = 0;
   const GOAL = [1];  // 1 tomatoes, 2 salad, 3 ham
   let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
   const NBLOCKS_STARS = [5,5]; // you get 1 star for winning
                           // 6 or less blocks gets you the second star
                           // 6 or less blocks gets you the third star

   const HELP_MESSAGE = 
`In this level the robot move around and pick up ingredients.
Its goal is to prepare a very simple sandwich with a slide of tomato. 
The slice will be put between two slices of bread.
Help the robot visit the right ingredients in the right sequence :)

But have also some fun exploring how the robot moves forward, turns one way or the other.
[HINT] To run your program, click the "RUN CODE" button...`;


   ///////////////////////////////////////////////////////////////
   return [ROBOT_LEVELS,LEVEL_NR,GOAL,ACTUAL_GOAL,NBLOCKS_STARS,HELP_MESSAGE];
}