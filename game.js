WIDTH = 400;
HEIGHT = 500;

MAX_HEIGHT_DIFFERENCE = 200;
PIPE_SPACING = 250;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.fillRect(0, 0, WIDTH, HEIGHT);


function Game(context, width, height) {

   this.ctx = context;
   this.width = width;
   this.height = height;
   this._delta = 1000/100;


   // Background image -- 1157 x 288. 
   this.background = new Image();
   this.background.src = "./background.png";
   this.background_speed = -50;
   this.background_width = (HEIGHT/288)*1157;
   this.background_x = 0;

   // high score manager
   this.highScoreManager = new HighScoreManager("FlappyBirdy");

   this.menu = new FlappyMenu(width, height, this);
   this.menu.init();
   this.highscore_menu = new HighScoreMenu(width, height, this);
   this.highscore_menu.init(this.highScoreManager);
   this.over_menu = new GameOverMenu(width, height);
   this.over_menu.init();
   this.newhighscore_menu = new NewHighscoreMenu(width, height);
   this.newhighscore_menu.init();

   // sound manager
   this.soundManager = new SoundManager();
   this.soundManager.addSound("jump", document.getElementById("jump-sound"));
   this.soundManager.addSound("score", document.getElementById("score-sound"));

   // game state variables
   this.game_state = "menu";
   this.player_count = 1;
   this.player_points = 0;
   this.player_name = "";
   this.point_multiplier = 1;

   // bird object
   this.bird = new Bird();

   // array of pipes
   this.pipes = [];

   //power cube object
   this.powercube = new PowerCube(-100, -100);

   /**
    * Reset game state variables
    */ 
   this.reset = function(){
      this.background_x = 0;
      this.bird.reset();
      this.player_points = 0; 

      this.pipes = [];
      this.init_pipes();
      this.over_menu.current_option = 0;
      this.menu.current_option = 0;

      //reset powercube

      var y = Math.random()*(HEIGHT - this.powercube.length*2) + this.powercube.length;
      var x = 1315 + PIPE_SPACING*(5+(Math.random() * 1)) ;
      this.powercube.x = x;
      this.powercube.y = y;
   }

   /**
   *    Game Loop
   **/
   this.loop = function(){
		this.update(this._delta);   
		this.render();
		var g = this;
		setTimeout(
			function(){g.loop();},
			this._delta
		);

   }
   /** 
   *  Update
   **/
   this.update = function(delta) {
      
  
      if(this.game_state == "paused"){

      }else if(this.game_state == "free_falling"){
         this.bird.update(delta);

         if(this.bird.y - 10 >= HEIGHT){
            if(  this.highScoreManager.isHighScore( this.player_points ) ){
               // get their name
               this.game_state = "new_highscore";
            } else{
               this.game_state = "game_over";
            }
         }
      }else if(this.game_state == "game_over"){

         this.bird.update(delta);
         //once bird is off the screen...then switch game states...

      }else if(this.game_state == "high_score"){
         this.bird.update(delta);

      }else if(this.game_state == "menu"){
         
      }else if(this.game_state == "playing" ){
         /* update background */

         this.background_x = this.background_x + this.background_speed * (delta/1000);
         if(this.background_x < -1* this.background_width + WIDTH+260){
            this.background_x = 0;
         }

         this.powercube.update(delta);

         /* if powercube is off screen, randomly create new powercube location ahead of bird */
         if(this.powercube.x < -10){
            this.powercube.x = 1315;
            this.powercube.y = Math.random()*HEIGHT;
         }


         this.bird.update(delta);
         /* check for top of screen and bottom of screen */
         if(this.bird.y <=10){
            this.bird.y = 10;
         }
         if(this.bird.y - this.bird.height_radius >= HEIGHT){
            this.game_state = "free_falling";
         }

         for(var i=0; i< this.pipes.length;i++){
            var pipe = this.pipes[i];
            pipe.update(delta);

            if(this.bird.collides(pipe)){
               this.game_state = "free_falling";
            }
         }
         if(this.pipes[0].x + this.pipes[0].width+10 < 0){
            //remove pipe
            this.pipes.splice(0, 1);
            var pipe = new Pipe(1190, Math.random()*300 + 100)

            // compare this.pipes[this.pipes.length-1].height WITH pipe.height
            if( Math.abs(pipe.height - this.pipes[this.pipes.length-1].height) > MAX_HEIGHT_DIFFERENCE){

               if( this.pipes[this.pipes.length-1].height > pipe.height){
                  pipe.height = this.pipes[this.pipes.length-1].height - MAX_HEIGHT_DIFFERENCE;
               }else{
                  pipe.height= this.pipes[this.pipes.length-1].height + MAX_HEIGHT_DIFFERENCE;
               }
            }
            this.pipes.push(pipe);
         }         
     
         if(this.bird.collides2( this.powercube ) ){
            this.powerUp();
         }

         if( !this.pipes[0]._scored){
            if(this.bird.x >= this.pipes[0].x + this.pipes[0].width){
               this.player_points += 1 * this.point_multiplier;
               this.pipes[0]._scored = true;
               this.soundManager.playSound("score");
            }
         }

      }

   }

   /**
   *  Render game objects
   * 
   *  
   **/
   this.render = function() {
   		this.ctx.clearRect(0, 0, this.width, this.height);
   		this.ctx.fillStyle = "black";
   		this.ctx.drawImage(this.background,this.background_x,0, this.background_width, HEIGHT);
        
         if(this.game_state == "menu"){
            this.menu.render(this.ctx);
         }else if(this.game_state == "highscore"){

            this.highscore_menu.render(this.ctx);

         }else if(this.game_state == "paused"){
            for(var i=0; i< this.pipes.length;i++){
               var pipe = this.pipes[i];
               pipe.render(this.ctx);
            }
            this.bird.render(this.ctx);
            this.drawScore();
            this.drawInstructions();
         }else{
            for(var i=0; i< this.pipes.length;i++){
               var pipe = this.pipes[i];
               pipe.render(this.ctx);
            }

            this.drawScore();
            
            this.powercube.render(this.ctx);
            this.bird.render(this.ctx);

            if(this.game_state == "game_over"){

               this.over_menu.render(this.ctx);
            }else if(this.game_state == "new_highscore"){
               // 
               this.newhighscore_menu.render(this.ctx);
            }
         }

   }

   this.drawInstructions = function(){
      ctx.font = "900 16px 'Press Start 2P'";
      ctx.fillStyle="black";
      ctx.fillText("Press SPACE to continue", 20, 400);
      ctx.filStyle = "white";
   }


   this.drawScore = function(){
      ctx.font = "25px 'Press Start 2P'";
      ctx.fillText(this.player_points, 80, 50);
      ctx.filStyle = "black";
   }
   this.init_pipes = function(){
      // temp pipe....first 5 pipes
      this.pipes.push( new Pipe(600, 200));
      this.pipes.push( new Pipe(850, 250));
      this.pipes.push( new Pipe(1100, 350));
      this.pipes.push( new Pipe(1350, 250));
      this.pipes.push( new Pipe(1600, 300));

   }
   this.pause = function(){
      this.game_state = "paused";
   }
   this.unpause = function(){
      this.game_state = "playing";
   }   
   this.startGame = function(){
      this.reset();
      this.game_state = "playing";
   }
   this.showHscore = function(){

   }
   this.powerUp = function(){
      this.point_multiplier = 2;
      var game = this;
      setTimeout(
            function(){ 
               game.point_multiplier = 1;
            }
      ,5000);
   }
}


