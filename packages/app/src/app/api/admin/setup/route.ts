import { NextRequest, NextResponse } from 'next/server'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { uid, email, ...profileData } = body

    // Verify this is the super admin email
    if (email !== 'info@unamifoundation.org') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Update user profile in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid,
      email,
      ...profileData,
      updatedAt: new Date()
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Super admin setup error:', error)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}