// 005_02.js

let prepare_005_02 = (playgroundId,appleId,bananaId)=>{
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
	let outputId1 = playgroundId+'_2';
	let outputId2 = playgroundId+'_3';
	let btn = playgroundId+'_4';
	let inputId1 = playgroundId+'_6';
	let inputId2 = playgroundId+'_7';
	let inputId3 = playgroundId+'_8';
	let inputId4 = playgroundId+'_9';
	let initialValue1 = '2';
	let initialValue2 = '0';
	let initialValue3 = '0';
	let initialValue4 = '0';
	let initialValueRadio = 1;
	let radioButtonId = playgroundId+'_10';
	let inputId5 = playgroundId+'_11';
	let inputId6 = playgroundId+'_12';
	let inputId7 = playgroundId+'_13';
	let inputId8 = playgroundId+'_14';
	
	parentDiv.innerHTML += 
	`<div style="display:inline-block;margin-left:1em;">
		<h2>Fruit shop stories</h2>
		In my shop I have 
			<input id="${inputId1}" type="number" size="2" value="${initialValue1}"> apples, 
			<input id="${inputId2}" type="number" size="2" value="${initialValue2}"> bananas, 
			<input id="${inputId3}" type="number" size="2" value="${initialValue3}"> cherries, and 
			<input id="${inputId4}" type="number" size="2" value="${initialValue4}"> florins on the floor. 
		<b>And then...</b><br>
			<input type="radio" id="${inputId5}" name="${radioButtonId}" value="1" checked>
			<label>I bought 5 apples and 6 cheeries... what do I have now in my shop?</label><br>
			<input type="radio" id="${inputId6}" name="${radioButtonId}" value="2">
			<label>Somebody ordered <span class="frac"><sup>1</sup><sub>4</sub></span> of the stuff in the shop...
			how much is that?</label><br>
			<input type="radio" id="${inputId7}" name="${radioButtonId}" value="3">
			<label style="width:40em;display:inline-block;vertical-align:top;">I want to make small packages
			of fruit salad, combining each of my fruits with 3 apples...
			how many fruit salads will I get, grouped by kind?</label>
			<br>
			<input type="radio" id="${inputId8}" name="${radioButtonId}" value="4">
			<label style="width:40em;display:inline-block;vertical-align:top;">I want to make fruit salads combining my fruits 
			with 3 apples AND 2 bananas...
			how many fruit salads is that?</label>
		<br><br>
		<b><div style="margin-left:1em;" width="100%" id="${outputId}"></div></b>
	<button id="${btn}" style="background-color:white;margin-left:4em;" >solve</button>
	<div style="margin-left:1em;min-height:12em;" width="100%" id="${outputId2}"></div>
	
	</div>
	`;

	let div = document.getElementById(outputId);
	let div2 = document.getElementById(outputId2);
	//console.log(div,div2)

	const prepareTerms = (whichStory)=>{
		//console.log( whichStory );
		let inputExpr = new algebra.parse(`
			(${inputs[0]})*a+(${inputs[1]})*b+(${inputs[2]})*c+(${inputs[3]})`);
		let expr,expr2;
		let text;
		if (whichStory==1){
			expr2 = new algebra.parse(`5*a+6*c`);
			expr = inputExpr.add(expr2,false);
			text = '('+inputExpr.toString()+') + ('+expr2.toString()+')';
		} else if (whichStory==2){
			expr2 = new algebra.Fraction(1, 4);
			expr = inputExpr.multiply(expr2,false);
			text = '('+inputExpr.toString()+') * '+expr2.toString()+'';
		} else if (whichStory==3){
			expr2 = new algebra.parse(`3*a`);
			expr = inputExpr.multiply(expr2,false);
			text = '('+inputExpr.toString()+') * '+expr2.toString()+'';
		} else {
			expr2 = new algebra.parse(`3*a+2*b`);
			let tmp = inputExpr+'';
			expr = inputExpr.multiply(expr2,false);
			text = '('+inputExpr.toString()+') * ('+expr2.toString()+')';

			// special --------------
			return [expr,text,tmp,algebra.parse( '3a' ),algebra.parse( '2b' )];
		}
		
		//console.log( expr.toString() );
		return [expr,text];
	}

	const draw = (arr)=>{
		let terms = arr[0];
		let termsText = arr[1];

		let text = termsText;
		div.innerHTML = `
				<div>${text} = ?</div>
		`;

		if (doSolve){
			if (valueRadio!=4){
				let text2 = terms.toString();
				let terms2 = terms.add(0); // clone
				let text3 = terms2.toString();
				div2.innerHTML = `
					<div>${text2} = </div><br>
					<div style="color:blue">${text3}</div>
				`;
			} else {
				let tmp1 = algebra.parse( arr[2] ).multiply( arr[3] , false);
				let tmp2 = algebra.parse( arr[2] ).multiply( arr[4] , false);
				let text2 = `( ${arr[2]} ) * ${arr[3]} + 
							 ( ${arr[2]} ) * ${arr[4]}`;				

				let text3 = `( ${tmp1+''} ) + ( ${tmp2+''} )`;

				//let text4 = terms.toString();
				let text4 = `( ${(tmp1.simplify())+''} ) + ( ${(tmp2.simplify())+''} )`;

				let terms2 = terms.add(0); // clone
				let text5 = terms2.toString();
				div2.innerHTML = `
					<div>${text2} = </div><br>
					<div>${text3} = </div><br>
					<div>${text4} = </div><br>
					<div style="color:blue">${text5}</div>
				`;
			}
			/* TO DO 
				replace all \frac{ with <span class="frac"><sup>
				replace all }{ with </sup><sub>
				replace all }? with </sub></span>

			  OR: visit the terms2 object -> make my own toHTML() function
			*/
			//console.log( terms2.toTex() );
			//console.log( terms2 );

			/* TO DO 
			   generate a sentence that reads the reesult out loud!
			*/
			//console.log( 'In my show there are now...' );
		} else {
			div2.innerHTML = '';
		}
	}
	let doSolve = false;
	let valueRadio = ~~initialValueRadio;
	let inputs = [~~initialValue1,~~initialValue2,~~initialValue3,~~initialValue4];
	let terms = prepareTerms(valueRadio);
	draw(terms);

	document.getElementById(btn).addEventListener("click", (evt)=>{
		console.log( evt );
		doSolve = true;
		terms = prepareTerms(valueRadio);
		draw(terms);
	});

	const radioHandler = (evt)=>{
		//console.log( evt.target.value );
		doSolve = false;
		valueRadio = ~~evt.target.value;
		terms = prepareTerms(valueRadio);
		draw(terms);
	}
	document.getElementById(inputId5).addEventListener("input", radioHandler );
	document.getElementById(inputId6).addEventListener("input", radioHandler );
	document.getElementById(inputId7).addEventListener("input", radioHandler );
	document.getElementById(inputId8).addEventListener("input", radioHandler );

	const numberInputHandler = (evt,n)=>{
		doSolve = false;
		inputs[n-1] = ~~evt.target.value;
		terms = prepareTerms(valueRadio);
		draw(terms);
	}
	document.getElementById(inputId1).addEventListener("input", (evt)=>numberInputHandler(evt,1) );
	document.getElementById(inputId2).addEventListener("input", (evt)=>numberInputHandler(evt,2) );
	document.getElementById(inputId3).addEventListener("input", (evt)=>numberInputHandler(evt,3) );
	document.getElementById(inputId4).addEventListener("input", (evt)=>numberInputHandler(evt,4) );
}