window.ontouchstart = function(e){

   if(game.game_state == "playing"){
         game.bird.flap();
         game.soundManager.playSound("jump");
   }else   if(game.game_state == "menu"){
      if(game.menu.current_option == 0){
         game.startGame();
      }
   }else if(game.game_state =="game_over"){
         
         if(game.over_menu.current_option == 0){
            game.game_state = "menu";
         } 
   }

}

window.onkeydown = function(e){

   if(game.game_state == "new_highscore"){
      //e.preventDefault();
      var alphabet = "-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      var key = e.key;
      if(alphabet.indexOf(key)>=0){

         game.player_name = game.player_name + key.toUpperCase();

         if(game.player_name.length > 3){
            game.player_name = game.player_name.substring(0, 3);
         }
         game.newhighscore_menu.options[0].value = game.player_name;
      }else if(key == "Enter"){

         //save 
         while(game.player_name.length<3){
            game.player_name = game.player_name + " ";
         }
         game.newhighscore_menu.options[0].value = game.player_name;
         game.highScoreManager.addHighScore(game.player_name, game.player_points);
         game.highscore_menu.reload();
         game.game_state = "menu";
      }else if(key=="Backspace"){
         game.player_name = game.player_name.substring(0, game.player_name.length -1);

         game.newhighscore_menu.options[0].value = game.player_name;
      }

      return;
   }
   if(e.key == " "){
      e.preventDefault();

      // add game_state checks her
      if(game.game_state == "playing"){
         game.bird.flap();
         game.soundManager.playSound("jump");
      }else if (game.game_state == "paused"){
         game.unpause();
      }  
   }
   if(e.key == "ArrowUp"){
      if(game.game_state == "menu"){
         game.menu.optionUp();
      } else if(game.game_state == "highscore"){
         game.menu.optionUp();
      }
   }
   if(e.key == "ArrowDown"){
      if(game.game_state == "menu"){
         game.menu.optionDown();
      } else if(game.game_state == "highscore"){
         game.menu.optionDown();
      }
   }
   if(e.key == "Enter"){
      if(game.game_state == "menu"){
         if(game.menu.current_option == 0){
            game.startGame();
         }else {
            game.game_state = "highscore";
         }
      }else if(game.game_state =="highscore"){
         game.game_state = "menu";
      } else if(game.game_state =="game_over"){
         
         if(game.over_menu.current_option == 0){
            game.game_state = "menu";
         }      
      }
   }
   if(e.key == "Escape"){
      if(game.game_state == "playing"){
         game.pause();
      }
   }

   if(e.key == "h"){
      if(game.game_state == "menu"){
         game.showHscore();
      }
   }

}
// create game and start game
var game = new Game(ctx, WIDTH, HEIGHT);
game.loop();
