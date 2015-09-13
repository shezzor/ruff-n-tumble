define(
	[
		'engine/sprite',
		'engine/entity'	
	], 
	function(Sprite, Entity) 
	{		
		var playerStates = Object.freeze({ 
			STILL: 0,
			MOVING: 1,
			PUSHING: 2,
			INAIR: 3,
			SHOOTING: 4,
			DUCKING: 5,
			SWIMMING: 6,
			CLIMBING: 7,
			HURT: 8,
			DEAD: 9,
			UNCONTROLABLE: 10
		});
		
		var weaponTypes = Object.freeze({ 
			MINIGUN: 0,
			FLAME: 1,
			LASER: 2,
			FULLMINI: 3,
			ROCKET: 4,
			ENEMYSOFT: 6,
			ENEMYROCKET: 7,
			ENEMYHARD: 8,
			ENEMYSTAR: 9,
			DEADORANGE: 10,
			DEADBLUE: 11
		});


		var player = new Entity();
		
		// Entity defaults
		
		player.x = 0;
		player.y = 0;
		player.gravity = 0;
		player.speed = 0;
		player.maxSpeed = 7;
		player.frame = 0;
		player.animFrame = 0;
		player.status = playerStates.STILL;
		player.facing = 0;
		player.weapon = weaponTypes.MINIGUN;
		player.lives = 2;
		player.score = 0;
		player.noHearts = 2;
		player.energy = 3;
		player.coins = 0;
		player.redMarbles = 0;
		player.greenMarbles = 0;
		player.blueMarbles = 0;
		player.redKeys = 0;
		player.blueKeys = 0;
		player.ticker = Date.now();
		player.dustTicker = Date.now();
		
		return player; 
	}
	
);