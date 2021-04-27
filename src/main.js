// Sky Peterson
// Project: Sole Defender
// 4/19/21
// Project took ~12 hours
// Source:
// Splash: "Splash, Jumping, H.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org

// Points Breakdown
// Redesign the game's artwork, UI and sound to change
// it's theme/aesthetic (something other than sci-fi) [60]
// Display time [10]
// New animated sprite for enemies [10]
// Implement a new timing/scoring mechanism that adds time to the clock for successful hits [20]

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