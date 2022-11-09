const staticDevArtistry = "artistry-v1"
const assets = [
    "/",
    "/index.html",
    "/index.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticDevArtistry).then(cache => {
      cache.addAll(assets)
    })
  )
})