
function FlappyMenu(w, h){
	Menu.call(this, w, h);

	this.init = function(){
		this.title = "Flappy Blob";
		this.options.push("Press ENTER to start!");
	}
	this.renderSelector = function(ctx, x, y){

		ctx.fillRect(x, y-2.5, 5, 5);
	}
}