// =============================================

function draw(canvas,model){

	var ctx = canvas.getContext("2d");
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	
	ctx.save();
	ctx.translate( 300,200);
	ctx.scale(1.5,1.5);

	ctx.strokeStyle = "#000000";
	ctx.beginPath();
	ctx.arc(0,0,100,0,2*Math.PI);
	ctx.stroke();
	ctx.clip();

	ctx.strokeStyle = "#000000";
	for (var i=0;i<6;i++){
		ctx.save();	
			ctx.rotate( i*60 *Math.PI/180);
			
			// clipping triangle
			ctx.beginPath();
			ctx.fillStyle = "rgba(255,255,255,0.1)";
			ctx.moveTo(0,0);
			ctx.lineTo(200*Math.cos(-30*Math.PI/180),200*Math.sin(-30*Math.PI/180));
			ctx.lineTo(200*Math.cos(30*Math.PI/180),200*Math.sin(30*Math.PI/180));
			ctx.lineTo(0,0);
			ctx.fill();
			ctx.clip();
		
			ctx.strokeStyle = "#000000";
			ctx.beginPath();
			ctx.arc(30+5*model.p1,0,5*model.p2,0,2*Math.PI);
			ctx.stroke();	
			
			ctx.save();
				ctx.rotate( (5*model.p7-20) *Math.PI/180);
				ctx.beginPath();
				ctx.arc(85+5*model.p5,0,8*model.p6,0,2*Math.PI);
				ctx.stroke();	
			ctx.restore();

			ctx.beginPath();
			var a = 5*model.p4;
			ctx.moveTo(a,18+model.p4*2);
			ctx.lineTo(a,5);
			ctx.lineTo(10+8*model.p3,0);
			ctx.lineTo(a,-5);
			ctx.lineTo(a,-18-model.p4*2);
			ctx.stroke();	

		ctx.restore();
	}

	ctx.restore();
	
	ctx.font="16px Times New Roman";
	ctx.fillText(model.toString(),10,20);
}

function initCursors(params){
	for (var i=0;i<params.length;i++){
		document.getElementById( params[i] ).value = model[ params[i] ];
		document.getElementById( params[i]+"_param").innerHTML = model[ params[i] ];
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================
// == MAIN                 ==
// ==========================

window.onload = function(){

	var canvas = document.getElementById("myCanvas");
	
	model = {p1:3,p2:6,
			 p3:2,p4:6,
			 p5:0,p6:1,p7:4,
			 params: ["p1","p2","p3","p4","p5","p6","p7"],
	         update:function(){ draw(canvas,this); },
			 toString: function(){
					var text = "";
					for (var i=0;i<this.params.length;i++){
						var n = this[ this.params[i] ];
						if (n<10) n = "0"+n;
						else      n = ""+n;
						text += n;
					}
					return text;
				}
			};
	initCursors(model.params);
	
	// setup changes
	document.getElementById("p1").onchange = function(){
		model.p1 = this.value;
		document.getElementById("p1_param").innerHTML = this.value;
		model.update();
	};
	document.getElementById("p2").onchange = function(){
		model.p2 = this.value;
		document.getElementById("p2_param").innerHTML = this.value;
		model.update();
	};
	document.getElementById("p3").onchange = function(){
		model.p3 = this.value;
		document.getElementById("p3_param").innerHTML = this.value;
		model.update();
	};
	document.getElementById("p4").onchange = function(){
		model.p4 = this.value;
		document.getElementById("p4_param").innerHTML = this.value;
		model.update();
	};
	document.getElementById("p5").onchange = function(){
		model.p5 = this.value;
		document.getElementById("p5_param").innerHTML = this.value;
		model.update();
	};
	document.getElementById("p6").onchange = function(){
		model.p6 = this.value;
		document.getElementById("p6_param").innerHTML = this.value;
		model.update();
	};
	document.getElementById("p7").onchange = function(){
		model.p7 = this.value;
		document.getElementById("p7_param").innerHTML = this.value;		
		model.update();
	};
	
	document.getElementById("randomize").onclick = function(event){
		model.p1 = getRandomInt(0,10);
		model.p2 = getRandomInt(0,10);
		model.p3 = getRandomInt(0,10);
		model.p4 = getRandomInt(0,10);
		model.p6 = getRandomInt(0,10);
		model.p5 = getRandomInt(0,10);
		model.p7 = getRandomInt(0,10);
		initCursors(model.params);
		model.update();
	};

	document.getElementById("print").onclick = function(event){
		var win=window.open();
		win.document.write("<br><img width='100%' src='"+canvas.toDataURL()+"'/>");
		win.print();
		win.location.reload();
	};
	
	model.update();
}