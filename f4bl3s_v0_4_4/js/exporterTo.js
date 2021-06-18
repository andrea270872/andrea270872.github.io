// require: js/fable.js  and   js/pptxgen.bundle.js

var exporterTo = function(){

    function safeTags(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
    }

// ******************************************************************************************
// *** 1) _exportToTwine ********************************************************************
// ******************************************************************************************
	var _exportToTwine = function(aFable){

        function renderBlock(aBlock,isWorldLevel){
            var st = '';
            
            var typeName = aBlock.type;
            typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1); // 1st char to uppercase
            //console.log( typeName + '  ' +aBlock.name);
            
            var colorClassName = 'visual'+typeName;
            if (isWorldLevel){
                colorClassName = 'visualWorld';
            }
            st += '<div class="'+colorClassName+' wrapper">';
            if (!isWorldLevel){ // only if this is not the World
                st += '<span class="blockname">'+aBlock.name+'</span>';
            }
            aBlock.children.forEach(function(block,index){
                st += renderBlock(block);
            });
            st += '</div>';

            return st; 
        }

        function render(aFable,index){
            var slide = aFable.slides[ index ];
            return renderBlock(slide.world,true);
        }

        // *** main *****************************************************
		var twine = '';

		twine += [                                // pid of Slide0
			'<tw-storydata name="'+aFable.title+'" startnode="0" creator="Twine" creator-version="2.2.1" ',
			//'ifid="C18B0205-D153-46DF-85BA-A0AA673359AC" ', // perhaps not needed
            'zoom="1" format="Harlowe" format-version="2.1.0" ',
			'options="" hidden>\n',
			//'<style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css"></style>',
            '<style role="stylesheet">',
                '.wrapper div {',
                '    padding: 2px;',
                '    border: 1px solid black;',
                '    width: 90%;}',
                '.visualRoom {background-color: LightSkyBlue; box-shadow: 3px 3px 2px #717171;}',
                '.visualPerson {background-color: LightCoral;}',
                '.visualThing {background-color: Khaki;}',
            '</style>',
			'<script role="script" id="twine-user-script" type="text/twine-javascript"><\/script>'
		].join('');

        
        var adjList = computeAjdList(aFable);

        var px=py=200;
        aFable.slides.forEach(function(slide,index){
            // console.log( 'now processing: Slide'+index);

            // consolidate the adjList per action name
            var actions = {};
            adjList[ index ].forEach(function(edge){
                var a = actions[ edge.name ];
                if (a==null){ // create new action
                    actions[ edge.name ] = [];
                } 
                // append to existing action
                actions[ edge.name ].push( [edge.fromIndex,edge.toIndex] ); // [fromIndex,toIndex]
            });
            // console.log( 'actions -> ' , actions);

            // generate twine links, to execute actions
            var twineLinksCode = [];
            Object.keys(actions).forEach(function(key) {

                // array of [fromIndex,toIndex] => array of toIndex
                var toIndexes = actions[key].map(e=>e[1]);                 
                //console.log( toIndexes );                

                if (toIndexes.length==1){
                    twineLinksCode.push(
                        '[['+key+' ->'+'Slide'+toIndexes[0]+']]'
                    );
                } else { // there are many toIndex for the same action label
                    /*
                    A little script to make non-deterministic choice:
                        (set: _list to (array: "Slide1", "Slide2"))
                        (link-goto: "action1", (shuffled: ..._list)'s 1st)
                    */
                    var slidesList = toIndexes.map(e=>'"Slide'+e+'"').join(',');

                    twineLinksCode.push(
                        '(set: _list to (array: '+slidesList+'))',
                        '(link-goto: "'+ key +'", (shuffled: ..._list)\'s 1st)'
                    );
                }
            });
            //console.log( "twine Links Code " , twineLinksCode);

            var divs = render(aFable,index);
            //console.log( divs ,safeTags(divs) );

    		twine += [
    			'\n<tw-passagedata pid="'+index+'"',
                ' name="Slide'+index+'" tags="" position="'+px+','+py+'" size="100,100">',
    			'Slide'+index+'\n',
                safeTags(divs),
                '\n',

                // generate the actions based on the adjacency list!
                /*
                // 1. only  deterministic links
                adjList[ index ].map(function(edge){
                    return '[['+edge.name+' ->'+'Slide'+edge.toIndex+']]';
                }).join(''),
                */
                // 2. deterministic and non-deterministic links
                twineLinksCode.join('\n'),


    			'\n</tw-passagedata>'
    		].join('');

            px += 120;
            py += 150;
        });

		twine += '</tw-storydata>';

		return twine;
	}
	
