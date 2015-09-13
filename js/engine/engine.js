define([
		'engine/render',
		'engine/input',
		'engine/audio',
		'engine/entity',
		'engine/resources'
	],
	function(Renderer, Audio, Input, Entity, Resources) 
	{
		var engine = function(game) 
		{		
			this.game = game;
			this.renderer = new Renderer(game.settings.viewport);
			this.resources = new Resources(game.settings.resources);
			this.input = new Input(game.settings.input);
			this.audio = new Audio();
		}

		engine.prototype = {
			state: null,
			
			// modules
			
			init: function() {
			 	/* Primary reason here is to 
			       ensure browser supports required features
				 
				   - Canvas
				   - Javascript functions
				   - Image
				   - Sound
				   - Input
				   
				 */
				if (!this.renderer.init()) {
					return false;
				}
				 
				return true;
			},
			
			main: function() {
				this.game.main();
			},
			
			start: function() {
				//this.renderer.drawSprite()
				//setInterval(this.mainloop, 1000/this.options.fps);
				console.log("Engine Started...");
			},
			
			fail: function() {
				
			}
			
		}
		
		return engine;
	}
);