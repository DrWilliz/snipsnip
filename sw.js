// sw.js - Service Worker for SnipMaster 3000

// Version identifier for our cache
const CACHE_NAME = 'snipmaster-cache-v1';

// Log events for easier debugging
console.log('Service Worker: Loaded');

// Files to cache initially
const INITIAL_CACHED_RESOURCES = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/app.js',
];

// Install event listener
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    // Extend install event until caching is complete
    event.waitUntil(
        // Open our cache
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching App Shell');
                // Add all resources to cache
                return cache.addAll(INITIAL_CACHED_RESOURCES);
            })
            .then(() => {
                console.log('Service Worker: Install Completed');
            })
    );
});

// Activate event listener - useful for cache management
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    // We'll expand this in the next exercise
    console.log('Service Worker: Activated');
});

// Fetch event listener - empty for now
self.addEventListener('fetch', event => {
    // We'll implement caching strategies here in the next exercise
});
