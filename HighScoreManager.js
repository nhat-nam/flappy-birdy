/*
	save scores as:
		{
			name: "name",
			score: SCORE
		}
*/

class HighScoreManager{
	constructor(name){
		this.scores = [];
		this.max_scores = 5;
		this.name_length = 3;
		this.dataStore = localStorage;
		this.key = name + "highscores";

		this.load();

	}
	clearScores(){
		this.scores = [];
		this.save();
	}
	load(){
		var value = this.dataStore.getItem(this.key);
		if(value){
			this.scores = JSON.parse(value);
		}else{
			this.scores=[];
			this.save();
		}
	}
	save(){
		var value = JSON.stringify(this.scores);
		this.dataStore.setItem(this.key, value);
	}
	/* 
		check to see if score is a high score
		return true or false
	*/
	isHighScore(score){
		// Check if we have enough high scores
		if(this.scores.length < this.max_scores){
			return true;
		}
		// Compare score to existing high scores
		for(var i = 0; i < this.scores.length; i++ ){
			if(this.scores[i].score < score){
				return true;
			}
		}
		return false;
	}

	/*
		adds name and score to scores list
		in proper order
	*/
	addHighScore(name, score){
		if(name.length>this.name_length){
		  name = name.substring(0,this.name_length);
		}
		var obj = {
			name: name,
			score: score
		};
		var addedScore = false;
		for(var i = 0; i < this.scores.length; i++ ){
			if(this.scores[i].score < score){
				// i needs to be new score
				this.scores.splice(i, 0, obj);
				addedScore = true;
				break;
			}
		}
		if(!addedScore){
			this.scores.push(obj);
		}
		if(this.scores.length > this.max_scores){
			this.scores.pop();
		}
		this.save();
	}
}



