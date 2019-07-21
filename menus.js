
function FlappyMenu(w, h, game){
	Menu.call(this, w, h);

	this.background = game.background;
    this.background_width = (HEIGHT/288)*1157;
    this.font = "14px 'Press Start 2P'";
    this.settings.title_font = "100px 'FlappyBirdy'";
    this.settings.options_x_pos = 120;
	this.init = function(){
		this.title = "Flappy Birdy";
		this.options.push("Start game!");
		this.options.push("High scores");
	}

	this.renderBackground = function(ctx){
		ctx.drawImage(this.background,0,0);
		ctx.drawImage(this.background,0,0, this.background_width, HEIGHT);
	}


	this.renderSelector = function(ctx, x, y){
		ctx.fillRect(x, y-2.5, 5, 5);
	}
}


function HighScoreMenu(w, h, game){
	Menu.call(this, w, h);

	this.background = game.background;
    this.background_width = (HEIGHT/288)*1157;
    this.font = "14px 'Press Start 2P'";
    this.settings.title_font = "100px 'FlappyBirdy'";
    this.settings.options_y_pos = 480;
    this.settings.options_x_pos = 120;

    this._highscoreManager;

	this.init = function(highscoreManager){
		this._highscoreManager = highscoreManager
		this.title = "High Scores";
		this.options.push("Return");

		var textBlock = new TextBlock(40, 140, w-80, 300);
		textBlock.settings.bg_color = "rgba(0,0,0,0)";
		textBlock.settings.font_color = "black";
		textBlock.settings.font = "32px 'Press Start 2P'";
		textBlock.settings.line_height = 50;


		for(var i=0;i<this._highscoreManager.scores.length;i++){
			var score_obj = this._highscoreManager.scores[i];

			var score_str = score_obj.score;
			if(score_str < 10){
				score_str = "...."+score_str;
			}else if(score_str< 100){
				score_str = "..." + score_str;
			}else if(score_str < 1000){
				
				score_str = ".." + score_str;
			}else{
				if(score_str > 9999){
					score_str = 9999;
				}
				score_str = "." + score_str;
			}
			textBlock.lines.push(score_obj.name.toUpperCase()+score_str);

		}
		this.child_nodes.push( textBlock );
	}
	this.reload = function(){
		var textBlock = this.child_nodes[0];
		textBlock.lines = [];
		for(var i=0;i<this._highscoreManager.scores.length;i++){
			var score_obj = this._highscoreManager.scores[i];

			var score_str = score_obj.score;
			if(score_str < 10){
				score_str = "...."+score_str;
			}else if(score_str< 100){
				score_str = "..." + score_str;
			}else if(score_str < 1000){
				
				score_str = ".." + score_str;
			}else{
				if(score_str > 9999){
					score_str = 9999;
				}
				score_str = "." + score_str;
			}
			textBlock.lines.push(score_obj.name.toUpperCase()+score_str);

		}

	}
	this.renderBackground = function(ctx){
		ctx.drawImage(this.background,0,0);
		ctx.drawImage(this.background,0,0, this.background_width, HEIGHT);
	}

	this.renderSelector = function(ctx, x, y){
		ctx.fillRect(x, y-2.5, 5, 5);
	}
}


function GameOverMenu(w, h){
	Menu.call(this, w, h);

    this.font = "14px 'Press Start 2P'";
    this.settings.title_font_color = "black";
    this.settings.title_font = "100px 'FlappyBirdy'";
    this.settings.options_x_pos = 110;
    this.settings.title_x_pos = 70;
	this.init = function(){
		this.title = "Game Over";
		this.options.push("Go Back To Menu");
	}

	this.renderBackground = function(ctx){
//		ctx.drawImage(this.background,0,0);
//		ctx.drawImage(this.background,0,0, this.background_width, HEIGHT);
	}


	this.renderSelector = function(ctx, x, y){
		ctx.fillRect(x, y-2.5, 5, 5);
	}
}


function NewHighscoreMenu(w, h){
	Menu.call(this, w, h);
    this.font = "14px 'Press Start 2P'";
    this.settings.title_font_color = "black";
    this.settings.title_font = "100px 'FlappyBirdy'";
    this.settings.options_x_pos = 140;
    this.settings.options_y_pos = 280;
    this.settings.title_x_pos = 70;

	var menuOption = new InitialsMenuOption(this.settings.options_x_pos,this.settings.options_y_pos);
	menuOption.value = "";
	this.options.push(menuOption)
	//HOW TO MAKE THE THINGS THINGIES

	this.init = function(){
		this.title = "Game Over";
		var textBlock = new TextBlock(40, 140, this.width - 80, 300);
		textBlock.settings.bg_color = "rgba(255, 165, 0, .6)";
		textBlock.settings.font_color = "white";
		textBlock.settings.font = "24 'Press Start 2P'";
		textBlock.settings.line_height = 50;
		textBlock.settings.rounded_corners = 15;
		textBlock.lines.push("New High Score");
		textBlock.lines.push("Your Name + ENTER");
		this.child_nodes.push(textBlock);
		this.child_nodes.push(menuOption);
	}
	this.renderSelector = function(ctx){}

	this.renderBackground = function(ctx){
		//no background..overlay game
	}
	

}



