var DIRS = {'center': {row:0,col:0},
            'right': {row:0,col:+1},
            'left': {row:0,col:-1},
            'up': {row:-1,col:0},
            'down': {row:+1,col:0} }
function invertDirectionName(dirName){
   switch (dirName){
      case 'right': return 'left'; break;
      case 'left': return 'right'; break;
      case 'up': return 'down'; break;
      case 'down': return 'up'; break;
   }
}

// -----------------------

// row and col in [0,999]
function Position(row,col){
    this.row = row;
    this.col = col;
   
   this.equals = function(pos1){
      /* if a card has no position, it is a new card,
         then it cannot be equal to any card with a given position on the board
      */
      if (!pos1)
         return false;
      
      return ((this.row === pos1.row) &&
              (this.col === pos1.col));
   }
   
   /*     #
        # o #
          #
   */
   this.isNear = function(pos1){
      var dRow = Math.abs(this.row-pos1.row);
      var dCol = Math.abs(this.col-pos1.col);
      var manhDist = dRow+dCol;
      switch (manhDist){
         case 0: return true; break; // the pivot is near itself!
         case 1: return true; break;
      } 
      // case 2:
      return false;
   };
   
   /* Note: when an object is used as key in {}, 
      it is first converted to string, 
	  so I need this method to use Positions as keys
   */
   this.toString = function(){
      return '('+this.row+';'+this.col+')';
   };
   
   this.add = function(pos1){
      this.row += pos1.row;
      this.col += pos1.col;
   };

   this.sub = function(pos1){
      this.row -= pos1.row;
      this.col -= pos1.col;
   };
   
   this.div = function(scalar){
      this.row /= scalar;
      this.col /= scalar;
   };   
   
   this.getDirectionTowards = function(pos1){
      var delta = new Position(pos1.row,pos1.col);
      delta.sub(this);
      if (Math.abs(delta.row)>Math.abs(delta.col)){
         // up/down
         if (delta.row>0)
            return 'down';
         else
            return 'up';
      } else {
         // left/right
         if (delta.col>0)
            return 'right';
         else
            return 'left';
      }
      return 'center';
   };
}
 
