import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    const { beatId, licenseType, amount, transactionHash } = await request.json()
    
    const beatDoc = await adminDb.collection('beats').doc(beatId).get()
    if (!beatDoc.exists) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const beatData = beatDoc.data()
    
    const purchase = {
      beatId,
      buyerId: decodedToken.uid,
      producerId: beatData?.producerId,
      amount,
      licenseType,
      transactionHash,
      createdAt: new Date(),
      status: 'completed'
    }

    const docRef = await adminDb.collection('purchases').add(purchase)
    
    const producerEarnings = amount * 0.9
    await adminDb.collection('producer-stats').doc(beatData?.producerId).set({
      totalEarnings: adminDb.FieldValue.increment(producerEarnings),
      totalSales: adminDb.FieldValue.increment(1),
      updatedAt: new Date()
    }, { merge: true })

    return NextResponse.json({
      success: true,
      purchaseId: docRef.id,
      purchase: { id: docRef.id, ...purchase }
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Purchase failed', details: error.message },
      { status: 500 }
    )
  }
}