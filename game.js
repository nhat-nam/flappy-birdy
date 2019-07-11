
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
   this.background_speed = -200;
   this.background_width = (HEIGHT/288)*1157;
   this.background_x = 0;

   this.menu = new FlappyMenu(width, height, this);
   this.menu.init();

   // high score manager
   this.highScoreManager = new HighScoreManager("FlappyBirdy");

   // sound manager
   this.soundManager = new SoundManager();
   this.soundManager.addSound("jump", document.getElementById("jump-sound"));
   this.soundManager.addSound("score", document.getElementById("score-sound"));

   // game state variables
   this.game_state = "menu";
   this.player_count = 1;
   this.player_points = 0;

   // bird object
   this.bird = new Bird();

   // array of pipes
   this.pipes = [];

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

      }else if(this.game_state == "game_over"){
         if(  this.highScoreManager.isHighScore( this.player_points ) ){
            // get their name
            this.highScoreManager.addHighScore("nam", this.player_points);
            
            this.game_state = "high_score";
         }
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


         this.bird.update(delta);
         /* check for top of screen and bottom of screen */
         if(this.bird.y <=10){
            this.bird.y = 10;
         }
         if(this.bird.y >= HEIGHT-15){
            this.bird.y = HEIGHT-15;
         }


         for(var i=0; i< this.pipes.length;i++){
            var pipe = this.pipes[i];
            pipe.update(delta);

            if(this.bird.collides(pipe)){
               this.game_state = "game_over";
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
     
         if( !this.pipes[0]._scored){
            if(this.bird.x >= this.pipes[0].x + this.pipes[0].width){
               this.player_points++;
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
         }else if(this.game_state == "paused"){
            for(var i=0; i< this.pipes.length;i++){
               var pipe = this.pipes[i];
               pipe.render(this.ctx);
            }
            this.bird.render(this.ctx);
            this.drawScore();
            this.drawInstructions();
         } else{
            for(var i=0; i< this.pipes.length;i++){
               var pipe = this.pipes[i];
               pipe.render(this.ctx);
            }

            this.drawScore();
            this.bird.render(this.ctx);
         
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
      this.game_state = "playing";
      this.init_pipes();
   }
}
window.onkeydown = function(e){
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
   if(e.key == "Enter"){
      if(game.game_state == "menu"){
         game.startGame();
      }

   }
   if(e.key == "Escape"){
      if(game.game_state == "playing"){
         game.pause();
      }
   }

}
// create game and start game
var game = new Game(ctx, WIDTH, HEIGHT);
game.loop();
