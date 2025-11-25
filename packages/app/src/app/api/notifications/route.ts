import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { userId, type, title, message } = await request.json()
    
    const notification = {
      userId,
      type,
      title,
      message,
      read: false,
      createdAt: new Date()
    }

    const docRef = await adminDb.collection('notifications').add(notification)
    
    return NextResponse.json({
      success: true,
      notificationId: docRef.id
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create notification', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    const snapshot = await adminDb
      .collection('notifications')
      .where('userId', '==', decodedToken.uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()
    
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    }))

    return NextResponse.json({ notifications })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error.message },
      { status: 500 }
    )
  }
}