function PowerCube(x, y){
	this.x = x;
	this.y = y;

	this.dx = -200;
	this.dy = 0;

	this.width = 65;
	this.length = 65;

	this.img = new Image();
	this.img.src = "./powercube.png";

	this.update = function(delta){
	this.x = this.x + (this.dx * (delta/1000));

	}

	this.render = function(ctx){
		ctx.drawImage(this.img, this.x, this.y);
	}
}