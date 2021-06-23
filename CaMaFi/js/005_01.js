// 005_01.js

let prepare_005_01 = (playgroundId,appleId,bananaId)=>{
	let parentDiv = document.getElementById(playgroundId);
	
	let appleImg = document.getElementById(appleId).cloneNode();
	appleImg.style.display = 'inline-block';	
	appleImg.style.width = '1em';
	appleImg.style.margin='1px';
	appleImg.style.padding='0px';	
	appleImg.removeAttribute("id");
	let bananaImg = document.getElementById(bananaId).cloneNode();
	bananaImg.style.display = 'inline-block';
	bananaImg.style.lineHeight = '1em';
	bananaImg.style.width = '1em';
	bananaImg.style.margin='1px';
	bananaImg.style.padding='0px';	
	bananaImg.removeAttribute("id");

	let outputId = playgroundId+'_1';
	let btn = playgroundId+'_2';
	let btn2 = playgroundId+'_3';
	let outputId2 = playgroundId+'_4';
	parentDiv.innerHTML += 
	`
	&nbsp; <b>Generate an expression with apples and bananas: 
		<button id="${btn}" style="background-color:white;">go</button>!</b>
	<div style="margin-left:1em;" width="100%" id="${outputId}"></div>
	<button id="${btn2}" style="background-color:white;margin-left:4em;" >solve</button>
	<div style="margin-left:1em;min-height:25em;" width="100%" id="${outputId2}"></div>
	`;

	let div = document.getElementById(outputId);
	let div2 = document.getElementById(outputId2);

	function randInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const generateTerms = ()=>{
		let sign;
		let howMany = randInt(0,6);
		let coeffs = Array.apply(null, new Array(2+howMany)).map( e => {
			if (Math.random()<=0.6)
				return randInt(1,5)
			return randInt(6,12)
		});
		let list = [];
		sign = [-1,+1][randInt(0,1)];
		//console.log(coeffs);
		list.push( [sign*coeffs[0] , 'a'] );
		for (let i=0;i<howMany;i++){
			sign = [-1,+1][randInt(0,1)];
			let letter = ['a','b'][randInt(0,1)];

			//console.log( sign , coeffs[i] , letter );
			list.push( [
					sign*coeffs[i+1] , letter 
						] );
		}
		sign = [-1,+1][randInt(0,1)];
		list.push( [sign*coeffs[coeffs.length-1] , 'b'] );
		return list;
	}

	const termsFormatter = (pair) => {
		if (pair[0]==1){
			return '+'+pair[1];
		} else if (pair[0]==-1){
			return '-'+pair[1];
		} 
		return (pair[0]>=0?'+'+pair[0]:pair[0])+'*'+pair[1];
	}

	const draw = (terms)=>{

		let text = terms.map( termsFormatter ).join(' ');

		div.innerHTML = `
				<div>${text} = ?</div>
		`;

		if (doSolve){
			let termsS = [...terms];
			termsS.sort( (a, b) => a[1]>b[1] );

			let text2 = termsS.map( termsFormatter ).join(' ');
			if (text2.startsWith('+')) text2 = text2.substring(1);

			let listA = termsS.filter( pair => pair[1]=='a' ).map( pair => pair[0] );
			let listB = termsS.filter( pair => pair[1]=='b' ).map( pair => pair[0] );
			let listAtext = listA.map( n => n>=0?'+'+n:n ).join('');
			let listBtext = listB.map( n => n>=0?'+'+n:n ).join('');

			let text3 = `(${listAtext})*a + (${listBtext})*b`;


			let totA = listA.reduce( (tot,n) => tot+n );
			let totB = listB.reduce( (tot,n) => tot+n );
			//let text4 = `(${totA})*a+(${totB})*b`;

			let solutionTerms = [ [totA,'a'],[totB,'b'] ];
			let text4 = solutionTerms.map( termsFormatter ).join('');
			if (text4.startsWith('+')) text4 = text4.substring(1);
			div2.innerHTML = `
				<div>${text2} = </div>
				<div>${text3} = </div>
				<div>${text4} </div>
			`;

			// the visual fruit thing!
			// to do 
			div2.innerHTML += `<br>~~ Fruit version ~~~~~~~~~~<br><br>`;

			// apples and bananas
			for (let idx=0;idx<terms.length;idx++){				
				let term = terms[idx];

				let signSpan = document.createElement('span');
				signSpan.innerHTML = term[0]>=0?'+':'-';
				div2.appendChild( signSpan );

				if (term[1]=='a'){
					let applesSpan = document.createElement('span');
					applesSpan.style.maxWidth='4em';
					applesSpan.style.lineHeight='0px';
					applesSpan.style.display='inline-block';
					for (let i=0;i<Math.abs(term[0]);i++){
						//console.log(i);
						applesSpan.appendChild( appleImg.cloneNode() );
					}
					div2.appendChild(applesSpan);
				} else {
					let bananasSpan = document.createElement('span');
					bananasSpan.style.maxWidth='4em';			
					bananasSpan.style.lineHeight='0px';
					bananasSpan.style.display='inline-block';
					for (let i=0;i<Math.abs(term[0]);i++){
						//console.log(i);
						bananasSpan.appendChild( bananaImg.cloneNode() );
					}
					div2.appendChild(bananasSpan);
				}
			}
			div2.innerHTML += ' =<br><br>';

			// totals of apples and bananas			
			let signSpan2 = document.createElement('span');
			signSpan2.innerHTML = totA>=0?'+':'-';
			div2.appendChild( signSpan2 );

			let applesSpan = document.createElement('span');
			applesSpan.style.maxWidth='4em';
			applesSpan.style.lineHeight='0px';
			applesSpan.style.display='inline-block';
			for (let i=0;i<Math.abs(totA);i++){
				//console.log(i);
				applesSpan.appendChild( appleImg.cloneNode() );
			}
			div2.appendChild(applesSpan);

			let signSpan3 = document.createElement('span');
			signSpan3.innerHTML = totB>=0?'+':'-';
			div2.appendChild( signSpan3 );

			let bananasSpan = document.createElement('span');
			bananasSpan.style.maxWidth='4em';		
			bananasSpan.style.lineHeight='0px';
			bananasSpan.style.display='inline-block';
			for (let i=0;i<Math.abs(totB);i++){
				//console.log(i);
				bananasSpan.appendChild( bananaImg.cloneNode() );
			}
			div2.appendChild(bananasSpan);


		} else {
			div2.innerHTML = '';
		}
	}
	let doSolve = true;
	let terms = generateTerms();
	draw(terms);

	document.getElementById(btn).addEventListener("click", ()=>{
		doSolve = false;
		// debug doSolve = true;
		terms = generateTerms();
		draw(terms);
	});

	document.getElementById(btn2).addEventListener("click", ()=>{
		doSolve = true;
		draw(terms);
	});

}