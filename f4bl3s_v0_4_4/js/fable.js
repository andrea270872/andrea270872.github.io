
	// natural langauge description of the changes
	function deltaSlide(aFableSlide1,aFableSlide2){
		// assert( haveSameRooms(aFableSlide1,aFableSlide2) , ... )
		var text = '';
		
		// TO DO
		/* how? Perhaps: 
			1. find all persons and things in slide1
			2. find all persons and things in slide2
			3a. identify all new persons and new things in slide2 not already in slide1
				=> added persons and added things!
			3b. identify all persons and things in slide1 but not in slide2
				=> removed persons and removed things!
			4. the intersection: persons and things in both slides
				For each person and thing:
					- find the path they traveled (minimal? shortest?)
					- generate a natural description of the path:
						e.g. "Boy" exits "street" and enters "shop",
									exits "shop" and enters "fridge",
						or: "money" moves from "Mom" to "Boy"
			
			Problem: what happens when 2 names are the same? 
					 Is it possible/legal?
					 Would a concept of "minimal/most-natural move" do?
		*/
		
		return text;
	}
	
	function describeSlide(aFableSlide){
		var text = '';
		
		// TO DO
		/*
		1. which rooms are there
			e.g. 
				. in the world there are: "house", "street", "shop"
				. "shop" contains "fridge"
		2. where are people
			e.g. 
				. "Mom" is in "house"
				. "Boy" is in "house"
				. "Clerk" is in "shop"
		3. where are things
			e.g. 
				. "Boy" has "money" (the money:T is in the Boy:P)
				. "Fridge" has "milk" (the milk:T is in the Fridge:R)
				. "car" has "hat"  (the hat:T is in the car:T)
		*/
		return text;
	}

