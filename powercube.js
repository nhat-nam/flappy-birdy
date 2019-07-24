function PowerCube(x, y){
	this.x = x;
	this.y = y;

	this.dx = -200;
	this.dy = 0;

	this.width = 40;
	this.length = 40;
	this._gotten = false;
	this.number_of_powerups = 1
	this.random_power = 0;


	this.img = new Image();
	this.img.src = "./powerup.png";
	this.fillStyle = "rgba(0,0,0,0)";

	this.update = function(delta){
		this.x = this.x + (this.dx * (delta/1000));
	}

	this.render = function(ctx){
		ctx.drawImage(this.img, this.x, this.y, this.width, this.length);
		ctx.save();
		ctx.fillStyle = this.fillStyle;
		ctx.fillRect(this.x, this.y, this.width, this.length);
		ctx.restore();
	}
}