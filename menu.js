function Menu(w, h){

	this.width = w;
	this.height = h;

	this.title = "";
	this.current_option = 0;
	this.options = [];

	this.settings = [];
	this.settings.bg_color = "white";

	this.settings.options_x_pos = 50;
	this.settings.options_y_pos = 150;
	this.settings.line_height = 20;
	this.settings.selector_radius = 4;

	this.settings.title_font ="64px Arial"; 
	this.settings.title_font_color = "black";
	this.settings.title_x_pos = 40;
	this.settings.title_y_pos = 100;

	this.font = "14px Arial";
	this.font_color = "black";

	this.child_nodes = [];


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
		ctx.font = this.settings.title_font;
		ctx.fillStyle = this.settings.title_font_color;
		ctx.fillText(this.title, this.settings.title_x_pos, this.settings.title_y_pos);
	}

	this.renderSelector = function(ctx,x, y){
		ctx.beginPath();
		ctx.arc(x, y, this.settings.selector_radius, 0, Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}
	this.renderOptions = function(ctx){
		// loop through options....write text in middle of screen
		ctx.font = this.font;// 
		ctx.fillStyle=this.font_color;

		for(var i = 0; i < this.options.length;i++){
			// display current choice
			if(this.current_option == i){
				this.renderSelector(ctx, this.settings.options_x_pos - 3*this.settings.selector_radius, 
					this.settings.options_y_pos-this.settings.selector_radius*2 +this.settings.line_height*i);
			}
			if(typeof(this.options[i]) == "string"){
				ctx.fillText(this.options[i], this.settings.options_x_pos, this.settings.options_y_pos + this.settings.line_height * i );	
			}else{
				this.options[i].render(ctx);
			}
		}
	}
	this.renderBackground = function(ctx){
		ctx.fillStyle = this.settings.bg_color;
		ctx.fillRect(0,0, this.width, this.height);
	}
	this.render = function(ctx){
		
		this.renderBackground(ctx);
		this.renderTitle(ctx);
		this.renderOptions(ctx);

		for(let i=0;i<this.child_nodes.length;i++){
			this.child_nodes[i].render(ctx);
		}
		
	}
}
function MenuOption(x, y){
	this.type = "text";
	this.value = "";
	this.x = x;
	this.y = y;
	this.line_height = 20;

	this.render = function(ctx){
		if(this.type == "text"){
			ctx.fillText(this.value, this.x, this.y - this.line_height );	
		}
	}
}

function InputMenuOption(x, y ){
	MenuOption.call(this, x, y);
	this.type = "input";
	this.max_length = 255;

	this.render = function(ctx){
		ctx.fillText(this.value, this.x, this.y);

	}
}

function InitialsMenuOption(x,y){
	InputMenuOption.call(this,x,y);
	this.type = "input-initials";
	this.max_length = 3;

	this.render = function(ctx){
		ctx.save();
		ctx.font = "32px 'Press Start 2p'";
		ctx.lineWidth = 3;
		for(var i=0;i<this.max_length;i++){
			ctx.beginPath();
			ctx.moveTo(this.x + 32*i, this.y);
			ctx.lineTo(this.x+32*i+28, this.y);
			ctx.stroke();	
			ctx.closePath();
		}
		ctx.fillText(this.value, this.x, this.y);
		ctx.restore();
	}

}















