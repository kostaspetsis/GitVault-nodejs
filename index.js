// https://www.youtube.com/watch?time_continue=17&v=LOeioOKUKI8
//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// Restrict write access to only me 
// https://stackoverflow.com/questions/39133918/restricting-firebase-read-write-access-to-only-myself
// https://firebase.google.com/docs/auth/web/password-auth
var http = require('http');
var spawn = require('child_process').spawn;
var backend = require('git-http-backend');
var zlib = require('zlib');
var bodyParser = require('body-parser')
var exec = require('child_process').execSync;

const express=require('express');
const auth = require('./auth');
const app = express();


//Authenticate-Login
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

//Database
const firebase = require('firebase');
var firebaseApp = firebase.initializeApp({
	apiKey: "AIzaSyDrjgnOgtKmQ1XfmW8RjmnSxda1685-Yik",
	authDomain: "gitvaultdb.firebaseapp.com",
	databaseURL: "https://gitvaultdb.firebaseio.com",
	projectId: "gitvaultdb",
	storageBucket: "gitvaultdb.appspot.com",
	messagingSenderId: "1085601843051"
});
const firebaseAuth = firebaseApp.auth();
// Get a reference to the database service
var database = firebaseApp.database();
// var globalUsernames=[];
const UserData = require('./UserData.js');
const Users = require('./Users.js');

//DB sync
var ProjectData = require('./ProjectData.js');
var Projects = require('./Projects.js');
var Comment = require('./Comment.js');
var DbUsers = null;
var DbProjects = null;

//UploadFile
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var admzip = require('adm-zip');
// var unzip = require('unzip');

var UploadPinName = 'file';
var FolderToSaveBares = '/home/kostas/Documents/repos/bares/';
var FolderToSaveNonBares = '/home/kostas/Documents/repos/non-bares/';
var FolderToSaveZips = '/home/kostas/Documents/repos/zips/';
var FolderToSaveVideos='/home/kostas/Documents/repos/videos/';
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FolderToSaveZips)
  },
  filename: function (req, file, cb) {
//    cb(null, file.fieldname + '-' + Date.now())
    cb(null, file.originalname)// + '-' + Date.now())
  }
});
 
var upload = multer({ storage: storage });

// function CreateNewProject(title,project_path,video_path,from_user){
// 	var projId = DbProjects.length+1;
// 	var Project = new ProjectData({
// 		title:title,
// 		project_path:project_path,
// 		video_path:video_path,
// 		from_user:from_user,
// 		id:projId,
// 		likes:0,
// 		dislikes:0,
// 		comments:[]
// 	});
// 	// DbProjects.push(Project);
// 	return Project;
// }

// function FillProjectData(id, likes,dislikes,comments){
// 	for (let i = 0; i < DbProjects.length; i++) {
// 		const element = DbProjects[i];
// 		var Project = element;
// 		if( Project.id === id){
// 			Project.likes = likes;
// 			Project.dislikes = dislikes;
// 			Project.comments = comments;
// 			break;
// 		}
// 	}
// }


// Add this line below
app.use(bodyParser.urlencoded({ extended: false })) 

app.use(bodyParser.json());
const DAYS2 = 1000 * 60 * 60 * 24 * 2;
const SESS_NAME='sid';
const SESS_LIFETIME = DAYS2;
const SESS_SECRET = 'ssid/quiet!authSecr3t'
app.use(session({
	name:SESS_NAME,
	resave:true,
	saveUninitialized:false,//Useful for implementing login
	secret:SESS_SECRET,
	cookie:{
		maxAge:SESS_LIFETIME
	},
	
}));

// app.use(express.json());

app.set('views', './views')
app.set('view engine', 'pug');
var path = require ('path');
var joinedPath = path.join(__dirname + '/public');
console.log(joinedPath);
app.use(express.static(joinedPath,{
//app.use(express.static(__dirname+"../public",{
	index:false,
	immutable:true,
	cacheControl:true,
	maxAge:"30d"
}));

function GitRequest(req,res){
	http.receivepack=false;
	// BasicAuth(req,res);
	if (BasicAuth(req,res)){
                console.log("Authenticated");
        
        }else{
                console.log("Not authenticated");
        }
}

