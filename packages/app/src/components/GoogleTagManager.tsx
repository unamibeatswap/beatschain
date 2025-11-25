'use client'

import { useEffect } from 'react'

interface GoogleTagManagerProps {
  gtmId?: string
  enabled?: boolean
}

export function GoogleTagManager({ gtmId, enabled = false }: GoogleTagManagerProps) {
  useEffect(() => {
    if (!gtmId || !enabled) return

    // GTM Script
    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `
    document.head.appendChild(script)

    // GTM NoScript
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `
    document.body.insertBefore(noscript, document.body.firstChild)

    return () => {
      // Cleanup on unmount
      document.head.removeChild(script)
      if (noscript.parentNode) {
        document.body.removeChild(noscript)
      }
    }
  }, [gtmId, enabled])

  return null
}