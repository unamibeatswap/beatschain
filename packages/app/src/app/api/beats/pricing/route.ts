import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    const { beatId, pricing } = await request.json()
    
    // Validate pricing structure
    if (!pricing || typeof pricing.basic !== 'number' || typeof pricing.premium !== 'number' || typeof pricing.exclusive !== 'number') {
      return NextResponse.json({ error: 'Invalid pricing structure' }, { status: 400 })
    }

    // Get beat and verify ownership
    const beatDoc = await adminDb.collection('beats').doc(beatId).get()
    if (!beatDoc.exists) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const beatData = beatDoc.data()
    if (beatData?.producerId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Not authorized to modify this beat' }, { status: 403 })
    }

    // Update beat pricing
    await adminDb.collection('beats').doc(beatId).update({
      price: pricing.premium, // Base price is premium
      pricing: {
        basic: Math.max(1, pricing.basic),
        premium: Math.max(1, pricing.premium),
        exclusive: Math.max(1, pricing.exclusive)
      },
      updatedAt: new Date()
    })

    return NextResponse.json({
      success: true,
      beatId,
      pricing: {
        basic: pricing.basic,
        premium: pricing.premium,
        exclusive: pricing.exclusive
      }
    })

  } catch (error: any) {
    console.error('Pricing update error:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    const { beatIds, pricing } = await request.json()
    
    if (!Array.isArray(beatIds) || beatIds.length === 0) {
      return NextResponse.json({ error: 'Beat IDs array required' }, { status: 400 })
    }

    // Bulk update pricing for multiple beats
    const batch = adminDb.batch()
    const results = []

    for (const beatId of beatIds) {
      const beatRef = adminDb.collection('beats').doc(beatId)
      const beatDoc = await beatRef.get()
      
      if (beatDoc.exists && beatDoc.data()?.producerId === decodedToken.uid) {
        batch.update(beatRef, {
          price: pricing.premium,
          pricing: {
            basic: Math.max(1, pricing.basic),
            premium: Math.max(1, pricing.premium),
            exclusive: Math.max(1, pricing.exclusive)
          },
          updatedAt: new Date()
        })
        results.push({ beatId, success: true })
      } else {
        results.push({ beatId, success: false, error: 'Not found or unauthorized' })
      }
    }

    await batch.commit()

    return NextResponse.json({
      success: true,
      results,
      updated: results.filter(r => r.success).length
    })

  } catch (error: any) {
    console.error('Bulk pricing update error:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing', details: error.message },
      { status: 500 }
    )
  }
}