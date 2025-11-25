'use client'

import React, { Suspense, lazy, ComponentType } from 'react'

interface LazyLoadOptions {
  fallback?: React.ReactNode
  ssr?: boolean
}

/**
 * Utility for lazy loading components with Suspense
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const LazyComponent = lazy(importFunc)
  
  const { 
    fallback = <DefaultLoadingFallback />,
    ssr = false 
  } = options

  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    // For SSR, we need to use dynamic import with ssr: false
    if (typeof window === 'undefined' && !ssr) {
      return fallback
    }

    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-4 min-h-[100px]">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}