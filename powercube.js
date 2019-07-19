function PowerCube(x, y){
	this.x = x;
	this.y = y;

	this.dx = -200;
	this.dy = 0;

	this.width = 32;
	this.length = 32;

	this.img = new Image();
	this.img.src = "./powerup.png";

	this.update = function(delta){
		this.x = this.x + (this.dx * (delta/1000));
	}

	this.render = function(ctx){
		ctx.drawImage(this.img, this.x, this.y, this.width, this.length);
	}
}