
function FlappyMenu(w, h, game){
	Menu.call(this, w, h);

	this.background = game.background;
    this.background_width = (HEIGHT/288)*1157;

	this.init = function(){
		this.title = "Flappy Birdy";
		this.options.push("Press ENTER to start!");
	}

	this.renderBackground = function(ctx){

		ctx.drawImage(this.background,0,0);
		ctx.drawImage(this.background,0,0, this.background_width, HEIGHT);


	}

	this.renderSelector = function(ctx, x, y){
		ctx.fillRect(x, y-2.5, 5, 5);
	}
}

function OverMenu(w, h){
	Menu.call(this, w, h);

	this.init = function(){
		this.title = "Game Over";
		this.options.push("Press ESCAPE to exit!");
		this.options.push("Press SPACE to play again!")
	}
	this.renderSelector = function(ctx, x, y){

		ctx.fillRect(x, y-2.5, 5, 5);
	}
}
