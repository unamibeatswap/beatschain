const CACHE_NAME = 'beatschain-v1'
const STATIC_CACHE = 'beatschain-static-v1'
const DYNAMIC_CACHE = 'beatschain-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/offline.html'
]

const CACHE_STRATEGIES = {
  beats: 'cache-first',
  api: 'network-first',
  static: 'cache-first',
  images: 'cache-first'
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle Web3 wallet connections - always network
  if (url.pathname.includes('/api/auth') || url.pathname.includes('wallet')) {
    return
  }
  
  // Handle beat audio files - cache first
  if (url.pathname.includes('/beats/') && request.destination === 'audio') {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE))
    return
  }
  
  // Handle API calls - network first with fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }
  
  // Handle static assets - cache first
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }
  
  // Handle navigation - network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline.html'))
    )
  }
})

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    return cached || new Response('Offline', { status: 503 })
  }
}

// Background sync for Web3 transactions
self.addEventListener('sync', event => {
  if (event.tag === 'web3-transaction') {
    event.waitUntil(syncWeb3Transactions())
  }
})

async function syncWeb3Transactions() {
  // Handle pending Web3 transactions when back online
  const pendingTxs = await getStoredTransactions()
  for (const tx of pendingTxs) {
    try {
      await retryTransaction(tx)
    } catch (error) {
      console.error('Transaction retry failed:', error)
    }
  }
}

async function getStoredTransactions() {
  // Get from IndexedDB or localStorage
  return JSON.parse(localStorage.getItem('pending_web3_transactions') || '[]')
}

async function retryTransaction(tx) {
  // Retry Web3 transaction logic
  console.log('Retrying transaction:', tx.hash)
}