// ***************************************
	
	// Returns array with all slides directly reachable (forward!) from current slide
	// but not those going back up!
	function nextSlidesFromSlideIndex(aFable,slideIndex){
		// DEBUG console.log('nextSlidesFromSlideIndex:', slideIndex);
		
		var next = [];
		var nextBack = [];

		aFable.edges.forEach(function(edge){
			var i = edge.fromIndex;
			var j = edge.toIndex;
			// DEBUG console.log('edge:'+i+' '+j);
			if (i<j){
				if (i==slideIndex){
					next.push(j);
					// DEBUG console.log('(+)');
				}				
			} else { // else it was a back-edge (so it does not count)
				if (i==slideIndex){
					nextBack.push(j);
				}
			}
			
		});
		
		return [next,nextBack];
	}
	
	
	function cloneAndRemoveBlockByNameFrom(nameToDelete,currentBlock){
		/*
		console.log( 'cloneAndRemoveBlockByNameFrom' , 
						currentBlock.name,
						nameToDelete);
		*/						
		
		if (currentBlock.name === nameToDelete){
			return null;
		}
		// else
		var clone = new FableBlock(currentBlock.type,currentBlock.name);
		currentBlock.children.forEach(function(childBlock,index){
			var cloneChildBlock = cloneAndRemoveBlockByNameFrom(nameToDelete,childBlock);
			if (cloneChildBlock!=null){
				clone.children.push( cloneChildBlock );
			}
		});
		return clone;
	}
	
	// assert: the name is of a person or a thing
	function deleteNameInAllSlides(name,fable){
		// console.log( 'deleteNameInAllSlides' , name );
		fable.slides.forEach(function(slide){
			/* visit all nodes in the tree, 
			   and remove any instance of the fableBlock with name _name_
			*/
			var newSlide = new FableSlide();
			newSlide.world = cloneAndRemoveBlockByNameFrom(name,slide.world);
			/*
			console.log( '//////////////////////////////' );
			console.log( newSlide );
			console.log( slide );
			console.log( '//////////////////////////////' );
			*/
			slide.world = newSlide.world;
		});
	}	
	
	function isNamePresentInSlide(name,fable,slideIndex){
		var block = findFableBlockByNameFrom(name,fable.slides[slideIndex].world);
		if (block!=null){
			return true;
		}
		return false;
	}
	
	// assert: in each slide, there is max 1 block with the same name!
	function renameInAllSlides(oldName,newName,fable){
		fable.slides.forEach(function(slide){
			var block = findFableBlockByNameFrom(oldName,slide.world);
			if (block!=null){
				block.name = newName;
			}
		});
	}

	function renameInPalette(oldName,newName,fablePalette){
		console.log( 'renameInPalette', oldName,newName);
		var index = -1;
		
		index = fablePalette.people.indexOf(oldName);
		if (index>-1){
			fablePalette.people[index] = newName;
			return;
		}
		
		index = fablePalette.things.indexOf(oldName);
		if (index>-1){
			fablePalette.things[index] = newName;
			return;
		}
		
		// palette.rooms
		var room = findFableBlockByNameFrom(oldName,fablePalette.rooms.world);
		if (room!=null){
			room.name = newName;
		}
	}

	function isNamePresentInPalette(name,fablePalette){
		//console.log( fablePalette.people, fablePalette.people.indexOf(name) );
		
		if (fablePalette.people.indexOf(name)>-1)
			return true;
		
		if (fablePalette.things.indexOf(name)>-1)
			return true;
		
		// palette.rooms
		if (findFableBlockByNameFrom(name,fablePalette.rooms.world)!=null)
			return true;
		
		return false;
	}

    function removeRoomInAllSlides(fable,pathArray){
        pathArray.shift(); // drop first element, which is 'world' anyways
        var roomName = pathArray.pop();
        
        fable.slides.forEach(function(slide){
            var parentObject = findBlockByPath(slide.world,pathArray);
            if (parentObject==null) {
              throw "moveRoomInAllSlides error: wrong PATH to block. ";
            }
            // DEBUG console.log( '+++>',parentObject );
            
            var roomObject = findFableBlockByNameFrom(roomName,parentObject);
            // DEBUG console.log( roomObject );
            
            // remove roomObject from its parent
            parentObject.children = parentObject.children.filter(function(child){
                return child.name != roomObject.name;
            }); 
        });
                             
    }


	/* - pathArrayFrom and pathArrayTo are arrays of strings
		e.g. 
		DraggedRoom>> moveRoomInAllSlides
			       >> from  (2) ["world", "foresta"]
		           >> to  ["world"]
                   >> roomName  casaNonna
                   
       How:
       - for every slide:
            1. find fromR room-block that matches the pathFrom
            2. detach it from parent
            3. find toR room-block that matches the pathTo
            3. append fromR to toR 
            
        Assert: both pathArrayFrom and pathArrayTo exist in all slides!
	*/
	function moveRoomInAllSlides(fable,pathArrayFrom,pathArrayTo,roomName){
        pathArrayFrom.shift(); // drop first element, which is 'world' anyways
        pathArrayTo.shift(); // drop first element, which is 'world' anyways
        
		fable.slides.forEach(function(slide){
            var fromR = findBlockByPath(slide.world,pathArrayFrom);
            var toR = findBlockByPath(slide.world,pathArrayTo);
			if ((fromR==null) || (toR==null)) {
				throw "moveRoomInAllSlides error: wrong PATH to block. ";
			}    
            // DEBUG console.log( 'moveRoomInAllSlides', fromR , toR);
            // DEBUG console.log( ''+JSON.stringify(fromR.children) );
        
            var roomObject = findFableBlockByNameFrom(roomName,fromR);
            // DEBUG console.log( roomObject );
        
            // remove roomObject from its parent
            fromR.children = fromR.children.filter(function(child){
                return child.name != roomObject.name;
            });
            // DEBUG console.log( ''+JSON.stringify(fromR.children) );
        
            toR.children.push( roomObject );
        });
	}

	function createBlockInAllSlides(fable,pathArray,blockName,blockType){
		pathArray.shift(); // drop first element, which is 'world' anyways
		
		fable.slides.forEach(function(slide){
			var parentBlock = findBlockByPath(slide.world,pathArray);
			if (parentBlock==null){
				throw "createBlockInAllSlides error: wrong PATH to block. "+pathArray;
			}
			var newBlock = new FableBlock(blockType,blockName);
			console.log( parentBlock , newBlock , parentBlock.children);
			parentBlock.children.push(newBlock);
		});
	}
	
	function findBlockByPath(parentBlock,pathArray){
		var okSoFar = true;
		var currentParentBlock = parentBlock;
		
		for (var i=0;i<pathArray.length;i++){
			var nextBlock = currentParentBlock.children.filter(function(elem){
				return (elem.name == pathArray[i]) &&
						(elem.type == 'room');
			});

			//DEBUG console.log( '>>>',i, currentParentBlock, pathArray, nextBlock ,'<<<');

			if (nextBlock==null){ // path was incorrect!
				okSoFar = false;
				break;
			}
			if (nextBlock.length>1){ // path was incorrect!
				okSoFar = false;
				break;
			}			
			currentParentBlock = nextBlock[0];
		}

		if (!okSoFar){ // invalid path!
			result = null;
		}
		
		//console.log( 'result = ', currentParentBlock);
		return currentParentBlock;
	}
	
	


	// from https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
	function unique(list){
		list = list.filter(function (x, i, a) { 
			return a.indexOf(x) == i; 
		});
		return list;
	}

	
	function keepOnlyRooms(tempTree){
		var children = tempTree.children.filter(function(child){
			return (child.type=='room');
		});
		tempTree.children = children;
		
		tempTree.children.forEach(function(child){
			keepOnlyRooms(child);
		});
	}

	// Keep existing persons and tings, but find all existing in all rooms and MERGE them too!
	function computePaletteFromSlides(fable){		
		var oldPeople = fable.palette.people;
		var oldThings = fable.palette.things;

		var persons = oldPeople;
		var things = oldThings;
		var rooms = [];
		
		// 1. compute all people, in all slides, but "unique", no repetitions
		// 2. compute all things, in all slides, but "unique", no repetitions
		fable.slides.forEach(function(slide){
			persons = persons.concat( findNamesByType(slide.world,'person') );
			things = things.concat( findNamesByType(slide.world,'thing') );
		});
		persons = unique(persons);
		things = unique(things);
		// console.log( '>>>' , persons, things );
		
		// 3. compute the tree of rooms in a slide (assume it is the same in all slides)
		if (fable.slides.length>0){
			var tempTree = cloneFable(fable.slides[0]);
			keepOnlyRooms(tempTree.world);
			fable.palette.rooms = tempTree;
		}

		// ***
		fable.palette.people = persons;		
		fable.palette.things = things;
	}

	// test for rooms structure integrity 
	function sameRoomsEverywhere(fable){
		// TO DO
		// check that the room-tree is the same (same names and nesting) in all slides
		return false;
	}
	
	// check if the name of a people/room/thing already exists a specfic slide
	function isNamePresent(aFableSlide,name){
		var itemToFind = findFableBlockByNameFrom(name,slide.world);
		if (itemToFind!=null)
			return true;
		return false;
	}

	// check that a room is empty in all slides (i.e. it is a "movable room")
	function isRoomEmptyEverywhere(fable,roomName){
		var empty = true;
		
		//	console.log( 'isRoomEmptyEverywhere ...');
		for (var i=0;i<fable.slides.length;i++){
			var slide = fable.slides[i];
			var roomToFind = findFableBlockByNameFrom(roomName,slide.world);
			//	console.log( '...', roomName ,roomToFind, roomToFind.children.length );
			if (roomToFind){
				if (roomToFind.children.length>0){
					empty = false;
					break;
				}
			}
		}
		//	console.log( 'isRoomEmptyEverywhere=', empty);
		return empty;
	}

    function computeAjdList(fable){
		// compute adjacency list
		var adjList = [];
		fable.slides.forEach(function(slide,index){
			adjList[index] = [];
		});		
		fable.edges.forEach(function(edge,index){
			if (adjList[ edge.fromIndex ]){
				// perhaps there is no slide with index _fromIndex_
				adjList[ edge.fromIndex ].push( edge );
			}
		});
		//console.log( adjList );
        return adjList;        
    }
	
	function cloneFable(aFableSlide){
		return JSON.parse( JSON.stringify( aFableSlide ) );
	}

	// in a specific block, recursivly
	function makeAllRoomsInvisible(aFableBlock){
		if (aFableBlock.type==='room'){
			aFableBlock.isVisible = false;
		}
		aFableBlock.children.forEach(function(block,index){
			makeAllRoomsInvisible(block);
		});
	}


	// aSlide : aFableSlide
	// return the fableBlock of the visible room  or  null
	function getVisibleRoomInSlide(aSlide){
		var w = aSlide.world;

		var searchList = [w];
		while (searchList.length>0){
			// DEBUG console.log( 'searchList:', JSON.stringify(searchList));
			var block = searchList.shift();
			if ((block.isVisible) && (block.isVisible==true)){
				return block;
			} else {
				searchList = searchList.concat( block.children );
			}
		}

		return null;
	}

	// for each slides: if slide has no visibleRoom -> make world "visible"
	function fixVisibleInAllSlides(aFable){
		aFable.slides.forEach(function(slide){
			// DEBUG console.log( '[---' );
			// DEBUG console.log( 'fixing visible in slide: ' , slide.description );
			var visibleRoomBlock = getVisibleRoomInSlide(slide);
			// DEBUG if (visibleRoomBlock) console.log( 'visible room is: ' , visibleRoomBlock.name );
			if (visibleRoomBlock==null){
				slide.world.isVisible = true;
			}
			// DEBUG console.log( 'and finally visible room is: ' , getVisibleRoomInSlide(slide).name );
			// DEBUG console.log( '---]' );
		});
	}

