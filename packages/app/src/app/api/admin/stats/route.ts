import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized')
  }

  const idToken = authHeader.split('Bearer ')[1]
  const decodedToken = await adminAuth.verifyIdToken(idToken)
  
  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get()
  const userRole = userDoc.data()?.role

  if (userRole !== 'admin') {
    throw new Error('Admin access required')
  }

  return decodedToken
}

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request)

    const [usersSnapshot, beatsSnapshot, purchasesSnapshot] = await Promise.all([
      adminDb.collection('users').get(),
      adminDb.collection('beats').get(),
      adminDb.collection('purchases').get()
    ])

    const totalUsers = usersSnapshot.size
    const totalBeats = beatsSnapshot.size
    const totalPurchases = purchasesSnapshot.size

    let totalRevenue = 0
    purchasesSnapshot.forEach(doc => {
      const purchase = doc.data()
      totalRevenue += purchase.amount || 0
    })

    const usersByRole = { user: 0, producer: 0, admin: 0 }
    usersSnapshot.forEach(doc => {
      const userData = doc.data()
      const role = userData.role || 'user'
      usersByRole[role as keyof typeof usersByRole]++
    })

    const beatsByGenre: Record<string, number> = {}
    beatsSnapshot.forEach(doc => {
      const beatData = doc.data()
      const genre = beatData.genre || 'unknown'
      beatsByGenre[genre] = (beatsByGenre[genre] || 0) + 1
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentBeatsSnapshot = await adminDb
      .collection('beats')
      .where('createdAt', '>=', thirtyDaysAgo)
      .get()

    const recentUsersSnapshot = await adminDb
      .collection('users')
      .where('createdAt', '>=', thirtyDaysAgo)
      .get()

    const stats = {
      overview: {
        totalUsers,
        totalBeats,
        totalPurchases,
        totalRevenue,
        activeProducers: usersByRole.producer
      },
      users: {
        byRole: usersByRole,
        recentSignups: recentUsersSnapshot.size
      },
      beats: {
        byGenre: beatsByGenre,
        recentUploads: recentBeatsSnapshot.size
      },
      revenue: {
        total: totalRevenue,
        averagePerSale: totalPurchases > 0 ? totalRevenue / totalPurchases : 0,
        monthlyGrowth: 0
      }
    }

    return NextResponse.json({ stats })

  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.message === 'Unauthorized' || error.message === 'Admin access required' ? 403 : 500 }
    )
  }
}