define([
		'rnt/player',
		'rnt/bullet',
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
			
			var gameState = gameStates.INIT;
						
			this.entities = {
				particles: [],
				bullets: [],
				pickUps: [],
				enemies: [],
				objects: []
			};
			
			this.levels = [];
					
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
					audio: [],
					json: []
				},
			
				viewport: {
					container: 'content', 
					width: 640, 
					height: 480,
					fps: 60
				},
				
				input: {
					left: 37,
					right: 39,
					up: 38,
					down: 40,
					buttons: {
						jump: 90,
						fire: 88
					}
				},
				
				options: {
					sound: false,
					soundVolume: 100,
					musicVolume: 100,
					godMode: true,
					debug: true	
				}	
			}
			
			this.state = gameStates.INIT;
		};
		
		game.prototype = {
		 
			main: function() {
				switch(this.state)
				{
					case this.gameStates.INIT:
						return this.init();
						break;
						
					case this.gameStates.LOADING:
						return this.loading();
						break;
						
					case this.gameStates.INGAME:
						return this.inGame();
						break;
				}
					
			},
			 
			loadingScreen: function() {
				
			},
			
			/*
			 *  State loops
			 */
			init: function() {
				
			},
			
			loading: function() {
				
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

BorderBrush="#FFFF7814"