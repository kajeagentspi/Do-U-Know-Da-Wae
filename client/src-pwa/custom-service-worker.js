/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
/* global workbox */
if (workbox) {
  workbox.precaching.precache(self.__precacheManifest);
  const filesToBeCached = [
    "https://maps.tilehosting.com/styles/bright/style.json?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/data/v3.json?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/styles/bright/sprite.json",
    "https://maps.tilehosting.com/styles/bright/sprite.png",
    "https://maps.tilehosting.com/data/v3/14/13709/7541.pbf?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/data/v3/14/13710/7541.pbf?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/data/v3/14/13710/7540.pbf?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/data/v3/14/13709/7540.pbf?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/fonts/Noto%20Sans%20Italic/0-255.pbf?key=4krAogjdNdbE796RetO6",
    "https://maps.tilehosting.com/fonts/Noto%20Sans%20Regular/0-255.pbf?key=4krAogjdNdbE796RetO6"
  ];
  filesToBeCached.forEach(link => {
    workbox.routing.registerRoute(link, new workbox.strategies.NetworkFirst());
  });
  self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
}
