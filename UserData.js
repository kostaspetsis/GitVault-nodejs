class UserData{
	constructor(database_path, username, password, email, id, project_ids) {
		this.database_path=database_path;
		this.username = username;
		this.password = password;
		this.email = email;
		this.id = id;
		this.project_ids = project_ids;
	}
};

module.exports = UserData;