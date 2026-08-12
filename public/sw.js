const CACHE_VERSION = 2
const CACHE_NAME = `ks-beauty-cache-v${CACHE_VERSION}`
const ASSETS_TO_CACHE = [
  "/",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  const { request } = event

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const copy = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          return networkResponse
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match("/"))
        )
    )
    return
  }

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response
      return fetch(request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const cache = caches.open(CACHE_NAME)
          cache.then((c) => c.put(request, networkResponse.clone()))
        }
        return networkResponse
      })
    })
  )
})

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

self.addEventListener("activate", (event) => {
  const valid = (key) => key === CACHE_NAME
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => !valid(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})