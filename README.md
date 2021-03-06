## XMLHttpRequest demo
- GET api, check response type
- POST api, "Content-Type": "application/x-www-form-urlencoded", "application/json", "multipart/form-data"
  
### start server
```shell
cd xmlhttprequest-demo
npm install
node ./bin/www
```
### backEnd controller
```javascript

//xhr.js
var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs     = require('fs');
var router = express.Router();

/* two get pages */

router.get('/get1', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/get1.html'));
});

router.get('/get2', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/get2.html'));
});

/* four post pages */
router.get('/post1', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/post1.html'));
});

router.get('/post2', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/post2.html'));
});

router.get('/post3', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/post3.html'));
});

router.get('/post4', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/post4.html'));
});

/* two get method response function */

router.get('/getdata',function(req,res,next){
  res.set("Content-Type","text/plain");
  res.send("get data");
});



/* four post method response function */
router.post('/post1_2', function(req, res, next) {
  console.log(req.body);
  res.set("Content-Type","text/plain");
  res.send("post data");
});

router.post('/post3_4', function(req, res, next) {
  postFormData(req,res);
  // res.set("Content-Type","text/plain");
  // res.send("got it!");
});

function postFormData(req, res) {
	if (!isFormData(req)) {
		//res.statusCode = 400;
		res.sendStatus(400); //Bad Request!
		res.send('Bad Request');
		return;
	}

	var form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname, '../public/images/');

	form.on('field', function(field,value) {
		console.log(field);
		console.log(value);
	});

	form.on('file', function(name, file) {
		console.log(name);
		console.log(file);
		//fs.rename(oldPath, newPath, callback)
		var oldPath = file.path;
		var newPath = form.uploadDir + file.name;
		fs.rename(oldPath,newPath,function(err){
			console.log("rename succ");
		});
	});

	form.on('end', function() {
		res.set("Content-Type","text/plain");
  		res.send("got it!");
	});

	form.parse(req);
}

function isFormData(req) {
	var type = req.headers['content-type'] || '';
	return 0 == type.indexOf('multipart/form-data');
}
module.exports = router;

```

### In backEnd, the module for parsing data
- the body-parser module in Express can provides the following parsers:
	- JSON body parser
	- Raw body parser
	- Text body parser
	- URL-encoded form body parser
- for multipart bodies, the best option is listed as follows:
	- formidable
	- multer


### GET request
- demo1: access http://localhost:3000/xhr/get1
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>send get: check the responseText</p>
	<script>
		function getText(url,cb){
			var r = new XMLHttpRequest();
			r.open("GET",url);
			r.onreadystatechange = function(){
				if(r.readyState === 4 && r.status === 200){
					var type = r.getResponseHeader("Content-Type");
					if(type.match(/^text/)){
						cb(r.responseText);
					}
				}
			};

			r.send(null);
		}

		getText("/xhr/getdata",fn);
		function fn(data){
			console.log("return: " + data);
		}
	</script>
	
</body>
</html>

```
- demo2: access http://localhost:3000/xhr/get2
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>send get: parse response data</p>
	<script>
		function getData(url,cb){
			var r = new XMLHttpRequest();
			r.open("GET",url);
			r.onreadystatechange = function(){
				if(r.readyState === 4 && r.status === 200){
					var type = r.getResponseHeader("Content-Type");
					if(type.indexOf("xml") !== -1 && r.responseXML)
						cb(r.responseXML);
					else if(type === "application/json")
						cb(JSON.parse(r.responseText));
					else
						cb(r.responseText);
				}
			};

			r.send(null);
		}

		getData("/xhr/getdata",fn);
		function fn(data){
			console.log("return : " + data);
		}
	</script>
	
</body>
</html>

```

### POST request
- demo1: access http://localhost:3000/xhr/post1
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>send post: "Content-Type","application/x-www-form-urlencoded" </p>
	<script>

		/* post method 1  */
		/* "Content-Type","application/x-www-form-urlencoded" */

		function encodeFormData(data){
			if(!data)
				return "";
			var pairs = [];
			for(var name in data){
				if(!data.hasOwnProperty(name))
					continue;
				if(typeof data[name] === "function")
					continue;
				var value = data[name].toString();
				name = encodeURIComponent(name.replace("%20","+"));
				value = encodeURIComponent(value.replace("%20","+"));
				pairs.push(name + "=" + value);
			}
			return pairs.join('&');
		}


		function postInfo(url,data,cb){
			var r = new XMLHttpRequest();
			r.open('POST',url,true);

			r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
			r.onreadystatechange = function(){
				if(r.readyState === 4 && r.status === 200 ){
					var type = r.getResponseHeader("Content-Type");
					if(type.match(/^text/))
						cb(r.responseText);
				}
			};
			r.send(encodeFormData(data));
		}

		var data = {name:"hello world"};
		
		postInfo('/xhr/post1_2',data,fn);
		function fn(data){
			console.log("return: "+ data);
		}
	</script>
