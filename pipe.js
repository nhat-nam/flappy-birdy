GAP = 80;
function Pipe(x, height){

	this.x = x;
	this.y = 0;

	this.dx = -200;
	this.dy = 0;

	this.width= 60;
	this.height = height;
	this._scored = false;

	this.update = function(delta){
		this.x = this.x + (this.dx * (delta/1000));

	}
	this.render = function(ctx){
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.fillRect(this.x, GAP + this.height, this.width, HEIGHT - GAP + this.height);

	}
}