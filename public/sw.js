const CACHE_VERSION = 3
const CACHE_NAME = `ks-beauty-cache-v${CACHE_VERSION}`
const ASSETS_TO_CACHE = [
  "/",
]

const ASSET_PATTERN =
  /\.(?:css|js|mjs|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|mp4|webm)$/i

function isApiOrAdmin(pathname) {
  return pathname.startsWith("/api/") || pathname.startsWith("/admin")
}

function isCacheableAsset(url) {
  if (url.origin !== self.location.origin) return false
  if (isApiOrAdmin(url.pathname)) return false
  if (url.pathname.startsWith("/_next/static/")) return true
  return ASSET_PATTERN.test(url.pathname)
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)

  if (url.origin !== self.location.origin) return

  // API responses and the admin panel must never be served from the
  // service-worker cache: stale JSON/HTML breaks create/update/delete flows.
  if (isApiOrAdmin(url.pathname)) return

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy))
              .catch(() => {})
          }
          return networkResponse
        })
        .catch(async () => {
          const cached = await caches.match(event.request)
          return cached || caches.match("/")
        })
    )
    return
  }

  if (!isCacheableAsset(url)) return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone()
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, copy))
              .catch(() => {})
          }
          return networkResponse
        })
        .catch(() => cached)

      return cached || network
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
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !valid(key)).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})
