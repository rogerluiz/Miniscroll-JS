function getSize(){
	var h = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
	
	var w = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.clientWidth;
	
	return [w, h];
}


function createDiv(ele, idName, className, color){
	var div = document.createElement('div');
	div.setAttribute("id", idName);
	div.setAttribute("class", className);
	div.style.backgroundColor = color;			
	document.getElementById(ele).appendChild(div);
}