</body>
</html>

```

- demo2: access http://localhost:3000/xhr/post2
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>send post: Content-Type: multipart/form-data </p>
	<script>

	/* post method 3  */
	/* Content-Type: multipart/form-data */
		function postFormData(url,data,cb){
			if(typeof FormData === "undefined")
				throw new Error("FormData is not implemented");

			var r = new XMLHttpRequest();
			r.open("POST",url);
			r.onreadystatechange = function(){
				if(r.readyState === 4 && r.status == 200){
					cb(r.responseText);
				}				
			};

			var formdata = new FormData();
			var value;
			for(var name in data){
				if(!data.hasOwnProperty(name))
					continue;
				value = data[name];
				if(typeof value === "function")
					continue;

				formdata.append(name,value);
			}
			//r.setRequestHeader("Content-Type","multipart/form-data");//will be added automitically
			r.send(formdata);
		}


		var url ="/xhr/post3_4";
		var data = {name: "hello world!"};
		function fn(text){
			console.log("return: " + text);
		}

		postFormData(url,data,fn);
		
	</script>
</body>
</html>

```

- demo3: access http://localhost:3000/xhr/post3
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>send post: Content-Type: multipart/form-data </p>
	<script>

	/* post method 3  */
	/* Content-Type: multipart/form-data */
		function postFormData(url,data,cb){
			if(typeof FormData === "undefined")
				throw new Error("FormData is not implemented");

			var r = new XMLHttpRequest();
			r.open("POST",url);
			r.onreadystatechange = function(){
				if(r.readyState === 4 && r.status == 200){
					cb(r.responseText);
				}				
			};

			var formdata = new FormData();
			var value;
			for(var name in data){
				if(!data.hasOwnProperty(name))
					continue;
				value = data[name];
				if(typeof value === "function")
					continue;

				formdata.append(name,value);
			}
			//r.setRequestHeader("Content-Type","multipart/form-data");//will be added automitically
			r.send(formdata);
		}


		var url ="/xhr/post3_4";
		var data = {name: "hello world!"};
		function fn(text){
			console.log("return: " + text);
		}

		postFormData(url,data,fn);
		
	</script>
</body>
</html>

```

- demo4: access http://localhost:3000/xhr/post4
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>form input file</p>
	<p>because of the absent of the callback, browser will redict to
		'/xhr/postdata4' and show the responseText to this page
		when responseText get back</p>

	<form method="post" action="/xhr/postdata4" enctype="multipart/form-data">
		<label for="cntname">name: </label>
		<input type="text" name="name" id="cntname" />
		<br />
		<label for="filename">filename: </label>
		<input type="file" name="file" id="filename" />
		<br />
		<input type="submit" value="upload" id="_submit" />
	</form>

</body>
</html>


```


- demo5: access http://localhost:3000/xhr/post5
```html

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<p>form upload file</p>
	<p>add upload progress bar</p>

	<form method="post" action="/xhr/post3_4_5" enctype="multipart/form-data">
		<label for="cntname">name: </label>
		<input type="text" name="name" id="cntname" />
		<br />
		<label for="filename">filename: </label>
		<input type="file" name="file" id="filename" />
		<br />
		<input type="submit" value="upload" id="_submit" />
	</form>

	<div id="_progress"></div>

	<script>
		var _submit = document.getElementById('_submit'),
				_file = document.getElementById('filename'),
				_progress = document.getElementById('_progress');

		var upload = function(e){

			if(e.preventDefault)
				e.preventDefault();
			e.returnValue = false;

			if(e.stopPropagation)
				e.stopPropagation();
			e.cancelBubble = true;

			if(_file.files.length === 0){
				return;
			}

			var data = new FormData();
			data.append('file', _file.files[0]);

			var request = new XMLHttpRequest();
			request.open('POST', '/xhr/post3_4_5');

			request.onreadystatechange = function(){
				if(request.readyState == 4){

					console.log(request.responseText);

				}
			};
			/*
			 request.upload.addEventListener('progress', function(e){
			 _progress.style.width = Math.ceil(e.loaded/e.total * 100) + '%';
			 }, false);
			 */
			request.upload.onprogress = function(e) {
				if (e.lengthComputable) {

					_progress.innerHTML = Math.round(e.loaded/e.total*100) + "% Complete";
				}
			};

			request.upload.onload = function(){
				console.log("upload succ");
			};


			request.send(data);
		};

		_submit.addEventListener('click', upload);
	</script>
</body>
</html>

```

### licence
MIT