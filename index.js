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

const express=require('express');
const auth = require('./auth');
const app = express();


//Authenticate-Login
const session = require('express-session');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
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


function CreateNewProject(title,project_path,video_path,from_user){
	var projId = DbProjects.length+1;
	var Project = new ProjectData({
		title:title,
		project_path:project_path,
		video_path:video_path,
		from_user:from_user,
		id:projId,
		likes:0,
		dislikes:0,
		comments:[]
	});
	// DbProjects.push(Project);
	return Project;
}

function FillProjectData(id, likes,dislikes,comments){
	for (let i = 0; i < DbProjects.length; i++) {
		const element = DbProjects[i];
		var Project = element;
		if( Project.id === id){
			Project.likes = likes;
			Project.dislikes = dislikes;
			Project.comments = comments;
			break;
		}
	}
}


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
				comments
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
	database.ref('user').push({
		username:user.username,
		email:user.email,
		password:user.password,
		id:user.id,
		project_ids:user.project_ids
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
    res.render('index', {authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
});

app.get('/viewProject', redirectLogin, (req,res) => {
	var ProjectTitle = "undefined";
	// var Likes = "undefined";
	// var Dislikes = "undefined";
	// var id = 1;
	// var project = DbProjects.GetProjectById(id);
	// console.log("project id = "+id);
	// if(project !== -1){
	// 	ProjectTitle = project.title;
	// 	Likes = project.likes;
	// 	Dislikes = project.dislikes;
	// }
	// console.log(ProjectTitle,Likes,Dislikes);
	res.render('viewProject', {authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg',
		ProjectTitle:ProjectTitle,
    	// Likes:Likes,
    	// Dislikes:Dislikes
	});
	// res.send('HelloWorld');
});



app.get('/upload', redirectLogin, (req,res) => {
	res.render('upload', {authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
	// res.send('HelloWorld');
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
	res.render('profile', {authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg', username:username, password:password, email:email});
	// res.send('HelloWorld');
});


app.get('/projects', redirectLogin, (req,res) => {
	var Projects = [];
	var id = 1;
	for (let i = 0; i < 4; i++) {
		var Project = {};
		Project["ProjectTitle"] = "Title" + i;
		Project["ProjectDescription"] = "Description" + i;
		Project["ProjectReadme"] = "Readme" + i;
		Project["ProjectGif"] = "gifs/newgif.gif";
		Projects.push(Project);
	}
	
	res.render('projects', {
		authorized:isUserAuthorized(req),
		ProjectId:id,
		ProfilePicture:'Profile1.jpeg',
		ProjectGif:"gifs/newgif.gif",
		ProjectTitle:"Project Title",
		ProjectDescription:"Project Description",
		ProjectReadme:"Project Readme",
		Projects:Projects
	});
	// res.send('HelloWorld');
});


app.get('/guide', (req,res) => {
	res.render('guide', {authorized:isUserAuthorized(req), ProfilePicture:'Profile1.jpeg'});
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

// process.EventEmitter = require('events');
// // https://www.npmjs.com/package/node-git-server
// var GitServer = require('git-server');
// var newUser = {
// 	username:'demo',
// 	password:'demo'
// }
// var newRepo = {
// 	name:'falafel.git',
// 	anonRead:false,
// 	users: [
// 		{ user:newUser, permissions:['R','W'] }
// 	]
// }
// server = new GitServer({repos: [ newRepo ]});
// server.on('commit', function(update, repo) {
// 	// do some logging or other stuff
// 	update.accept() //accept the update.
// });
// server.on('post-receive', function(update, repo) {
// 	console.log("Push from git-server npm module");
// 	console.log(update,repo);
// // update.accept();
// });
////// runs on 7000


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

		if((username == 'hack') && (password == 'thegibson')) {   // Is the username/password correct?

			res.statusCode = 200;  // OK
			var b = backend(req.url, function (err, service) {
				if (err) return res.end(err + '\n');
				// res.setHeader("WWW-Authenticate", 'Basic realm="authorization needed"');
						
				res.setHeader('content-type', service.type);
					
				console.log(service.action, repo, service.fields);
				console.log(service.cmd,service.args,service.action,service.fields,service.type);
				
		
		
				if(service.action == "push"){
					console.log("[push] command detected!");
					console.log(req.protocol+'://' + req.hostname + req.originalUrl);
					
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
			var dir = path.join(__dirname, 'repos', repo);
			var reqStream = req.headers['content-encoding'] == 'gzip' ? req.pipe(zlib.createGunzip()) : req;
			// sb.write("dsds");
			console.log("Enwmenoi");
			console.log(req.protocol+'://' + req.hostname + req.originalUrl);
		
			reqStream.pipe(b).pipe(res);
			authenticated=true;
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