// ***************************************

function Fable(title){
    this.title = title;
    this.slides = []; // of FableSlides
    this.edges = []; // of FableEdges

    this.palette = {
        rooms: null, // a FableSlides
        people: [],
        things: []
    };
}

function FableEdge(name,fromIndex,toIndex){
    this.name = name;
    this.fromIndex = fromIndex;
    this.toIndex = toIndex;
}

function FableSlide(){
	this.world = new FableBlock('room','world');
    this.description = "aSlide";
}

function FableBlock(type,name){	
	this.isVisible = false;
	if (name=='world') 
		this.isVisible = true;

    this.type = type;
    this.name = name;
    this.children = [];
}

// *** commands

function findParentOfFableBlockFromBlock(blockName,fromBlock){
	if (fromBlock.children.length==0){ // not found!
		return null;
	}
	
    var childrenNames = fromBlock.children.map(function(child){
		return child.name;
	});
	if (childrenNames.indexOf(blockName)>-1){ // found!
		return fromBlock;
	}
	
	// else
    var block = null;
    fromBlock.children.forEach(function(childBlock,index){
        if (block==null){
            block = findParentOfFableBlockFromBlock(blockName,childBlock);
        }
    });
    return block;
}

function findFableBlockByNameFrom(blockName,fromBlock){
    if (fromBlock.name === blockName){
        return fromBlock;
    }
    // else
    var block = null;
    fromBlock.children.forEach(function(childBlock,index){
        if (block==null){
            block = findFableBlockByNameFrom(blockName,childBlock);
        }
    });
    return block;
}