// card names are usually 2 characters
function Card(name){
   this.name = name;
   this.position = null;
   
   this.collided = false;
   this.collidedInLastTurn = false;
   this.collidedInLastTurnWithCard = null;
    
   this.clone = function(){
      var c = new Card(this.name);
      return c;
   };
   
}
   
   
function Board(rows,cols){
    this.rows = rows;
    this.cols = cols;
    this.cards = [];
   
   // if a cell is occupied, add the card anyway, but mark it as 'collided'
   var collisionCard = null;
   this.placeAt = function(r,c,newCard){
      var isCardAlreadyOnBoard = this.cards.filter(function(currentCard){
         if (newCard.position){
            if (currentCard.position.equals(newCard.position)){
               collisionCard = currentCard;
               return true;
            }
         } else if ((currentCard.position.row===r) && 
               (currentCard.position.col===c) ){
            collisionCard = currentCard;
            return true;
         }
      }).length>0;

      if (isCardAlreadyOnBoard){
         newCard.collided = true;
         newCard.collidedInLastTurn = true;
         newCard.collidedInLastTurnWithCard = collisionCard;
         console.log( 'COLLISION! <======================== ' );
      } else {
         // add the card and mark its current position
         newCard.position = new Position(r,c);
         this.cards.push( newCard );
      }
   };
   
   
   this.placeCardAtRandomNear = function(card,spawningPosition){
      
      var r,c;
      r = spawningPosition.row + ~~(Math.random()*3)-1;
      c = spawningPosition.col + ~~(Math.random()*3)-1;
      console.log('placeCardAtRandom',card,'Attempt placing at',r,c);
      this.placeAt(r,c,card);
      console.log('collision?',card.collided);
      while (card.collided){
         card.collided = false;
         // try again
         r = spawningPosition.row + ~~(Math.random()*3)-1;
         c = spawningPosition.col + ~~(Math.random()*3)-1;
         this.placeAt(r,c,card);
      }
   };
   
   /* Returns first card found scanning the board, top-left to bottom-left;
      the card or null is returned.
   */
   this.findFirstCard = function(cardName){
      var card = null;
      for (var k in this.cards){
         if (this.cards[k].name == cardName){
            card = this.cards[k];
            break;
         }
      }
      return card;
   };

   /* Returns first card found scanning the board, top-left to bottom-left;
      that belongs to the given deck: the card or null is returned.
   */
   this.findFirstFromDeck = function(deckName){
      if (!decks[deckName]){
         return null;
      }

      var card = null;
      for (var k in this.cards){
         var currentCard = this.cards[k];
         var isCardInDeck = decks[deckName].filter(function(deckCard){
            return deckCard.name === currentCard.name;
         }).length>0;
         
         if (isCardInDeck){
            card = currentCard;
            break;
         }
      }
      return card;       
   };
   
   /* Intersection between all cards on the board (from a certain deck) and
      those near a pivot card.
      Can return null if no such card exist near the pivot.
      Here "near" is defined as the manhattan-distance.
   */
   this.findFirstFromDeckNear = function(deckName,pivotCard){
      var foundCard = null;
      
      var allCards = this.findAllFromDeck(deckName);
      for (var k in allCards){
         var currentCard = allCards[k];
         if (currentCard.position.isNear(pivotCard.position)){
            foundCard = currentCard;
            break;
         }
      }      
      return foundCard;
   };
   
   /* Returns all cards found scanning the board, top-left to bottom-left;
      the cards or an empty array is returned.
   */
   this.findAllCard = function(cardName){
      var cards = [];
      for (var k in this.cards){
         if (this.cards[k].name == cardName){
            cards.push( this.cards[k] );
         }
      }
      return cards;
   };   
   
   /* Returns all cards found scanning the board, top-left to bottom-left, 
      that belongs to the given deck: the cards or an empty array is returned.
   */
   this.findAllFromDeck = function(deckName){
      if (!decks[deckName]){
         return [];
      }

      var cards = [];
      for (var k in this.cards){
         var currentCard = this.cards[k];
         var isCardInDeck = decks[deckName].filter(function(deckCard){
            return deckCard.name === currentCard.name;
         }).length>0;
         
         if (isCardInDeck){
            cards.push( currentCard );
         }
      }
      return cards;
   };      
   
   // if card is null then no move, else move in 1 step in the give direction
   this.moveDirection = function(card,directionName){
      if (card){
         var delta = DIRS[directionName];
         this.remove(card);
         card.position.add(delta);
         this.placeAt(card.position.row,card.position.col,card);
         
         if (card.collided){
            card.collided = false;
            // move did not happen, replace card at its original place: undo move!
            card.position.sub(delta);
            this.placeAt(card.position.row,card.position.col,card);
         }
      }
   };
   
   /* card has its own position, so just remove it from where it is.
      if no card at that position, no effect
   */
   this.remove = function(card){
      for (var k in this.cards){
         var theCard = this.cards[k];
         if (theCard.position.equals(card.position)){
            if (theCard.name===card.name){
               this.cards.splice(k, 1);
               break;
            }
         }
      }
      return card;
   };
   
   this.moveRandom = function(card){
      // DEBUG console.log( 'moving in random dir ' , card );
      var dirName = Object.keys(DIRS)[ ~~(Math.random()*5) ];
      this.moveDirection(card,dirName);
   };
   
   this.moveTowards = function(theCard,targetCard){
      // DEBUG console.log( 'moving in moveTowards ' , theCard , ' -> ', targetCard );
      
      // 1. find direction from theCard to targetCard
      // 2. use direction to move
      var dirName = theCard.position.getDirectionTowards(targetCard.position);
      this.moveDirection(theCard,dirName);
   };
   
   this.moveAway = function(theCard,targetCard){
      // DEBUG console.log( 'moving in moveAway ' , theCard , ' -> ', targetCard );
      
      // 1. find direction from theCard to targetCard, reverse it
      // 2. use direction to move
      var dirName = theCard.position.getDirectionTowards(targetCard.position);
      dirName = invertDirectionName(dirName);
      this.moveDirection(theCard,dirName);
   };
   
   this.replace = function(exictingCard,newCard){
      var r = exictingCard.position.row;
      var c = exictingCard.position.col;
      this.remove(exictingCard);
      this.placeAt(r,c,newCard);
   };
   
   
   this.toString = function(){
      var out = '';
       
      var grid = new Array(this.rows);
      for (var i = 0; i < this.rows; i++) {
         grid[i] = new Array(this.cols);
         for (var j = 0; j < this.cols; j++) {
            if ((i+j)%2==0)
               grid[i][j] = '::';
            else
               grid[i][j] = '  ';
         }
      }
       
      for (var cardKey in this.cards) {
         var card = this.cards[cardKey];
         if (card.position){
            var r = card.position.row;
            var c = card.position.col;
            grid[r][c] = card.name;
         }
      }
       
      out = grid.map(e => e.join('|')).join('<br/>');
      return out;
    };
   
   this.endTurnReset = function(){
      for (var cardKey in this.cards) {
         this.cards[cardKey].collidedInLastTurn = false;
         this.cards[cardKey].collidedInLastTurnWithCard = null;
      }
   };
}