function ConnectToDatabase(){
	DbUsers = new Users();
	DbProjects = new Projects();
	var refUser = database.ref('user');
	refUser.on("value",(data)=>{
		var users = data.val();
		var keys = Object.keys(users);
		// globalUsernames = [];
		
		DbUsers.Reset();
		for(var i = 0; i < keys.length; i++){
			var username = users[keys[i]].username;
			console.log(keys[i],username);
			var proj_idsKeys=[];
			if(users[keys[i]] !== null && users[keys[i]] !== undefined && users[keys[i]].project_ids !== null && users[keys[i]].project_ids !== undefined){
				console.log(users[keys[i].project_ids]);
				proj_idsKeys = Object.keys(users[keys[i]].project_ids);
				var proj_idsArray = [];
				for (let j = 0; j < proj_idsKeys.length; j++) {
					const element = proj_idsKeys[j];
					proj_idsArray.push(users[keys[i]].project_ids[proj_idsKeys[j]]);
				}
				var user = new UserData(
					users[keys[i]].database_path,
					users[keys[i]].username,
					users[keys[i]].password,
					users[keys[i]].email,
					users[keys[i]].id,
					proj_idsArray);
				// // Update Users in my database
				
				DbUsers.AddUser(user);
			}
			
			
		}
	},(error)=>{
		console.log("[ConnectToDatabase]:"+error);
	});
	var refProjects = database.ref("projects");
	refProjects.on("value", (data) => {
		var projects = data.val();
		var keys = Object.keys(projects);
		DbProjects.Reset();
		for(var i = 0; i < keys.length; i++){
			var title = projects[keys[i]].title;
			var project_path = projects[keys[i]].project_path;
			var video_path = projects[keys[i]].video_path;
			var id = projects[keys[i]].id;
			var from_user = projects[keys[i]].from_user;
			var likes = projects[keys[i]].likes;
			var dislikes = projects[keys[i]].dislikes;
			var database_path = projects[keys[i]].database_path;
			var commentsKeys = Object.keys(projects[keys[i]].comments);
			var comments = [];
			for(var ci = 0; ci < commentsKeys.length; ci++){
				var comment = new Comment(
					projects[keys[i]].comments[commentsKeys[ci]]["Text"],
					projects[keys[i]].comments[commentsKeys[ci]]["date"],
					projects[keys[i]].comments[commentsKeys[ci]]["from_user"],
					projects[keys[i]].comments[commentsKeys[ci]]["time"]
				);
				comments.push(comment);
			}
			var projectData = new ProjectData(
				title,
				project_path,
				video_path,
				id,
				from_user,
				likes,
				dislikes,
				comments,
				database_path
			);
			DbProjects.AddProject(projectData);
		}
	},(error)=>{
		console.log("[ConnectToDatabase-Projects]:"+error);
	});
	// var comment = new Comment(
	// 	"This is a comment",
	// 	"2 October 2019",
	// 	"username1",
	// 	"09:09"
	// );
	// var projectReference = database.ref('projects').push({
	// 	title:"TestProject2",
	// 	project_path:"/home/server/repos/bares/",
	// 	video_path:"/home/server/videos/",
	// 	id:1,
	// 	from_user:"kappa",
	// 	likes:3,
	// 	dislikes:2,
	// 	// comments:{Text:"none",date:"none",from_user:"none",time:"none"}
	// });
	// if(projectReference){
	// 	console.log("There is a reference");
	// 	console.log(projectReference);
	// 	database.ref('projects/'+projectReference['path']['pieces_'][1] + "/comments").push({
	// 			Text:comment.Text,
	// 			date:comment.date,
	// 			from_user:comment.from_user,
	// 			time:comment.time,
	// 		});
	// }
}

const redirectLogin = (req, res, next) => {
	if( !req.session.userId){
		res.redirect('explore');
	}else{
		next();
	}
}

function isUserAuthorized(req){
	return (req.session.userId)?true:false;
	// return req.session.userId;
}

app.get('/', (req,res)=>{
console.log("Mpike edw -> /");
	// GitRequest(req,res);
	res.redirect('explore');
	DbProjects.Serialize();
    // res.render('index', {authorized:isUserAuthorized(req)});
	// res.render('index', {authorized:true});
});

// app.get('/:user/:repo', GitRequest);
app.get('/login/:username/:password', (req,res) =>{
	// var username = req.params.username;
	// var password = req.params.password;

	const {username}=req.body;
	console.log("USERNAME:"+username);
	// res.send('username:'+req.params.username+' password:'+req.params.password);
});

