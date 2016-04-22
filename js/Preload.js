var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.spritesheet('player1', 'assets/images/player1.png', 110, 160, 19);
    this.load.spritesheet('player2', 'assets/images/player2.png', 80, 150, 19);

    this.load.image('coin', 'assets/images/coin.png');
    this.load.image('bomb', 'assets/images/bomb.png');

    this.load.image('wheel', 'assets/images/wheel.png');
    this.load.image('wheel_room', 'assets/images/wheel_room.png');
    this.load.image('pin', 'assets/images/pin.png');
    this.load.image('pin2', 'assets/images/pin2.png');
    this.load.image('wheel_button', 'assets/images/wheel_button.png');

    this.load.image('bg', 'assets/images/bg.png');
    this.load.image('space', 'assets/images/space.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('light', 'assets/images/lights.png');
    this.load.image('col', 'assets/images/b_col.png');

    this.load.image('panel', 'assets/images/panel.png');
    this.load.image('play_btn', 'assets/images/play.png');
    this.load.image('again_btn', 'assets/images/again.png');
    this.load.image('menu_btn', 'assets/images/menu.png');
    this.load.image('bonus_btn', 'assets/images/bonus.png');
    this.load.image('sound_btn', 'assets/images/sound.png');
    this.load.image('muted_btn', 'assets/images/muted.png');
    this.load.image('character_btn', 'assets/images/characters.png');

    this.load.image('item1', 'assets/images/item1.png');//Coins
    this.load.image('item2', 'assets/images/item2.png');//Life
    this.load.image('item3', 'assets/images/item3.png');//Magnet
    this.load.image('item4', 'assets/images/item4.png');//Explosion
    this.load.image('item5', 'assets/images/item5.png');//Shield
    this.load.image('items', 'assets/images/items.png');

    this.load.image('particle', 'assets/images/particle.png');
    this.load.image('particle2', 'assets/images/particle2.png');

    this.load.bitmapFont('myFont', 'assets/desyrel.png', 'assets/desyrel.xml');
    this.load.bitmapFont('myFont2', 'assets/gem.png', 'assets/gem.xml');
    this.load.bitmapFont('myFont3', 'assets/nokia.png', 'assets/nokia.xml');
    

    this.load.audio('coin', 'assets/audio/coin.ogg');
    this.load.audio('pop', 'assets/audio/pop.ogg');
    this.load.audio('swing', 'assets/audio/swing.ogg');
    this.load.audio('break', 'assets/audio/break.ogg');
    this.load.audio('explosion', 'assets/audio/explosion.ogg');
    this.load.audio('magnet', 'assets/audio/magnet.ogg');
    this.load.audio('shield', 'assets/audio/shield.ogg');
    // this.load.audio('bgm1', 'assets/audio/bgm1.wav');
    // this.load.audio('bgm2', 'assets/audio/bgm2.wav');
    // this.load.audio('bgm3', 'assets/audio/bgm3.wav');
  },
  create: function() {
    this.state.start('Menu');
  }
};