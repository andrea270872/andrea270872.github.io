// 004_02.js

let prepare_004_02 = (playgroundId)=>{
	let parentDiv = document.getElementById(playgroundId);
	let outputId = playgroundId+'_1';
	let inputId1 = playgroundId+'_2';
	let inputId2 = playgroundId+'_3';
	let inputId3 = playgroundId+'_4';
	let inputId4 = playgroundId+'_5';
	let btn = playgroundId+'_6';
	let initialValue1 = '1';
	let initialValue2 = '2';
	let initialValue3 = '3';
	let initialValue4 = '4';
	parentDiv.innerHTML += 
	`&nbsp; &nbsp; ( <input id="${inputId1}" style="color:blue;" 
					type="number" size="3" value="${initialValue1}"> :
	   <input id="${inputId2}" type="number" style="color:ForestGreen;" 
	   size="3" value="${initialValue2}"> ) * 
	 ( <input id="${inputId3}" type="number" style="color:FireBrick;"
	 	size="3" value="${initialValue3}"> : 
	   <input id="${inputId4}" type="number" style="color:Orange;"
	   	size="3" value="${initialValue4}"> ) = ? 
	<button id="${btn}" style="margin-left:20em;">random</button>
	<div width="100%" id="${outputId}"></div>`;


	function fix(x,precision=3) {
		let tmp = 10**precision;
		return Math.round(x*tmp)/tmp;
	}

	let div = document.getElementById(outputId);
	let draw = (a,b,c,d)=>{
		div.innerHTML = `
		<br>
		<table cols="2" width="130%">
		  <tr><td valign="top">
		    <table class="centered_table" width="33%,33%,33%">
		    <tr><td>(<span style="color:blue;">${a}</span>:<span style="color:ForestGreen;">${b}</span>)</td>
		    	<td> * </td>
		    	<td>(<span style="color:FireBrick;">${c}</span>:<span style="color:Orange;">${d}</span>)</td></tr>
		    <tr><td><b>&Downarrow; :</b></td><td>  </td><td><b>&Downarrow; :</b></td></tr>
		    <tr><td> ${fix(a/b)} </td><td> * </td><td> ${fix(c/d)} </td></tr>
		    <tr><td></td><td><b>&Downarrow; *</b></td><td></td></tr>
		    <tr><td></td><td><b> ${fix((a/b)*(c/d))} </b></td><td></td></tr>
		    </table>
		  </td>
		  <td valign="top">
		    <table class="centered_table" width="33%,33%,33%">
		    <tr><td>(<span style="color:blue;">${a}</span>:<span style="color:ForestGreen;">${b}</span>)</td>
		    	<td> * </td>
		    	<td>(<span style="color:FireBrick;">${c}</span>:<span style="color:Orange;">${d}</span>)</td></tr>
		    <tr><td></td><td><b>&Downarrow; *</b></td><td></td></tr>
		    <tr><td></td><td><div style="width:10em;">
		    (<span style="color:blue;">${a}</span>*<span style="color:FireBrick;">${c}</span>) 
		    : 
		    (<span style="color:ForestGreen;">${b}</span>*<span style="color:Orange;">${d}</span>)  =
		     ${a*c}:${b*d}</div></td><td></td></tr>
		    <tr><td></td><td><b>&Downarrow; :</b></td><td></td></tr>
		    <tr><td></td><td><b> ${fix((a*c)/(b*d))} </b></td><td></td></tr>
		  </table>
		  </td></tr>
		</table>
		`;
	}
	let a = ~~initialValue1;
	let b = ~~initialValue2;
	let c = ~~initialValue3;
	let d = ~~initialValue4;
	draw(a,b,c,d);

	document.getElementById(inputId1).addEventListener("input", ()=>{
		a = ~~(document.getElementById(inputId1).value);
		a = ~~Math.abs(a);
		document.getElementById(inputId1).value = a;
		draw(a,b,c,d);
	});	

	document.getElementById(inputId3).addEventListener("input", ()=>{
		c = ~~(document.getElementById(inputId3).value);
		c = ~~Math.abs(c);
		document.getElementById(inputId3).value = c;
		draw(a,b,c,d);
	});	

	document.getElementById(inputId2).addEventListener("input", ()=>{
		b = ~~(document.getElementById(inputId2).value);
		b = ~~Math.abs(b);
		if (b==0) b=1
		document.getElementById(inputId2).value = b;
		draw(a,b,c,d);
	});	

	document.getElementById(inputId4).addEventListener("input", ()=>{
		d = ~~(document.getElementById(inputId4).value);
		d = ~~Math.abs(d);
		if (d==0) d=1
		document.getElementById(inputId4).value = d;
		draw(a,b,c,d);
	});	

	document.getElementById(btn).addEventListener("click", ()=>{
		if (Math.random()<=.8){
			a = ~~(Math.random()*10);
			c = ~~(Math.random()*10);
			b = ~~(Math.random()*10)+1;
			d = ~~(Math.random()*10)+1;
		} else {
			a = ~~(Math.random()*100);
			c = ~~(Math.random()*100);
			b = ~~(Math.random()*100)+1;
			d = ~~(Math.random()*100)+1;
		}
		//console.log(a,b,c,d);

		document.getElementById(inputId1).value = a;
		document.getElementById(inputId2).value = b;
		document.getElementById(inputId3).value = c;
		document.getElementById(inputId4).value = d;
		draw(a,b,c,d);
	});

}