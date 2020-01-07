jQuery(document).ready(function($){
	var path = window.location.pathname.split("/").pop();
	if(path==''){
		path="index";
	}
	
	console.log("path="+path);
	var projectspath = path.substring(0,path.indexOf('_'));
	console.log("contatenated projectspath="+ projectspath);
	if(projectspath === "projects"){
		// path = "projects";	
	}
	// var target = $('nav-item a[href="'+path+'"]');
	var elements = document.getElementsByClassName("nav-link");
	console.log(elements.length);
	for (let i = 0; i < elements.length; i++) {
		var found = elements[i].getAttribute('href').split("/").pop();
		console.log("found="+found);
		var target = elements[i].parentNode.classList;
		target.remove('active');
		if(found === path){
			target.add('active');
			console.log("adasda");
		}else if(path === "index" && found === "explore"){
			target.add('active');
			console.log("adasda");
		}
		console.log(elements[i].getAttribute('href'));
	}
});
