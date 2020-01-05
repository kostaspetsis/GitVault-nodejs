class Projects{
	constructor(){
		this.data = [];
	}

	AddProject(newProject){
		this.data.push(newProject);
	}
};
module.exports = Projects;