import React, { PropsWithChildren } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastContainer } from 'react-toastify'
import BlockchainEventListener from './BlockchainEventListener'
import 'react-toastify/dist/ReactToastify.css'

export function Layout(props: PropsWithChildren) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='grow px-4 container max-w-full mx-auto'>{props.children}</main>

      <Footer />
      
      <BlockchainEventListener />
      
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ 
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: '500',
          top: '80px'
        }}
        toastStyle={{
          backgroundColor: '#059669',
          color: '#ffffff',
          border: '1px solid #047857',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          minHeight: '60px'
        }}
      />
    </div>
  )
}
