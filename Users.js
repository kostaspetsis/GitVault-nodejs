class Users{
	constructor(){
		console.log('Initializing Users class');
		this.data = [];
	}

	Reset(){
		this.data = [];
	}

	AddUser(newUser){
		var username = newUser.username;
		var findUser = this.GetUserByUsername(username);
		if (findUser === -1){//No user with that username found
			this.data.push(newUser);
			this.Serialize();
			return 1;
		}else{
			console.log("User with username:" + username + " exists!");
			this.Serialize();
			return -1;
		}
	}

	DeleteUser(user){
		//delete
	}

	UpdateUsers(user){
		var username = user.username;
		var findUser = this.GetUserByUsername(username);
		if (findUser === -1){//No user with that username found
			this.data.push(user);
		}else{

		}
		this.Serialize();
	}
	Update(){
		
	}

	Serialize(){
		for(var i = 0; i < this.data.length; i++){
			var serializeProj_ids = "";
			for(var j = 0; j < this.data[i].project_ids.length; j++){
				serializeProj_ids += this.data[i].project_ids[j]+",";
			}
			console.log("username:"+this.data[i].username+"\n",
						"password:"+this.data[i].password+"\n",
						"email:"+this.data[i].email+"\n",
						"id:" + this.data[i].id+"\n",
						"project_ids:"+serializeProj_ids+"\n");
		}
	}

	isMyProject(userid, idproject){
		var user = this.GetUserById(userid);
		console.log("isMyProject:userid="+user.id+", projectid="+idproject);
		if( user != -1){
			console.log(user.database_path,
						user.username,
						user.password,
						user.email,
						user.id,
						user.project_ids);
			for (let i = 0; i < user.project_ids.length; i++) {
				const element = user.project_ids[i];
				console.log("currentid= "+element+", idproject="+idproject);
				if( element == idproject){
					return true;
				}
			}
		}
		
		return false;
	}

	GetUserById(id){
		for (let i = 0; i < this.data.length; i++) {
			const element = this.data[i];
		
			if(element.id == id){
				return element;
			}
		}
		return -1;
	}

	//Return the UserData by username
	GetUserByUsername(username){
		for (let i = 0; i < this.data.length; i++) {
			const element = this.data[i];
			if(element.username === username){
				return element;
			}else{
				console.log("ssssssssssssssssssssssssssssssssssssssssssssdsadasdsada +"+element.username+", "+username);
			}
		}
		console.log("DIDN'T FIND USERNAME "+username);
		return -1;
	}

	//Return the UserData by email
	GetUserByEmail(email){
		for (let i = 0; i < this.data.length; i++) {
			const element = this.data[i];
			if(element.email === email){
				return element;
			}
		}
	}
};

module.exports=Users;