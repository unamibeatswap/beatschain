'use client'

import BeatUpload from '@/components/BeatUpload'
import ProtectedRoute from '@/components/ProtectedRoute'

export const dynamic = 'force-dynamic'

export default function UploadPage() {
  return (
    <ProtectedRoute permission="upload" requireWallet={true}>
      <BeatUpload />
    </ProtectedRoute>
  )
}