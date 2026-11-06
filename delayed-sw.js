/* ECHO COACH – offline mode (VOLLEY APPS). Caches only the app page; everything else passes through. */
var PAGE=new URL(self.location.href).searchParams.get("page")||"delayed.html";
var CACHE="echocoach-offline-v1";
var URLP=new URL(PAGE,self.registration.scope).href;
function isPage(u){var p=new URL(u).pathname,q=new URL(URLP).pathname;return p===q||p===q.replace(/\.html$/,"")}
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return fetch(new Request(URLP,{cache:"reload"})).then(function(r){if(r&&r.ok)return c.put(URLP,r)})}).catch(function(){}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE&&n.indexOf("echocoach-")===0}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET"||r.mode!=="navigate"||!isPage(r.url))return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(URLP).then(function(hit){
      var upd=fetch(new Request(URLP,{cache:"no-store"})).then(function(n){if(n&&n.ok){c.put(URLP,n.clone())}return n});
      if(hit){upd.catch(function(){});return hit}
      return upd})}))});
