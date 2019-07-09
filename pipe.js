GAP = 80;
function Pipe(x, height){

	this.x = x;
	this.y = 0;

	this.dx = -200;
	this.dy = 0;

	this.width= 70;
	this.height = height;
	this._scored = false;

	//70 x 430. 
   this.img = new Image();
   this.img.src = "./pipe.png";


	this.update = function(delta){
		this.x = this.x + (this.dx * (delta/1000));

	}
	this.render = function(ctx){
		ctx.fillStyle = "white";

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(Math.PI);
		ctx.drawImage(this.img, -1*this.width, -1*this.height);
		ctx.restore();
		ctx.drawImage(this.img, this.x, GAP + this.height);
	}
}