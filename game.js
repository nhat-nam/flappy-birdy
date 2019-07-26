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
   
   this.swiped = false;
   this.swipedir = "";
   this.powerup_timer = 0;
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
   this.instructions_menu = new InstructionsMenu(width, height, this);
   this.instructions_menu.init();

   // sound manager
   this.soundManager = new SoundManager();
   this.soundManager.addSound("jump", document.getElementById("jump-sound"));
   this.soundManager.addSound("score", document.getElementById("score-sound"));
   this.soundManager.addSound("powerup", document.getElementById("powerup-sound"));

   // game state variables
   this.game_state = "menu";
   this.player_count = 1;
   this.player_points = 0;
   this.player_name = "";
   this.point_multiplier = 1;
   this.save_dy = 0;  

   // bird object
   this.bird = new Bird();

   // array of pipes
   this.pipes = [];

   //power cube object
   this.powercube = new PowerCube(1000, 400);

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
      this.powercube.x = 1000;
      this.powercube.y = 400;
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
         this.bird.affected_by_gravity = true;
         this.bird.update(delta);

         if(this.bird.y - 10 >= HEIGHT){
            if(  this.player_points > 0 && this.highScoreManager.isHighScore( this.player_points ) ){
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
   /*   }else if(this.game_state == "powerphase"){

         // momentarily stop updating objects         

*/
      }else if(this.game_state == "playing"){
         /* update background */
         if(this.powerup_timer > 0){
            this.powerup_timer = this.powerup_timer - delta;
         }else{
            this.point_multiplier = 1;
         }
         this.background_x = this.background_x + this.background_speed * (delta/1000);
         if(this.background_x < -1* this.background_width + WIDTH+260){
            this.background_x = 0;
         }

         this.powercube.update(delta);

         /* if powercube is off screen, randomly create new powercube location ahead of bird, reset power cube gotten state */
         if(this.powercube.x  < -1 * this.powercube.width){
            this.powercube.x = this.pipes[this.pipes.length-1].x + 140;
            this.powercube.y = 100 + Math.random()*(HEIGHT-200);  
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
     
            if(this.bird.collidesPower( this.powercube ) ){
                  this.powercube.random_power = Math.floor(Math.random() * this.powercube.number_of_powerups);
                  //this.game_state = "powerphase";
                  this.soundManager.playSound("powerup");
                  this.save_dy = this.bird.dy;

                  this.powercube.fillStyle = "rgba(200,0,0,.4)";
                  var game = this;

                  if(game.powercube.random_power == 0){
                     game.powerDoublePoints();
                  } else if(game.powercube.random_power == 1){
                     game.powerEasyControl();
                  }

                  setTimeout(function(){
                     game.powercube.fillStyle = "rgba(0,0,0,0)";
                  },250);
                  setTimeout(function(){
                     game.powercube.fillStyle = "rgba(200,0,0,.4)";
                  },500);
                  setTimeout(function(){
                     game.powercube.fillStyle = "rgba(0,0,0,0)";
                  },750);
                  setTimeout(function(){
                     game.powercube.fillStyle = "rgba(200,0,0,.4)";
                  },1000);
                  
                  setTimeout(
                     function(){ 
                        game.powercube.fillStyle = "rgba(0,0,0,0)";
                        game.powercube.x = game.pipes[game.pipes.length-1].x + 140;
                        game.powercube.y = 100 + Math.random()*(HEIGHT-200);  
                     },
                  1000);
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
         }else if(this.game_state == "instructions"){
            this.instructions_menu.render(this.ctx);
         }else{
            /* 
               Game scene
            */
            for(var i=0; i< this.pipes.length;i++){
               var pipe = this.pipes[i];
               pipe.render(this.ctx);
            }

            this.drawScore();
            if(this.point_multiplier == 2){
               this.drawX2();
               ctx.fillText(""+Math.floor(this.powerup_timer/1000) + "."+Math.floor(this.powerup_timer/10)%100, 150, 100);
               ctx.fillStyle = "white";
            }
      
            this.powercube.render(this.ctx);  
            this.bird.render(this.ctx);
            if(this.game_state == "paused"){
               this.drawInstructions();
            }else if(this.game_state == "game_over"){
               this.over_menu.render(this.ctx);
            }else if(this.game_state == "new_highscore"){
               this.newhighscore_menu.render(this.ctx);
            }
      }

   }

   this.drawX2 = function(){
      ctx.font = "900 16px 'Press Start 2P'";
      ctx.fillText("Double Points", 100, 120);
   }

   this.drawEzControl = function(){
      ctx.font = "900 16px 'Press Start 2P'";
      ctx.fillText("Easy Control", 100, 100);
   }
   this.drawInstructions = function(){
      ctx.save();
      ctx.font = "900 16px 'Press Start 2P'";
      ctx.fillStyle="black";
      ctx.fillText("Press SPACE to continue", 20, 400);
      ctx.restore();
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
      this.powerup_timer = 0;
   }
   this.showHscore = function(){

   }
   this.powerDoublePoints = function(){
      this.point_multiplier = 2;
      this.powerup_timer = 5000;
   }

   this.powerEasyControl = function(){
      this.bird.affected_by_gravity = false;
         var game = this;
         setTimeout(
               function(){ 
                  game.bird.affected_by_gravity = true;
               }
         ,8000);
      }
   }


window.ontouchend = function(e){

   if(!game.swiped){
      if(game.game_state == "playing"){
            game.bird.flap();
            game.soundManager.playSound("jump");
      }else if(game.game_state == "menu"){
         if(game.menu.current_option == 0){
            game.startGame();
         }else if(game.menu.current_option == 1){
            game.game_state = "highscore";
         }else if(game.menu.current_option == 2){
            game.game_state = "instructions";
         }
      }else if(game.game_state =="game_over"){
            
            if(game.over_menu.current_option == 0){
               game.game_state = "menu";
            } 
      }else if(game.game_state == "instructions"){
         game.game_state = "menu"
      }else if(game.game_state =="highscore"){ 
         if(game.highscore_menu.current_option == 0){
            game.game_state = "menu";
         }else if(game.highscore_menu.current_option == 1){
            game.highScoreManager.clearScores();
            game.highscore_menu.reload();
         }
      }
   }else{
      if(game.game_state == "menu"){
         if(game.swipedir == "up"){
            game.menu.optionUp();

         }else if (game.swipedir == "down"){
            game.menu.optionDown();
         }
      }
      //do swipe
      game.swiped = false;
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
      }else if (game.game_state == "paused"){
         game.unpause();
      }  
   }
   if(e.key == "ArrowUp"){
      if(game.game_state == "menu"){
      
         game.menu.optionUp();
      

      } else if(game.game_state == "highscore"){
         game.highscore_menu.optionUp();
      } else if(game.game_state == "playing"){
         if(game.bird.affected_by_gravity == false){
            game.bird.y = game.bird.y - 30;   
            ;
         }
      }
   }
   if(e.key == "ArrowDown"){
      if(game.game_state == "menu"){
         game.menu.optionDown();
      }else if(game.game_state == "highscore"){
         game.highscore_menu.optionDown();
      }else if(game.game_state == "playing"){
         if(game.bird.affected_by_gravity == false){
            game.bird.y = game.bird.y + 30;
         }
      }
   }
   if(e.key == "Enter"){
      if(game.game_state == "menu"){
         if(game.menu.current_option == 0){
            game.startGame();
         }else if(game.menu.current_option == 1){
            game.game_state = "highscore";
         }else if(game.menu.current_option == 2){
            game.game_state = "instructions";
         }
      }else if(game.game_state == "instructions"){
         game.game_state = "menu"
      }else if(game.game_state =="highscore"){ 
         if(game.highscore_menu.current_option == 0){
            game.game_state = "menu";
         }else if(game.highscore_menu.current_option == 1){
            game.highScoreManager.clearScores();
            game.highscore_menu.reload();

         }

      }else if(game.game_state =="game_over"){
         
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

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if(mobilecheck()){
   swipedetect(canvas, function(swipedir){
      if(swipedir != "none"){
         game.swiped = true;
         game.swipedir = swipedir;
      }else{
         game.swiped = false;
      }
   });     
}


