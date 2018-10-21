 var uploader = document.getElementById('upload');
// var upload = new fileUpload(uploader);

uploader.addEventListener('change', function(){
	// 检查是否支持FileReader对象
　　if (typeof FileReader != 'undefined') {
　　　　var acceptedTypes = {
　　　　　　'image/png': true,
　　　　　　'image/jpeg': true,
　　　　　　'image/gif': true
　　　　};
　　　　if (acceptedTypes[uploader.files[0].type] === true) {
　　　　　　var reader = new FileReader();
　　　　　　reader.onload = function (event) {
　　　　　　　　var image = new Image();
　　　　　　　　image.src = event.target.result;
　　　　　　　　image.width = 100;
　　　　　　　　document.body.appendChild(image);
　　　　　　};
　　　　reader.readAsDataURL(uploader.files[0]);
　　　　}
　　}
})

	
