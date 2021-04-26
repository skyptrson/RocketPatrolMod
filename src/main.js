// Sky Peterson
// Project: Sole Defender
// 4/19/21
// Project took ~12 hours
// 

// Points Breakdown
// Redesign the game's artowkr, UI and sound to change
// it's theme/aesthetic (something other than sci-fi) [60]
// 

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 4;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// figure out how to flip sprites for diff direction sharks
// find watery or chomp sfx
// change game over screen