// Hard-coded rules => API %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var _gameRules = {};
var _playerRules = {};
var supportRules = {};

var _startUpRule = function(){
   for (var c=0;c<13;c++){
      board.placeAt( 0,c, decks['standard'][0].clone() ); // wall
      board.placeAt( 5,c, decks['standard'][0].clone() ); // wall
   }
   for (var r=1;r<5;r++){
      board.placeAt( r,0, decks['standard'][0].clone() ); // wall
      board.placeAt( r,12, decks['standard'][0].clone() ); // wall
   }

   board.placeAt( 1,2, decks['hero'][0].clone() ); // H2
   board.placeAt( 2,5, decks['standard'][0].clone() ); // wall
   //board.placeAt( 2,7, decks['monster'][1].clone() ); // M3
   //board.placeAt( 3,3, decks['monster'][3].clone() ); // M6
   //board.placeAt( 1,6, decks['monster'][2].clone() ); // M4
   //board.placeAt( 4,6, decks['monster'][2].clone() ); // M4
   board.placeAt( 7,1, decks['live'][2].clone() ); // 3 lives
};


_playerRules['Hero-right'] = function(){
   var heroCard = board.findFirstFromDeck('hero');
   board.moveDirection(heroCard,'right');
   
   //console.log('hero collided with S2 or S2?', heroCard.collidedInLastTurnWithCard.name );
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][0].name) ){ // sword2
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][0].clone() ); // H2
      board.remove(sword3Card);      
   }   
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][1].name) ){ // sword3
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][1].clone() ); // H3
      board.remove(sword3Card);
      //board.moveDirection(heroCard,'right'); DOES NOT WORK(?)
   }
   
};
_playerRules['Hero-left'] = function(){
   var heroCard = board.findFirstFromDeck('hero');
   board.moveDirection(heroCard,'left');
   
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][0].name) ){ // sword2
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][0].clone() ); // H2
      board.remove(sword3Card);      
   }   
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][1].name) ){ // sword3
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][1].clone() ); // H3
      board.remove(sword3Card);
      //board.moveDirection(heroCard,'right'); DOES NOT WORK(?)
   }
};   
_playerRules['Hero-up'] = function(){
   var heroCard = board.findFirstFromDeck('hero');
   board.moveDirection(heroCard,'up');

   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][0].name) ){ // sword2
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      data.board.rows.replace(heroCard,decks['hero'][0].clone() ); // H2
      board.remove(sword3Card);      
   }   
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][1].name) ){ // sword3
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][1].clone() ); // H3
      board.remove(sword3Card);
      //board.moveDirection(heroCard,'right'); DOES NOT WORK(?)
   }
   
};
_playerRules['Hero-down'] = function(){
   var heroCard = board.findFirstFromDeck('hero');
   board.moveDirection(heroCard,'down');
   
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][0].name) ){ // sword2
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][0].clone() ); // H2
      board.remove(sword3Card);      
   }   
   if ( (heroCard.collidedInLastTurn) && 
        (heroCard.collidedInLastTurnWithCard.name === decks['sword'][1].name) ){ // sword3
      var sword3Card = heroCard.collidedInLastTurnWithCard;
      heroCard.collided = false;
      board.replace(heroCard,decks['hero'][1].clone() ); // H3
      board.remove(sword3Card);
      //board.moveDirection(heroCard,'right'); DOES NOT WORK(?)
   }
   
};   
_playerRules['Hero-slice'] = function(){
   var heroCard = board.findFirstFromDeck('hero');
   console.log( 'hero slice-ing');
   
   /*
   - find a monster near hero (if any)
   - attempt at slicing it:
      - if H2 and M4 => replace M4 with M2 and spawn (M2 or S2) nearby
      - if H2 and M6 => replace M4 with M2 and spawn (M2 or S2) nearby
      - if H2 and M3 => apply 'HeroLoses1Life' rule
      - if H3 and M4 => apply 'HeroLoses1Life' rule
      - ...
   */
   var monsterCard = board.findFirstFromDeckNear('monster',heroCard);
   if (!monsterCard){
      console.log( 'swishhh! you missed with your sword! :(');
   } else {
      console.log( 'attaching...' , monsterCard );
      if (heroCard.name==='H2'){
         switch (monsterCard.name){
            case 'M2': {
               board.remove(monsterCard);
               console.log( '!you killed a M2!');
               supportRules['HeroWins1Life']();               
               playSound("sounds/splat.mp3");               
               break;
            }                           
            case 'M4': {
               board.replace(monsterCard,
                             decks['monster'][0].clone() ); // M2
               var choice = ~~(Math.random()*100);
               if (choice<=90){
                  board.placeCardAtRandomNear(decks['monster'][0].clone(),
                                              monsterCard.position); // M2
               } else {
                  board.placeCardAtRandomNear(decks['sword'][0].clone(),
                                              monsterCard.position); // S2                  
               }
               playSound("sounds/splat.mp3");               
               break;
            }
            case 'M6': {
               board.replace(monsterCard,
                             decks['monster'][1].clone() ); // M3
               if (choice<=90){
                  board.placeCardAtRandomNear(decks['monster'][1].clone(),
                                              monsterCard.position); // M3
               } else {
                  board.placeCardAtRandomNear(decks['sword'][1].clone(),
                                              monsterCard.position); // S3                  
               }
               playSound("sounds/splat.mp3");               
               break;
            }
            default:{
               console.log( '=> wrong sword for this monster! should lose 1 life!' );
               break;
            }
         }
      } else if (heroCard.name==='H3'){
         switch (monsterCard.name){
            case 'M3': {
               board.remove(monsterCard);
               console.log( '!you killed a M3!');
               supportRules['HeroWins1Life']();
               playSound("sounds/splat.mp3");               
               break;
            }                    
            case 'M6': {
               board.replace(monsterCard,
                             decks['monster'][0].clone() ); // M2
               board.placeCardAtRandomNear(decks['monster'][0].clone(),
                                           monsterCard.position); // M2
               if (choice<=90){
                  board.placeCardAtRandomNear(decks['monster'][0].clone(),
                                              monsterCard.position); // M2
               } else {
                  board.placeCardAtRandomNear(decks['sword'][0].clone(),
                                              monsterCard.position); // S2
               }
               playSound("sounds/splat.mp3");               
               break;
            }
            default:{
               console.log( '=> wrong sword for this monster! should lose 1 life!' );
               break;
            }
         }
      }
      
      
   }
};

   
supportRules['HeroLoses1Life'] = function(){
   console.log( 'hero loses 1 life' );
   var livesCard = board.findFirstFromDeck('live');
   if (livesCard == null){
      // TO DO =>>>>>>>>>>>>> gameOver = true;)
      console.log( 'game is over!' );
      return;
   }   
       
   if (livesCard.name === decks['live'][2].name){
      board.replace(livesCard,decks['live'][1]);
   } else if (livesCard.name === decks['live'][1].name){
      board.replace(livesCard,decks['live'][0]);
   } else if (livesCard.name === decks['live'][0].name){
      board.remove(livesCard);
      playSound("sounds/ouch.mp3");
   }
   
}

