

var SCREEN_WIDTH = 800;
var SCREEN_HEIGHT = 600;
var SHIP_ROTATION_SPEED = 200;
var SHIP_ACCELERATION = 200;
var SHIP_MAX_SPEED = 300;
var SHIP_DRAG = 80;
var BULLET_SPEED = 500;
var BULLET_LIFE = 60;
var NUMBER_ASTEROIDS = 10;
var ASTEROID_SPEED = 100;


var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, "kibel",
	{preload: preload, create: create, update: update});

var ship;
var bullets; //array to hold bullet
var asteroids;

// variables for keys
var fireButton;
//var leftButton;
//var rightButton;

//variables for sounds
var fireSound;
var currentSound; // this is so that only one sound is audible at once.... or is it?



function preload() {
	this.load.image("Ship", "assets/sprites/ship.png");
	this.load.image("Bullet", "assets/sprites/bullet.png");
	this.load.image("LargeAsteroid", "assets/sprites/LargeAsteroid.png")
	this.load.audio("FireSound", "assets/sounds/fire.ogg");

	//set scale
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//game.scale.setUserScale(3, 3);

	// enable crisp rendering
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
	
}

function create () {


	this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //initializing ship
	ship = this.add.sprite(120, 150, "Ship");
	ship.anchor.setTo(0.5);
	ship.angle = -90;
	this.physics.enable(ship, Phaser.Physics.ARCADE);
	ship.body.drag.set(SHIP_DRAG);
	ship.body.maxVelocity.set(SHIP_MAX_SPEED);

	//initialilzing bullets - as a one element group so that it's easy to handle
	bullets = this.add.group();

	//asteroid group
	asteroids = this.add.group();
	generateRocks();

	//keys
	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	//leftButton = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	//rightButton = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	//sounds
	fireSound = this.add.audio("FireSound");
}

function update () {
	moveShip();
	moveBullet();
	moveRocks();
	game.physics.arcade.collide(bullets, asteroids, null, function (bullet, asteroid) {
		//bullet.destroy();
		asteroid.kill();
		bullet.kill();
	}, this);
}

function moveShip () {
	ship.body.angularVelocity = 0;
	ship.body.acceleration.set(0);
	wrap(ship);
	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		ship.body.angularVelocity = -SHIP_ROTATION_SPEED;
	} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		ship.body.angularVelocity = +SHIP_ROTATION_SPEED;
	} 

	if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
		game.physics.arcade.accelerationFromRotation(ship.rotation, BULLET_SPEED, ship.body.acceleration);
	}
	fireButton.onDown.add(fire, this);
}

//checks whether there exist any bullets and if not - creates one
function fire () {
	if (bullets.length < 4) {
		//set bullet sprite, enable physics for collisions and add it to the group
		var length = ship.width / 2;
		var startX = ship.x + (Math.cos(ship.rotation) * length);
		var startY = ship.y + (Math.sin(ship.rotation) * length);
		var bullet = game.add.sprite(startX, startY, "Bullet");
		game.physics.enable(bullet, Phaser.Physics.ARCADE);
		bullet.anchor.setTo(0.5);
		bullet.body.immovable = true;
		bullet.angle = ship.angle;
		bullet.lifeSpan = BULLET_LIFE;
		game.physics.arcade.velocityFromRotation(ship.rotation, BULLET_SPEED, bullet.body.velocity);
		bullets.add(bullet);
		fireSound.play();
	}
}

//moves the bullet and destroys it if off screen
function moveBullet() {
	bullets.forEach(function (bullet) {
		//bullet.y += BULLET_SPEED;
		wrap(bullet);
		bullet.lifeSpan--;
		console.log(bullet.lifeSpan);
		if (bullet.lifeSpan < 0) {
			bullet.destroy();
		}
		
	});
}

function wrap(sprite) {
	if (sprite.x > SCREEN_WIDTH + sprite.width / 2) {
		sprite.x -= (SCREEN_WIDTH + sprite.width);
	} else if (sprite.x < 0 - sprite.width / 2) {
		sprite.x += (SCREEN_WIDTH + sprite.width);
	} else if (sprite.y > SCREEN_HEIGHT + sprite.height / 2) {
		sprite.y -= (SCREEN_HEIGHT + sprite.height);
	} else if (sprite.y < 0 - sprite.height / 2) {
		sprite.y += (SCREEN_HEIGHT + sprite.height);
	}
}


function generateRocks() {
	for (var i=0; i < NUMBER_ASTEROIDS; i++) {
		var asteroid = game.add.sprite(game.rnd.between(0, SCREEN_WIDTH), game.rnd.between(0, SCREEN_HEIGHT), "LargeAsteroid");
		game.physics.enable(asteroid, Phaser.Physics.ARCADE);
		asteroid.angle = game.rnd.between(0, 360);
		asteroid.anchor.setTo(0.5);
		//asteroid.realAngle = asteroid.rotation; //independend of angular velocity
		asteroid.body.velocity.setTo(ASTEROID_SPEED * Math.cos(asteroid.rotation), ASTEROID_SPEED * Math.sin(asteroid.rotation))
		asteroid.body.angularVelocity = game.rnd.between(-100, 100);
		asteroids.add(asteroid);
	}
}

function moveRocks () {
	asteroids.forEach(function (asteroid) {
		//asteroid.body.velocity.setTo(ASTEROID_SPEED * Math.cos(asteroid.realAngle), ASTEROID_SPEED * Math.sin(asteroid.realAngle));
		wrap(asteroid);
	});
}