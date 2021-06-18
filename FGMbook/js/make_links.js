(()=>{
	
	let all = document.querySelectorAll('h1, h2, h3');
	let counter = 0;
	for (elem of all){
		counter++;

		let content = elem.textContent;
		elem.innerHTML = `<a 
				href="#section_${counter}" 
				name="section_${counter}" 
				class="standard-header">${content}</a>`
	}

})();

/*
<a href="#section_5" name="section_5"><h2>The need for zero</h2></a>
*/