supportRules['HeroWins1Life'] = function(){
   console.log( 'hero wins 1 life' );
   var livesCard = board.findFirstFromDeck('live');
   if (livesCard == null){
      board.placeAt(7,1, decks['live'][0].clone() ); // 1 lives
      return;
   }   
       
   if (livesCard.name === decks['live'][0].name){
      board.replace(livesCard,decks['live'][1]);
   } else if (livesCard.name === decks['live'][1].name){
      board.replace(livesCard,decks['live'][2]);
   }
}
   
_gameRules['MonsterMove'] = function(){
   // DEBUG console.log( 'executing rule MonsterMove' ); //debug
   var heroCard = board.findFirstFromDeck('hero');
   
   // for all!
   var monsterCards = board.findAllFromDeck('monster');
   for (var k in monsterCards){
      var choice = ~~(Math.random()*100);
      if (choice<=60){
         board.moveRandom(monsterCards[k]);
      } else {
         board.moveTowards(monsterCards[k],heroCard);
         if ( (monsterCards[k].collidedInLastTurn) && 
              (monsterCards[k].collidedInLastTurnWithCard === heroCard) ){
            supportRules['HeroLoses1Life']();
         }
      }
   }
};   
   
_gameRules['CleanUpSwords'] = function(){   
   var choice = ~~(Math.random()*100);
   if (choice<=02){
      var swordCard = board.findFirstFromDeck('sword');
      if (swordCard){
         board.remove(swordCard);
      }
   }
};
   
