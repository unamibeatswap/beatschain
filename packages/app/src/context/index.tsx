'use client'

import { PropsWithChildren } from 'react'
import { Web3Provider } from './Web3'
import { Web3DataProvider } from './Web3DataContext'
import { SIWEProvider } from './SIWEContext'
import { AuthProvider } from './AuthContext'
import { NotificationProvider } from './Notifications'

interface Props extends PropsWithChildren {
  cookies: string | null
}

// Feature flags
const USE_SIWE_AUTH = process.env.NEXT_PUBLIC_USE_WEB3_AUTH === 'true'

export function Providers(props: Props) {
  return (
    <>
      <Web3Provider cookies={props.cookies}>
        {USE_SIWE_AUTH ? (
          <SIWEProvider>
            <Web3DataProvider>
              <NotificationProvider>{props.children}</NotificationProvider>
            </Web3DataProvider>
          </SIWEProvider>
        ) : (
          <AuthProvider>
            <Web3DataProvider>
              <NotificationProvider>{props.children}</NotificationProvider>
            </Web3DataProvider>
          </AuthProvider>
        )}
      </Web3Provider>
    </>
  )
}