function findNamesByType(startBlock,type){
	// DEBUG console.log('findNamesByType ' + type + ' -> '+ startBlock.type+ ':' +startBlock.name);
	var result = [];
    if (startBlock.type === type){
        result.push(startBlock.name);
		console.log( result );
    }    
    startBlock.children.forEach(function(childBlock){
		var temp = findNamesByType(childBlock,type);
        if (temp.length>0){
			result = result.concat( temp );
		}
    });	
    return result;
}

function findIndexByKey(arraytosearch, key, valuetosearch) {
    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return -1;
}

/*
1. remove aFableBlock from parentBlock  
2. add aFableBlock to grandparentBlock
*/
function goOut(aFableBlock,parentBlock,grandparentBlock){
    // 1.
    var index = findIndexByKey(parentBlock.children,'name',aFableBlock.name);
    console.assert( index>=0 , 'The block  '+aFableBlock.name
					+'  is not inside the parentBlock  '+
					parentBlock.name);
    parentBlock.children.splice( index, 1 );

    // 2.
    grandparentBlock.children.push( aFableBlock );
}

/*
1. remove aFableBlock from parentBlock  
2. add aFableBlock to siblingBlock
*/
function goIn(aFableBlock,siblingBlock,parentBlock){
    // 1.
    var index = findIndexByKey(parentBlock.children,'name',aFableBlock.name);
    console.assert( index>=0 , 'The block  '+aFableBlock.name
					+'  is not inside the parentBlock  '+
					parentBlock.name);
    parentBlock.children.splice( index, 1 );

    // 2.
    siblingBlock.children.push( aFableBlock );
}

function removeChild(childBlockName,parentBlock){
    var index = findIndexByKey(parentBlock.children,'name',childBlockName);
    console.assert( index>=0 , 'The block is not inside the parentBlock');
    parentBlock.children.splice( index, 1 );
}
