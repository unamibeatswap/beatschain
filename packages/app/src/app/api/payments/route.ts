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
    
    const { beatId, licenseType, paymentMethod, amount } = await request.json()
    
    // Get beat data
    const beatDoc = await adminDb.collection('beats').doc(beatId).get()
    if (!beatDoc.exists) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const beatData = beatDoc.data()
    
    // Process payment based on method
    let transactionHash = null
    let status = 'pending'
    
    if (paymentMethod === 'crypto') {
      // Crypto payment - would integrate with smart contract
      status = 'completed'
      transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`
    } else {
      // Fiat payment - would integrate with PayFast/Stripe
      status = 'completed'
      transactionHash = `fiat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Create transaction record
    const transaction = {
      beatId,
      buyerId: decodedToken.uid,
      producerId: beatData?.producerId,
      amount,
      licenseType,
      paymentMethod,
      transactionHash,
      status,
      createdAt: new Date(),
      fees: paymentMethod === 'crypto' ? amount * 0.025 : amount * 0.035
    }

    const docRef = await adminDb.collection('transactions').add(transaction)
    
    // Update producer earnings
    const producerEarnings = amount * 0.85 // 85% to producer
    await adminDb.collection('producer-stats').doc(beatData?.producerId).set({
      totalEarnings: adminDb.FieldValue.increment(producerEarnings),
      totalSales: adminDb.FieldValue.increment(1),
      updatedAt: new Date()
    }, { merge: true })

    // Create purchase record for buyer
    await adminDb.collection('purchases').add({
      transactionId: docRef.id,
      beatId,
      buyerId: decodedToken.uid,
      licenseType,
      downloadUrl: beatData?.audioUrl,
      createdAt: new Date()
    })

    return NextResponse.json({
      success: true,
      transactionId: docRef.id,
      transactionHash,
      status,
      downloadUrl: beatData?.audioUrl
    })

  } catch (error: any) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Payment failed', details: error.message },
      { status: 500 }
    )
  }
}