(()=>{

	
	// add the always-on-top sidebar
	let elemDiv = document.createElement('div');
    elemDiv.id = 'sidebar';
    elemDiv.innerHTML = '[<a href="#top">Inizio</a>]';
    document.body.prepend(elemDiv);

	let sidebar = document.getElementById('sidebar');
	let sidebarCounter = 0;
	let sidebarSubCounter = 0;
	let beforePuzzles = true;

	// iterate over all paragraphs
	let all = document.querySelectorAll('h1, h2, h3');
	let counter = 0;
	for (elem of all){
		counter++;

		let content = elem.textContent;
		elem.innerHTML = `<a 
				href="#section_${counter}" 
				name="section_${counter}" 
				class="standard-header">${content}</a>`

		// push this paragraph header to the sidebar
		if (elem.textContent.startsWith("Puzzle")){
			beforePuzzles = false;

			sidebarSubCounter = 0;
			sidebarCounter++;
			sidebar.innerHTML += `<br>*<a href="#section_${counter}">Puzzle</a>*`;
		}
		if (beforePuzzles){
			let contentWordsOnly = content.replace(/[\W_]+/g," ");
			let conts = contentWordsOnly.split(' ');
			if (elem.tagName=='H2'){
				sidebarSubCounter = 0;
				sidebarCounter++;
				
				let text = conts[0];
				if (text.length<10) text += ' '+conts[1];
				text += '…';
				sidebar.innerHTML += `<br><a href="#section_${counter}">${text}</a>`;
			}
			if (elem.tagName=='H3'){ // sub-section
				sidebarSubCounter++;
				let text = conts[0]+' '+conts[1];
				text = text.substr(0,10);
				text += '…';				
				sidebar.innerHTML += `<br>${'&nbsp;'}<a href="#section_${counter}">${text}</a>`;
			}
		}
	}

})();

/*
<a href="#section_5" name="section_5"><h2>The need for zero</h2></a>
*/