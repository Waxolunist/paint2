/* global importScripts:readonly, workbox:readonly, self:readonly */
importScripts('/serviceworker/workbox-sw.js');
workbox.setConfig({debug: true});
workbox.core.skipWaiting();
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
