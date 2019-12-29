// https://www.youtube.com/watch?time_continue=17&v=LOeioOKUKI8
//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var http = require('http');
var spawn = require('child_process').spawn;
var backend = require('git-http-backend');
var zlib = require('zlib');


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

app.use(express.json());

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




app.get('/', (req,res)=>{
console.log("Mpike edw -> /");
	// GitRequest(req,res);
	res.render("index");
});

function UserAuthenticate(username, password){
	// firebaseAuth.createUserWithEmailAndPassword(username,password);
	var ref = database.ref('user');
	ref.on('value',success,error);
	return true;
}
function success(data){
	console.log(data.val());
}
function error(err){
	console.log(err);
}
// app.get('/:user/:repo', GitRequest);
app.get('/login/:username/:password', (req,res) =>{
	var username = req.params.username;
	var password = req.params.password;
	var auth = UserAuthenticate(username,password);
	if (auth === true){//Correct User credentials
		//Login User and save give him a cookie!
		//UserLogin(username, password);
	}else{
		//
	}
	res.send('username:'+req.params.username+' password:'+req.params.password);
});



app.get('/explore', (req,res) => {
	res.render('index');
	// res.send('HelloWorld');
});

app.get('/viewProject', (req,res) => {
	res.render('viewProject');
	// res.send('HelloWorld');
});



app.get('/upload', (req,res) => {
	res.render('upload');
	// res.send('HelloWorld');
});


app.get('/profile', (req,res) => {
	console.log("Profile requested");
	res.render('profile');
	// res.send('HelloWorld');
});


app.get('/projects', (req,res) => {
	res.render('projects');
	// res.send('HelloWorld');
});


app.get('/guide', (req,res) => {
	res.render('guide');
	// res.send('HelloWorld');
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