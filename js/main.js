/* global requirejs */
requirejs(
	[
		'engine/engine', 
		'rnt/game'	
	], 
	function(Engine, Game) {
		var rntEngine = new Engine({
				container: 'content', 
				width: 640, 
				height: 480,
				fps: 60
		});
		
		if (rntEngine.init())
		{
			rntEngine.start();
		}
	}
);