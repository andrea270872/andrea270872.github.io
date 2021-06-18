var exporterToTwine = function(){    

    function safeTags(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
    }


	var _exportToTwine = function(aFable){
		var twine = '';

		twine += [                                // ´pid of Slide0
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
            console.log( 'now processing: Slide'+index);

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
            console.log( 'actions -> ' , actions);

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
	
    // *******************************************************
    // visualArea functions

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

    function computeAjdList(fable){
        // compute adjacency list
        var adjList = [];
        fable.slides.forEach(function(slide,index){
            adjList[index] = [];
        });     
        fable.edges.forEach(function(edge,index){
            adjList[ edge.fromIndex ].push( edge );
        });
        //console.log( adjList );
        return adjList;        
    }    



    return _exportToTwine;    
};