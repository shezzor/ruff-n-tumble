define([
		'engine/sprite',
		'engine/render'
	],
	function(Sprite, Renderer) {
		var entity = function(x, y, name) {
			this.x = 0;
			this.y = 0;
			this.gravity = 0;
			this.name = '';
			this.sprite = new Sprite();
		}	
		
		return entity;
	}
);