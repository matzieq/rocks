

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


var game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, "gra",
	{preload: preload, create: create, update: update});

var ship;

function loadAssets () {
	game.load.image("Ship", "assets/sprites/ship.png");
}

function setDisplay () {
	
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	// enable crisp rendering
	game.renderer.renderSession.roundPixels = true;
	Phaser.Canvas.setImageRenderingCrisp(game.canvas);
	game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
}

function preload() {
	loadAssets();
	setDisplay();
}

function createShip () {
	//initializing ship
	ship = game.add.sprite(120, 150, "Ship");
	ship.anchor.setTo(0.5);
	ship.angle = -90;
	game.physics.enable(ship, Phaser.Physics.ARCADE);
	ship.body.drag.set(SHIP_DRAG);
	ship.body.maxVelocity.set(SHIP_MAX_SPEED);
}

function create () {
	createShip();
}

function update () {
	moveShip();
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