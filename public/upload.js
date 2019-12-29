$(function(){
   
function showPleaseWait() {
	var pleaseWait = $('#pleaseWaitDialog'); 

	pleaseWait.modal('show');
	console.log("ProgressBar showed");
};
	
function hidePleaseWait() {
	var pleaseWait = $('#pleaseWaitDialog'); 

	pleaseWait.modal('hide');
};
    
// showPleaseWait();
hidePleaseWait();

});