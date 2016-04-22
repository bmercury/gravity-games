var SideScroller = SideScroller || {};
SideScroller.Menu = function(){};


var style = { font: "24px Arial", fill: "#000"};

var playbtn;

var pubMoney;

SideScroller.Menu.prototype = {
  create: function() {

    this.space = this.game.add.sprite(0,0, 'space');
    this.background = this.game.add.sprite(0,0, 'bg');
    this.ground = this.game.add.sprite(0,0, 'ground');
    this.light = this.game.add.sprite(0,0, 'light');
    this.panel = this.game.add.sprite(400,300, 'panel');
    this.panel.anchor.setTo(0.5);
    this.panel.scale.setTo(0.8);

    var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.startGame, this);

    //sounds
    // this.coinSound = this.game.add.audio('coin');
    this.deathSound = this.game.add.audio('pop');
    // this.gravitySound = this.game.add.audio('swing');

    //Texts
    this.score_text = this.game.add.bitmapText(400, 100, 'myFont3', 'Your record: 0', 36)
    this.score_text.align = 'center';
    this.score_text.x = this.game.width / 2 - this.score_text.textWidth / 2;

    this.lastscore_text = this.game.add.bitmapText(400, 150, 'myFont3', 'Your record: 0', 20)
    this.lastscore_text.align = 'center';
    this.lastscore_text.x = this.game.width / 2 - this.lastscore_text.textWidth / 2;

    this.allgames_text = this.game.add.bitmapText(400, 170, 'myFont3', 'Games played: 0', 20)
    this.allgames_text.align = 'center';
    this.allgames_text.x = this.game.width / 2 - this.allgames_text.textWidth / 2;
    // this.score_text.anchor.setTo(0.5);
    
    this.coin_text = this.game.add.bitmapText(50, 10, 'myFont3', '0', 24)
    this.coin_icon = this.game.add.sprite(25, 20, 'coin');
    this.coin_icon.scale.setTo(0.6);
    this.coin_icon.anchor.setTo(0.5);


    this.setData();

    myItems = this.game.add.button(0, 560, 'items', this.getItems, this);

    playbtn = this.game.add.button(200, 425, 'play_btn', this.startGame, this);
    playbtn.anchor.setTo(0.5);

    bonusbtn = this.game.add.button(335, 425, 'bonus_btn', this.openBonus, this);
    bonusbtn.anchor.setTo(0.5);

    charactersbtn = this.game.add.button(465, 425, 'wheel_button', this.startGame, this);
    charactersbtn.anchor.setTo(0.5);

    if(localStorage.getItem("sound")=="true"){
      soundbtn = this.game.add.button(600, 425, 'sound_btn', this.toggleSound, this);
    }else{
      soundbtn = this.game.add.button(600, 425, 'muted_btn', this.toggleSound, this);
    }
    soundbtn.anchor.setTo(0.5);
    // bgmusic = this.game.add.audio('bgm1');

    // bgmusic.play();
  },


  toggleSound: function() {
    if(localStorage.getItem("sound")=="true"){
      localStorage.setItem("sound",false);
      soundbtn.loadTexture("muted_btn");
    }else if(localStorage.getItem("sound")=="false"){
      localStorage.setItem("sound",true);
      soundbtn.loadTexture("sound_btn");
    }
  },

  getItems: function() {

    var item1 = localStorage.getItem("doubleCoin");
    var item2 = localStorage.getItem("shield");
    var item3 = localStorage.getItem("magnet");
    var item4 = localStorage.getItem("superLife");
    var item5 = localStorage.getItem("explosion");

    if(item1=="false")item1="no";
    else item1="yes";
    if(item2=="false")item2="no";
    else item2="yes";
    if(item3=="false")item3="no";
    else item3="yes";
    if(item4=="false")item4="no";
    else item4="yes";
    if(item5=="false")item5="no";
    else item5="yes";

    swal("Double coins: "+item1+"\nShield: "+item2+"\nMagnet: "+item3+"\nSecond Life: "+item4+"\nExplosion: "+item5);
  },

  openBonus: function() {
    //Double coins
    itembtn1 = this.game.add.button(200, 270, 'item1', function(){this.buyItem(1);}, this);
    itembtn1.anchor.setTo(0.5);
    itembtn1.scale.setTo(0.7);
    //Shield
    itembtn2 = this.game.add.button(300, 270, 'item5', function(){this.buyItem(2);}, this);
    itembtn2.anchor.setTo(0.5);
    itembtn2.scale.setTo(0.7);
    //Magnet
    itembtn3 = this.game.add.button(400, 270, 'item3', function(){this.buyItem(3);}, this);
    itembtn3.anchor.setTo(0.5);
    itembtn3.scale.setTo(0.7);
    // //Heart
    itembtn4 = this.game.add.button(500, 270, 'item2', function(){this.buyItem(4);}, this);
    itembtn4.anchor.setTo(0.5);
    itembtn4.scale.setTo(0.7);
    // //Explosion
    itembtn5 = this.game.add.button(600, 270, 'item4', function(){this.buyItem(5);}, this);
    itembtn5.anchor.setTo(0.5);
    itembtn5.scale.setTo(0.7);

  },

  buyItem: function(n) {
    if(n==1){
      if(pubMoney>=50 && localStorage.getItem("doubleCoin", false) != "true"){
        pubMoney-=50;
        localStorage.setItem("money",pubMoney);
        localStorage.setItem("doubleCoin", true);
        this.setData();

        // swal("Yay! You will get two times more coins next time you play");
        swal("Yay!", "You will get two times more coins next time you play", "success")
      }
    }else if(n==2){
      if(pubMoney>=50 && localStorage.getItem("shield", false) != "true"){
        pubMoney-=50;
        localStorage.setItem("money",pubMoney);
        localStorage.setItem("shield", true);
        this.setData();

        swal("Yay!", " You will get a shield that lasts for 10 seconds next time you play", "success");
      }
    }else if(n==3){
      if(pubMoney>=75 && localStorage.getItem("magnet", false) != "true"){
        pubMoney-=75;
        localStorage.setItem("money",pubMoney);
        localStorage.setItem("magnet", true);
        this.setData();
        swal("Yay!", " You will get a coin magnet that lasts for 25 seconds next time you play", "success");
      }
    }else if(n==4){
      if(pubMoney>=100 && localStorage.getItem("superLife", false) != "true"){
        pubMoney-=100;
        localStorage.setItem("money",pubMoney);
        localStorage.setItem("superLife", true);
        this.setData();
        swal("Yay!", " You will be able to resist the deadly box one time next time you play", "success");
      }
    }else if(n==5){
      if(pubMoney>=150 && localStorage.getItem("explosion", false) != "true"){
        pubMoney-=150;
        localStorage.setItem("money",pubMoney);
        localStorage.setItem("explosion", true);
        this.setData();
        swal("Yay!", " You will be able to destroy all boxes you see next time you play", "success");
      }
    }
  },


  startGame: function() {
    // this.deathSound.play();
    this.game.state.start('Game');
  },

  update: function() {

  },

  setData: function(){

  var m = localStorage.getItem("money");
  var maxScore = localStorage.getItem("max_score");
  var lastScore = localStorage.getItem("last_score");

  pubMoney = parseInt(localStorage.getItem("money"));
  if(m==null){
    m=0;
    localStorage.setItem("money",0);
  }
  if(maxScore==null){
    maxScore=0;
    localStorage.setItem("max_score",0);
  }
  if(lastScore==null){
    lastScore=0;
    localStorage.setItem("last_score",0);
  }
  if(localStorage.getItem("specialPlayer")==null){
    localStorage.setItem("specialPlayer",false);
  }
  if(localStorage.getItem("gamesPlayed")==null){
    localStorage.setItem("gamesPlayed",0);
  }

  if(localStorage.getItem("doubleCoin")==null){
    localStorage.setItem("doubleCoin", false);
  }
  if(localStorage.getItem("shield")==null){
    localStorage.setItem("shield", false);
  }
  if(localStorage.getItem("magnet")==null){
      localStorage.setItem("magnet", false);
  }
  if(localStorage.getItem("superLife")==null){
    localStorage.setItem("superLife", false);
  }
  if(localStorage.getItem("explosion")==null){
    localStorage.setItem("explosion", false);
  }

  if(localStorage.getItem("sound")==null){
    localStorage.setItem("sound", true);
  }

  this.coin_text.text = m;
  this.score_text.text = "Your record: "+maxScore;
  this.lastscore_text.text = "Last game: "+lastScore;
  this.allgames_text.text = "Games played: "+localStorage.getItem("gamesPlayed");
}
};