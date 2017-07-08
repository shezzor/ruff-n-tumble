define(
	[
		'engine/sprite'		
	], 
	function() {
		var resources = function(resources) {
			this.images = resources.images;
			this.filecount = 0 || resources.images.length;
			this.filedone = 0;
			this.sounds = []
		};
			
		resources.prototype = {
			createImage: function(src) {
				var image = new Image();
				
				image.src = src;
				
				image.onload = function() {
					this.filedone++;
				}
				
				return image;
			},
			
			loadImages: function() {
				for (var i in this.images)
				{
					this.images[i].image = this.createImage(this.images[i].src);
					
					// Meh, not sure this is needed
					//delete this.images[i].src;
				}
				
				return true;
			},
			
			loadSounds: function() {
				
			}
		}
		
		return resources; 
	}
	
);