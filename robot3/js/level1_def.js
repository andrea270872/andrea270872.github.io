const LEVEL_NR = 1; // level 1

let robotPos = [1,3] // row,col
const level = [ [0,0,0,0,0,0],
                [0,0,0,0,0,0],
                [0,0,0,2,0,0],
                [0,0,0,1,0,0],
                [0,0,0,3,0,0]
              ];
let GOAL = [2,1]; // 1 tomatoes, 2 salad
let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...
let NBLOCKS_STARS = [3,2]; // you get 1 star for winning
                           // 3 or less blocks gets you the second star
                           // 2 or less blocks gets you the third star
const HELP_MESSAGE = 
`In this level the robot should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
to put between two slices of bread.
Help the robot visit the right ingredients in the right sequence :)

[HINT] Try with: forward and forward; click the "RUN CODE" button...`

