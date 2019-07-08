function Menu(w, h){

	this.width = w;
	this.height = h;

	this.title = "";
	this.current_option = 0;
	this.options = [];

	this.init = function(){
		/* used to change settings */
	}
	this.optionUp = function(){
		this.current_option--;
		if(this.current_option < 0 ){
			this.current_option = this.options.length - 1; 
		}
	}
	this.optionDown = function(){
		this.current_option++;
		this.current_option = this.current_option % this.options.length;
	}
	this.renderTitle = function(ctx){

			//render title
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(this.title, 400, 100);
	}

	this.renderSelector = function(ctx,x, y){
		ctx.beginPath();
		ctx.arc(x, y, 4, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
	this.renderOptions = function(ctx){
		// loop through options....write text in middle of screen
		ctx.font = "14px Arial";
		ctx.fillStyle="black";

		for(var i = 0; i < this.options.length;i++){
			// display current choice
			if(this.current_option == i){
				this.renderSelector(ctx, 390, 145+20*i);
			}
			ctx.fillText(this.options[i], 400, 150 + 20 * i );
		}
	}
	this.render = function(ctx){
		ctx.fillStyle = "white";
		ctx.fillRect(0,0, this.width, this.height);
		this.renderTitle(ctx);
		this.renderOptions(ctx);

	}

}
