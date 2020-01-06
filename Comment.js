class Comment{
	constructor(Text,date,from_user,time){
		this.Text = Text;
		this.date = date;
		this.from_user = from_user;
		this.time = time;
	}
	Serialize(){
		return "Comment{Text:"+this.Text + "\n"+
		"date:"+this.date + "\n"+
		"from_user:"+this.from_user + "\n"+
		"time:"+this.time + "}\n";
	}
};
module.exports = Comment;