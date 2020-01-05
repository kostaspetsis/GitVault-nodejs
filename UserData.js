class UserData{
	constructor(username, password, email, id, project_ids) {
		this.username = username;
		this.password = password;
		this.email = email;
		this.id = id;
		this.project_ids = project_ids;
	}
};

module.exports = UserData;