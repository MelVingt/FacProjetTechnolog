var io = require("socket.io");
var sockets = io.listen(3000);
var players = null;
sockets.on('connection', function (socket) {
    socket.on('playerOne', function (data) {
        players = data;
        sockets.emit("move",data);    
    });
    sockets.emit("ball",ball);
});



var ball = {
      width : 10,
      height : 10,
      color : "#FFFFFF",
      posX : 200,
      posY : 200,
      directionX: 1,
      directionY: 1,
      speed : 8,
      move : function() {
        this.posX += this.directionX * this.speed;
        this.posY += this.directionY * this.speed;
      },
      bounce : function(soundToPlay) {
        if ( this.posX > 700 || this.posX < 0 ) {
          this.directionX = -this.directionX;
          //soundToPlay.play()
        }
        if ( this.posY > 400 || this.posY < 0  ) {
          this.directionY = -this.directionY;    
          //soundToPlay.play();  
        }
      },
      collide : function(anotherItem) {
            if ( !( this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX
              || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY ) ) {
        // Collision
            return true;
            } 
          return false;
        },
};
var moveTools= {
    moveBall: function(ball){
    ball.move();
    ball.bounce(this.wallSound);
  },
    collideBallWithPlayersAndAction : function(ball) { 
    if ( ball.collide(players[0]) ) {
      ball.directionX = -ball.directionX;
      //this.colideSound.play()
    }
    if ( ball.collide(players[1]) ) {
      ball.directionX = -ball.directionX;
      //this.colideSound.play()
    }
  },
}

mainBall = function(){
    moveTools.moveBall(ball);
    if(players!=null)
    moveTools.collideBallWithPlayersAndAction(ball)
    sockets.emit("ball",ball);
}
setInterval(mainBall,7);