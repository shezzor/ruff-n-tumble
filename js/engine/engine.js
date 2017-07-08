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
			this.debug = game.settings.options.debug;
			this.
			
			this.renderer = new Renderer(game.settings.viewport, this.debug);
			this.resources = new Resources(game.settings.resources, this.debug);
			this.input = new Input(game.settings.input, this.debug);
			this.audio = new Audio(game.settings.audio, this.debug);
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
				this.lastFrameTime = Date.now();
				this.game.main();
				
				requestAnimationFrame(this.main);
			},
			
			start: function() {
				//this.renderer.drawSprite()
				//setInterval(this.mainloop, 1000/this.options.fps);
				if (this.game.options.debug) 
				{
					console.log('Engine Started...');
					console.log('Initialising Game...');
				}
				
				console.log (this.game)
				
				this.game.init();
			},
			
			fail: function() {
				
			}
		}
		
		engine.options = function() {
			return this.options;
		}
		
		return engine;
	}
);