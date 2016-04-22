//App42.initialize("779990d8946f32a25966ace5e48831f457a0b17a301764d52c36272937af345e","33a419adbb18720197ab82a23f962d79576cf2e8b43b435f5650c2041f7f95e0"); 


var SideScroller = SideScroller || {};

SideScroller.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

SideScroller.game.state.add('Boot', SideScroller.Boot);
SideScroller.game.state.add('Preload', SideScroller.Preload);
SideScroller.game.state.add('Game', SideScroller.Game);
SideScroller.game.state.add('Menu', SideScroller.Menu);

SideScroller.game.state.start('Boot');