// LAST ONE ---------------------------------------------
_gameRules['Respawn'] = function(){
   var spawningPos;
   if (board.findAllFromDeck('monster').length<=0){
      spawningPos = new Position(2,2);
      board.placeCardAtRandomNear(decks['monster'][2].clone(),spawningPos); // M4

      spawningPos = new Position(3,9);
      var choice = ~~(Math.random()*100);
      if (choice<=60){
         board.placeCardAtRandomNear(decks['monster'][2].clone(),spawningPos); // M4
      } else {
         board.placeCardAtRandomNear(decks['monster'][1].clone(),spawningPos); // M3         
      }
      board.placeCardAtRandomNear(decks['monster'][3].clone(),spawningPos); // M6
   }
};


// =================================================
// Graphics ******************
// =================================================

//function Renderer(){

function addToVisualBoard(x,y,image,divId){
   var ele = document.createElement("div");
   ele.className = 'sprite';
   ele.style.backgroundImage =  'url('+image+ ')'; // guy
   ele.style.left = x+'px';
   ele.style.top = y+'px';
   
   if (divId!=undefined){
      ele.id = divId;
   }
   
   $(ele).rotate( ~~(Math.random()*12)-6 );
   visualBoard.appendChild(ele);
}
   
var renderOldHeroPos = null;

