game.config = {
	init_config_game: function() {
	var inputElement = document.createElement('input');
	inputElement.type = "button";
	inputElement.text = "Joueur 1";
	inputElement.addEventListener('click', function(){
	    console.log("je choisis un joueur");
	});
	document.body.appendChild(inputElement);
	}
};