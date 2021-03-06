function Bird(){

	this.x = 150;
	this.y = 0

	this.dx = 0;
	this.dy = 200;
	this.accel_y = 1000;

	this.original_color = "white";
	this.color = "white";
	this.height_radius = 10;
	this.width_radius = 15
	this.affected_by_gravity = true;

	//38x24


	this.img = new Image();
	this.img.src = "./bird.png";

	this.update = function(delta){

		if(this.affected_by_gravity == true){
			this.dy = this.dy + (this.accel_y *(delta/1000));

			this.y = this.y + (this.dy * (delta/1000));
			this.x = this.x + (this.dx * (delta/1000));
		}
	}
	this.resetColor = function(){
		this.color = this.original_color;
	}
	this.render = function(ctx){

		ctx.fillStyle=this.color;
		
		if(this.affected_by_gravity == true){
			if(this.dy > 180){
			//facing down
				ctx.save();
				ctx.translate(this.x, this.y);
				ctx.rotate(Math.PI/6);
				ctx.drawImage(this.img, -19, -12);
				ctx.restore();
			}else if(this.dy < -20){
				//facing up 
				ctx.save();
				ctx.translate(this.x, this.y);
				ctx.rotate(-1*Math.PI/6);
				ctx.drawImage(this.img, -19,-12);
				ctx.restore();
			}else {
				//draw a bird
				ctx.drawImage(this.img, this.x-19,this.y-12);
				
			}
		} else {
			ctx.drawImage(this.img, this.x-19,this.y-12);
		}
	}
	this.flap = function(){
		if(this.affected_by_gravity == true){
			if(this.dy < 0){
				this.dy = this.dy - 850;
			}else{
				this.dy = -350;
			}
			if(this.dy < -400){
				this.dy = -400;
			}
			game.soundManager.playSound("jump");
		}
	}
	this.reset = function(){
		this.x = 150;
		this.y = 0

		this.dx = 0;
		this.dy = 200;
		this.accel_y = 1000;
	}
	
	this.collides = function(pipe){
		if(this.x + this.width_radius >= pipe.x
			&& this.x - this.width_radius <= pipe.x + pipe.width
			&& this.y - this.height_radius <= pipe.y + pipe.height
			&& this.y + this.height_radius >= pipe.y 
		
		|| this.x + this.width_radius >= pipe.x
			&& this.x - this.width_radius <= pipe.x + pipe.width
			&& this.y - this.height_radius <= GAP + pipe.height + (HEIGHT - GAP + pipe.height)
			&& this.y + this.height_radius >= GAP + pipe.height ){

			return true;
		} 
		return false;
	}

	this.collidesPower = function(powercube){
		if(	this.x + this.width_radius >= powercube.x
			&& this.x - this.width_radius <= powercube.x + powercube.width
			&& this.y - this.height_radius <= powercube.y + powercube.length
			&& this.y + this.height_radius >= powercube.y ){
			return true;
		} 
		return false;
	}

}