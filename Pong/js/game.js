var game = {
	groundWidth : 700,
	groundHeight : 400,
	groundColor: "#000000",
	netWidth : 6,
	netColor: "#FFFFFF",
	groundLayer : null,
	// datas for scorePlayer
	scorePosPlayer1 : 270,
	scorePosPlayer2 : 395,
	ball : null,
	players : [],
	//On choisi le 
	//main player = player de la fenêtre
	mainPlayer : null,
	playerReady : true,
	setMainPlayer : function(){
	var myselect = document.getElementById("choixPlayer");
	this.mainPlayer = myselect.options[myselect.selectedIndex].value;
    game.control.currentPlayer = parseInt(this.mainPlayer)-1;
    this.initConnection()
  	},
	// socket
	socket: null,
    requestGameDatas: function() {
      this.socket = io.connect('http://localhost:3000/');
      this.socket.emit("requestGameDatas");
      this.socket.once("requestGameDatas",function(ball,players,isNumberOfPlayerSet){
        game.ball=ball;
        game.players=players;
        game.init()
        if(isNumberOfPlayerSet){
        	game.display.choosePlayer();
        } else {
        	game.socket.once("updateNumbersOfPlayers",function(){
        		    location.reload();
        	})
        }
      })
    },
    init : function() {
    	this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#555555", 0, 0); 
    	game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth/2 - this.netWidth/2, 0);
    	this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
    	this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);  
    	this.displayScore(this.players[0].score,this.players[1].score);
    	this.displayBall();
    	this.displayPlayers();
    	this.initKeyboard(game.control.onKeyDown,game.control.onKeyUp);
	},
	choosePlayer: function(){
		console.log("ichosse");
		var numberOfPlayer = document.querySelector('input[name="numberOfPlayer"]:checked').value;
		this.socket.emit("numberOfPlayer",parseInt(numberOfPlayer));
	},
  	playerIsReady: function(){
    	if(game.mainPlayer!=0&&game.mainPlayer!=null&&game.playerReady) {
        	console.log("player "+game.mainPlayer+" is ready");
			game.socket.emit("ready",game.mainPlayer-1);
			game.playerReady = false;
    	}
  	},
	//Affichage des scores
	score : function(){
		if(game.ball.posX <= -3){
			this.players[1].score += 1;
			this.socket.emit('score',this.players[0].score,this.players[1].score);
			//gestion des scores sans socket
			//this.clearLayer(this.scoreLayer);
			//this.displayScore(this.playerOne.score,this.playerTwo.score);
			return true;
		  }
		  else if(game.ball.posX >= 700){
			this.players[0].score += 1;
			this.socket.emit('score',this.players[0].score,this.players[1].score);
			//gestion des scores sans socket
			//this.clearLayer(this.scoreLayer);
			//this.displayScore(this.playerOne.score,this.playerTwo.score);
			return true;
		}
		  return false;
	 },
	//Fonction pour se connecter au jeu 
	initConnection : function(){
		this.socket.on("move",function(data) {
		for(let item in data) {
			game.players[item]= data[item];
		}
		game.clearLayer(game.playersBallLayer);
		game.displayPlayers();
		game.displayBall();
    });
    this.socket.on("ball",function(ball,players){
      game.ball=ball;
      game.players=players;
      game.clearLayer(game.playersBallLayer);
      game.displayPlayers();
      game.displayBall();
	});

	//gestion des score avec les socket (les scores sont géré seulement par le joueur1)
	this.socket.on('score',function(score1,score2){
		game.players[0].score = score1;
		game.players[1].score = score2;
		game.clearLayer(game.scoreLayer);
		game.displayScore(game.players[0].score,game.players[1].score);
	})
	},
	//
	displayScore : function(scorePlayer1, scorePlayer2) {
		game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
		game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
	},

	displayBall : function() {
		game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
	},

	displayPlayers : function() {
    for(let playerIndex in game.players) {
        player = game.players[playerIndex];
        game.display.drawRectangleInLayer(this.playersBallLayer, player.width, player.height, player.color, player.posX, player.posY);
    }
		
	},

	moveBall : function(){
		this.ball.move();
		this.ball.bounce(this.wallSound);
		this.displayBall();
	},  
	// supprimer le score 
	clearLayer : function(targetLayer) {
		targetLayer.clear();
	},
  	//controle
  	initKeyboard : function(onKeyDownFunction, onKeyUpFunction) {
  		window.onkeydown = onKeyDownFunction;
  		window.onkeyup = onKeyUpFunction;
  	},

  	initMouse : function(onMouseMoveFunction) {
  		window.onmousemove = onMouseMoveFunction;
  	},
  	// bouger les joueurs
	movePlayers : function() {
    game.movePlayer(game.players[0]);
    game.movePlayer(game.players[1]);
	},
  // Bouger le joueur
    movePlayer : function(player) {
		if ( game.control.controlSystem == "KEYBOARD" ) {
		// keyboard control
			if (player.goUp && player.posY > 0) {
				player.posY-=5;
			}
			else if (player.goDown && player.posY < game.groundHeight - player.height) {
				player.posY+=5;
			} else if ( game.control.controlSystem == "MOUSE" ) {
				//mouse control
				if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer) {
				player.posY-=5;
				} else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer) {
					player.posY+=5;
				}
			}
		}
    },

  collideBallWithPlayersAndAction : function() { 
    if ( this.ball.collide(game.playerOne) ) {
    	game.ball.directionX = -game.ball.directionX;
    }
    if ( this.ball.collide(game.playerTwo) ) {
    	game.ball.directionX = -game.ball.directionX;
    }
  }, 
};
