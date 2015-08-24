define([
		'engine/sprite',
		'engine/tilemap'
	],
	function(Sprites, TileMaps) {
		var renderer = function(options) {
			
			// Default values
			this.viewport = document.createElement('canvas');
			this.viewport.id = "bbeViewport";
			this.viewport.width = options.width || 320;
			this.viewport.height = options.height || 240;
			this.context = null;
			
			this.container = options.container;
			this.fps = options.fps || 60;
		}

		renderer.prototype = {	
			init: function() {	
				if (this.viewport.getContext)
				{	
					document.getElementById(this.container).appendChild(this.viewport);
					this.context = this.viewport.getContext('2d');
				} else {
					return false;
				}

				console.log("renderer init");
				
				return true;
			},
			
			clear: function(style) {
				if (style) {
					this.context.fillStyle = style;
				}
				
				this.context.fillRect(0, 0, this.viewport.width, this.viewport.height);
			},
			
			flip: function() {
				
			}
		}
		
		return renderer;
	}
);