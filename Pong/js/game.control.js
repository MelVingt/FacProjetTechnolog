game.control = {
	mousePointer : null,
	controlSystem: null,
	currentPlayer: null,
	onKeyDown : function(event) {
		game.control.controlSystem = "KEYBOARD";
		if ( event.keyCode == game.keycode.KEYDOWN ) {
			game.players[game.control.currentPlayer].goDown = true;
		} else if ( event.keyCode == game.keycode.KEYUP ) {
			game.players[game.control.currentPlayer].goUp = true;
		}
		game.socket.emit("playerOne",game.players);
	},

	onKeyUp : function(event) {
		if ( event.keyCode == game.keycode.KEYDOWN ) {
			game.players[game.control.currentPlayer].goDown = false;
		} else if ( event.keyCode == game.keycode.KEYUP ) {
			game.players[game.control.currentPlayer].goUp = false;
		}
		game.socket.emit("playerOne",game.players);
	},

	onMouseMove : function(event) {
		// game.control.controlSystem = "MOUSE";
		// if ( event ) {
		// 	game.control.mousePointer = event.clientY;
		// }
		//
		// if ( game.control.mousePointer > game.playerOne.posY ) {
		// 	game.playerOne.goDown = true;
		// 	game.playerOne.goUp = false;
		// } else if ( game.control.mousePointer < game.playerOne.posY ) {
		// 	game.playerOne.goDown = false;
		// 	game.playerOne.goUp = true;
		// } else {
		// 	game.playerOne.goDown = false;
		// 	game.playerOne.goUp = false;
		// }
	}
}
