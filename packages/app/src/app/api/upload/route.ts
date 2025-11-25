import { NextRequest, NextResponse } from 'next/server'
import { PinataSDK } from 'pinata-web3'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fileType = formData.get('type') as string
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3']
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
    
    if (fileType === 'audio' && !allowedAudioTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid audio file type' }, { status: 400 })
    }
    
    if (fileType === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 })
    }

    // Check file size
    const maxSize = fileType === 'audio' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Max size: ${fileType === 'audio' ? '50MB' : '5MB'}` 
      }, { status: 400 })
    }

    // Upload to IPFS using Pinata
    const pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: process.env.NEXT_PUBLIC_IPFS_GATEWAY!
    })
    
    const upload = await pinata.upload.file(file).group(fileType || 'beats')
    
    return NextResponse.json({
      success: true,
      url: `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${upload.IpfsHash}`,
      hash: upload.IpfsHash,
      size: file.size
    })

  } catch (error: any) {
    console.error('IPFS upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error.message },
      { status: 500 }
    )
  }
}