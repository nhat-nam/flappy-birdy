
class SoundManager{
	constructor(){
		this.sounds = [];
	}
	addSound(key, el){
		this.sounds[key] = el;

	}
	playSound(key){
		if(this.sounds[key]){
			this.sounds[key].play();
		}
	}
	stopSound(key){

	}
	pauseSound(key){

	}

}

