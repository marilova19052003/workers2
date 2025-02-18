self.addEventListener("install", (event) => {
  console.log("установлен");

  event.waitUntil(
    ceches.open("loved-caches").then((cache) => {
      cache.addAll([
        "./",
        "my-web-workers-projectindex.html",
        "my-web-workers-projectstyle.css",
        "my-web-workers-projectimages\fallback",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("активирован");
});

async function cachePriorityThenFetch(event) {
  const cacheResponse = await caches.match(event.request);

  if (cacheResponse) {
    return cacheResponse;
  }

  let response;

  try {
    response = await fetch(event.request);
  } catch (error) {
    return;
  }

  const cache = await caches.open("loved-caches");

  cache.put(event.request, response.clone());

  return response;
}

self.addEventListener("fetch", (event) => {
  console.log("происходит запрос на сервер");
  event.respondWith(cachePriorityThenFetch(event));
});
