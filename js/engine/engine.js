define([
		'engine/render',
		'engine/input',
		'engine/audio',
		'engine/object',
		'engine/loader'
	],
	function(Renderer, Audio, Input, Objects, Loader) {
		var engine = function(options) {		
			this.renderer = new Renderer(options);
			this.loader = new Loader(options);
		}

		engine.prototype = {
			state: null,
			
			// modules
			
			init: function() {
			 	//ensure browser supports required features
				if (!this.renderer.init()) {
					return false;
				}
				 
				return true;
			},
			
			mainloop: function() {
				
			},
			
			start: function() {
				alert('yes');
				//setInterval(this.mainloop, 1000/this.options.fps);
			}
			
		}
		
		return engine;
	}
);