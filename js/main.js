/* global requirejs */
requirejs(
	[
		'engine/engine', 
		'rnt/game'	
	], 
	function(BBEngine, RnTGame) {
		var game = new RnTGame(),
		    engine = new BBEngine(game);
		
		if (engine.init()) {
			engine.start();
		} else {
			engine.fail();
		}
	}
);