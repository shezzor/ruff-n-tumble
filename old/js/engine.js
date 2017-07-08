(function () {
	var d = document, w = window, preloadFiles = 0;

	var gameScreen = d.createElement('canvas'),
		unsupportedBrowser = d.createElement('div');

	gameScreen.id = 'gameScreen';
	gameScreen.width = 640;
	gameScreen.height = 480;

	unsupportedBrowser.innerHTML = '<p>Unfortunately it appears your browser does not support <a href="http://en.wikipedia.org/wiki/HTML5">HTML5</a>.</p><p>Please try one of the following, more standards compliant browsers: <a href="http://www.mozilla.com/firefox/">Firefox</a>, <a href="http://www.google.com/chrome">Chrome</a>, <a href="http://www.opera.com/">Opera</a> or (if you <i>really</i> must) <a href="http://www.apple.com/safari/">Safari</a>.</p>';

	d.getElementById('content').appendChild((gameScreen.getContext) ? gameScreen : unsupportedBrowser);

	var gamectx = gameScreen.getContext('2d');

	/* Load Graphics
	 */

	function createImage (src, w, h) {
		this.image = new Image();
		this.image.src = src;
		this.spriteWidth = w;
		this.spriteHeight = h;

		this.onload = function() {
			preloadFiles++;
		}
	}

	/*function createSound (src) {
		this.sound = new Audio;
	}*/

	// Handle keyboard controls
	var keys = {};

	d.addEventListener("keydown", function (e) {
			keys[e.keyCode] = true;
	}, false);

	d.addEventListener("keyup", function (e) {
		delete keys[e.keyCode];
	}, false);

	// Load Graphic Content
	var imgTiles = new createImage('gfx/tiles01.png', 32, 32),
		imgRuff = new createImage('gfx/ruff.png', 66, 88),
		imgNumbers = new createImage('gfx/numbers.png', 14, 20),
		imgSmlNumbers = new createImage('gfx/smallnumbers.png', 14, 14),
		imgHearts = new createImage('gfx/hearts.png', 32, 28),
		imgWeaponIcons = new createImage('gfx/panelweapons.png', 30, 32),
		imgMeters = new createImage('gfx/hearts.png', 2, 16),
		imgPanel = new createImage('gfx/panel.png', 640, 64),
		imgDust = new createImage('gfx/dust.png', 20, 20),
		imgMiniBullet = new createImage('gfx/bullet.png', 20, 20),
		imgPlyGunFire = new createImage('gfx/fire.png', 42, 42),
		imgCollectables = new createImage('gfx/collectables.png', 32, 32),
		imgDisappear = new createImage('gfx/collectdisappear.png', 30, 30),
		imgDoors = new createImage('gfx/doors.png', 64, 64),
		imgExit = new createImage('gfx/exit.png', 28, 10),
		imgLaser = new createImage('gfx/laser.png', 64, 64),
		imgBulletHit = new createImage('gfx/bullethit.png', 32, 32);

	// World 1 Gradient
	var w1grd = gamectx.createLinearGradient(0, 0, 0, gameScreen.height);
	w1grd.addColorStop(0, '#6058b2');
	w1grd.addColorStop(1, '#1a0d4c');


	/* Set up stuff
	*/
	var game = {
		state: 0,
		fade: 1,
		level: 1
	};

	var guninfo = [
		  3,  0,  1,  2,  3,  0,  1,	// 000 MINIGUN: frame
		 -3, -6,  4, 17, 43, 50, 49,	// 007 x pos
		 73, 51, 23, 41, 23, 59, 73,	// 014 y pos (but x pos for up direction)
		 17, 20, 17,  6, 17, 20, 17,	// 021 width
		 17,  6, 17, 20, 17,  6, 17,	// 028 height
		  0,  0,  0,  0,  0,  0,  0,	// 035 FLAMER: frame
		-15,-18,-11,  2, 31, 40, 39,	// 042 x pos
		 63, 36, 11, 21, 11, 36, 63,	// 049 y pos (but x pos for up direction)
		 40, 40, 40, 40, 40, 40, 40,	// 056 width
		 40, 40, 40, 40, 40, 40, 40,	// 063 height
		  1,  0,  3,  2,  3,  0,  1,	// 070 LASER: frame
		-35,-50,-26, 16, 44, 50, 51,	// x pos
		 74, 50, -7, 38, -7, 50, 74,	// y pos (but x pos for up direction)
		 46, 64, 46, 10, 46, 64, 46,	// width
		 46, 10, 46, 64, 46, 10, 46,	// height
		  3,  0,  1,  2,  3,  0,  1,	// FULLMINI: frame
		 -3, -6,  4, 17, 43, 50, 49,	// x pos
		 73, 51, 23, 41, 23, 59, 73,	// y pos (but x pos for up direction)
		 17, 20, 17,  6, 17, 20, 17,	// width
		 17,  6, 17, 20, 17,  6, 17,	// height
		  0,  1,  2,  3,  4,  5,  6,	// ROCKET: frame
		 -3, -6,  4, 17, 43, 50, 49,	// x pos
		 73, 51, 23, 41, 23, 59, 73,	// y pos (but x pos for up direction)
		 25, 32, 25, 18, 25, 32, 25,	// width
		 25, 18, 25, 32, 25, 18, 25		// height
	];

	var footmap = [
		32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,
		31,31,30,30,29,29,28,28,27,27,26,26,25,25,24,24,23,23,22,22,21,21,20,20,19,19,18,18,17,17,16,16,
		15,15,14,14,13,13,12,12,11,11,10,10, 9, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0,
		 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,10,10,11,11,12,12,13,13,14,14,15,15,
		16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,
		 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
		31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
	];

	var animations = {
		heart: [0,2,3,4,3,2,0]
	};

	var map = {
		height: 23,
		width: 128,
		red: 3,
		green: 3,
		blue: 3,
		startX: 6,
		startY: 16,
		animFrame: 0,
		heartFrame: 0,
		ticker: Date.now(),

		tiledata: [
			[408,511,512,511,512,511,512,511,512,511,544,509,0,0,535,512,511,538,0,0,0,464,469,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,464,469,0,0,0,0,519,520,423,459,550,463,503,504,423,459,550,439,440,441,503,504,438,439,548,549,550,439,548,549,550,551,548,549,550,551,457,439,548,549,503,504,503,504,438,439,440,441,503,504,438,439,457,439,316,317,1,242,241,0,0,0,476,477,400,482,475,470,471,472,512,319,532,511,410,411,406,409,512,511,512,511,318,319,297,298,410,411,406],
			[550,551,457,439,457,439,440,441,503,504,525,0,0,0,0,519,509,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,464,511,512,511,473,465,512,511,410,407,408,409,512,511,410,407,408,409,410,407,408,409,410,407,408,409,410,411,406,407,408,409,512,511,512,511,410,411,408,409,512,511,410,411,406,407,408,409,544,241,0,0,0,0,484,485,412,486,491,405,480,481,519,243,535,504,423,459,462,463,438,439,440,441,312,313,314,315,548,549,462],
			[410,407,406,407,406,407,408,409,544,509,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,521,503,506,0,0,535,504,423,459,462,463,503,504,423,459,550,551,548,549,550,439,548,549,550,551,548,549,460,461,550,551,440,441,503,504,423,459,462,463,438,551,548,549,460,461,462,463,525,0,0,0,0,0,0,0,424,492,487,419,488,489,0,0,0,545,512,511,318,319,410,411,408,409,410,411,406,407,408,409,512],
			[423,421,460,459,460,461,462,463,525,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,524,538,0,0,0,0,524,512,511,512,511,512,511,512,511,410,407,406,409,410,411,408,409,410,407,408,409,541,542,410,407,408,409,512,511,512,511,512,511,410,411,408,409,541,542,473,469,0,0,0,0,0,0,0,0,0,490,493,429,0,0,0,0,0,0,519,506,240,299,423,459,462,463,423,459,460,461,550,518,543],
			[432,433,552,470,471,472,473,469,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,535,504,438,439,457,439,457,439,548,549,550,551,457,516,515,439,548,549,550,551,457,551,548,549,550,551,457,439,440,441,503,504,423,459,462,463,465,506,0,0,0,0,0,0,0,0,0,0,0,482,491,0,0,0,0,0,0,0,0,0,0,524,512,511,473,469,464,465,466,467,468,469,430],
			[403,404,0,405,480,481,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,521,410,411,406,407,406,407,408,409,410,411,406,407,406,407,408,409,410,411,406,407,408,409,410,411,406,407,408,409,544,469,464,465,473,469,0,0,0,0,0,0,0,0,0,0,0,0,331,490,483,6,0,0,0,0,0,0,0,0,0,0,519,506,0,0,0,0,476,477,400,0,401],
			[416,417,418,419,488,489,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,524,423,459,460,461,462,459,420,422,423,421,460,459,460,461,462,463,423,459,460,461,462,463,423,459,460,461,462,463,546,0,0,0,0,0,0,0,0,0,0,0,0,0,0,331,6,2,494,495,496,497,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,484,485,412,413,414],
			[403,427,428,429,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,464,465,466,467,468,506,430,431,432,433,552,470,471,472,473,469,464,465,466,467,468,474,475,470,471,472,473,469,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,304,152,352,499,500,501,502,311,173,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,424,425,426],
			[416,436,437,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,6,2,332,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,476,477,400,0,401,402,403,404,0,405,480,481,0,0,0,0,476,477,400,482,483,405,480,481,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,172,157,158,60,61,58,59,60,61,159,309,173,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,434,435],
			[403,404,0,0,0,0,0,0,0,0,0,0,0,0,0,2,11,6,339,340,341,154,331,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0,2,11,6,339,340,303,11,6,2,6,0,0,0,0,0,0,0,0,0,0,0,484,485,412,413,414,415,416,417,418,419,488,489,0,0,0,0,484,485,412,486,487,419,488,489,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,324,183,168,169,70,71,68,69,70,71,170,171,184,325,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,401],
			[416,443,0,0,0,0,0,0,0,0,0,0,0,0,86,310,353,354,348,349,350,351,351,356,5,6,0,0,0,0,0,0,0,2,639,640,331,6,304,152,354,348,349,350,351,351,353,311,87,0,0,0,0,0,0,0,0,0,0,0,0,424,425,426,402,403,427,428,429,0,0,0,0,0,0,0,0,424,492,493,429,0,0,0,0,0,0,0,0,0,0,0,0,0,2,6,221,220,149,200,141,79,127,128,78,79,127,128,141,79,197,150,224,0,0,0,0,0,0,0,2,44,45,46,0,0,0,442],
			[403,404,0,0,0,0,0,0,0,0,0,0,0,0,7,58,59,60,61,58,59,60,61,98,357,5,332,0,0,0,331,332,2,342,652,653,333,152,182,183,58,59,60,61,58,59,135,136,300,0,0,0,0,0,0,0,0,0,0,0,0,0,434,435,415,416,436,437,0,0,639,640,0,0,0,0,0,0,490,491,0,0,0,0,0,0,0,0,0,0,0,0,2,11,333,343,9,1,1,128,70,92,66,67,91,92,66,67,70,92,121,231,244,220,224,0,0,0,2,11,333,47,48,49,331,11,444,445],
			[416,443,44,41,46,0,0,2,6,2,6,0,2,6,331,68,69,70,71,68,69,70,71,9,1,4,5,11,11,332,304,5,333,152,666,667,157,158,199,200,68,69,70,71,68,69,147,148,320,0,0,0,0,0,0,0,0,0,0,0,0,0,0,401,402,403,404,0,0,0,652,653,0,0,0,0,0,0,482,483,0,0,0,0,0,0,0,0,2,11,6,2,361,362,340,3,343,9,66,67,128,128,139,140,66,67,139,140,128,1,1,231,231,231,244,223,2,11,333,152,353,50,51,52,385,387,450,451],
			[447,448,47,48,49,6,2,368,369,341,5,6,339,340,341,78,79,127,128,78,79,127,128,343,10,9,305,340,303,306,4,152,182,183,60,61,168,169,99,100,141,142,99,100,141,142,62,63,11,6,0,0,0,0,2,11,6,0,0,0,0,0,0,442,415,416,443,6,0,0,660,661,639,640,11,6,0,331,490,491,332,331,332,2,332,0,0,2,333,152,385,351,374,375,384,354,153,307,139,140,66,67,91,92,76,77,91,92,66,67,30,9,231,231,231,30,333,152,157,158,82,83,60,61,58,59,60,61],
			[453,454,50,51,52,353,354,381,382,350,353,354,348,349,350,164,165,166,167,164,165,166,167,354,353,354,348,349,350,351,157,158,199,200,70,71,141,142,68,69,70,71,68,69,70,71,72,73,305,340,11,6,326,327,339,340,303,6,2,11,332,2,444,445,446,447,448,449,6,2,668,669,652,653,340,154,2,494,495,496,497,302,340,341,5,6,2,152,182,183,122,123,1,1,122,123,159,160,156,92,139,140,127,128,1,1,127,128,139,140,29,28,10,9,30,152,182,183,168,169,93,94,70,71,68,69,70,71],
			[58,59,60,61,58,59,60,61,58,59,58,59,60,61,58,59,60,61,58,59,60,61,58,59,60,61,58,59,60,61,168,169,99,100,99,100,70,71,78,79,127,128,78,79,127,128,115,144,348,349,351,354,664,665,348,349,350,387,354,388,354,456,450,451,452,453,454,455,456,351,666,667,666,667,349,351,354,499,500,501,502,348,349,350,385,354,157,158,199,200,145,146,62,63,145,146,170,171,159,160,164,165,166,167,166,167,166,167,164,165,351,352,351,352,157,158,199,200,141,142,78,79,99,100,141,142,99,100],
			[68,69,70,71,68,69,70,71,68,69,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,141,142,68,69,68,69,127,128,91,92,66,67,91,92,66,67,70,75,122,123,105,106,58,59,60,61,58,59,60,61,58,59,60,61,58,59,60,61,58,59,60,61,58,59,1,1,58,59,60,61,58,59,60,61,58,59,168,169,68,69,115,116,68,69,115,116,141,142,170,171,58,59,60,61,58,59,60,61,58,59,60,61,58,59,168,169,68,69,70,71,91,92,68,69,70,71,68,69],
			[141,142,99,100,141,142,99,100,141,142,141,142,99,100,141,142,99,100,141,142,99,100,141,142,99,100,141,142,99,100,70,71,78,79,78,79,66,67,1,1,76,77,1,1,76,77,127,63,145,146,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,62,63,68,69,70,71,68,69,70,71,68,69,141,142,78,79,70,71,78,79,70,71,70,71,141,142,68,69,70,71,68,69,70,71,68,69,70,71,68,69,141,142,78,79,127,128,127,128,78,79,127,128,78,79],
			[70,71,68,69,70,71,68,69,70,71,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,127,128,91,92,91,92,139,140,1,1,1,1,1,1,1,1,66,67,115,116,99,100,141,142,99,100,141,142,99,100,141,142,99,100,141,142,99,100,141,142,99,100,141,142,68,69,141,142,99,100,141,142,99,100,141,142,70,71,91,92,66,67,91,92,66,67,127,128,70,71,141,142,68,69,141,142,99,100,141,142,99,100,141,142,70,71,91,92,1,1,1,1,91,92,1,1,91,92],
			[127,128,78,79,127,128,78,79,127,128,127,128,78,79,127,128,78,79,127,128,78,79,127,128,78,79,127,128,78,79,66,67,127,128,127,128,91,92,1,1,1,1,1,1,1,1,76,140,70,71,66,67,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,68,69,70,71,78,79,70,71,68,69,70,71,68,69,70,71,127,128,66,67,76,77,1,1,76,77,1,1,66,67,70,71,78,79,70,71,68,69,70,71,68,69,70,71,66,67,1,1,1,1,1,1,1,1,1,1,1,1],
			[66,67,91,92,66,67,91,92,66,67,66,67,91,92,66,67,91,92,66,67,91,92,66,67,91,92,66,67,91,92,139,140,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,92,66,67,76,77,127,128,78,79,127,128,78,79,127,128,78,79,127,128,78,79,127,128,78,79,127,128,91,92,127,128,78,79,127,128,78,79,127,128,66,67,76,77,1,1,1,1,1,1,1,1,76,77,66,67,91,92,66,67,78,79,66,67,78,79,66,67,76,77,1,1,1,1,1,1,1,1,1,1,1,1],
			[76,77,127,128,76,77,127,128,76,77,76,77,127,128,76,77,127,128,76,77,127,128,76,77,127,128,76,77,127,128,91,92,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,76,77,1,1,66,67,91,92,66,67,91,92,66,67,91,92,66,67,91,92,66,67,91,92,66,67,127,128,66,67,91,92,66,67,91,92,66,67,76,77,1,1,1,1,1,1,1,1,1,1,1,1,76,77,1,1,76,77,91,92,76,77,91,92,76,77,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,76,77,1,1,76,77,1,1,76,77,1,1,76,77,1,1,76,77,1,1,76,77,1,1,76,77,1,1,76,77,1,1,76,77,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]		
		],
		colldata: [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,0,0,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,122,0,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,0,102,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,2,2,2,2,2,2,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,2,0,0,0,0,0,0,0,0,2,6,7,0,0,0,0,0,0,0,0,0,103,0,0,0,0,110,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,103,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,119,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,100,13,13,13,0,0,101,0,0,0,0,0,0,0,0,0,0,0,119,0,0,0,0,0,0,0,0,0,0,0,0,4,5,1,1,1,1,1,1,1,1,1,1,0,103,0,0,0,0,0,0,0,0,0,0,0,0,127,0,0,0,0,0,0,0,0,0,122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,13,13,13,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,103,0,100,123,0,0,0,0,0,0,0,124,0,0,0,0,0,0,0,0,0,0,2,2,0,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,100,103,124,0,0,0,4,5,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,13,13,13,13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,115,0,0,0,0,0,0,125,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,0,4,5,1,1,1,1,1,1,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,102,0,4,5,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,1,1,1,1,1,1,1,1,1,1,6,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,5,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],

		update: function() {
			if ( map.ticker + 60 < Date.now() )
			{
				map.animFrame++; if ( map.animFrame > 3 ) map.animFrame = 0;
				//animtile3 = animtile3 + 1 : If animtile3 > 9 Then animtile3 = 0
				//animtile2 = animtile2 + 1 : If animtile2 > 7 Then animtile2 = 0
				map.heartFrame++; if ( map.heartFrame > 5 ) map.heartFrame = 0;
				map.ticker = Date.now();
			}
		},

		render: function() {
			// Draw Map
			for (var y = 0; y < 16; y++)
			{
				for (var x = 0; x < 21; x++)
			 	{
			 		var tile = this.tiledata[y + Math.floor(camera.y / imgTiles.spriteWidth)][x + Math.floor(camera.x / imgTiles.spriteHeight)];
			 		var ctile = this.colldata[y + Math.floor(camera.y / imgTiles.spriteWidth)][x + Math.floor(camera.x / imgTiles.spriteHeight)];

			 		if (tile > 0) {
				 		var tileposx = Math.floor(tile % (imgTiles.image.width / imgTiles.spriteWidth)) * imgTiles.spriteWidth,
				 			tileposy = Math.floor(tile / (imgTiles.image.width / imgTiles.spriteWidth)) * imgTiles.spriteWidth;

				 		gamectx.drawImage(imgTiles.image, tileposx, tileposy, imgTiles.spriteWidth, imgTiles.spriteHeight, Math.floor((-camera.x % imgTiles.spriteWidth) + (x * imgTiles.spriteHeight)), Math.floor((-camera.y % imgTiles.spriteHeight) + (y * imgTiles.spriteHeight)), imgTiles.spriteWidth, imgTiles.spriteHeight );
				 		//gamectx.drawImage(tiles.image, tileposx, tileposy, 32, 32, x * 32, y * 32, 32, 32);
			 		}

			 		if ( (ctile > 99) && (ctile < 110) )
					{
						// Change Marbles to coins
						if ( (this.blue - player.blueMarbles < 1 && ctile == pickupTypes.BLUEMARBLE) || (this.red - player.redMarbles < 1 && ctile == pickupTypes.REDMARBLE) || (this.green - player.greenMarbles < 1 && ctile == pickupTypes.GREENMARBLE) )
						{
							map.colldata[y + Math.floor(camera.y / imgTiles.spriteWidth)][x + Math.floor(camera.x / imgTiles.spriteHeight)] = pickupTypes.COIN;
							ctile = pickupTypes.COIN;
						}
						gamectx.drawImage(imgCollectables.image, map.animFrame * imgCollectables.spriteWidth, (ctile - pickupTypes.BLUEMARBLE) * imgCollectables.spriteHeight, imgCollectables.spriteWidth, imgCollectables.spriteHeight, Math.floor((-camera.x % imgTiles.spriteWidth) + (x * imgTiles.spriteHeight)), Math.floor((-camera.y % imgTiles.spriteHeight) + (y * imgTiles.spriteHeight)), imgCollectables.spriteWidth, imgCollectables.spriteHeight);
					} else {
						if ( ctile == 110 ) 
							gamectx.drawImage(imgHearts.image, animations.heart[map.heartFrame] * imgHearts.spriteWidth, 0, imgHearts.spriteWidth, imgHearts.spriteHeight, Math.floor((-camera.x % imgTiles.spriteWidth) + (x * imgTiles.spriteHeight)), Math.floor((-camera.y % imgTiles.spriteHeight) + (y * imgTiles.spriteHeight)), imgHearts.spriteWidth, imgHearts.spriteHeight);

						if ( (ctile > 110) && (ctile < 147) ) 
							gamectx.drawImage(	imgCollectables.image, 
											  	Math.floor((ctile - pickupTypes.BERSERK) % (imgCollectables.image.width / imgCollectables.spriteWidth)) * imgCollectables.spriteWidth, 
											  	320 + (Math.floor((ctile - pickupTypes.BERSERK) / (imgCollectables.image.width / imgCollectables.spriteWidth)) * imgCollectables.spriteWidth),
											  	imgCollectables.spriteWidth, imgCollectables.spriteHeight, 
											  	Math.floor((-camera.x % imgTiles.spriteWidth) + (x * imgTiles.spriteHeight)), 
											  	Math.floor((-camera.y % imgTiles.spriteHeight) + (y * imgTiles.spriteHeight)), 
											  	imgCollectables.spriteWidth, imgCollectables.spriteHeight);
					}
			 	}
			}
		}
	};

	var camera = {
		x: 0,
		y: 170,
		bounce: 0,

		update: function () {
			var LOOK_AHEAD = 16;
			var CATCH_UP_X = 32;
			var CATCH_UP_Y = 14;

			if ( this.bounce > 0 ) this.bounce =- 0.3;

			// Horizontal movement
		    this.tx = (player.x + LOOK_AHEAD) - (((gameScreen.width / 2) - 20) - (player.speed * 50));
		    this.x += ((this.tx - this.x) / CATCH_UP_X);

			// Vertical movement
			if ( !((player.status == playerstates.DEAD) && (player.gravity > 0)) )
			{
				this.ty = (player.y + LOOK_AHEAD) - ((gameScreen.height / 2) + 26);
				this.y += ((this.ty - this.y) / CATCH_UP_Y);

				//this.y += (float)Math.sin((-0.5f + ((int)this.bounce % 2) * 180) * this.bounce);
			}

			// Limits of the map
			if (camera.x < 0) camera.x = 0;
			if (camera.y < 0) camera.y = 0;
			if (camera.x > (map.width * 32) - gameScreen.width) camera.x = (map.width * 32) - gameScreen.width;
			if (camera.y > (map.height * 32) - gameScreen.height) camera.y = (map.height * 32) - gameScreen.height;
		}
	};

	var playerstates = Object.freeze({ 
		STILL: 0,
		MOVING: 1,
		PUSHING: 2,
		INAIR: 3,
		SHOOTING: 4,
		DUCKING: 5,
		SWIMMING: 6,
		CLIMBING: 7,
		HURT: 8,
		DEAD: 9,
		UNCONTROLABLE: 10
	});

	var weaponTypes = Object.freeze({ 
		MINIGUN: 0,
		FLAME: 1,
		LASER: 2,
		FULLMINI: 3,
		ROCKET: 4,
		ENEMYSOFT: 6,
		ENEMYROCKET: 7,
		ENEMYHARD: 8,
		ENEMYSTAR: 9,
		DEADORANGE: 10,
		DEADBLUE: 11
	});

	var pickupTypes = Object.freeze({ 
		BLUEMARBLE:	100,
		REDMARBLE: 101,
		GREENMARBLE: 102,
		COIN: 103,
		GREENFULL: 104,
		REDFULL: 105,
		BLUEFULL: 106,
		EXTRALIFE: 107,
		BLUEKEY: 108,
		REDKEY:	109,
		HEARTCONT: 110,
		BERSERK: 111,
		ROCKET: 114,
		LASER: 115,
		FLAME: 116,
		MINIGUN: 117,
		DEATH: 118,
		GUNPOWERUP: 119,
		SHIELD: 120,
		SPEED: 121,
		HEART: 122
	});

	var player = {
		x: map.startX * imgTiles.spriteWidth,
		y: (map.startY * imgTiles.spriteHeight) - imgRuff.spriteHeight,
		gravity: 0,
		speed: 0,
		maxSpeed: 7,
		frame: 0,
		animFrame: 0,
		status: 0,
		facing: 0,
		weapon: weaponTypes.MINIGUN,
		lives: 2,
		score: 0,
		noHearts: 2,
		energy: 3,
		coins: 0,
		redMarbles: 0,
		greenMarbles: 0,
		blueMarbles: 0,
		redKeys: 0,
		blueKeys: 0,
		ticker: Date.now(),
		dustTicker: Date.now(),

		keyd: 0,
		onSlope: false,
		inWater: false,
		onPlatform: false,
		springJump: false,
		fallTimer: 0,
		gravTimer: 0,
		foot1: 0,
		foot2: 0,

		downKey: 40,
		upKey: 38,
		leftKey: 37,
		rightKey: 39,
		jumpKey: 90,
		fireKey: 88,

		JUMPPEAK: 14,       	/*Amount of highest rise before you start to fall*/
		JUMPSPEED: -7,       	/*Speed in which you jump/fall*/
		JUMPFALL: 10,

		RIGHTCHECK:	40,
		LEFTCHECK: 13,
		FOOTMAPLIMIT: 11,

		FALLHEIGHT:	16,

		duckAnim : [10, 16, 10, 0],

		gun: {
			x: 0,
			y: 0,
			frame: 0,
			pause: 0,
			meter: 10,
			meterlimit: 10,
			ticker: Date.now()
		},

		update: function() {
			
			if (this.leftKey in keys) this.keyd = 1;
			if (this.rightKey in keys) this.keyd = 2;

			if ( this.status == playerstates.PUSHING )
			{
				if ( this.facing )
				{
					if (!(this.leftKey in keys)) this.keyd = 0;
				} else {
					if (!(this.rightKey in keys)) this.keyd = 0;
				}
			} else {
				if ( !(this.rightKey in keys) && !(this.leftKey in keys) ) this.keyd = 0;
			}

			if ( this.status < playerstates.INAIR )
			{
				if ( this.status < playerstates.PUSHING )
				{
					if ( this.keyd ) this.status = playerstates.MOVING;
					if ( this.downKey in keys )
					{
						this.ticker = Date.now(); 
						this.animFrame = 0;
						this.status = playerstates.DUCKING; 
						this.frame = player.duckAnim[this.animFrame];
					}

					switch ( this.keyd )
					{
						case 1:
							if ( this.speed > -this.maxSpeed )
							{
								if ( Math.floor(this.speed) <= 0 )
								{
									this.facing = 1;
									this.speed -= 0.4;
								} else {
									if (this.dustTicker + 60 < Date.now()) {
										particles.push(new particle(1, this.x + 20, this.y + 76));
										this.dustTicker = Date.now();
									}
									this.speed -= 0.3; this.onSlope = false;
									if ( this.speed > 3 ) { this.frame = 17; } else { this.frame = 18; }
								}
							}
							break;

						case 2:
							if ( this.speed < this.maxSpeed )
							{
								if ( Math.floor(this.speed) >= 0 )
								{
									this.facing = 0;
									this.speed += 0.4;
								} else {
									if (this.dustTicker + 60 < Date.now()) {
										particles.push(new particle(1, this.x + 20, this.y + 76));
										this.dustTicker = Date.now();
									}
									this.speed += 0.3; this.onSlope = false;
									if ( this.speed < -3 ) { this.frame = 17; } else { this.frame = 18; }
								}
							}
							break;
					}

					if ( this.inWater == false ) 
					{
						if ( this.speed > this.maxSpeed ) this.speed = this.maxSpeed;
						if ( this.speed < -this.maxSpeed ) this.speed = -this.maxSpeed;
					} else {
            			if ( this.speed > (this.maxSpeed / 2) ) this.speed = (this.maxSpeed / 2);
            			if ( this.speed < -(this.maxSpeed / 2) ) this.speed = -(this.maxSpeed / 2);
					}

					if ( this.status == playerstates.STILL || this.status == playerstates.PUSHING )
					{
						if (this.fireKey in keys) this.status = playerstates.SHOOTING;
					}

					if ( this.jumpKey in keys )
					{
						if ( this.inWater == false )
						{
							this.status = playerstates.INAIR; this.frame =+ 10; this.onPlatform = false;
					        this.gravTimer = 0; this.gravity = this.JUMPSPEED;
						} else {
					        this.status = playerstates.SWIMMING; this.frame =+ 10;
					        this.gravTimer = this.speed = 0; this.gravity = this.JUMPSPEED << 1;
						}
					}
				}
			}

			// Slowdown / Skid
			if ( (this.status < playerstates.SWIMMING) && (!this.onSlope) )
			{
				if ( (!this.keyd) || (this.status == playerstates.DUCKING) )
				{
					if ( this.speed > 0.0 )
					{
						this.speed -= 0.2;
					} else {
						if ( this.speed < 0.0 ) this.speed += 0.2;
					}
					if ( Math.abs(this.speed) < 0.11 ) this.speed = 0.0;

					if ( this.status != playerstates.INAIR )
					{
						if ( this.status != playerstates.SHOOTING )
						{
							if ( !this.speed )
							{
								if ( this.status != playerstates.DUCKING ) this.status = playerstates.STILL;
							} else {
								if (this.dustTicker + 60 < Date.now()) {
									particles.push(new particle(1, this.x + 20, this.y + 76));
									this.dustTicker = Date.now();
								}
							}
						}
					}
				}
			}

			switch ( this.status )
			{
				case playerstates.STILL:
					if ( Math.abs(this.speed) > 0.11 )
					{
						if ( this.onSlope == false ) this.frame = 9; else this.status = playerstates.MOVING;
					} else {
						this.frame = 0; this.ticker = Date.now();
					}
					break;

				case playerstates.MOVING:
					if ( (this.keyd == 1 && this.speed < 0) || (this.keyd == 2 && this.speed > 0) || (this.onSlope) )
					{
						if ( this.ticker + 80 < Date.now() )
						{
							this.frame ++;
							this.ticker = Date.now();
							if ( this.frame > 8 ) this.frame = 1;
							if ( (this.frame == 6 || this.frame == 2) && this.inWater == false )
							{
								if ( this.frame == 6 )
								{
									//Play_Sound(snd_foot1, (int)this.x, (int)this.y);
								} else {
									//Play_Sound(snd_foot2, (int)this.x, (int)this.y);
								}
								//user\num_steps = user\num_steps + 1
							}
						}
			            if ( Math.floor(this.speed) > 0 ) this.facing = 0;
				        if ( Math.floor(this.speed) < 0 ) this.facing = 1;
					} else {
						if ( (Math.abs(this.speed) > 0.11 ) && (!this.keyd) ) this.frame = 9;
					}
					break;

				case playerstates.DUCKING:
					if ( (this.rightKey in keys) && Math.floor(this.speed) == 0 ) this.facing = 0;
					if ( (this.leftKey in keys) && Math.floor(this.speed) == 0 ) this.facing = 1;

					if ( this.ticker + 80 < Date.now() )
					{
						this.ticker = Date.now();
						this.animFrame ++;

						if ( this.downKey in keys )
						{
							this.ticker = Date.now(); 
							this.animFrame = 1;
						} else {
							if ( Math.abs(this.speed) > 0.11 )
		   					{
		      					if ( this.animFrame >= 3 ) this.status = playerstates.MOVING;
		   					} else {
								if ( this.animFrame >= 3 ) this.status = playerstates.STILL;
							}
						}
						this.frame = this.duckAnim[this.animFrame];
						//if ( player.bullettimer > 6 && player.animframe == 1 ) player.frame = 26;
				    }
					break;

				case playerstates.INAIR:
					if ( this.gravTimer < this.JUMPPEAK )
					{
						this.gravTimer ++;
						if ( !(this.jumpKey in keys) ) this.gravTimer = this.JUMPPEAK;
					} else {
						this.gravity += 0.55;
						if ( Math.floor(this.gravity) > this.JUMPFALL ) this.gravity = this.JUMPFALL;
					}

					this.onSlope = false;

					if ( this.keyd == 2 )
					{
						if ( this.speed < 4 ) this.speed += 0.3;
						if ( this.gravity > 0 ) this.facing = 0;
					}
					if ( this.keyd == 1 )
					{
						if ( this.speed > -4 ) this.speed -= 0.3;
						if ( this.gravity > 0 ) this.facing = 1;
					}
					if ( this.speed > 2 ) this.speed -= 0.1;
					if ( this.speed < -2 ) this.speed += 0.1;

					if ( this.springJump )
					{
						this.frame = 33;
						if ( this.gravity > -1.5 ) this.springJump = false;
						if ( this.upKey in keys ) this.gravity -= 0.20;
						if ( this.downKey in keys ) this.gravity += 0.20;
					} else {
						switch ( Math.floor(this.gravity) )
						{
							case -7:
								this.frame = 11;
								break;

							case -6:
								this.frame = 12;
								break;

							case -1:
								this.frame = 13;
								break;

							case 1:
								this.frame = 14;
								break;

							case 7:
								this.frame = 15;
								break;
						}
					}

					if ( Math.floor(this.gravity) > 6 ) this.fallTimer ++;
					if ( this.fallTimer > 20 ) this.frame = 27;
					break;

				case playerstates.PUSHING:
					if ( this.ticker + 120 < Date.now() ) { this.frame = 29; } else { this.frame = 28; }
					if ( !this.keyd ) this.status = playerstates.STILL;
					if ( this.fireKey in keys ) this.status = playerstates.SHOOTING;
					if ( this.jumpKey in keys ) this.status = playerstates.INAIR;
					break;

				case playerstates.SHOOTING:
		         	if ( this.rightKey in keys ) this.facing = 0;
		         	if ( this.leftKey in keys ) this.facing = 1;

		         	if ( this.bullettimer > 6 ) { this.frame = 19; } else { this.frame = 0; }

		         	if ( this.downKey in keys )
		         	{
		            	if ( this.frame == 0 ) { this.frame = 21; } else { this.frame = 24; }
					} else if ( this.upKey in keys )
					{
		             	if ( !(this.leftKey in keys) && !(this.rightKey in keys) )
		             	{
		                	if ( this.frame == 0 ) { this.frame = 22; } else { this.frame = 25; }
						}
		             	if ( this.leftKey in keys || this.rightKey in keys )
		             	{
							if ( this.frame == 0 ) { this.frame = 20; } else { this.frame = 23; }
						}
					}

		         	if ( !(this.fireKey in keys) ) { this.status = playerstates.STILL; this.frame = 0; }
					if ( this.speed ) this.status = playerstates.MOVING;
					break;
			}

			this.x += this.speed;
			if (this.status < playerstates.DEAD) this.detectArms();

			this.y += this.gravity;

			if ( player.onPlatform == false && player.status < playerstates.DEAD ) this.detectFeet();

			// Map Limits
			if ( this.x < -12 )	{ this.x = -12; this.speed = 0; }
			if ( this.y > (map.height * imgTiles.spriteHeight) && this.status < thisstates.DEAD ) this.y = 88;
			if ( this.x > ((map.width - 2) * imgTiles.spriteWidth) + 20 )
			{
      			this.x = ((map.width - 2) * imgTiles.spriteWidth) + 20; this.speed = 0;
			}

			// Gun Bullet Section
			if ( this.fireKey in keys && this.gun.ticker + this.gun.pause < Date.now() && (this.frame < 17 || this.frame > 18) && this.fallTimer < 20 && this.status < playerstates.HURT && !this.springJump )
			{
				this.gun.ticker = Date.now(); //10

				if ( this.weapon == weaponTypes.MINIGUN )
				{
					this.gun.pause = 100 + (player.gun.meter * 5); //-16 + player.gun.meter;
				} else {
					this.gun.pause = 0;
				}

				this.fireBullet(this.weapon, this.x, this.y);
				if ( !this.facing )
				{
					this.gun.frame = 5;
					this.gun.x = Math.floor(this.x) + 48;
				} else {
					this.gun.frame = 1;
					this.gun.x = Math.floor(this.x) - 24;
				}
				
				this.gun.y = Math.floor(this.y) + 33;

				if ( this.status == playerstates.SHOOTING )
				{
					if ( this.upKey in keys )
					{
						this.gun.frame = 3;
						this.gun.y = Math.floor(this.y) - 12;
						if ( this.facing ) { this.gun.x = Math.floor(this.x) + 24; } else { this.gun.x = Math.floor(this.x) - 1; }
						if ( this.leftKey in keys )
						{
							this.gun.frame = 2;
							this.gun.x = Math.floor(this.x) - 14;
							this.gun.y = Math.floor(this.y) + 5;
						} else if ( this.rightKey in keys ) {
							this.gun.frame = 4;
							this.gun.x = Math.floor(this.x) + 39;
							this.gun.y = Math.floor(this.y) + 5;
						}
					}
					if ( this.downKey in keys )
					{
						if ( this.facing )
						{
							this.gun.frame = 0;
							this.gun.x = this.x - 14;
							this.gun.y = this.y - 24;
						} else {
							this.gun.frame = 6;
							this.gun.x = this.x + 34;
							this.gun.y = this.y - 24;
						}
					}
				}

		        if ( this.downKey in keys )
				{
					this.gun.y = Math.floor(this.y) + 71;

					if ( this.facing ) { this.gun.x = Math.floor(this.x) - 20; } else { this.gun.x = Math.floor(this.x) + 44; }
				}

				if ( this.status == playerstates.DUCKING ) { this.gun.y = Math.floor(this.y) + 42; this.gun.frame = 0; }
			}
		},

		detectArms: function() {
			var arm1, arm2, arm3, tmpb, tmpx, tmpy;

			// Leftside of player
			arm1 = map.colldata[Math.floor((Math.floor(this.y) + 72) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)];
			arm2 = map.colldata[Math.floor((Math.floor(this.y) + 58) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)];
			if ( this.status != playerstates.DUCKING ) { arm3 = map.colldata[Math.floor((Math.floor(this.y) + 26) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)]; } else { arm3 = 0; }

			// Collectables
			if ( (arm2 > 99) || (arm3 > 99) )
			{
				if ( arm2 > 99 )
				{
					map.colldata[Math.floor((Math.floor(this.y) + 58) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)] = 0;
					tmpy = (Math.floor((Math.floor(this.y) + 58) / imgTiles.spriteHeight) * imgTiles.spriteHeight) + 1;
					tmpb = arm2;
				} else {
					map.colldata[Math.floor((Math.floor(this.y) + 26) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)] = 0;
					tmpy = (Math.floor((Math.floor(this.y) + 26) / imgTiles.spriteHeight) * imgTiles.spriteHeight) + 1;
					tmpb = arm3;
				}

				tmpx = (Math.floor(Math.floor(this.x + this.LEFTCHECK) / imgTiles.spriteWidth) * imgTiles.spriteWidth) + 1;
				this.doCollectable(tmpb);
				particles.push(new particle(2, tmpx, tmpy));
			}
			/*
				if arm2 = 13 Or arm3 = 13
					fadestate = FADE_PART : fadespeed# = 0.02
					If level < 6 Then fadetemp# = 0 Else water = False : HideEntity watersprite
				EndIf
				If arm2 = 14 Or arm3 = 14
					fadestate = FADE_PART : fadespeed# = 0.02
					If level < 6 Then fadetemp# = 0.2 Else water = True : ShowEntity watersprite
				EndIf
				If arm2 = 15 Or arm3 = 15 Then fadestate = FADE_PART : fadetemp# = 0.4 : fadespeed# = 0.02
				If arm2 = 16 Or arm3 = 16 Then hearts = 1  : Gosub RuffHurt
			*/
			// Collision
			if ( (arm1 == 1) || (arm2 == 1) || (arm3 == 1) )
			{
				this.x = (Math.floor(Math.floor(this.x) / imgTiles.spriteWidth) * imgTiles.spriteWidth) + 21;
				this.speed = 0;
				if ( this.leftKey in keys && !this.gravity )
				{
					if ( (this.status != playerstates.SHOOTING) && (this.status != playerstates.INAIR) && (this.status != playerstates.SWIMMING) && (this.status != playerstates.CLIMBING) ) { this.status = playerstates.PUSHING; this.ticker = Date.now(); }
				}
			}

			// Right
			arm1 = map.colldata[Math.floor((Math.floor(this.y) + 72) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)];
			arm2 = map.colldata[Math.floor((Math.floor(this.y) + 58) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)];
			if ( this.status != playerstates.DUCKING ) { arm3 = map.colldata[Math.floor((Math.floor(this.y) + 26) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)]; } else { arm3 = 0; }

			if ( (arm2 > 99) || (arm3 > 99) )
			{
				if ( arm2 > 99 )
				{
					map.colldata[Math.floor((Math.floor(this.y) + 58) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)] = 0;
					tmpy = (Math.floor((Math.floor(this.y) + 58) / imgTiles.spriteHeight) * imgTiles.spriteHeight) + 1;
					tmpb = arm2;
				} else {
					map.colldata[Math.floor((Math.floor(this.y) + 26) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)] = 0;
					tmpy = (Math.floor((Math.floor(this.y) + 26) / imgTiles.spriteHeight) * imgTiles.spriteHeight) + 1;
					tmpb = arm3;
				}

				tmpx = (Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth) * imgTiles.spriteWidth) + 1;
				this.doCollectable(tmpb);
				particles.push(new particle(2, tmpx, tmpy));
		   }
		/*
		   If arm2 = 13 Or arm3 = 13
		      fadestate = FADE_PART  : fadespeed# = 0.02
		      If level < 6 Then fadetemp# = 0 Else water = False : HideEntity watersprite
		   EndIf
		   If arm2 = 14 Or arm3 = 14
		      fadestate = FADE_PART : fadespeed# = 0.02
		      If level < 6 Then fadetemp# = 0.2 Else water = True : ShowEntity watersprite
		   EndIf
		   If arm2 = 15 Or arm3 = 15 Then fadestate = FADE_PART : fadetemp# = 0.4 : fadespeed# = 0.02
		   If arm2 = 16 Or arm3 = 16 Then hearts = 1 : Gosub RuffHurt
		*/
			// Collision
			if ( (arm1 == 1) || (arm2 == 1) || (arm3 == 1) )
			{
				this.x = (Math.floor(Math.floor(player.x) / imgTiles.spriteWidth) * imgTiles.spriteWidth) + 21;
				this.speed = 0;
				if ( this.rightKey in keys && !this.gravity )
				{
					if ( (this.status != playerstates.SHOOTING) && (this.status != playerstates.INAIR) && (this.status != playerstates.SWIMMING) && (this.status != playerstates.CLIMBING) ) { this.status = playerstates.PUSHING; this.ticker = Date.now(); }
				}
			}
		},

		detectFeet: function () {
			var foot3, foot4;

			// Check 1 (See if player has overlapped a collision block)
			//
			this.foot1 = map.colldata[Math.floor((Math.floor(this.y) + imgRuff.spriteHeight) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)];
			this.foot2 = map.colldata[Math.floor((Math.floor(this.y) + imgRuff.spriteHeight) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)];

			if ( this.foot1 && this.foot2 && this.foot2 != 8 && this.foot1 != 9 ) { this.onSlope = false; }

			if ( !((this.status == playerstates.PUSHING) || (this.status == playerstates.CLIMBING)) )
			{
				if ( this.foot2 == 8 )
				{
					this.onSlope = 1; this.speed -= 0.1;
					if ( this.speed > 4 ) this.speed -= 0.5;
				}
				if ( this.foot1 == 9 )
				{
					this.onSlope = 1; this.speed += 0.1;
					if ( this.speed < -4 ) this.speed += 0.5;
				}
			}

			// Do check for ladders and climbing state
			//
			if ( this.status != playerstates.CLIMBING )
			{
				if ( (this.foot1 == 12) || (this.foot2 == 12) )
				{
					foot3 = map.colldata[Math.floor(((Math.floor(this.y) + imgRuff.spriteHeight) - this.FALLHEIGHT) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)];
					foot4 = map.colldata[Math.floor(((Math.floor(this.y) + imgRuff.spriteHeight) - this.FALLHEIGHT) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)];

					if ( ((KeysHeld[this.downkey] || KeysHeld[this.upkey])) && ((foot3 == 12) || (foot4 == 12)) )
					{
						if ( Math.floor(this.gravity) >= 0 )
						{
							this.status = playerstates.CLIMBING; this.gravity = this.speed = this.fallTimer = 0;
						}
					}
					if ( !foot3 && !foot4 ) this.foot1 = this.foot2 = 2;
				}
			}

			if ( (this.foot1 > this.FOOTMAPLIMIT) && (this.status < playerstates.CLIMBING) ) this.foot1 = 0;
			if ( (this.foot2 > this.FOOTMAPLIMIT) && (this.status < playerstates.CLIMBING) ) this.foot2 = 0;

			if ( (Math.floor(this.gravity) >= 0) && ((this.status < playerstates.CLIMBING) || (this.status == playerstates.HURT)) )
			{
				if ( ((this.foot1 > 0) || (this.foot2 > 0)) && ((this.foot1 < 12) && (this.foot2 < 12)) )
				{
					if ( (this.foot1 == 2) || (this.foot2 == 2) ) {
						if ( Math.floor(this.y + imgRuff.spriteHeight) % imgTiles.spriteHeight <= this.FALLHEIGHT ) this.doFeet();
					} else {
						this.doFeet();
					}
				} else {
					if ( !((this.status == playerstates.INAIR) || (this.status == playerstates.HURT) || (this.status == playerstates.SWIMMING)) )
					{
						// see if block below has heightmap, if so adjust variables

						foot3 = map.colldata[Math.floor(((Math.floor(this.y) + imgRuff.spriteHeight) + this.FALLHEIGHT) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)];
						foot4 = map.colldata[Math.floor(((Math.floor(this.y) + imgRuff.spriteHeight) + this.FALLHEIGHT) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)];

						if ( foot3 > this.FOOTMAPLIMIT ) foot3 = 0;
						if ( foot4 > this.FOOTMAPLIMIT ) foot4 = 0;

						if ( ((foot3 > 0) || (foot4 > 0)) && ((foot3 < 12) && (foot4 < 12)) )
						{
							this.y += this.FALLHEIGHT;
							this.foot1 = foot3;
							this.foot2 = foot4;
							this.doFeet();
						} else {
							if ( this.status < playerstates.HURT )
							{
								if ( !this.inWater ) { this.status = playerstates.INAIR; this.frame = 13; } else { this.status = playerstates.SWIMMING; this.frame = 40; }
							}
						}
					}
				}
			}
		},

		doFeet: function() {
			var foot3, foot4, lev1, lev2, temp;

			/* Check 1: See if block above has heightmap, if so adjust variables
			*/
			if ( !(this.status == playerstates.INAIR || this.status == playerstates.HURT || this.status == playerstates.SWIMMING) )
			{	// Check the block underneath
				foot3 = map.colldata[Math.floor(((Math.floor(this.y) + imgRuff.spriteHeight) - this.FALLHEIGHT) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.LEFTCHECK) / imgTiles.spriteWidth)];
				foot4 = map.colldata[Math.floor(((Math.floor(this.y) + imgRuff.spriteHeight) - this.FALLHEIGHT) / imgTiles.spriteHeight)][Math.floor((Math.floor(this.x) + this.RIGHTCHECK) / imgTiles.spriteWidth)];

				if ( foot3 > this.FOOTMAPLIMIT ) foot3 = 0;
				if ( foot4 > this.FOOTMAPLIMIT ) foot4 = 0;

				if ( (foot3 > 0) || (foot4 > 0) )
				{
					if ( (foot3 != 2) && (foot4 != 2) )
					{
						this.y -= this.FALLHEIGHT; this.foot1 = foot3; this.foot2 = foot4;
					};
				};
			};

			/* Check 2: See if player has overlapped heightmap of block
			*/
			lev1 = footmap[(this.foot1 * imgTiles.spriteWidth) + Math.floor(this.x + this.LEFTCHECK) % imgTiles.spriteHeight];
			lev2 = footmap[(this.foot2 * imgTiles.spriteWidth) + Math.floor(this.x + this.RIGHTCHECK) % imgTiles.spriteHeight];

			if ( lev1 < lev2 )
				temp = (Math.floor(Math.floor(this.y + imgRuff.spriteHeight) / imgTiles.spriteHeight) * imgTiles.spriteHeight) + lev1;
			else
				temp = (Math.floor(Math.floor(this.y + imgRuff.spriteHeight) / imgTiles.spriteHeight) * imgTiles.spriteHeight) + lev2;

			if ( (this.status == playerstates.INAIR) || (this.status == playerstates.HURT) || (this.status == playerstates.SWIMMING) )
			{
				if ( Math.floor(this.y + imgRuff.spriteHeight) > temp )
				{
					if (this.status == playerstates.HURT) { this.facing = 1 - this.facing; this.flashTimer = 80; }

					this.gravity = 0;
					this.fallTimer = 0;
					this.animFrame = 1;
					this.status = playerstates.DUCKING; this.frame = this.duckAnim[this.animFrame];
					this.y = temp - imgRuff.spriteHeight;
				}
			} else {
				this.y = temp - imgRuff.spriteHeight; this.gravity = 0;
			};
		},

		doCollectable: function(type) {
			switch ( type )
			{
				case pickupTypes.BLUEMARBLE:
					player.blueMarbles++;
					player.score++;
					//Play_Sound(snd_marble, (int)player.x, (int)player.y);
					break;

				case pickupTypes.REDMARBLE:
					this.redMarbles++;
					this.score++;
					//Play_Sound(snd_marble, (int)player.x, (int)player.y);
					break;

				case pickupTypes.GREENMARBLE:
					this.greenMarbles++;
					this.score++;
					//Play_Sound(snd_marble, (int)player.x, (int)player.y);
					break;

				case pickupTypes.COIN:
					this.coins++;
					this.score++;
					//map.coins ++;
					if ( this.coins > 99 ) { this.coins = 0; this.lives++; }
					//Play_Sound(snd_coin, (int)player.x, (int)player.y);
					break;

				case pickupTypes.EXTRALIFE:
					this.lives++;
					break;

				case pickupTypes.BLUEFULL:
					this.blueMarbles = map.blue;
					break;

				case pickupTypes.REDFULL:
					this.redMarbles = map.red;
					break;

				case pickupTypes.GREENFULL:
					this.greenMarbles = map.green;
					break;

				case pickupTypes.GUNPOWERUP:
					if ( this.weapon == weaponTypes.MINIGUN )
					{
						this.gun.meterlimit += 5;
						if ( this.gun.meterlimit > 23 ) this.gun.meterlimit = 23;
						this.gun.meter = this.gun.meterlimit;
					} else {
						player.gun.meter += 5;
						if ( player.gun.meter > 23 ) player.gun.meter = 23;
					}
					break;

				case pickupTypes.HEART:
					if ( this.energy < this.noHearts ) player.energy++;
					break;

				case pickupTypes.HEARTCONT:
					if (player.noHearts < 5) player.noHearts++;
					player.energy = player.noHearts;
					break;

				case pickupTypes.LASER:
					player.weapon = weaponTypes.LASER;
					player.gunmeter = 12;
					//Play_Sound(snd_weapon, (int)player.x, (int)player.y);
					break;

				default:
					player.score += 500;
					break;
			};
		},

		fireBullet: function() {

			var thisBullet = new bullet(this.weapon, this.x, this.y);

			// Default settings for weapon types
			switch (this.weapon)
			{
				case weaponTypes.MINIGUN:
					thisBullet.distance = 18;
					thisBullet.w = 20;
					thisBullet.h = 20;
					thisBullet.strength = thisBullet.alpha = 1;
					if ( this.facing ) { thisBullet.xSpeed = -15; } else { thisBullet.xSpeed = 15; }
					//Play_Sound(snd_mini, (int)player.x, (int)player.y);
					//user\wep_norm_shot = user\wep_norm_shot + 1
					break;

				case weaponTypes.LASER:
					thisBullet.distance = 100;
					thisBullet.w = 64;
					thisBullet.h = 20;
					thisBullet.strength = 4;
					thisBullet.alpha = 1;
					if ( player.facing ) { thisBullet.xSpeed = -15; } else { thisBullet.xSpeed = 15; }
					//Play_Sound(snd_laser, (int)player.x, (int)player.y);
					//user\wep_laser_shot = user\wep_laser_shot + 1
					break;

				/*case B_FLAME:
					thisBullet.distance = 100;
					thisBullet.w = 20;
					thisBullet.h = 20;
					thisBullet.strength = thisBullet.used = thisBullet.alpha = 1;
					player.bulletpause = 6;
					if ( player.facing ) { thisBullet.xspeed = -12; } else { thisBullet.xspeed = 12; }
					thisBullet.xspeed += (player.speed * 0.7f);
					Play_Sound(snd_flame, (int)player.x, (int)player.y);
					//user\wep_flame_shot = user\wep_flame_shot + 1
					break;

				case B_FULLMINI:
					thisBullet.distance = 100;
					thisBullet.w = 20;
					thisBullet.h = 20;
					thisBullet.strength = thisBullet.used = thisBullet.alpha = 1;
					player.bulletpause = 4;
					if ( player.facing ) { thisBullet.xspeed = -15; } else { thisBullet.xspeed = 15; }
					Play_Sound(snd_mini, (int)player.x, (int)player.y);
					//user\wep_mini_shot = user\wep_mini_shot + 1
					break;

				case B_ROCKET:
					thisBullet.distance = 100;
					thisBullet.w = 20;
					thisBullet.h = 20;
					thisBullet.strength = 10;
					thisBullet.used = thisBullet.alpha = 1;
					player.bulletpause = -14;
					if ( player.facing ) { thisBullet.xspeed = -15; } else { thisBullet.xspeed = 15; }
					Play_Sound(snd_mini, (int)player.x, (int)player.y);
					//user\wep_missile_shot = user\wep_missile_shot + 1
					break;*/
			}

			// Override default values depending on state/direction
			if ( this.status == playerstates.DUCKING )
			{
				thisBullet.y = this.y + guninfo[(this.weapon * 35) + 14 + 5];
			} else {
				thisBullet.y = this.y + guninfo[(this.weapon * 35) + 14 + 1];
			}

			if ( (this.facing && !(this.leftKey in keys) && !(this.rightKey in keys)) || (this.rightKey in keys))
			{
				thisBullet.frame = guninfo[(this.weapon * 35) + 1];
				thisBullet.x = this.x + guninfo[(this.weapon * 35) + 7 + 1];
			}

			if ( (!this.facing && !(this.leftKey in keys) && !(this.rightKey in keys)) || (this.leftKey in keys))
			{
				thisBullet.frame = guninfo[(this.weapon * 35) + 5];
				thisBullet.x = this.x + guninfo[(this.weapon * 35) + 7 + 5];
			}

			if ( this.status == playerstates.SHOOTING )
			{
				if ( this.downKey in keys )
				{
					if ( thisBullet.type == weaponTypes.FLAME ) { thisBullet.ySpeed = 12; } else { thisBullet.ySpeed = (Math.abs(thisBullet.xSpeed) - 5); }
					if ( this.facing )
					{
						if ( thisBullet.type == weaponTypes.FLAME )
						{
							thisBullet.ySpeed = 10; thisBullet.xSpeed = -10;
						} else {
							thisBullet.xSpeed = -(Math.abs(thisBullet.xSpeed) - 5);
						}

						thisBullet.frame = guninfo[(this.weapon * 35)];
						thisBullet.x = this.x + guninfo[(this.weapon * 35) + 7];
						thisBullet.y = this.y + guninfo[(this.weapon * 35) + 14];
					} else {
						if ( thisBullet.type == weaponTypes.FLAME )
						{
							thisBullet.ySpeed = 10; thisBullet.xSpeed = 10;
						} else {
							thisBullet.xSpeed = (Math.abs(thisBullet.xSpeed) - 5);
						}

						thisBullet.frame = guninfo[(player.weapon * 35) + 6];
						thisBullet.x = this.x + guninfo[(player.weapon * 35) + 7 + 6];
						thisBullet.y = this.y + guninfo[(player.weapon * 35) + 14 + 6];
					}
				} else if ( this.upKey in keys )
				{
					if ( thisBullet.type == weaponTypes.FLAME ) { thisBullet.ySpeed = -12; } else { thisBullet.ySpeed = -(Math.abs(thisBullet.xSpeed) - 5); }
					if ( !(this.leftKey in keys) && !(this.rightKey in keys) )
					{
						thisBullet.xSpeed = 0;
						thisBullet.frame = guninfo[(this.weapon * 35) + 3];
						thisBullet.y = this.y + 50; // 9 really
						if ( player.facing ) { thisBullet.x = this.x + guninfo[(this.weapon * 35) + 14 + 3]; } else { thisBullet.x = this.x + guninfo[(this.weapon * 35) + 7 + 3]; }
					} else {
						if ( this.facing )
						{
							if ( thisBullet.type == weaponTypes.FLAME )
							{
								thisBullet.ySpeed = -10; thisBullet.xSpeed = -10;
							} else {
								thisBullet.xSpeed = -(Math.abs(thisBullet.xSpeed) - 5);
							}

							thisBullet.frame = guninfo[(this.weapon * 35) + 2];
							thisBullet.x = this.x + guninfo[(this.weapon * 35) + 7 + 2];
							thisBullet.y = this.y + guninfo[(this.weapon * 35) + 14 + 2];
						} else {
							if ( thisBullet.type == weaponTypes.FLAME )
							{
								thisBullet.ySpeed = -10; thisBullet.xSpeed = 10;
							} else {
								thisBullet.xSpeed = (Math.abs(thisBullet.xSpeed) - 5);
							}

							thisBullet.frame = guninfo[(this.weapon * 35) + 4];
							thisBullet.x = this.x + guninfo[(this.weapon * 35) + 7 + 4];
							thisBullet.y = this.y + guninfo[(this.weapon * 35) + 14 + 4];
						}
					}
				}
			}

			if ( this.weapon == weaponTypes.FLAME )
			{
				//thisBullet.xspeed += (2 * ((float)rand()/RAND_MAX)) - 1;
				//thisBullet.yspeed += (2 * ((float)rand()/RAND_MAX)) - 1;
			}

			bullets.push(thisBullet);
		},

		DoGunMeter: function() {
			var fireKey;
	
			if ( player.weapon == weaponTypes.MINIGUN )
			{
				if ( (fireKey in keys) && player.gun.meter >= 0 )
				{
					if ( player.gun.ticker + 200 < Date.now() )
					{
						player.gun.ticker = Date.now();
						player.gun.meter--;
					}
				} else {
					if ( player.gun.meter < player.gun.meterlimit )
					{
						if ( player.metertimer + 150 < Date.now() )
						{
							player.gun.ticker = Date.now();
							player.gun.meter++;
						}
					}
				}
			} else {
				if ( player.gun.metertimer + 1000 < Date.now() )
				{
					player.gun.metertimer = Date.now();
					player.gun.meter--;
					if ( (!player.gun.meter) && (player.weapon > weaponTypes.MINIGUN) ) { player.weapon = weaponTypes.MINIGUN; player.gun.meter = 12; }
				}
			}
		},

		render: function() {
			gamectx.drawImage(imgRuff.image, this.frame * imgRuff.spriteWidth, this.facing * imgRuff.spriteHeight, imgRuff.spriteWidth, imgRuff.spriteHeight, Math.floor(this.x - camera.x), Math.floor(this.y - camera.y), imgRuff.spriteWidth, imgRuff.spriteHeight);

			if ( this.gun.ticker + (this.gun.pause - 40) > Date.now() )
			{
				gamectx.globalAlpha = 0.7;
				gamectx.drawImage(imgPlyGunFire.image, this.gun.frame * imgPlyGunFire.spriteWidth, 0, imgPlyGunFire.spriteWidth, imgPlyGunFire.spriteHeight, Math.floor(this.gun.x - camera.x), Math.floor(this.gun.y - camera.y), imgPlyGunFire.spriteWidth, imgPlyGunFire.spriteHeight )
				gamectx.globalAlpha = 1;
			};
		}
	};

	var particles = [];
	var bullets = [];
	var pickups = [];
	var enemies = [];
	var objects = [];

	function particle(type, thatX, thatY) {
	 	this.x = thatX;
	 	this.y = thatY;
	 	this.type = type;
	 	this.frame = 0;
	 	this.ticker = Date.now();
	 	this.alpha = 1;
	 	this.alive = true;

		this.update = function() {
			switch (this.type)
			{
				case 1:
					this.alpha -= 0.04;
					this.y -= 0.5;

					if ( this.ticker + 100 < Date.now() ) {
						this.frame++;
						this.ticker = Date.now();

						if (this.frame > 2) 
							particles.splice(particles.indexOf(this), 1);
					}
					break;

				case 2:
					if ( this.ticker + 20 < Date.now() )
					{
						this.frame ++;
						this.ticker = Date.now();

						if (this.frame > 7) 
							particles.splice(particles.indexOf(this), 1);
					}

					this.alpha -= 0.03;
					this.y -= 8;
					break;

				case 3:
					if ( this.ticker + 40 < Date.now() )
					{
						this.frame ++;
						this.ticker = Date.now();

						if (this.frame > 8) 
							particles.splice(particles.indexOf(this), 1);
					}
					break;
			}	
	 	};

	 	this.render = function() {
	 		gamectx.globalAlpha = this.alpha;

	 		switch (this.type)
			{
				case 1:
			 		gamectx.drawImage(imgDust.image, this.frame * imgDust.spriteWidth, 0, imgDust.spriteWidth, imgDust.spriteHeight, this.x - camera.x, this.y - camera.y, imgDust.spriteWidth, imgDust.spriteHeight);
			 		break;

			 	case 2:
					gamectx.drawImage(imgDisappear.image, this.frame * imgDisappear.spriteWidth, 0, imgDisappear.spriteWidth, imgDisappear.spriteHeight, this.x - camera.x, this.y - camera.y, imgDisappear.spriteWidth, imgDisappear.spriteHeight);
			 		break;

			 	case 3:
					gamectx.drawImage(imgBulletHit.image, this.frame * imgBulletHit.spriteWidth, 0, imgBulletHit.spriteWidth, imgBulletHit.spriteHeight, this.x - camera.x, this.y - camera.y, imgBulletHit.spriteWidth, imgBulletHit.spriteHeight);
			 		break;
			}
			gamectx.globalAlpha = 1;
	 	};
	}

	function bullet(type, thatX, thatY) {
		this.type = type;
		this.x = thatX;
		this.y = thatY;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.gravity = 0;
		this.distance = 0;
		this.frame = 0;
		this.h = 0;
		this.w = 0;
		this.strength = 0;
		this.alpha = 0;

		this.update = function() {
			this.x += this.xSpeed;
			this.y += this.ySpeed;
			this.ySpeed += this.gravity;

			// Delete bullet if it leaves the screen
			if ( (this.x - camera.x > gameScreen.width) || (this.x - camera.x < -20) || (this.y - map.y > gameScreen.height) || (this.y -map.y < -20) )
				bullets.splice(bullets.indexOf(this), 1);

			var tmptile = map.colldata[Math.floor((Math.floor(this.y) + this.h) / imgTiles.spriteHeight)][Math.floor(Math.floor(this.x) / imgTiles.spriteWidth)];
			if ( (tmptile == 1) || (this.distance < 1) )
			{
				bullets.splice(bullets.indexOf(this), 1);

				particles.push(new particle(3, this.x - 16, this.y - 16));
			}

			switch ( this.type )
			{
				case weaponTypes.MINIGUN:
					this.distance--;
					break;
			}

		}

		this.render = function() {
			switch (this.type)
			{
				case weaponTypes.MINIGUN:
					gamectx.drawImage(imgMiniBullet.image, this.frame * imgMiniBullet.spriteWidth, 0, imgMiniBullet.spriteWidth, imgMiniBullet.spriteHeight, this.x - camera.x, this.y - camera.y, imgMiniBullet.spriteWidth, imgMiniBullet.spriteHeight);
			 		break;

			 	case weaponTypes.LASER:
			 		gamectx.drawImage(imgLaser.image, this.frame * imgLaser.spriteWidth, 0, imgLaser.spriteWidth, imgLaser.spriteHeight, this.x - camera.x, this.y - camera.y, imgLaser.spriteWidth, imgLaser.spriteHeight);
			 		break;
			}
		}
	}

	function pickup(type, thatX, thatY) {
		this.x = thatX;
		this.y = thatY;

		switch (type)
		{
			//case: 
		}

		this.render = function () {

		}

	}

	/* Main loop 
	 */

	var update = function () {
		var i;

		camera.update();
		map.update();
		
		player.update();

		for (i in bullets)
		{
			bullets[i].update();
		};

		for (i in particles)
		{
			particles[i].update();
		};

	};

	function drawPaddingFont(font, fonty, x, y, num, count) {
		var padded = (new Array(count + 1 - num.toString().length)).join('0') + num;

		for (var i = 0; i <= count; i++) {
			gamectx.drawImage(font.image, padded[i] * font.spriteWidth, fonty, font.spriteWidth, font.spriteHeight, x + (i * (font.spriteWidth + 2)), y, font.spriteWidth, font.spriteHeight);
		};
	}

	var render = function() {
		var i;
		
		// Background
		gamectx.fillStyle = w1grd;
      	gamectx.fillRect(0, 0, gameScreen.width, gameScreen.height);

      	map.render();

		for (i in bullets)
		{
			bullets[i].render();
		};

		player.render();

		for (i in particles)
		{
			particles[i].render();
		};

		// Panel
		gamectx.drawImage(imgPanel.image, 0, 0);
		gamectx.drawImage(imgNumbers.image, player.lives * imgNumbers.spriteWidth, 0, imgNumbers.spriteWidth, imgNumbers.spriteHeight, 36, 4, imgNumbers.spriteWidth, imgNumbers.spriteHeight);
		
		drawPaddingFont(imgSmlNumbers, 0, 67, 4, player.coins, 2);

		if ( map.red - player.redMarbles > 0 )
			drawPaddingFont(imgSmlNumbers, 14, 436, 4, map.red - player.redMarbles, 2);
		else {
			gamectx.drawImage(imgSmlNumbers.image, 0, 14, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight, 436, 4, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight);
			gamectx.drawImage(imgSmlNumbers.image, 140, 14, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight, 436 + imgSmlNumbers.spriteWidth + 2, 4, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight);
		}
		if ( map.green - player.greenMarbles > 0 )
			drawPaddingFont(imgSmlNumbers, 28, 468, 4, map.green - player.greenMarbles, 2);
		else {
			gamectx.drawImage(imgSmlNumbers.image, 0, 28, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight, 468, 4, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight);
			gamectx.drawImage(imgSmlNumbers.image, 140, 28, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight, 468 + imgSmlNumbers.spriteWidth + 2, 4, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight);
		}
		if ( map.blue - player.blueMarbles > 0 )
			drawPaddingFont(imgSmlNumbers, 42, 500, 4, map.blue - player.blueMarbles, 2);
		else {
			gamectx.drawImage(imgSmlNumbers.image, 0, 42, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight, 500, 4, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight);
			gamectx.drawImage(imgSmlNumbers.image, 140, 42, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight, 500 + imgSmlNumbers.spriteWidth + 2, 4, imgSmlNumbers.spriteWidth, imgSmlNumbers.spriteHeight);
		}

		drawPaddingFont(imgNumbers, 0, 546, 4, player.score, 6);

		gamectx.drawImage(imgWeaponIcons.image, 0, 0, imgWeaponIcons.spriteWidth, imgWeaponIcons.spriteHeight, 114, 8, imgWeaponIcons.spriteWidth, imgWeaponIcons.spriteHeight );

		for (i = 0; i < player.gun.meter; i++ )
			gamectx.drawImage(imgMeters.image, 0, 0, imgMeters.spriteWidth, imgMeters.spriteHeight, 148 + (i * 4), 16, imgMeters.spriteWidth, imgMeters.spriteHeight);

		/*x = (screenposx + 338) - ((player.nohearts << 5) >> 1);*/
		for (i = 0; i <= player.noHearts; i++)
		{
			/*if (player.energy < i) { f = 822; } else { f = 821; }*/
			gamectx.drawImage(imgHearts.image, 0, 0, imgHearts.spriteWidth, imgHearts.spriteHeight, (320 - ((player.noHearts * imgHearts.spriteWidth) / 2)) + (i * imgHearts.spriteWidth), 10, imgHearts.spriteWidth, imgHearts.spriteHeight);
		};

		// 
		if (game.fade > 0.01) 
		{
			game.fade -= 0.01; 

			gamectx.fillStyle = 'rgba(0,0,0,' + game.fade + ')';
			gamectx.fillRect(0, 0, gameScreen.width, gameScreen.height);
		};
	};

	var loop = function() {

		update();
		render();

		w.scrollTo(0, 0);
	};

	// run game
	setInterval(loop, 1000/60);

}());
