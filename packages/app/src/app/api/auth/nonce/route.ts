import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Dynamic import to prevent build issues
    const { generateNonce } = await import('siwe')
    const nonce = generateNonce()
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Nonce generation error:', error)
    return NextResponse.json({ nonce: Math.random().toString(36) }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { generateNonce } = await import('siwe')
    const nonce = generateNonce()
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Nonce generation error:', error)
    return NextResponse.json({ nonce: Math.random().toString(36) }, { status: 500 })
  }
}