app.post('/login1',(req,res)=>{
	const {loginUsername, loginPassword} = req.body;

	console.log(loginUsername,loginPassword);
	var user = DbUsers.GetUserByUsername(loginUsername);
	if( user !== -1){
		var userpassword = user.password;
		if(userpassword === loginPassword){
			console.log("Successfull login of "+ loginUsername);
			var id = user.id;
			req.session.userId = id;
			console.log("req.session.userId = " + req.session.userId);
		}
	}
	
	// res.send("<h1>"+loginUsername+","+loginPassword+"</h1>");
	res.redirect('/');
});

app.post('/register1', (req,res) => {
	const {registerUsername, registerPassword, registerEmail} = req.body;
	var id = DbUsers.data.length + 1;
	var user = new UserData(
		registerUsername,
		registerPassword,
		registerEmail,
		id,
		[-1]
	);
	var newref = database.ref('user').push({
		database_path:"-1",
		username:user.username,
		email:user.email,
		password:user.password,
		id:user.id,
		project_ids:user.project_ids
	});

	//Update database_path
	var database_path = newref['path']['pieces_'][1];
	newref.update({
		database_path:database_path,
	});

	res.redirect('/explore');
});
// app.get('/login1',(req,res)=>{
	
// 	res.send('<h1>Haha</h1');
// });

app.get('/register/:username/:password/:email', (req,res) =>{
	var username = req.params.username;
	var password = req.params.password;
	var email = req.params.email;
	var id = DbUsers.data.length + 1;
	var user = new UserData(
		username,
		password,
		email,
		id,
		[-1]
	);
	database.ref('user').push({
		username:user.username,
		email:user.email,
		password:user.password,
		id:user.id,
		project_ids:user.project_ids
	});
	// DbUsers.AddUser(user);
	res.send('username:'+req.params.username+' password:'+req.params.password+", email:"+email+", project_ids:"+user.project_ids);
});



