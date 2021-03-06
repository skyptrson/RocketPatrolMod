class Play extends Phaser.Scene{
    constructor() {
        super("playScene");
    }

    preload(){
        // load images/tile sprites
        this.load.image('rocket', './assets/ball.png');
        this.load.image('spaceship', './assets/shark.png');
        this.load.image('starfield', './assets/background.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/chomp.png',{
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 14
        });
        this.load.spritesheet('bite', './assets/bitecycle.png',{
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0,0, 640, 480, 'starfield').setOrigin(0,0);
        
        // green UI background
        //this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x000000).setOrigin(0, 0);
        
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize*2, 0x000000).setOrigin(0, 0);
        //this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        //this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        // add rocket (player 1)
        this.p1Rocket = new Rocket(this, game.config.width/3, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0.5);

        // add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4,'bite', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2,'bite', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4,'bite', 0, 10).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    
        // animation config
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('bite',{
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 20
        });
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 14,
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
            fontFamily: 'Lora',
            fontSize: '28px',
            //backgroundColor: '#F3B141',
            color: '#FFFFFF',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize, borderUISize/8 +borderPadding, this.p1Score, scoreConfig);
          
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart. Press ??? for Menu', scoreConfig).setOrigin(0.5);
            console.log(this.clock.delay);
            this.gameOver = true;
          }, null, this);
        // displaying play time
        this.timeDisplay = this.add.text(game.config.width-borderPadding-borderUISize*2, borderUISize/8+ borderPadding,
            Math.trunc(this.clock.delay/1000-this.clock.getElapsedSeconds()), scoreConfig);
    }

    update() {
        // swap direction bc i drew the art backwards oops
        this.ship01.setFlip(true, false);
        this.ship02.setFlip(true, false);
        this.ship03.setFlip(true, false);

        // animated sprites here
        this.ship01.anims.play('move', true);
        this.ship02.anims.play('move', true);
        this.ship03.anims.play('move', true)

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= starSpeed;
        if(!this.gameOver){
            // update rocket
            this.p1Rocket.update();
            // update spaceships (x3)
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
            // game.settings.gameTimer += 1
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();        
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        // updating timer
        this.timeDisplay.text = `${Math.trunc(this.clock.delay/1000-this.clock.getElapsedSeconds())} s`;
    }
    
    checkCollision(rocket, ship){
        // axis alligned bounding boxes (AABB) checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
                return true;
        }
        else{
            return false;
        }
    }

    shipExplode(ship){
        // temp hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.setFlip(true,false)            // fixing direction bc backwards art
        boom.anims.play('explode');         // play explode animation
        boom.on('animationcomplete', () =>{ // callback after anim completes
            ship.reset();                   // reset ship position
            ship.alpha = 1;                 // make ship visible again
            boom.destroy();                 // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.clock.delay += ship.points*100;   // adding 1 second to clock per point
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}
