define([
		'rnt/player',
		'rnt/level'
	], function(Player, Level) 
	{
		var game = function() 
		{	
			var gameStates = Object.freeze({ 
				INIT: 0,
				LOADING: 1,
				TITLE: 2,
				INGAME: 3,
				GAMEOVER: 4
			});
					
			this.settings = {
				// Information
				info: {
					name: 'Ruff n Tumble Remake',
					version: 'v0.1 alpha',
					date: '01/09/2015',
					author: 'Anthony Sherratt'
				},
			
				// Resources
				resources: {
					images: [{
						name: 'tiles',
						src: 'gfx/tiles01.png',
						gridWidth: 32,
						gridHeight: 32
					},
					{
						name: 'ruff',
						src: 'gfx/ruff.png',
						gridWidth: 66,
						gridHeight: 88
					}],
					sounds: []
				},
			
				viewport: {
					container: 'content', 
					width: 640, 
					height: 480,
					fps: 60
				},
				
				input: {
					left: 0,
					right: 0,
					up: 0,
					down: 0,
					buttons: {
						jump: 0,
						fire: 0
					}
				}	
			}
			
			this.state = gameStates.INIT;
		};
		
		game.prototype = {
			/*
				State loops
			 */
			main: function() {
				switch(this.state)
				{
					case this.gameStates.INIT:
						break;
				}
					
			},
			 
			loadingScreen: function() {
				
			},
			
			title: function() {
				
			},
			
			inGame: function() {
				
			},
			
			gameOver: function() {
				
			}			
		}
		
		return game;
	}
);