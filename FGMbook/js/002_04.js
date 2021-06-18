// 002_04.js

let prepare_002_04 = (playgroundId)=>{
	let primes = [2, 3,  5,  7,  11,  13,  17, 19,  23,
  				29,  31,  37,  41,  43,  47,  53,  59,  61,  67,
  				71,  73,  79,  83,  89,  97].map(n=>BigInt(n));
  	console.log( primes.length );

	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId = playgroundId+'_2';
	let initialValue = '1,2,3';
	parentDiv.innerHTML += 
	`Type a list of numbers, separated by comma: <input id="${inputId}" 
		type="text" size="30" value="${initialValue}">
	<div style="margin-left:2em;" width="100%" id="${outputId}"></div>`;

	let div = document.getElementById(outputId);
	let draw = (l)=>{
		let digits = l.map(n=> `<span class="open_box">${n}</span>` );
		let godelList1 = l.map((n,idx)=>primes[idx]+'<sup>'+n+'</sup>');
		let godelList2 = l.map((n,idx)=>primes[idx]**n);
		let godelNumber = ''+godelList2.reduce((prod,n)=>prod*n,1n);

		// pretty print
		godelNumber = godelNumber.split('').reverse().join('');
		godelNumber = godelNumber.replace(/(.{3})/g,"$1'");
		godelNumber = godelNumber.split('').reverse().join('');
		if (godelNumber.startsWith("'"))
			godelNumber = godelNumber.substring(1);

		// `<span class="open_box">${}</span>`
		div.innerHTML = digits.join('') + ' = '+
						godelList1.join(' * ') + ' =<br>'+
						godelList2.join(' * ') + ' =<br>'+
						godelNumber;
	}
	let list = initialValue.split(',').map(n=>BigInt(n))
	while (list.length>25) list.pop();
	draw(list);

	document.getElementById(inputId).addEventListener("input", ()=>{
		list = document.getElementById(inputId).value.split(',').map(n=>BigInt(n))
		while (list.length>25) list.pop();
		draw(list);
	});	
}