// Global polyfills for SSR compatibility
if (typeof globalThis === 'undefined') {
  (global as any).globalThis = global
}

if (typeof self === 'undefined') {
  (global as any).self = globalThis
}

if (typeof window === 'undefined') {
  (global as any).window = {}
}

export {}