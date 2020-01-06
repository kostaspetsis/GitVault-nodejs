class Projects{
	constructor(){
		this.data = [];
	}

	AddProject(newProject){
		this.data.push(newProject);
	}

	Reset(){
		this.data = [];
	}

	Serialize(){
		for(var i = 0; i < this.data.length; i++){
			var commentsSerialized = "";
			for(var j = 0; j < this.data[i].comments.length; j++){
				commentsSerialized = this.data[i].comments[j].Serialize();
			}
			console.log("title:" + this.data[i].title+"\n",
			"project_path:" + this.data[i].project_path+"\n",
			"video_path:" + this.data[i].video_path+"\n",
			"id:" + this.data[i].id+"\n",
			"from_user:" + this.data[i].from_user+"\n",
			"likes:" + this.data[i].likes+"\n",
			"dislikes:" + this.data[i].dislikes+"\n",
			"comments:" + commentsSerialized+"\n");
		}
	}

	GetProjectById(id){
		for(var i = 0; i < this.data.length; i++){
			if (this.data[i].id === id){
				return this.data[i];
			}
		}
		return -1;
	}
};
module.exports = Projects;