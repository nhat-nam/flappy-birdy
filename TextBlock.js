function TextBlock(x, y, w, h){

	this.width = w;
	this.height = h;
	this.x = x;
	this.y = y;

	this.lines =[];
	this.settings = [];
	this.settings.bg_color = "white";

	this.settings.padding_left = 20;
	this.settings.line_height = 20;

	this.settings.font = "14px Arial";
	this.settings.font_color = "black";
	this.settings.rounded_corners = 0;

	this.init = function(){
		/* used to change settings */
	}
	this.renderBackground = function(ctx){
		ctx.fillStyle = this.settings.bg_color;
		if(this.settings.rounded_corners == 0){
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}else{
			ctx.beginPath();
			ctx.moveTo(this.x + this.settings.rounded_corners, this.y);
			ctx.arcTo(this.x + this.width, this.y, this.x+this.width, this.y + this.height, this.settings.rounded_corners);
			ctx.arcTo(this.x+this.width, this.y + this.height, this.x , this.y + this.height, this.settings.rounded_corners);
			ctx.arcTo(this.x, this.y + this.height, this.x, this.y, this.settings.rounded_corners);
			ctx.arcTo(this.x, this.y , this.x + this.width, this.y, this.settings.rounded_corners);
			ctx.fill();
		}

	}
	this.render = function(ctx){
		
		this.renderBackground(ctx);
		ctx.fillStyle=this.settings.font_color;
		ctx.font=this.settings.font;
		for(let i=0;i<this.lines.length;i++){
			ctx.fillText(this.lines[i], this.x +this.settings.padding_left, this.y + this.settings.line_height * (i+1) );
			// rneder textthis.lines[i];
		}
		
	}

	/*
	this.moveTo(x, y, t){
		

	}	
		textBlock = this;
		this.currentInterval = setInterval(function(){
			textBlock.x = textBlock.x - 1;
			if(textBlock.x == target_x){
				clearInterval(textBlock.currentInterval);
			}
		}, 20);

	*/

}
