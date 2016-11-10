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

router.get('/post5', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/post5.html'));
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


router.post('/postdata4', function(req, res, next) {
	postFormData(req,res,true);
});

router.post('/post3_4_5', function(req, res, next) {
  postFormData(req,res);
});

function postFormData(req, res, isPost4) {
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
		if(isPost4){
			res.sendFile(path.join(__dirname, '../public/upload_succ.html'));
			return;
		}
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