// ******************************************************************************************
// ** _exportToPPT **************************************************************************
// ******************************************************************************************
    var _exportToPPT = function(fable){

        function flatDescription(block){
            var description = '';

            description += block.name;
            if (block.children.length>0){
                description += '[';
                block.children.forEach(function(childBlock,index){
                    description += flatDescription(childBlock);
                });
                description += ']';
            }
            description += ' ';

            return description;
        }

        // ** main ****************************        
        console.log( JSON.stringify(fable) );
        console.log( 'palette = ' , fable.palette );
        var adjList = computeAjdList(fable);

// ********* generate ppt *******************************************
        var pptx = new PptxGenJS();
        //console.log( pptx );
        var pageW = 10.0; // inches (default)
        var pageH = 5.63; // inches (default)
        console.log( pageW, pageH );

        // generate 1 palette  + 1 slide per slide      
        var slide;
        
        slide = pptx.addNewSlide();
        slide.addText('Title ' + fable.title, { x:1.5, y:0.5, fontSize:18, color:'0000A0' });


        slide = pptx.addNewSlide();
        slide.addText('PALETTE', { x:1.5, y:0.5, fontSize:18, color:'000000' });

            var roomFlatDescription = flatDescription(fable.palette.rooms.world);
            console.log( roomFlatDescription );
            slide.addText('Rooms:',                 { x:1.5, y:1.0, fontSize:16, color:'000000' });
            slide.addText(''+roomFlatDescription,   { x:1.5, y:1.2, fontSize:12, color:'000000' });

            slide.addText('People:',                { x:1.5, y:2.5, fontSize:16, color:'000000' });
            slide.addText(''+fable.palette.people,  { x:1.5, y:2.7, fontSize:12, color:'000000' });

            slide.addText('Things:',                { x:5.5, y:2.5, fontSize:16, color:'000000' });
            slide.addText(''+fable.palette.things,  { x:5.5, y:2.7, fontSize:12, color:'000000' });


        // *** aux functions

        function rectMargin(rect,margin){
            var newRect = rect.slice(); // clone
            newRect[0] += margin;
            newRect[1] += margin;
            newRect[2] -= margin*2;
            newRect[3] -= margin*2;
            return newRect;
        }

        // [    ] , k ->  [][]...[]  k-times
        // centered horizontally!
        function rectDivideHorizontallyIn(rect, numAreas ){
            console.assert( numAreas>0 , 'Error: there must be 1 or more areas!');
            var rects = [];

            var columnWidth = rect[2]/(numAreas+0.0);

            for (var i=0;i<numAreas;i++){
                rects.push( [ rect[0]+columnWidth*i,rect[1], 
                            columnWidth, rect[3] ] );
            }

            return rects;
        }

        function rectDivideIn(rect, numAreas ){
            console.assert( numAreas>0 , 'Error: there must be 1 or more areas!');

            var rects = [];

            if (numAreas==1){
                // do nothing 
                rects.push( rect );
            } else
            if (numAreas==2){
                /* | me | c1  |
                */
                var c1 = rectMargin([ rect[0]            ,rect[1],   rect[2]/2.0,rect[3] ],0.1);
                var me = rectMargin([ rect[0]+rect[2]/2.0,rect[1],   rect[2]/2.0,rect[3] ],0.1);
                rects.push( me,c1 );
            } else
            if (numAreas==3){
                /* | c1 | c2 |
                   |   me    |
                */              
                var c1 = rectMargin([ rect[0]            ,rect[1],   rect[2]/2.0,rect[3]/2.0 ],0.1);
                var c2 = rectMargin([ rect[0]+rect[2]/2.0,rect[1],   rect[2]/2.0,rect[3]/2.0 ],0.1);
                var me = rectMargin([ rect[0],rect[1]+rect[3]/2.0,   rect[2],    rect[3]/2.0 ],0.1);
                rects.push( me,c1,c2 );
            } else 
            if (numAreas==4){
                /* | c1 | c2 |
                   | c3 | me |
                */              
                var c1 = rectMargin([ rect[0]            ,rect[1],               rect[2]/2.0,rect[3]/2.0 ],0.1);
                var c2 = rectMargin([ rect[0]+rect[2]/2.0,rect[1],               rect[2]/2.0,rect[3]/2.0 ],0.1);
                var c3 = rectMargin([ rect[0]            ,rect[1]+rect[3]/2.0,   rect[2]/2.0,rect[3]/2.0 ],0.1);
                var me = rectMargin([ rect[0]+rect[2]/2.0,rect[1]+rect[3]/2.0,   rect[2],    rect[3]/2.0 ],0.1);
                rects.push( me,c1,c2,c3 );
            } else
            if (numAreas>=5){
                /* 5=> | c1 | c2 | c3 |                                         rows= 2, cols=3, leftOver= 2 cells
                       | c4 |    me   |                                         

                   6=> | c1 | c2 | c3 |                                         
                       | c4 | c5 | me | 

                   7=> | c1 | c2 | c3 |                                         
                       | c4 | c5 | c6 | 
                       |      me      |

                   8=> c1,c2,c3 | c4,c5,c6 | c7,  meX2  |
                   9=> c1,c2,c3 | c4,c5,c6 | c7, c8, me |
                  10=> c1,c2,c3 | c4,c5,c6 | c7, c8, c9 |     meX3    |
                  11 ... 

                Cases:
                   #areas > rows leftOver
                    5 > 2 2
                    6 > 2 1
                    7 > 2 3     --> 2 full rows + 3 cells leftover for _me_
                    8 > 3 2     --> 3 full rows, of which 2 cells are leftover for _me_
                    9 > 3 1     --> 3 full rows, of which 1 cell is leftover for _me_
                    10 > 3 3
                    11 > 4 2
                    12 > 4 1
                    13 > 4 3
                    14 > 5 2

                */
                var cols = 3; // horizontal, fixed
                var rows = Math.ceil((numAreas-1)/3.0); // vertical
                var leftOver = 3-(numAreas-1) % 3; // cells for _me_

                var cellW = rect[2]/3.0;
                var cellH = rect[3]/rows;

                // leftOver
                var me;
                switch (leftOver){
                    case 3:{ // _rows_ full rows + 3 cells leftover for _me_
                        var cellH = rect[3]/(rows+1); // to count the new __me__ row!
                        me = rectMargin([ rect[0],rect[1]+cellH*rows, cellW*3,cellH],0.1);
                    } break;
                    case 2:{ // _rows_ full rows, of which 2 cells are leftover for _me_
                        me = rectMargin([ rect[0]+cellW,rect[1]+cellH*(rows-1), cellW*2,cellH],0.1);
                    } break;
                    case 1:{ // _rows_ full rows, of which 1 cell is leftover for _me_
                        me = rectMargin([ rect[0]+cellW*2,rect[1]+cellH*(rows-1), cellW,cellH],0.1);
                    }
                }
                rects.push( me );

                for (var r=0;r<rows;r++){
                    for (var c=0;c<3;c++){ // cols
                        var cN =rectMargin([ rect[0]+cellW*c,rect[1]+cellH*r, cellW,cellH],0.1);
                        rects.push( cN );
                    }
                }
            }

            return rects;
        }

        function visitAndDo(block,currentRect,roomsTable,depth = 0){
            console.log( '-> ' , block.name , currentRect, block.children.length+1);

            // only count children which are rooms!
            var roomChildren = block.children.filter( (child)=>
            	child.type=='room'
            );

            var node = {};
            node.name = block.name;
            node.childrenNum = roomChildren.length;
            node.depth = depth;

            var rects = rectDivideIn(currentRect, node.childrenNum+1 );
            node.outRect = currentRect;
            node.rect = rects[0];
            roomsTable[ node.name ] = node;

            roomChildren.forEach(function(childBlock,index){            	
                visitAndDo(childBlock,rects[index+1],roomsTable,depth+1);
            });
        }

        fable.slides.forEach(function(fableSlide,slideIndex){

// *** compute layout for each slide (statically) wrt the page ***
	        var roomsTable = {};
	        var pageRect = [0,0,pageW,pageH-1.5]; // x,y,w,h 
	        
	        var visibleRoomBlock = getVisibleRoomInSlide(fableSlide);
	        visitAndDo(visibleRoomBlock,pageRect,roomsTable);

	        // compute minimal size for a person or a thing in the rooms
	        var minRoomRect = pageRect;
	        Object.keys(roomsTable).forEach(function(roomName,index){
	            // if rect1 W AND H are less or equal to the minimum -> rect1 is the new minimum
	            if ((roomsTable[roomName].outRect[2]<=minRoomRect[2]) 
	             && (roomsTable[roomName].outRect[3]<=minRoomRect[3]))
	                minRoomRect = roomsTable[roomName].outRect;
	        });
	        var personSize = Math.min( minRoomRect[2]/3.0 , minRoomRect[3]/3.0);	        

	        console.log( roomsTable );
	        console.log('minRoomRect -> ' , minRoomRect ); // it will give the max size for 3 persons
	        console.log('personSize -> ' , personSize );
// *** end ***




            slide = pptx.addNewSlide();
            // generate rects for each room in the roomsTable, using rectangles info
            var blue = 'FF';
            Object.keys(roomsTable).forEach(function(roomName,index){
                //console.log( 'generate rects for each room. Room: '+roomName,index);
                //console.log( roomName,roomsTable[roomName].rect );
                var outRect = roomsTable[roomName].outRect;
                var rect = roomsTable[roomName].rect;

                slide.addShape(pptx.shapes.RECTANGLE, 
                    { x:outRect[0], y:outRect[1], w:outRect[2], h:outRect[3], fill:'0000'+blue });
                slide.addShape(pptx.shapes.RECTANGLE, 
                    { x:outRect[0], y:outRect[1], w:outRect[2], h:outRect[3], line:'000000' });

                slide.addText(roomName, { x: rect[0], y:rect[1], fontSize:10, color:'FFFFFF' });

                // change background color for each room
                var blue10 = parseInt(blue, 16);
                blue10-=10;
                if (blue10<16)
                    blue10 = 255; // loop over when too many rooms!
                blue = blue10.toString(16);
            });


            //console.log( fableSlide );
            // *** compute layour for items inside a rooms ***
            var itemsTable = {}; // like roomTable, but with positions of people and things; {itemName:[x,y],...}

            function computeWidthAndPosOfAllItems(block,parentBlock,currentRect){
                // Block, nor any of its child, is a room!
                console.log( 'computeWidthAndPosOfAllItems-> ' , block.name,' Child of: ', parentBlock.name );

                currentRect[1] += personSize*2/3;
                itemsTable[ block.name ] = [currentRect[0],currentRect[1],currentRect[2]];

                // recursive call on children 
                // Which are NOT ALL items! -> filter out the sub-rooms!
                var itemChildrenNumber=0;
                block.children.forEach(function(childBlock,index){
                    if (childBlock.type!="room"){
                        itemChildrenNumber++;
                    }
                });
                console.log( "item has # item-children: " + itemChildrenNumber);

                var itemIndex = 0;
                if (itemChildrenNumber>0){
                    var childRects = rectDivideHorizontallyIn(currentRect, itemChildrenNumber);
                    console.log( childRects );
                    var itemIndex = 0;
                    block.children.forEach(function(childBlock,index){
                        if (childBlock.type!="room"){
                            computeWidthAndPosOfAllItems( childBlock , block, 
                                                          childRects[itemIndex] );
                            itemIndex++;                        
                        }
                    });
                }

            }

            Object.keys(roomsTable).forEach(function(roomName,index){
                console.log( "visiting room: " + roomName);
                var roomBlock = findFableBlockByNameFrom( roomName , fableSlide.world);

                var itemChildrenNumber=0;
                roomBlock.children.forEach(function(childBlock,index){
                    if (childBlock.type!="room"){
                        itemChildrenNumber++;
                    }
                });             
                console.log( "room has # item-children: " + itemChildrenNumber);

                if (itemChildrenNumber>0){
                    var currentRect = roomsTable[roomName].rect;
                    var childRects = rectDivideHorizontallyIn(currentRect, itemChildrenNumber);
                    console.log( childRects );
                    var itemIndex = 0;
                    roomBlock.children.forEach(function(childBlock,index){
                        if (childBlock.type!="room"){
                            computeWidthAndPosOfAllItems( childBlock , roomBlock, 
                                                          childRects[itemIndex] );
                            itemIndex++;                        
                        }
                    });
                }
        
            });         
            console.log( "================>",itemsTable);

            // use itemsTable to place all items in the current slide
            // for each of the people in the palette, create a box or an image (if the skin has one!)
            // NOTE: not all items in palette are present in all slides!
            fable.palette.people.forEach(function(element,index){
                var personName = fable.palette.people[index];
                if (itemsTable[personName]!=null){ // this item is present in the current slide
                    var posX = itemsTable[personName][0],
                        posY = itemsTable[personName][1];

                    // center rectangle horizontally
                    posX = posX + itemsTable[personName][2]/2 - personSize/2;

                    var imgBase64 = null;
                    if (fable.skin) imgBase64 = fable.skin[personName];
                    if (imgBase64!=null){
                        slide.addImage({ data:'image/png;base64,'+imgBase64, 
                            x:posX, y:posY, w:personSize, 
                            h:personSize });
                    } else {
                            slide.addText(personName,
                                { shape:pptx.shapes.RECTANGLE, align:'c', 
                                    x:posX, y:posY, w:personSize, 
                                    fontSize:10, color:'000000',
                                    w:personSize, h:personSize, 
                                    fill:'FF8C00', line:'F39696', lineSize:1 }); // darkorange / darkerOrange
                    }
                }
            });

            fable.palette.things.forEach(function(element,index){
                var thingName = fable.palette.things[index];
                if (itemsTable[thingName]!=null){ // this item is present in the current slide
                    var posX = itemsTable[thingName][0],
                        posY = itemsTable[thingName][1];

                    // center rectangle horizontally
                    posX = posX + itemsTable[thingName][2]/2 - personSize/2;                    

                    var imgBase64 = null;
                    if (fable.skin) imgBase64 = fable.skin[thingName];
                    if (imgBase64!=null){
                        slide.addImage({ data:'image/png;base64,'+imgBase64, 
                            x:posX, y:posY, w:personSize, 
                            h:personSize });
                    } else {
                            slide.addText(thingName,
                                { shape:pptx.shapes.RECTANGLE, align:'c', 
                                    x:posX, y:posY, w:personSize, 
                                    fontSize:10, color:'000000',
                                    w:personSize, h:personSize, fill:'F0E68C', line:'C0b870', lineSize:1 }); // golden / yellow
                    }
                }
            });
            // ************************************************

            // Add links/buttons to other slides -> actions!
            if (adjList[ slideIndex ].length==0){
                // end of fable
                slide.addText(
                    [{
                        text: '[END OF FABLE]'
                    }],
                    { x:1.0, y:4.5, w:5, h:1 }
                );

            } else {
                adjList[ slideIndex ].forEach(function(edge,index){
                    //console.log( "ACTION: " , edge.name, edge.fromIndex,edge.toIndex );
                    slide.addText(
                        [{
                            text: '['+edge.name+']',
                            options: { hyperlink:{ slide:''+(edge.toIndex+3),   
                                        tooltip:'Go to Slide '+edge.toIndex } }
                        }],
                        { x:1.0, y:4.2+ 0.3*index, w:5, h:1 }
                    );
                });
            }

            slide.addText('Slide_'+slideIndex, { x:pageW*2/3, y:4.2, fontSize:12, color:'363636' });
            if (fableSlide.description){
            	slide.addText(fableSlide.description, 
            			{ x:pageW*2/3, y:4.5, fontSize:12, color:'363636' });
            }
        });  // end forEach fableSlide ***************************



        // LATER! ->        
        pptx.save(fable.title);
    };

    // ready for multiple exports!
    return {toTwine: _exportToTwine,
            toPPT: _exportToPPT
    		};
};