function renderOnVisualBoard(board){   
   
   visualBoard.innerHTML = ''; // clear inner DOM elements
   
   var heroPos = null;
   for (var k in board.cards) {
      var card = board.cards[k];
      
      if (card.position){
         var animated = false;
         var r = card.position.row;
         var c = card.position.col;
         
         if (card.name.startsWith('H')){ // hero card
            heroPos = new Position(r,c);
            if (renderOldHeroPos!=null){
               addToVisualBoard(20+50*renderOldHeroPos.col,
                                20+50*renderOldHeroPos.row,
                                IMAGESET[card.name],'heroCard');
               // animate DIV
               $('div#heroCard').first().stop( true, true ).animate({
                  'left': (20+50*c)+'px',
                  'top': (20+50*r)+'px'
                  },  
                  250, 
                  "easeInOutBack");
               animated = true;
            }
         }
         if (!animated){
            addToVisualBoard(20+50*c,20+50*r,IMAGESET[card.name]);
         }
      }

   }

   renderOldHeroPos = heroPos;
}

// RULES =======================================================================

function Rule(ruleGroup,name){
   this.ruleGroup = ruleGroup;
   this.name = name;
   
   this.execute = function(){
      // VERY PRIMITIVE!!!! FIX IT 
      //console.log( 'execute... ', this.ruleGroup+'["' +this.name+ '"]();' );
      
      if (this.ruleGroup)
         eval( this.ruleGroup+'["' +this.name+ '"]();' );
      else // this must be the startUpRule!
         eval( this.name+ '();' );
   };
   
}


// SERIALIZATION ------------------------------------------------

function stripAndSerialize(){
   console.log('SERIALIZATION TEST======Start');
   
   // strip decks --> DONE 
   var stripDecks = {};
   Object.keys(decks).forEach(function(deckKey){
      stripDecks[deckKey] = 
         decks[deckKey].map(function(card){
            return card.name;
         });
   });   
   
   var gameSetupData = {stripDecks:stripDecks,
                        imageSet: IMAGESET, // as they are
                        stripBoard: {rows: board.rows, cols: board.cols}, // only ROWSxCOLS
                        gameRules: gameRules,
                        playerRules: playerRules
                       };
   //console.log('=> gameSetupData',JSON.stringify(gameSetupData));

   console.log('SERIALIZATION TEST======End');
   return JSON.stringify(gameSetupData);
}
// DEBUG console.log( stripAndSerialize() );


function deserializeAndRebuild(gameSetupData){
   
   decks = {};
   Object.keys(gameSetupData.stripDecks).forEach(function(deckKey){
      decks[deckKey] = [];
      gameSetupData.stripDecks[deckKey].forEach(function(cardName){
            decks[deckKey].push( new Card(cardName) );
      });
   });
   
   // the ruleObj that come back from JSON-serialization have no methods!
   playerRules = [];
   gameSetupData.playerRules.forEach(function(strippedRuleObject){
      playerRules.push( new Rule(strippedRuleObject.ruleGroup,
                                 strippedRuleObject.name)
                     );
   });
   //console.log( 'p###> ', gameSetupData.playerRules);
   //console.log( 'p###> ', playerRules);
   
   // the ruleObj that come back from JSON-serialization have no methods!
   gameRules = [];
   gameSetupData.gameRules.forEach(function(strippedRuleObject){
      gameRules.push( new Rule(strippedRuleObject.ruleGroup,
                               strippedRuleObject.name)
                     );
   });
   //console.log( 'g###> ', gameSetupData.gameRules);
   //console.log( 'g###> ', gameRules);
   
   startUpRule = new Rule(null,'_startUpRule'); // DEFAULT, FIX IT
   
   board = new Board(gameSetupData.stripBoard.rows,
                     gameSetupData.stripBoard.cols);
   IMAGESET = gameSetupData.imageSet;
}





// =================================================
// Data
// =================================================

var HEART = 'L'; //'\u2764';
var decks = {};

var board = null;

var gameRules = [];
var playerRules = [];
var startUpRule = null;
var IMAGESET = {};

