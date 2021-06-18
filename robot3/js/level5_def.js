const LEVEL_NR = 3;

let robotPos = [1,3] // row,col
const level = [ [0,3,0,0,0,0],
                [0,1,0,0,1,0],
                [0,0,0,0,3,0],
                [0,1,3,0,0,0],
                [2,0,0,0,0,1]
              ];
let GOAL = [3,1,3,1]; // 1 tomatoes, 2 salad, 3 ham
let NBLOCKS_STARS = [6,4]; // you get 1 star for winning
                           // 6 or less blocks gets you the second star
                           // 4 or less blocks gets you the third star

const HELP_MESSAGE = 
`In this level the robot should prepare a sandwich with these ingredients:
   ${GOAL.map(i=>[null,'tomatoes','salad','ham'][i]).join(', ')}
to put between two slices of bread.
Help the robot visit the right ingredients in the right sequence :)

[HINT] Try forward and turn, many times, like in level 3.
            There are at least 2 pairs of ingredients the robot could reach...
            Consider using REPEAT blocks.`

let ACTUAL_GOAL = GOAL.map( n=>n+7 ); // 1->8 salad-leaf, ...