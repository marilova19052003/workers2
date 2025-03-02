self.addEventListener("install", (event) => {
  console.log("установлен");

  event.waitUntil(
    caches.open("loved-caches").then((cache) => {
      cache.addAll([
        "./",
        "my-web-workers-project/index.html",
        "my-web-workers-projectstyle.css",
        "my-web-workers-projectimages/fallback",
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== "loved-caches") {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
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
    return new Response("Ошибка загрузки данных", { status: 408 });
  }

  const cache = await caches.open("loved-caches");

  cache.put(event.request, response.clone());

  return response;
}

self.addEventListener("fetch", (event) => {
  console.log("происходит запрос на сервер");
  event.respondWith(cachePriorityThenFetch(event));
});
