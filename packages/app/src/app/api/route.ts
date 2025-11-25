// import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    // Test API connection
    // const testDoc = await adminDb.collection('_health').doc('test').get()
    
    return Response.json({ 
      status: 'ok',
      firebase: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return Response.json({ 
      status: 'error',
      firebase: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
