require.config({
	paths: {
		"Util": "../common/util"
	}
});

define(['Util'], function(Util) {

	var canvas = document.getElementById("bg");
	var ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	var bg = new Image();
	bg.src = "/img/bg.jpg";

	bg.onload = function() {
		ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
	};
	setTimeout(function() {
		window.location.href = '/';
	}, 3000);

});