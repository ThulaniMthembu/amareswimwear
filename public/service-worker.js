// public/service-worker.js

const CACHE_NAME = 'amare-swimwear-cache-v1';
const urlsToCache = [
	'/',
	'/shop',
	'/static/styles/globals.css',
	// Add other static assets and routes you want to cache
];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				return response;
			}
			return fetch(event.request);
		})
	);
});
