var SideScroller = SideScroller || {};
SideScroller.Game = function(){};
//Game variabels

var gravityDir = 0;
var plGravity=1500;

var score = 0;
var coins = 0;

var bombSpeed=-150;
var bombRate=2000;

var emitter; //On death

var bgmpl = false;
var ended = false;

var superLifeUsed=false;
var explosionUsed=false;
var magnetActivated=false;
var shieldActivated=false;
var coinActivated=false;

//Wheel of fortune

// the spinning wheel
var wheel; 
// can the wheel spin?
var canSpin;
// slices (prizes) placed in the wheel
var slices = 8;
// prize names, starting from 12 o'clock going clockwise
var slicePrizes = ["JACKPOT!!!", "1 COIN", "250 COINS", "BAD LUCK!", "50 COINS", "100 COINS", "10 COINS", "BAD LUCK!"];
var slicePrizeNumbers = [800,1,250,0,50,100,10,0];
// the prize you are about to win
var prize;
var room;
var pin;
var spinned=0;
//===================//

var style = { font: "24px Arial", fill: "#000"};


SideScroller.Game.prototype = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {

    //Reset data
    gravityDir = 0;
    if(plGravity<0)plGravity*=-1;

    score = 0;
    spinned=0;
    coins = 0;
    bombSpeed=-150;
    bombRate=2000;
    ended=false;

    superLifeUsed=false;
    explosionUsed=false;
    magnetActivated=false;
    shieldActivated=false;
    coinActivated=false;

    //create Environment
    this.space = this.game.add.sprite(0,0, 'space');
    this.background = this.game.add.tileSprite(0,0,800,600, 'bg');
    this.ground = this.game.add.tileSprite(0,0,800,600, 'ground');

    //create player
    if(localStorage.getItem("specialPlayer")=="true"){
      this.player = this.game.add.sprite(100, 400, 'player2');
    }else{
      this.player = this.game.add.sprite(100, 400, 'player1');
    }
    //Environment2
    this.light = this.game.add.tileSprite(0,0,800,100, 'light');

    //Collisions
    this.col_bottom = this.game.add.sprite(0,520);
    this.col_bottom.width = 800;
    this.col_top = this.game.add.sprite(0,50);
    this.col_top.width = 800;

    //Create boxes and coins
    this.bombs = this.game.add.group(); 
    this.coins = this.game.add.group();

    //Enable physics
    this.game.physics.enable( [ this.player, this.col_bottom, this.col_top], Phaser.Physics.ARCADE);


    this.player.body.gravity.y = plGravity;
    this.player.anchor.setTo(0.5);
    this.player.body.collideWorldBounds = true;
    this.player.scale.setTo(0.8);
    this.player.body.setSize(60, 130, 2, 0);

    this.col_bottom.body.immovable = true;
    this.col_top.body.immovable = true;


    this.player.animations.add('walk');
    
    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.changeGravity, this);

    var oneKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    oneKey.onDown.add(this.activateMagnet, this);
    var twoKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    twoKey.onDown.add(this.activateShield, this);
    var threeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);
    threeKey.onDown.add(this.activateExplosion, this);

    //sounds
    this.coinSound = this.game.add.audio('coin');
    this.coinSound.volume = 2;
    this.deathSound = this.game.add.audio('pop');
    this.deathSound.volume = 2;
    this.gravitySound = this.game.add.audio('swing');
    this.gravitySound.volume = 2;
    this.breakSound = this.game.add.audio('break');
    this.breakSound.volume = 2;
    this.explosionSound = this.game.add.audio('explosion');
    this.explosionSound.volume = 2;
    this.shieldSound = this.game.add.audio('shield');
    this.shieldSound.volume = 2;
    this.magnetSound = this.game.add.audio('magnet');
    this.magnetSound.volume = 0.7;

    //Texts
    this.score_text = this.game.add.bitmapText(10, 10, 'myFont3', 'Score: 0', 22)
    //this.score_text = this.game.add.text(10, 10, "Score: 0", style);
    this.coin_text = this.game.add.bitmapText(50, 50, 'myFont3', '0', 24)
    this.coin_icon = this.game.add.sprite(25, 60, 'coin');
    this.coin_icon.scale.setTo(0.6);
    this.coin_icon.anchor.setTo(0.5);

    this.game.time.events.add(bombRate, this.spawnBomb, this);
    this.game.time.events.loop(2000, this.spawnCoin, this);
    this.countScore();


    // bgmusic = this.game.add.audio('bgm1');
    // bgmusic2 = this.game.add.audio('bgm2');
    // bgmusic3 = this.game.add.audio('bgm3');
    // if(!bgmpl && localStorage.getItem("sound")=="true"){
    //   var musics = [bgmusic, bgmusic2, bgmusic3];
    //   var rmusic = rint(0,2);
    //   musics[rmusic].play();
    //   bgmpl=true;
    //   musics[rmusic].play().volume = 0.3;
    // }
    
  },


  update: function() {
    if(!ended){
      this.background.tilePosition.x -=2;
      this.ground.tilePosition.x -= 5;
      this.light.tilePosition.x -= 5;

      if(magnetActivated){
        this.coins.forEach(function(item) {
          this.game.physics.arcade.moveToObject(item, this.player, 1000);
        }, this);
      }

      if(shieldActivated){
        this.player.tint = 0x0A91FF;
      }else{
        this.player.tint = 0xffffff;
      }

      if(this.player.position.y>550)this.player.position.y = 400;

      //collision
      this.game.physics.arcade.collide(this.player, this.col_bottom);
      this.game.physics.arcade.collide(this.player, this.col_top);
      if(shieldActivated){
        this.game.physics.arcade.overlap(this.player, this.bombs, this.shieldAction, null, this);
      }else{
        this.game.physics.arcade.overlap(this.player, this.bombs, this.gameOver, null, this);
      }
      
      this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

      if(this.player.body.onFloor() || this.player.body.touching.down || this.player.position.y < 150){
        this.player.animations.play('walk', 30, true);
      }else{
        this.player.animations.stop(null, true);
      }
      
    }

  },

  render: function(){
     // this.game.debug.body(this.player);
  },

  countScore: function() {
    if(!ended){
      score++;
      if(localStorage.getItem("specialPlayer")=="true"){
        this.game.time.events.add(700, this.countScore, this);
      }else{
        this.game.time.events.add(1500, this.countScore, this);
      }
      this.score_text.text = 'Score: ' + score;
    }
  },

  collectCoin: function(player, coin){
    coin.destroy();
    if(localStorage.getItem("doubleCoin")=="true"){
      coins+=2;
    }else coins+=1;

    this.coin_text.setText(coins);

    this.playSound(this.coinSound);

    var a = this.game.add.tween(this.coin_icon.scale).to( { y: 1.3, x: 1.3  }, 150, Phaser.Easing.Linear.None, true);
    a.yoyo(true, 300);
    //this.game.add.tween(this.coin_icon.scale).to( { y: 1}, 200, Phaser.Easing.Linear.None, true);
  },

  gameOver: function(pl, bomb) {

    if(localStorage.getItem("superLife")=="true" && !superLifeUsed){
      bomb.destroy();
      superLifeUsed=true;
      this.playSound(this.breakSound);
    }else{

      this.game.camera.flash("0xE83838");

      //Unlock Niks
      if(score>=100 && localStorage.getItem("specialPlayer")=="false"){
        localStorage.setItem("specialPlayer",true);
        swal("WoW!!!","You unlocked our special character - Niks", "success");
        this.game.time.events.add(2500, this.openPanel, this);
        this.game.time.events.add(2500, this.openWheel, this);
      }if(score>=30){
        //Wheel of fortune
        this.game.time.events.add(1000, this.openPanel, this);
        this.game.time.events.add(1000, this.openWheel, this);

      }else{
         this.game.time.events.add(1000, this.openPanel, this);
      }
      ended=true;

      pl.kill();
      
      magnetActivated=false;
      shieldActivated=false;
      
      emitter = this.game.add.emitter(this.player.position.x, this.player.position.y, 100);
      emitter.makeParticles('particle');
      emitter.gravity = 250;
      emitter.start(true, 2000, null, 40);
     
      this.playSound(this.deathSound);

      this.bombs.forEach(function(item) {
        item.body.velocity.x = 0;
        item.body.gravity.y=1000;
      }, this);
      this.coins.forEach(function(item) {
        item.body.velocity.x = 0;
        item.body.gravity.y=1000;
      }, this);


      var tempMoney = coins;
      
      var tempScore = score;

      var tempMoney2 = parseInt(localStorage.getItem("money"));

      tempMoney2+=coins;
      localStorage.setItem("money",tempMoney2);

      var tempScore2 = parseInt(localStorage.getItem("max_score"));
      
      if(tempScore2 < score){
        tempScore2 = score;
        localStorage.setItem("max_score",tempScore2);
      }

      localStorage.setItem("last_score",score);

      if(localStorage.getItem("doubleCoin")=="true"){
        localStorage.setItem("doubleCoin", false);
      }

      localStorage.setItem("superLife", false);

      var temp_gamesPlayed = parseInt(localStorage.getItem("gamesPlayed"));
      temp_gamesPlayed++;
      localStorage.setItem("gamesPlayed",temp_gamesPlayed);

      //this.player.body.gravity.y=1200;
     // this.game.add.tween(this.player).to( { angle: -90 }, 500, Phaser.Easing.Linear.None, true);
    }
  },

  openWheel: function() {
      room = this.game.add.sprite(0, 0, "wheel_room");
      wheel = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "wheel");
      wheel.anchor.set(0.5);
      pin = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "pin");
      pin.anchor.set(0.5);
      canSpin = true;

      pin.inputEnabled = true;
      wheel.inputEnabled = true;
      pin.events.onInputDown.add(this.spin, this);
      wheel.events.onInputDown.add(this.spin, this);
      // pin.input.onDown.add(this.spin, this); 
  },

  spin: function(){
       if(canSpin){
            var rounds = this.game.rnd.between(2, 10);
          var degrees = this.game.rnd.between(0, 360);
          prize = slices - 1 - Math.floor(degrees / (360 / slices));
          canSpin = false;
          var spinTween = this.game.add.tween(wheel).to({
               angle: 360 * rounds + degrees
          }, 3000, Phaser.Easing.Quadratic.Out, true);


          spinTween.onComplete.add(function(){
            if(slicePrizeNumbers[prize]==800){
              this.game.camera.flash("0xFFEA00");
            }
            if(slicePrizes[prize]!="BAD LUCK!"){
              swal("Wheel of Fortune!", "You won: "+slicePrizes[prize], "success");
              var temp_money = parseInt(localStorage.getItem("money"));
              temp_money+=slicePrizeNumbers[prize];
              localStorage.setItem("money",temp_money);
            }else{
              sweetAlert("Ohh, bad luck!", "Maybe next time you will be better :P", "error");
            }
            spinned++;
            if(score>=100&&spinned<2){
              canSpin=true;
            }else if(score>=150&&spinned<3){
              canSpin=true;
            }else if(score>=200&&spinned<5){
              canSpin=true;
            }else{
              room.destroy();
              wheel.destroy();
              pin.destroy();
            }
          }); 
        }
  },

  shieldAction: function(pl, bomb){
    bomb.destroy();
    if(localStorage.getItem("doubleCoin")=="true"){
      coins+=2;
    }else coins+=1;

    this.coin_text.setText(coins);

    this.playSound(this.coinSound);
  },

  openPanel: function() {
    this.panel = this.game.add.sprite(400,300, 'panel');
    this.panel.anchor.setTo(0.5);
    this.panel.scale.setTo(0.8);

    menubtn = this.game.add.button(250, 400, 'menu_btn', this.toMenu, this);
    menubtn.anchor.setTo(0.5);

    againbtn = this.game.add.button(550, 400, 'again_btn', this.startGame, this);
    againbtn.anchor.setTo(0.5);


    this.score_text2 = this.game.add.bitmapText(400, 100, 'myFont3', "Your record: "+localStorage.getItem("max_score"), 36)
    this.score_text2.align = 'center';
    this.score_text2.x = this.game.width / 2 - this.score_text2.textWidth / 2;
    
    // var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    // spaceKey.onDown.add(this.startGame, this);

  },

  toMenu: function() {
    this.game.state.start('Menu');
  },

  spawnBomb: function() {
    if(!ended){
      var bomb = this.game.add.sprite(800, rint(100,400), 'bomb');
      this.bombs.add(bomb);

      this.game.physics.arcade.enable(bomb);
      bomb.outOfBoundsKill = true;
        bomb.body.velocity.x = bombSpeed+(rint(50, 200)*-1);
        // console.log(bombSpeed+(rint(50, 200)*-1));
      bomb.checkWorldBounds = true;
      var rsize = rint(30,65);
      bomb.width = rsize;
      bomb.height = rsize;

    
      this.game.time.events.add(bombRate, this.spawnBomb, this);
      this.game.time.events.add(1000, this.speedUp, this);  
    }
    
  },

  spawnCoin: function() {
    if(!ended){
      var coin = this.game.add.sprite(800, rint(100,400), 'coin');
      this.coins.add(coin);

      this.game.physics.arcade.enable(coin);
      coin.outOfBoundsKill = true;
      coin.body.velocity.x = -300;
      coin.checkWorldBounds = true;
    }
  },

  speedUp: function() {
    if(bombRate<500){
      bombRate=1500;
    }else{
      bombRate -= 50;
    }
  },

  changeGravity: function() {
    this.playSound(this.gravitySound);

    if(plGravity>0)this.player.body.gravity.y = plGravity*=-1;
    else this.player.body.gravity.y = plGravity*=-1;

    if(gravityDir==0){
      this.game.add.tween(this.player.scale).to( { y: -0.8}, 200, Phaser.Easing.Linear.None, true);
      gravityDir=1;
      // this.player.anchor.setTo(0.5,1);
      // this.player.height = -150;
    }else{
      this.game.add.tween(this.player.scale).to( { y: 0.8}, 200, Phaser.Easing.Linear.None, true);
      gravityDir=0;
      // this.player.anchor.setTo(0.5,0);
      // this.player.height = 150;
    }
  },
  activateMagnet: function() {
    if(localStorage.getItem("magnet")=="true" && !magnetActivated){
      localStorage.setItem("magnet",false);
      magnetActivated=true;
      this.playSound(this.magnetSound);
      this.game.time.events.add(25000, function(){magnetActivated=false;});
    }
  },
  activateShield: function() {
    if(localStorage.getItem("shield")=="true" && !shieldActivated){
      this.game.camera.flash("0x477BD6");
      localStorage.setItem("shield",false);
      shieldActivated=true;
      this.playSound(this.shieldSound);
      this.game.time.events.add(10000, function(){shieldActivated=false;});
    }
  },
  activateExplosion: function() {
    if(localStorage.getItem('explosion')=="true" && !explosionUsed){
      explosionUsed=true;
      this.playSound(this.explosionSound);
      this.game.camera.shake();
      this.bombs.forEach(function(item) {
        var tem = this.game.add.emitter(item.position.x, item.position.y, 50);
        tem.makeParticles('particle2');
        tem.gravity = 250;
        tem.start(true, 2000, null, 40);
      }, this);
      this.bombs.removeAll();
    }
  },
  startGame: function() {
    this.game.state.start('Game');
  },

  playSound: function(n){
    if(localStorage.getItem("sound")=="true"){
      n.play();
    }
  }
};

function rint(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}