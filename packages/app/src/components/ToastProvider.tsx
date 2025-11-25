'use client'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Enhanced toast styles matching /beatnft page
const toastStyles = `
  .Toastify__toast {
    background: white !important;
    color: #1f2937 !important;
    font-weight: 600 !important;
    border-radius: 12px !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
    border: 2px solid #e5e7eb !important;
    font-size: 14px !important;
    min-height: 70px !important;
    padding: 16px !important;
  }
  .Toastify__toast--success {
    border-left: 6px solid #10b981 !important;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  }
  .Toastify__toast--error {
    border-left: 6px solid #ef4444 !important;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  }
  .Toastify__toast--info {
    border-left: 6px solid #3b82f6 !important;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
  }
  .Toastify__toast--warning {
    border-left: 6px solid #f59e0b !important;
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%) !important;
  }
  .Toastify__close-button {
    color: #6b7280 !important;
    opacity: 0.7 !important;
    font-size: 18px !important;
  }
  .Toastify__close-button:hover {
    opacity: 1 !important;
    color: #374151 !important;
  }
  .Toastify__progress-bar {
    height: 4px !important;
  }
  .Toastify__progress-bar--success {
    background: #10b981 !important;
  }
  .Toastify__progress-bar--error {
    background: #ef4444 !important;
  }
  .Toastify__progress-bar--info {
    background: #3b82f6 !important;
  }
  .Toastify__progress-bar--warning {
    background: #f59e0b !important;
  }
  /* BeatNFT page specific styles */
  .Toastify__toast-icon {
    font-size: 20px !important;
    margin-right: 12px !important;
  }
  .Toastify__toast-body {
    font-family: 'Inter', system-ui, sans-serif !important;
    line-height: 1.5 !important;
  }
  /* Animation enhancements */
  .Toastify__toast {
    transform: translateY(0) !important;
    transition: transform 0.3s ease-out !important;
  }
  .Toastify__toast--enter {
    transform: translateY(20px) !important;
  }
  .Toastify__toast--exit {
    transform: translateY(-20px) !important;
  }
`

export default function ToastProvider() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: toastStyles }} />
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      style={{
        zIndex: 9999,
        top: '80px',
        right: '20px',
        width: '400px'
      }}
    />
    </>
  )
}