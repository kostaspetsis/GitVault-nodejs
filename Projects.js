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
			"comments:" + commentsSerialized+"\n",
			"database_path:" + this.data[i].database_path+"\n");
		}
	}

	GetProjectById(id){
		for(var i = 0; i < this.data.length; i++){
			if (this.data[i].id == id){
				return this.data[i];
			}else{
				console.log("id is '"+this.data[i].id+"' and parameterid = '" + id+"'");
			}
		}
		return -1;
	}

	GetProjectByTitle(title){
		for(var i = 0; i < this.data.length; i++){
			if (this.data[i].title == title){
				return this.data[i];
			}else{
				console.log("id is '"+this.data[i].title+"' and parametertitle = '" + title+"'");
			}
		}
		return -1;
	}
};
module.exports = Projects;