script(src='dropzone.js')
link(rel='stylesheet', href='https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/dropzone.css')
script(src='https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/dropzone.js')
script.
  $(document).ready(function(){
	Dropzone.options.dropzoneFrom={
		autoProcessQueue:false,
		acceptedFiles:".zip",
		init:function(){
			var submitButton=document.querySelector('#submit-all');
			myDropzone=this;
			submitButton.addEventListener("click",function(){
				myDropzone.processQueue();
			});
			this.on("complete", function(){
				if(this.getQueuedFiles().length == 0 && this.getUploadingFiles().length ==0){
					var _this=this;
					_this.removeAllFiles();
				}
			});
		}
	};
  });
