var version = "0.1";
var cacheName = "flappy-birdy-"+version;
self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(cacheName).then(cache => {

			return cache.addAll([
				'./',
				'./index.html',
				'./background.png',
				'./bird.png',
				'./pipe.png',
				'./powerup.png',
				'./bird.js',
				'./game.js',
				'./HighScoreManager.js',
				'./menu.js',
				'./menus.js',
				'./pipe.js',
				'./powercube.js',
				'./SoundManager.js',
				'./TextBlock.js',
				'./jump.wav',
				'./score.wav',
				'./FlappyBirdy.ttf',
				'./PressStart2P-Regular.ttf'
			]).then(() => self.skipWaiting());


		})
	);
});
self.addEventListener("activate", event => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.open(cacheName)
			.then(cache => cache.match(event.request, {ignoreSearch: true}))
			.then(response => {
				return response || fetch(event.request);
		})
	);
});