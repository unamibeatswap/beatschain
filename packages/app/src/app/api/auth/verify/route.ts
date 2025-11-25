import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json()
    
    // Dynamic import to prevent build issues
    const { SiweMessage } = await import('siwe')
    const siweMessage = new SiweMessage(message)
    const result = await siweMessage.verify({ signature })
    
    if (result.success) {
      return NextResponse.json({ success: true, address: result.data.address })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }
  } catch (error) {
    console.error('SIWE verification error:', error)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}