'use client'

import { useState } from 'react'
import { useContract } from './useContract'
import { useUnifiedAuth } from '@/context/UnifiedAuthContext'
import { Beat } from '@/types'
import { PaymentManager, PaymentToken, SUPPORTED_TOKENS } from '@/lib/payments'

interface PurchaseOptions {
  licenseType: 'basic' | 'premium' | 'exclusive'
  paymentMethod: 'crypto' | 'card'
  paymentToken?: PaymentToken
}

export function usePurchase() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedToken, setSelectedToken] = useState<PaymentToken>(SUPPORTED_TOKENS[0])
  const { user } = useUnifiedAuth()
  const { buyBeat, isPending, isConfirming, isConfirmed, hash } = useContract()

  const purchaseBeat = async (beat: Beat, options: PurchaseOptions) => {
    if (!user) {
      throw new Error('User must be authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      const licenseMultiplier = {
        basic: 0.8,
        premium: 1,
        exclusive: 8
      }[options.licenseType]

      const totalPrice = beat.price * licenseMultiplier
      const paymentToken = options.paymentToken || selectedToken
      
      if (options.paymentMethod === 'crypto') {
        // Web3 payment flow
        if (paymentToken.address === '0x0000000000000000000000000000000000000000') {
          // ETH payment - direct contract call
          const result = await buyBeat(beat.tokenId || 0, totalPrice.toString())
          return {
            success: true,
            transactionHash: result.hash,
            beatId: beat.id,
            licenseType: options.licenseType,
            paymentToken: paymentToken.symbol
          }
        } else {
          // ERC20 token payment
          throw new Error('ERC20 payments not yet implemented')
        }
      } else {
        // Traditional payment via API
        const idToken = await user.getIdToken()
        
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            beatId: beat.id,
            licenseType: options.licenseType,
            paymentMethod: options.paymentMethod,
            amount: totalPrice,
            paymentToken: paymentToken.symbol
          })
        })
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Payment failed')
      }

      const result = await response.json()
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        transactionId: result.transactionId,
        beatId: beat.id,
        licenseType: options.licenseType,
        downloadUrl: result.downloadUrl
      }
    } catch (err: any) {
      setError(err.message || 'Purchase failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const mintAndSell = async (beat: Beat, priceInEth: number, royaltyPercentage: number = 5) => {
    if (!user) {
      throw new Error('User must be authenticated')
    }

    setLoading(true)
    setError(null)

    try {
      // Mock IPFS metadata upload
      const metadata = {
        name: beat.title,
        description: beat.description,
        image: beat.coverImageUrl,
        audio: beat.audioUrl,
        attributes: [
          { trait_type: 'Genre', value: beat.genre },
          { trait_type: 'BPM', value: beat.bpm },
          { trait_type: 'Key', value: beat.key },
          { trait_type: 'Producer', value: beat.producerId }
        ]
      }

      const metadataUri = `ipfs://mock-hash-${beat.id}`
      
      // Mint NFT with royalties
      // Note: This would need the user's wallet address
      const mockWalletAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
      
      console.log('Minting NFT:', {
        to: mockWalletAddress,
        metadataUri,
        royaltyRecipient: mockWalletAddress,
        royaltyPercentage
      })

      // In real implementation, would call mintBeat function
      // await mintBeat(mockWalletAddress, metadataUri, mockWalletAddress, royaltyPercentage)

      return {
        success: true,
        tokenId: Math.floor(Math.random() * 10000), // Mock token ID
        metadataUri,
        transactionHash: hash
      }
    } catch (err: any) {
      setError(err.message || 'Minting failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const approveToken = async (amount: string) => {
    if (selectedToken.address === '0x0000000000000000000000000000000000000000') {
      return true // ETH doesn't need approval
    }

    try {
      setLoading(true)
      setError(null)
      
      // This would need contract address to approve
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x58cab6383b346c08775d1340301fabbfc3a66239'
      await PaymentManager.approveToken(
        selectedToken.address,
        contractAddress,
        amount
      )
      
      return true
    } catch (err: any) {
      setError(err.message || 'Approval failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    purchaseBeat,
    mintAndSell,
    approveToken,
    selectedToken,
    setSelectedToken,
    supportedTokens: SUPPORTED_TOKENS,
    loading: loading || isPending || isConfirming,
    error,
    isConfirmed: true,
    transactionHash: hash
  }
}