app.get('/explore', (req,res) => {
	console.log(req.session.userId);
    res.render('index', {UserId:req.session.userId,authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
});

app.post('/post_comment_id=:ProjectId', redirectLogin, (req,res) => {
	var ProjectId = req.params.ProjectId;
	var project = DbProjects.GetProjectById(ProjectId);
	const {commentText} = req.body;
	var dateInfo = new Date();
	var commentDate = dateInfo.toISOString().slice(0,10);
	var commentTime = dateInfo.toISOString().slice(11,16);
	if(project != -1) {

		database.ref('projects/'+project.database_path+'/comments').push({
			Text : commentText,
			date : commentDate,
			from_user : DbUsers.GetUserById(req.session.userId).username,
			time : commentTime
		});
	}

	res.redirect('/viewProject_id='+ProjectId);
});
// How can i clone this project to my personal computer?What is the terminal command?
app.get('/post_comment_id=:ProjectId', redirectLogin, (req,res) => {
	res.redirect('/viewProject_id='+ProjectId);
});

app.get('/viewProject_id=:id', redirectLogin, (req,res) => {
	var ProjectTitle = "undefined";
	console.log("id of viewProject["+req.params.id+"]");
	var Likes = "undefined";
	var Dislikes = "undefined";
	var Comments = [];
	var id = req.params.id;
	var project = DbProjects.GetProjectById(id);
	console.log("project id = "+id);
	var CurrentPath = req.params.CurrentPath;
	
	var Structure = [];
	var directoryPath;// = FolderToSaveNonBares + project.title.substring(0,project.title.indexOf('.')) + CurrentPath;
	var CurrPath;//=project.title.substring(0,project.title.indexOf('.'));
	if(project !== -1){
		ProjectTitle = project.title;
		Likes = project.likes;
		Dislikes = project.dislikes;
		for(var i = 0; i < project.comments.length; i++){
			const element = project.comments[i];
			var Comment = {};
			Comment["Text"] = element.Text;
			Comment["date"] = element.date;
			Comment["from_user"] = element.from_user;
			Comment["time"] = element.time;
			Comments.push(Comment);
			
			var CurrPath=project.title.substring(0,project.title.indexOf('.'));
			if (CurrentPath == "" || CurrentPath == undefined){
				CurrentPath = CurrPath;
			}
			// console.log(ProjectTitle,Likes,Dislikes);
			var directoryPath = FolderToSaveNonBares + project.title.substring(0,project.title.indexOf('.'));

			
			fs.readdirSync(directoryPath, function (err, files) {
				var fileNames = "Filenames are =";
		
				//handling error
				if (err) {
					return console.log('Unable to scan directory: ' + err);
				}
				var i = 0; 
				//listing all files using forEach
				files.forEach(function (file) {
					// Do whatever you want to do with the file
					console.log(file); 
					var itemLinkToPath = "undefind";
					var itemTitle = file;
					var itemType = "undefind";
					fileNames += file + "\n";
					var stat = fs.statSync(directoryPath+"/"+file);
					if (stat && stat.isDirectory()) { 
						itemType = "folder";
						console.log('folder');
					}else{
						itemType = "file";
						console.log('file');
					}
					// if(i != 0){
					// 	Structure[i-1]["itemLinkToPath"] = itemTitle;
					// }
					var block = {};
					block["itemLinkToPath"] = itemLinkToPath;
					block["itemTitle"]=itemTitle;
					block["itemType"]=itemType;
					Structure.push(block);
					i++;
				});
			});

			Structure = fs.readdirSync(FolderToSaveNonBares + project.title.substring(0,project.title.indexOf('.')));
		}
	}else{
		console.log("No such project with id["+id+"]");
	}
	
	// const getAllFiles = function(dirPath, arrayOfFiles) {
	// 	files = fs.readdirSync(dirPath)
	   
	// 	arrayOfFiles = arrayOfFiles || []
	   
	// 	files.forEach(function(file) {
	// 	  if (fs.statSync(dirPath + "/" + file).isDirectory()) {
	// 		arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
	// 	  } else {
	// 		arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
	// 		// arrayOfFile["itemLink"] = 
	// 		// arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
	// 	  }
	// 	})
	   
	// 	return arrayOfFiles
	//   } 
	//   const result = getAllFiles(FolderToSaveNonBares + project.title.substring(0,project.title.indexOf('.')));

	res.render('viewProject', {UserId:req.session.userId,authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg',
		ProjectId:req.session.userId,
		ProjectTitle:ProjectTitle,
    	Likes:Likes,
		Dislikes:Dislikes,
		Comments:Comments,
		Structure:Structure,
		CurrPath:CurrentPath
	});
	
	// res.send('HelloWorld');
});



app.get('/upload', (req,res) => {
	res.render('upload', {UserId:req.session.userId,authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
	// res.send('HelloWorld');
});

app.post('/uploadfile', upload.single(UploadPinName), (req, res, next) => {
	const file = req.file
	if (!file) {
	  const error = new Error('Please upload a file')
	  error.httpStatusCode = 400
	  return next(error)
	}


	var fileNames = "Filenames are=";
	var zip = new admzip(FolderToSaveZips + file.originalname);
	zip.extractAllTo(FolderToSaveNonBares, true);
	 
	var projNameWithoutDotZip = file.originalname.substring(0,file.originalname.indexOf('.'));
	//joining path of directory
	// var directoryPath = path.join(__dirname, FolderToSaveNonBares+projNameWithoutDotZip);
	// console.log(directoryPath);

	
	// exec('mkdir '+FolderToSaveBares+projNameWithoutDotZip+'.git', (error, stdout, stderr) => {
	// 	console.log('Made a folder at ' + FolderToSaveBares+projNameWithoutDotZip+'.git');
	// });
	// exec('git init --bare '+FolderToSaveBares+projNameWithoutDotZip+'.git', (error, stdout, stderr) => {
	// 	console.log("Exec'd "+'git init --bare '+FolderToSaveBares+projNameWithoutDotZip);
	// });
	// exec('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' add -A', (error, stdout, stderr) => {
	// 	console.log("Exec'd "+'git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' add -A');
	// });
	// exec('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' commit -m '+'"initial commit"', (error, stdout, stderr) => {
	// 	console.log('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' commit -m '+'"initial commit"');
	// });
	// // exec('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' remote add '+FolderToSaveBares+projNameWithoutDotZip+'.git' + ' master', (error, stdout, stderr) => {
	// // 	console.log('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' remote add '+FolderToSaveBares+projNameWithoutDotZip+'.git' + ' master');
	// // });
	// exec('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' push ' + FolderToSaveBares+projNameWithoutDotZip+'.git' + ' master', (error, stdout, stderr) => {
	// 	console.log('git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +' push ' + FolderToSaveBares+projNameWithoutDotZip+'.git' + ' master');
	// });


	// exec('mkdir '+FolderToSaveBares+projNameWithoutDotZip+'.git;'+
	// 'git -C '+ FolderToSaveBares+projNameWithoutDotZip+'.git/'+' init --bare;'+
	// 'git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +'/'+' add *;'+
	// 'git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +'/'+' commit -m '+'"initial commit";'+
	// 'git -C '+ FolderToSaveNonBares+projNameWithoutDotZip +'/'+' push ' + FolderToSaveBares+projNameWithoutDotZip+'.git' + ' master' , (error,stdout,stderr) => {});
	
	// exec('mkdir '+FolderToSaveBares+projNameWithoutDotZip+'.git;'+
	// 'cd '+FolderToSaveBares+projNameWithoutDotZip+'.git;'+'git init --bare;cd ../../;'+
	// 'cd non-bares/'+ projNameWithoutDotZip+';'+'git init;git add *;'+
	// 'git commit -m '+'"initial commit";'+
	// 'git push ../../bares/' + projNameWithoutDotZip+'.git' + ' master' , (error,stdout,stderr) => {});
	console.log("git -C "+FolderToSaveNonBares + projNameWithoutDotZip+"/" + " init;");
	var Commands = "mkdir "+FolderToSaveBares + projNameWithoutDotZip +".git;"+
				   "git -C "+FolderToSaveBares+ projNameWithoutDotZip +".git init --bare;"+
				   "git -C "+FolderToSaveNonBares + projNameWithoutDotZip+"/" + " init;";
				//    "git -C /home/kostas/Documents/repos/non-bares/" + projNameWithoutDotZip+"/" + " add *;"+ 
				//    "git -C /home/kostas/Documents/repos/non-bares/" + projNameWithoutDotZip+"/" + " commit -m 'initial commit';"+
				//    "git -C /home/kostas/Documents/repos/non-bares/" + projNameWithoutDotZip+"/" + " push " + "/home/kostas/Documents/repos/bares/" + projNameWithoutDotZip + ".git master;";
	
	exec(Commands, (error,stdout,stderr)=>{});


	console.log(exec("git -C "+FolderToSaveNonBares+projNameWithoutDotZip +"/ add .;").toString());
	console.log(exec("git -C "+FolderToSaveNonBares+projNameWithoutDotZip +"/ commit -m 'initiali commit';").toString());
	console.log(exec("git -C "+FolderToSaveNonBares+projNameWithoutDotZip +"/ push "+ FolderToSaveBares + projNameWithoutDotZip + ".git master;").toString());
	//   //passsing directoryPath and callback function
	//   fs.readdir(directoryPath, function (err, files) {
	// 	  var fileNames = "Filenames are =";
	  
	// 	  //handling error
	// 	  if (err) {
	// 		  return console.log('Unable to scan directory: ' + err);
	// 	  } 
	// 	  //listing all files using forEach
	// 	  files.forEach(function (file) {
	// 		  // Do whatever you want to do with the file
	// 		  console.log(file); 
	// 		  fileNames += file + "\n";
	// 	  });
	// 	//   res.send("<h1>"+fileNames+"</h1");
	//   });

	// Push new project to database
	var user = DbUsers.GetUserById(req.session.userId);
	var uname = DbUsers.GetUserById(req.session.userId).username;
	console.log(uname);
	console.log(DbProjects.data.length);
	var dateInfo = new Date();
	var commentDate = dateInfo.toISOString().slice(0,10);
	var commentTime = dateInfo.toISOString().slice(11,16);

	var newProjectId = DbProjects.data.length+1;
	var ref = database.ref('projects').push({
		comments:-1,
		database_path:"ok",
		dislikes:0,
		likes:0,
		from_user:uname,
		id:newProjectId,
		project_path:FolderToSaveBares,
		title:projNameWithoutDotZip+".git",
		video_path:FolderToSaveVideos
	});
	// console.log(ref);

	//Update database_path to project = the newly created
	var database_path = ref['path']['pieces_'][1];
	ref.update({
		database_path:database_path,
	});

	//Make a first comment by us(to have something in comments)
	database.ref("projects/" + database_path +"/comments").push({
		Text:"Initiali Commit",
		date:commentDate,
		from_user:uname,
		time:commentTime
	});

	//Update our user in firebase so that he has the newly created project id in his project_ids
	var newProject_ids = user.project_ids;
	newProject_ids.push(newProjectId);
	database.ref('user/'+user.database_path).update({
		project_ids:newProject_ids
	});

	res.render('upload', {UserId:req.session.userId,authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
});
  


app.get('/profile', redirectLogin, (req,res) => {
	console.log("Profile requested");
	var username = "undefined-username";
	var password = "undefined-password";
	var email = "undefined-emai";
	var user = DbUsers.GetUserById(req.session.userId);
	if(user !== -1){
		username = user.username;
		password = user.password;
		email = user.email;
	}
	res.render('profile', {UserId:req.session.userId,authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg', username:username, password:password, email:email});
	// res.send('HelloWorld');
});


app.get('/projects_id=:id', (req,res) => {
	var userId = req.params.id;
	console.log("userId="+userId);
	var user = DbUsers.GetUserById(userId);
	var UserProjects = [];
	if( user !== -1){//Valid user
		var project_ids = user.project_ids;//Get project ids of the user
		for (let i = 0; i < project_ids.length; i++) {
			const proj_id = project_ids[i];
			if (proj_id == -1){
				break;
			}
			var project = DbProjects.GetProjectById(proj_id);
			if( project != -1){//Valid project
				var UserProject = {};
				UserProject["ProjectTitle"] = project.title;
				UserProject["ProjectDescription"] = "TODO-ProjectDescription";
				UserProject["ProjectReadme"] = "TODO-ProjectReadme";
				UserProject["ProjectGif"] = project.video_path;
				UserProject["ProjectId"] = project.id;
				UserProjects.push(UserProject);
			}
		}
	}else{
		console.log("No user with id "+userId);
	}
	// var Projects = [];
	
	// for (let i = 0; i < 4; i++) {
	// 	var Project = {};
	// 	Project["ProjectTitle"] = "Title" + i;
	// 	Project["ProjectDescription"] = "Description" + i;
	// 	Project["ProjectReadme"] = "Readme" + i;
	// 	Project["ProjectGif"] = "gifs/newgif.gif";
	// 	Projects.push(Project);
	// }
	
	res.render('projects', {
		UserId:userId,
		authorized:isUserAuthorized(req),
		ProfilePicture:'Profile1.jpeg',
		ProjectGif:"gifs/newgif.gif",
		ProjectTitle:"Project Title",
		ProjectDescription:"Project Description",
		ProjectReadme:"Project Readme",
		Projects:UserProjects
	});
	// res.send('HelloWorld');
});


app.get('/guide', (req,res) => {
	res.render('guide', {UserId:req.session.userId,authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
	// res.send('HelloWorld');
});

app.post('/logout', (req,res) => {
	req.session.destroy(err => {
		if (err){
			return res.redirect('/explore');
		}
		res.clearCookie(SESS_NAME);
		res.redirect('/');
	});
});
//exports.app = functions.https.onRequest(app);
/*const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});*/


//website server
var WebServer = http.createServer(app);
//Git server
var GitServer = http.createServer(GitRequest);

WebServer.listen(5000);
GitServer.listen(8080);

ConnectToDatabase();



function BasicAuth(req,res){
	var authenticated = false;
	// console.log(req);   // debug dump the request

	// If they pass in a basic auth credential it'll be in a header called "Authorization" (note NodeJS lowercases the names of headers in its request object)

	var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
	console.log("Authorization Header is: ", auth);

	if(auth === undefined || auth === null) {     // No Authorization header was passed in so it's the first time the browser hit us

		// Sending a 401 will require authentication, we need to send the 'WWW-Authenticate' to tell them the sort of authentication to use
		// Basic auth is quite literally the easiest and least secure, it simply gives back  base64( username + ":" + password ) from the browser
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
		console.log("Need some creds son");
		res.end('<html><body>Need some creds son</body></html>');
	}

	else if(auth) {    // The Authorization was passed in so now we validate it

		var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part

		var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
		var plain_auth = buf.toString();        // read it back out as a string

		console.log("Decoded Authorization ", plain_auth);

		// At this point plain_auth = "username:password"

		var creds = plain_auth.split(':');      // split on a ':'
		var username = creds[0];
		var password = creds[1];
		
		var user = DbUsers.GetUserByUsername(username);
		if (user != -1){
			console.log("User with username:"+username+" exists.Checking for password...");
			if(user.password == password){
				console.log("User Authenticated.Proceeding to git commands[push,pull]");
	
				res.statusCode = 200;  // OK
				var b = backend(req.url, function (err, service) {
					if (err) return res.end(err + '\n');
					// res.setHeader("WWW-Authenticate", 'Basic realm="authorization needed"');
							
					res.setHeader('content-type', service.type);
						
					console.log("action:"+service.action, "repo:"+repo, "fields:"+service.fields);
					console.log("cmd:"+service.cmd,"args:"+service.args,"action:"+service.action,"fields:"+service.fields,"type:"+service.type);
					
					var repoName = repo.substring(0,repo.indexOf('.'));
					console.log("repoName:"+repoName);
					if(service.action == "push"){
						console.log("[push] command detected!");
						console.log(req.protocol+'://' + req.hostname + req.originalUrl);
						//console.log("git -C "+FolderToSaveNonBares+repoName +"/ pull " + FolderToSaveBares+repo +";\n");
						// exec("git -C "+FolderToSaveNonBares+repoName +"/ pull " + FolderToSaveBares+repo +";\n");
						
						//TODO
						// check if project id belongs to user
						console.log(exec("rm -rf "+FolderToSaveNonBares+repoName+";\n").toString());
						console.log(exec("git -C "+FolderToSaveNonBares+" clone " + FolderToSaveBares+repo +";\n").toString());
					}
					if(service.action == "pull"){
						console.log("[pull-(clone)] command detected!");
					}
					if(service.action == "remote"){
						console.log("[push] command detected!");
					}
					var ps = spawn(service.cmd, service.args.concat(dir));
					ps.stdout.pipe(service.createStream()).pipe(ps.stdin);
					});
			
				// req.pipe(b).pipe(res);
				// var sb = b.createBand();
				var repo = req.url.split('/')[1];
				var dir = path.join('', FolderToSaveBares, repo);
				var reqStream = req.headers['content-encoding'] == 'gzip' ? req.pipe(zlib.createGunzip()) : req;
				// sb.write("dsds");
				console.log("Enwmenoi");
				console.log(req.protocol+'://' + req.hostname + req.originalUrl);
			
				reqStream.pipe(b).pipe(res);
				authenticated=true;
			}else{
				console.log("Wrong password");
				res.statusCode = 401; // Force them to retry authentication
				res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

				// res.statusCode = 403;   // or alternatively just reject them altogether with a 403 Forbidden

				res.end('<html><body>Wrong password</body></html>');
				authenticated = false;
			}
		}
		else {
					console.log("Wrong credentials bro");
			res.statusCode = 401; // Force them to retry authentication
			res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

			// res.statusCode = 403;   // or alternatively just reject them altogether with a 403 Forbidden

			res.end('<html><body>You shall not pass</body></html>');
			authenticated = false;
		}
	}
	return authenticated;
}

// var server = http.createServer(BasicAuth);


// server.listen(2000, function() { console.log("Server Listening on http://localhost:2000/"); });









// const Server = require('node-git-server');
// function next1(){
//         console.log("Next");
// }
// const repos = new Server(path.resolve(__dirname, 'tmp'), {
//     autoCreate: true,
//     authenticate: (type, repo, user, next1) => {
//       if(type == 'push') {
//         user((username, password) => {
//           console.log(username, password);
//         //   next1();
//         });
//       } else {
//         // next1();
//       }
//     }
// });

// const repos = new Server(path.resolve(__dirname, 'tmp'), {
//     autoCreate: true
// //     authenticate :(type,repo,user,next)=>{
// //             if(type=='push'){
// //                     console.log('push push push');
// //             }
// //     }
// });
// const port = process.env.PORT || 7005;

// repos.on('push', (push) => {
//     console.log(`push ${push.repo}/${push.commit} (${push.branch})`);
// 	// app.use(auth);
//         BasicAuth(req,res);
// push.accept();
// });

// repos.on('fetch', (fetch) => {
//     console.log(`fetch ${fetch.commit}`);
//     fetch.accept();
// });

// repos.listen(port, () => {
//     console.log(`node-git-server running at http://localhost:${port}`)
// });


// // res.setHeader("WWW-Authenticate", 'Basic realm="authorization needed"');