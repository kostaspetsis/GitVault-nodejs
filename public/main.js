
function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  // var data = ev.dataTransfer.getData("text");
	// ev.target.appendChild(document.getElementById(data));
	console.log("Dropped something");
	
	$('#pleaseWaitDialog').modal('show');
	$('#submitFile').click();
	console.log("Spamming submitFile");
	var i = 40;                     //  set your counter to 1

	function myLoop () {           //  create a loop function
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called
			// $('#progressBarValue').css('width',''+i);
			// $('#progressBarValue').attr('aria-valuenow',''+i);


			$('#progressBarValue').attr('aria-valuenow', i).css('width', i);


			//alert('hello');          //  your code here
			i++;                     //  increment the counter
			if (i < 200) {            //  if the counter < 10, call the loop function
				myLoop();             //  ..  again which will trigger another 
			}
		}, 10)
	}

	myLoop();  

}

// $("#onClickFileManager").click(function() {
//     $('#theFileInput').click();
// });


$(document).on("click", "#onClickFileManager", function(){
	// $(this).text("It works!");
	// $("#theFileInput").css("display","flex");
	$("#theFileInput").click();
});

$(document).ready(function(){
		// $("#theFileInput").click();
});

function readURL(input) {
	// if (input.files && input.files[0]) {
	// 	var reader = new FileReader();

	// 	reader.onload = function (e) {
	// 		$('#code').text = e.target.result;
	// 		console.log(e.target.result);
	// 	};

	// 	reader.readAsDataURL(input.files[0]);
	// }
}
function readFile(file){
	const reader = new FileReader();
	reader.onload = event => console.log(event.target.result); // desired file content
	reader.onerror = error => reject(error);
	reader.readAsText(file); // you could also read images and other binaries	
}
function loadFileAsText(){
	// var fileToLoad = document.getElementById("theFileInput").files[0];
  
	// var fileReader = new FileReader();
	// fileReader.onload = function(fileLoadedEvent){
	// 	var textFromFileLoaded = fileLoadedEvent.target.result;
	// 	document.getElementById("code").textContent = textFromFileLoaded;
	// 	$("#dropArea").css("display","none");
	// 	console.log(textFromFileLoaded);
	// };
  
	// fileReader.readAsText(fileToLoad, "UTF-8");
}