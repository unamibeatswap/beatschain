import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const beatDoc = await adminDb.collection('beats').doc(params.id).get()
    
    if (!beatDoc.exists) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const beat = {
      id: beatDoc.id,
      ...beatDoc.data(),
      createdAt: beatDoc.data()?.createdAt?.toDate(),
      updatedAt: beatDoc.data()?.updatedAt?.toDate()
    }

    return NextResponse.json({ beat })

  } catch (error: any) {
    console.error('Error fetching beat:', error)
    return NextResponse.json(
      { error: 'Failed to fetch beat', details: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    // Check if beat exists and user owns it
    const beatDoc = await adminDb.collection('beats').doc(params.id).get()
    if (!beatDoc.exists) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const beatData = beatDoc.data()
    if (beatData?.producerId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData = await request.json()
    const updatedBeat = {
      ...updateData,
      updatedAt: new Date()
    }

    await adminDb.collection('beats').doc(params.id).update(updatedBeat)
    
    return NextResponse.json({
      success: true,
      beat: { id: params.id, ...beatData, ...updatedBeat }
    })

  } catch (error: any) {
    console.error('Error updating beat:', error)
    return NextResponse.json(
      { error: 'Failed to update beat', details: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    // Check if beat exists and user owns it or is admin
    const beatDoc = await adminDb.collection('beats').doc(params.id).get()
    if (!beatDoc.exists) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const beatData = beatDoc.data()
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get()
    const userRole = userDoc.data()?.role

    if (beatData?.producerId !== decodedToken.uid && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await adminDb.collection('beats').doc(params.id).delete()
    
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Error deleting beat:', error)
    return NextResponse.json(
      { error: 'Failed to delete beat', details: error.message },
      { status: 500 }
    )
  }
}