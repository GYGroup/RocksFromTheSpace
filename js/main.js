var globalWidth = 1029; //width of the background
var globalHeight = 821; //height of the background
var gameState = {};

//Function called before the game is loaded 
//Load the ressources
gameState.load = function() {};
gameState.load.prototype = {
	//we load ressources for the game
	preload: function() {
		this.game.load.image('background', 'ressources/img/background.png');
		this.game.load.atlasJSONHash('vessel', 'ressources/img/vessel.png', 'data/vessel.json');
	},

	create: function() {
		game.state.start('main');
	}
};

//HeartGame
gameState.main = function() {};
gameState.main.prototype = {
	nbColumn: 5, //nb of total column where the rocks fall
	activeColumn: 3, //index of the column where the vessel is 1 to nbColumn
	vesselSpeed: 10, //speed of the vessel when we move it
	create: function() {
		//we load the background
		this.background = this.game.add.sprite(0,0,'background');

		//we set the key -> to go right <- to go left space to shoot
		keyLeft = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		keyRight = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		keyLeft.onDown.add(this.vesselMove,this);
		keyRight.onDown.add(this.vesselMove,this);

		//we load the vessel ressources left and right movement animation and we place it on the screen
		this.vessel = this.game.add.sprite(0,0,'vessel');
		this.vessel.animations.add('going-right',[0,1]);
		this.vessel.animations.add('going-left',[0,2]);
		this.vessel.y = 700;
		this.vessel.x = this.getVesselPosx();
	},

	update: function() {
		this.vesselAnimation();
	},

	//we get the x coordinate if the active column, where we should place the vessel
	getVesselPosx: function() {
		var singleWidthColumn = globalWidth  / this.nbColumn;
		var widthColumn = this.activeColumn * singleWidthColumn;
		return (widthColumn - singleWidthColumn / 2)  - this.vessel.width / 2;
	},

	//we handle the movement of the vessel here
	vesselMove: function() {
		//RIGHT MOVEMENT
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			if(this.activeColumn<this.nbColumn) {
				this.activeColumn++;
				this.vessel.animations.play('going-right');
			}
		}
		//LEFT MOVEMENT 
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			if(this.activeColumn>1) {
				this.activeColumn--;
				this.vessel.animations.play('going-left');
			}
		}
	},

	//we animate the vessel movement
	vesselAnimation: function() {
		if(this.vessel.x + this.vesselSpeed < this.getVesselPosx()) this.vessel.x += this.vesselSpeed;
		else if(this.vessel.x - this.vesselSpeed > this.getVesselPosx()) this.vessel.x -= this.vesselSpeed;
		else {
			this.vessel.frame = 0;
		}
	}
};


var game = new Phaser.Game(globalWidth, globalHeight, Phaser.AUTO, 'rfts');
game.state.add('load', gameState.load);
game.state.add('main', gameState.main);
game.state.start('load');