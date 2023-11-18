// BlocksOnMobile.js - Andrea Valente
// 19-Nov-2023

let __bOm_Globals = {};

// orientation is 1-portrait, 2-landscape
function init(w,h,orientation){

	__bOm_Globals = {};

	// create a canvas w x h 
	// place it on the page
	//document.body.innerHTML = `<canvas id="__medialibCanvas" width="${w}" height="${w}"></canvas>`;
	
	let doneMsg = document.querySelector('#__all_done__');
	if (doneMsg!=null){
		doneMsg.remove();
	}

	const canvas = document.querySelector('#__bOmCanvas');
	const ctx = canvas.getContext("2d");
	console.log(""+canvas.style.display);
	canvas.style.display = "inline-block";
	console.log(""+canvas.style.display);

	switch (orientation){
		case 2: // landscape
			screen.orientation.lock("landscape-primary")
			.catch(err => {/* handle your error here */
				// DEBUG 
				console.log(err);
			});
			break;
		default: // portrait
			screen.orientation.lock("portrait-primary")
			.catch(err => {/* handle your error here */
				// DEBUG 
				console.log(err);
			});
			break;
	}	

	if (!document.fullscreenElement) {
		canvas.requestFullscreen().catch((err) => {
			alert(
			`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
			);
		});
	} else {
		document.exitFullscreen();
	}

	// fullscreen canvas
	//    logical size
	canvas.width = w;
	canvas.height = h;
	//    physical size on the screen
	canvas.style.width = "100%";
	canvas.style.height = "auto";


	// touch events and vars
	__bOm_Globals.tapPos = [0,0];
	__bOm_Globals.isTapping = false;
	canvas.ontouchstart = (event) => {
		event.preventDefault();
		const touches = event.changedTouches;
		const rect = canvas.getBoundingClientRect();
		if (touches.length>0){
			// I only need the first finger
			
			__bOm_Globals.isTapping = true;
			let x = event.targetTouches[0].pageX - rect.left;
			let y = event.targetTouches[0].pageY - rect.top;
			__bOm_Globals.tapPos = [x,y];

		}
	}
	canvas.ontouchend = (event) => {
		event.preventDefault();
		__bOm_Globals.isTapping = false;
	}

/*
// ------- keys ----------------------------------
	__medialibGlobal.isKeyPressed = false;
	__medialibGlobal.keyPressed = null; 
	document.body.onkeydown = (e) => {
		e = e || window.event;
		let key = e.key;
		if (key.length==1){
	    	__medialibGlobal.isKeyPressed = true;
	    	__medialibGlobal.keyPressed = key;
	    	//alert(charStr);
		}
	    return false;
	}
	document.body.onkeyup = (e) => {
	    __medialibGlobal.isKeyPressed = false;
	    __medialibGlobal.keyPressed = null;
	    return false;
	}
// -----------------------------------------------

	// initialize the __medialibGlobal object
	__medialibGlobal.backgroundColor = [0,0,0];
	__medialibGlobal.imgs = {};
	__medialibGlobal.sounds = {};
	__medialibGlobal.canvas = canvas;
	__medialibGlobal["screen"] = ctx;
*/
	__bOm_Globals.backgroundColor = [0,0,0];
	__bOm_Globals.imgs = {};
	__bOm_Globals.canvas = canvas;
	__bOm_Globals.ctx = ctx;

}

function clear(r,g,b){
	const cw = __bOm_Globals.canvas.width;
	const ch = __bOm_Globals.canvas.height;
	const ctx = __bOm_Globals.ctx;
	if ((r!=null)&&(g!=null)&&(b!=null)){
		__bOm_Globals.backgroundColor = [r,g,b];
	}
	const [red,green,blue] = __bOm_Globals.backgroundColor;
	ctx.fillStyle = `rgb(${red},${green},${blue})`;
	ctx.fillRect(0,0,cw,ch);
}

function rect(x,y,w,h, r,g,b){
	const ctx = __bOm_Globals.ctx;
    let color = [255,255,255];
    if ((r!=null) && (g!=null) && (b!=null)){
        color = [r,g,b];
    }
	ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`;
	ctx.fillRect(x,y,w,h);
}

function wait(sec) {
	return new Promise(resolve => setTimeout(resolve, sec*1000));
}

async function waitTap(){
	// DEBUG console.log("tapping?",__bOm_Globals.isTapping);
	while (!__bOm_Globals.isTapping){
		//console.log("waiting a click...");
		await wait(.01);
	}
}

function getTapPos(){
	return __bOm_Globals.tapPos;
}

function isTap(){
	return __bOm_Globals.isTapping;
}

function draw(img_file_name,x,y,width,height){
	const ctx = __bOm_Globals.ctx;
	let image = __bOm_Globals.imgs[img_file_name];

	if (image!=null){
        if ((width!=null)&&(height!=null)){
			ctx.drawImage(image, x,y, width,height);
        } else {
        	ctx.drawImage(image, x,y);
        }
	} else {
		image = new Image();
		image.onerror = function () {
			let w = 160; 
			let h = 120; // default size
			ctx.fillStyle = 'white';
			ctx.fillRect(x, y, w, h);
	        console.log(`bOm: Image ${img_file_name} not found.`);
		}
	    image.onload = function () {
	    	// cache it
	    	__bOm_Globals.imgs[img_file_name] = image;
	    	// then draw it
	    	draw(img_file_name,x,y,width,height);
	    };

		image.src = img_file_name;
	}

}

function saveScreen(file_name,pos_x,pos_y,width,height){
	const link = document.createElement('a');
	link.download = file_name;

	let partOfCanvas = document.createElement('canvas');
	partOfCanvas.width = width;
	partOfCanvas.height = height;
	partOfCanvas.getContext('2d')
			.drawImage(__bOm_Globals.canvas,
						pos_x,pos_y,width,height,
						0,0,width-pos_x,height-pos_y);

	link.href = partOfCanvas.toDataURL();
	link.click();
	link.delete;
}

/*

function text(message,x,y,font_size, r,g,b){
	const ctx = __medialibGlobal["screen"];
  let color = "white";
  if ((r!=null)&&(g!=null)&&(b!=null)){
		color = `rgb(${red},${green},${blue})`;
	}

	ctx.font = `${font_size}px Arial, sans-serif`;
	ctx.fillStyle = color;
	ctx.textAlign = "left";
  ctx.fillText(message,x,y+font_size);
}

function set_font(file_name){
	// TO DO 
}

function get_text_rect(message,x,y,font_size){
	// TO DO 
	// approximation ...
	return [message.length*font_size , font_size];
}

async function wait_key_press(){
	while (!__medialibGlobal.isKeyPressed){
		await wait(.01);
		//console.log("!",__medialibGlobal.isKeyPressed);
	}
	//console.log("!!");
	__medialibGlobal.isKeyPressed = false; // empty "keyboard buffer"
	return __medialibGlobal.keyPressed;
}

function play(sound_file_name){
	// cache the audio objects ...
	let sound = __medialibGlobal["sounds"][sound_file_name];
	if (sound==null){
		sound = new Audio(sound_file_name);
	    sound.loop = false;
		__medialibGlobal["sounds"][sound_file_name] = sound;
	}
	sound.pause(); sound.currentTime = 0; // STOP
    sound.play();
}

*/

function allDone(){
	/*
	__medialibGlobal.canvas.onmousemove = 
	__medialibGlobal.canvas.onmouseup = 
	__medialibGlobal.canvas.onmousedown = 
	document.body.onkeydown = 
	document.body.onkeyup = ()=>{};
	*/

	__bOm_Globals.canvas.ontouchstart = 
	__bOm_Globals.canvas.ontouchstop = null;

	let par = document.createElement('p');
		par.id = '__all_done__';
		par.innerHTML="<h1>All done!</h1>";
	document.body.append(par);

	if (document.fullscreenElement) {
		document.exitFullscreen()
	}
	__bOm_Globals.canvas.style.display = "none";
	
	screen.orientation.lock("natural")
	.catch(err => {/* handle your error here */
				// DEBUG 
				console.log(err);
			});
	
	console.log("all done");
}


function distance(x1,y1,x2,y2){
    return ((x2 - x1)**2 + (y2 - y1)**2)**.5;
}

// tPercentage=  0 -> a
// tPercentage=100 -> b
// tPercentage= 50 -> a/2 + b/2
function a_to_b(a,b,tPercentage){
    let t = tPercentage/100.0;
    return (1-t)*a + t*b;
}

function point_inside_rect(px,py,  pos_x,pos_y, width,height){
    if ( (px>=pos_x) && (px<=pos_x+width) 
    	&& (py>=pos_y) && (py<=pos_y+height) ){
    	return true;
    }
    return false;
}