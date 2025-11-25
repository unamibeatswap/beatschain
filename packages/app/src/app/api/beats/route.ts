import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { Beat } from '@/types'

export async function GET(request: NextRequest) {
  return NextResponse.json({ beats: [], total: 0 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Use Web3 minting instead' },
    { status: 501 }
  )
}