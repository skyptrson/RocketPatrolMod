class Menu extends Phaser.Scene{
    constructor() {
        super("menuScene");
    }

    preload(){
        // load audio
        this.load.audio('sfx_select', './assets/open.wav');
        this.load.audio('sfx_explosion', './assets/splash.wav');
        this.load.audio('sfx_rocket', './assets/pitch.wav');
        this.load.image('shark', './assets/shark.png');
        this.load.image('background', './assets/background_lora.png');
    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Lora',
            fontSize: '28px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            align: 'right',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 0
        }

        // insert background image
        var menuBg = this.add.image(game.config.height/16, 0, 'background');
        // show menu text
        this.add.text(game.config.width/2, game.config.height/3 -borderUISize - borderPadding, '   SOLE DEFENDER   ', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, '   Use ←→ arrows to move. Press F to fire.  ', menuConfig).setOrigin(0.5);
        menuConfig.config = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '   Press ← for Novice or → for Expert   ', menuConfig).setOrigin(0.5);
        var topLeft = this.add.image(game.config.width/2, 14*game.config.height/16, 'shark');

        // define keys 
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
      }
}