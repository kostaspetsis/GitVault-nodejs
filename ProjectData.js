class ProjectData{
	constructor(title,
				project_path,
				video_path,
				id,
				from_user,
				likes,
				dislikes,
				comments){
		this.project_path = project_path; 
		this.video_path = video_path; 
		this.id = id; 
		this.from_user = from_user; 
		this.likes = likes; 
		this.dislikes = dislikes; 
		this.comments = comments; 
	}
};
module.exports = ProjectData;