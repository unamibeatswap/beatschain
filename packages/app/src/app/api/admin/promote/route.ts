import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    // Only allow promotion of the owner email
    if (email !== 'info@unamifoundation.org') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Find user by email and update to admin
    const usersSnapshot = await adminDb.collection('users').where('email', '==', email).get()
    
    if (usersSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userDoc = usersSnapshot.docs[0]
    await adminDb.collection('users').doc(userDoc.id).update({
      role: 'admin',
      isVerified: true,
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'User promoted to admin successfully' 
    })

  } catch (error: any) {
    console.error('Promote admin error:', error)
    return NextResponse.json(
      { error: 'Failed to promote user', details: error.message },
      { status: 500 }
    )
  }
}