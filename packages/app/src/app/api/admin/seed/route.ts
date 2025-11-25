import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'
import { seedFirestore } from '@/utils/seedData'

export async function POST(request: NextRequest) {
  try {
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    
    // Check if user is admin (you can modify this check)
    if (decodedToken.email !== 'info@unamifoundation.org') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('🌱 Admin seeding request from:', decodedToken.email)
    
    const result = await seedFirestore()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database seeded successfully',
        data: {
          users: 3,
          beats: 5,
          transactions: 2,
          producerStats: 2
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      { error: 'Seeding failed', details: error.message },
      { status: 500 }
    )
  }
}