function Bird(){

	this.x = 200
	this.y = 0

	this.dx = 0;
	this.dy = 200;
	this.accel_y = 1000;

	this.original_color = "white";
	this.color = "white";
	this.radius = 10;

	this.update = function(delta){

		this.dy = this.dy + (this.accel_y *(delta/1000));

		this.y = this.y + (this.dy * (delta/1000));
		this.x = this.x + (this.dx * (delta/1000));
	}
	this.resetColor = function(){
		this.color = this.original_color;
	}
	this.render = function(ctx){
		ctx.fillStyle=this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 360);
		ctx.fill();
		ctx.closePath();	

	}
	this.flap = function(){
		//flapp
		if(this.dy < 0){
			this.dy = this.dy - 200;
		}else{
			this.dy = -200;
		}
		if(this.dy < -400){
			this.dy = -400;
		}
		//this.accel_y = 0;
	}
	this.reset = function(){
		this.dx = 0;
	    this.dy = 0;
      	this.x = 500
      	this.y = 250
	}
	
this.collides = function(pipe){
		if(this.x + this.radius >= pipe.x
			&& this.x - this.radius <= pipe.x + pipe.width
			&& this.y - this.radius <= pipe.y + pipe.height
			&& this.y + this.radius >= pipe.y 
		
		|| this.x + this.radius >= pipe.x
			&& this.x - this.radius <= pipe.x + pipe.width
			&& this.x - this.radius <= GAP + pipe.height + (HEIGHT - GAP + pipe.height)
			&& this.y + this.radius >= GAP + pipe.height ){

			return true;
		} return false;
	}

}