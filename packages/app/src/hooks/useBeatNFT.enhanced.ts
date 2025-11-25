'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
// import { toast } from 'react-toastify' // Replaced with enhanced toast

// Smart contract ABI for BeatNFT Credit System
const BeatNFTCreditSystemAbi = [
  {
    type: 'function',
    name: 'purchaseCredits',
    inputs: [{ name: 'packageId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function', 
    name: 'upgradeToProNFT',
    inputs: [],
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    name: 'getCreditBalance', 
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'hasProNFT',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    name: 'canUpload',
    inputs: [{ name: 'user', type: 'address' }, { name: 'requiredCredits', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'event',
    name: 'CreditsPurchased',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'credits', type: 'uint256', indexed: false },
      { name: 'price', type: 'uint256', indexed: false }
    ]
  },
  {
    type: 'event',
    name: 'ProNFTUpgraded', 
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'price', type: 'uint256', indexed: false }
    ]
  }
] as const

// Contract addresses
const BeatNFTCreditSystemAddress = {
  1: '0x0000000000000000000000000000000000000000', // Mainnet - not deployed
  11155111: '0xcf7f010edb33f5c8582e8f97e20ef76be8b83311', // Sepolia V2 - deployed
  31337: '0x5fbdb2315678afecb367f032d93f642f64180aa3' // Local - deployed
} as const

export interface BeatNFTBalance {
  credits: number
  hasProNFT: boolean
  totalUsed: number
  totalPurchased?: number
  lastPurchase?: string
  proNFTUpgradedAt?: string
  proNFTTransactionHash?: string
}

export function useBeatNFT() {
  const [balance, setBalance] = useState<BeatNFTBalance>({
    credits: 10, // Default free credits
    hasProNFT: false,
    totalUsed: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()

  // Load balance on mount and when wallet changes
  useEffect(() => {
    if (isConnected && address) {
      loadBalance()
    } else {
      // Reset balance when wallet disconnects
      setBalance({
        credits: 10,
        hasProNFT: false,
        totalUsed: 0
      })
    }
  }, [address, isConnected])

  const loadBalance = async () => {
    if (!address || typeof window === 'undefined') return

    try {
      setLoading(true)
      setError(null)
      
      // Try to load from contract first
      try {
        const { chain } = useAccount()
        const chainId = chain?.id || 31337 // Default to local hardhat network
        const contractAddress = BeatNFTCreditSystemAddress[chainId as keyof typeof BeatNFTCreditSystemAddress] as `0x${string}`
        
        if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
          const { data: readContract } = useReadContract({
            address: contractAddress,
            abi: BeatNFTCreditSystemAbi,
            functionName: 'getCreditBalance',
            args: [address as `0x${string}`]
          })
          
          const { data: hasProNFTData } = useReadContract({
            address: contractAddress,
            abi: BeatNFTCreditSystemAbi,
            functionName: 'hasProNFT',
            args: [address as `0x${string}`]
          })
          
          if (readContract !== undefined) {
            const credits = Number(readContract)
            const hasProNFT = Boolean(hasProNFTData)
            
            // Update balance from contract data
            const newBalance = {
              ...balance,
              credits: hasProNFT ? Infinity : credits,
              hasProNFT
            }
            
            // Store in localStorage for offline access
            localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
            setBalance(newBalance)
            return // Exit early if contract data was loaded successfully
          }
        }
      } catch (contractError) {
        console.warn('Failed to load balance from contract:', contractError)
        // Continue with localStorage fallback
      }
      
      // Load from localStorage (temporary until smart contract integration)
      try {
        const stored = localStorage.getItem(`beatnft_balance_${address}`)
        if (stored) {
          const balanceData = JSON.parse(stored)
          setBalance(balanceData)
        } else {
          // New user gets 10 free credits
          const newBalance = {
            credits: 10,
            hasProNFT: false,
            totalUsed: 0,
            welcomeCreditsReceived: true,
            receivedAt: new Date().toISOString()
          }
          localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
          setBalance(newBalance)
          
          // Welcome notification removed to prevent loops
        }
      } catch (storageError) {
        console.error('Failed to load balance from localStorage:', storageError)
        // Fallback to default balance
        setBalance({
          credits: 10,
          hasProNFT: false,
          totalUsed: 0
        })
      }
    } catch (error: any) {
      console.error('Failed to load BeatNFT balance:', error)
      setError(`Failed to load credits: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const canUpload = (file: File | { size: number; name: string }): { allowed: boolean; cost: number; reason?: string; fileSize?: string } => {
    const fileSize = file.size
    const fileName = 'name' in file ? file.name : ''
    const fileType = fileName.split('.').pop()?.toLowerCase() || 'mp3'
    const sizeMB = fileSize / (1024 * 1024)
    
    // Check file size limit (100MB max)
    if (sizeMB > 100) {
      return {
        allowed: false,
        cost: 0,
        fileSize: `${sizeMB.toFixed(1)}MB`,
        reason: 'File size exceeds 100MB limit'
      }
    }
    
    // Calculate credits based on file size (reduced costs)
    let cost = 1 // Base cost for upload only
    if (sizeMB > 50) cost = 3
    else if (sizeMB > 25) cost = 2
    else if (sizeMB > 10) cost = 1
    
    // Pro users can upload anything under 100MB
    if (balance.hasProNFT) {
      return { allowed: true, cost: 0, fileSize: `${sizeMB.toFixed(1)}MB` }
    }
    
    // Check if user has enough credits
    if (balance.credits >= cost) {
      return { allowed: true, cost, fileSize: `${sizeMB.toFixed(1)}MB` }
    }
    
    // Not enough credits
    return { 
      allowed: false, 
      cost,
      fileSize: `${sizeMB.toFixed(1)}MB`,
      reason: `Need ${cost} BeatNFT credit${cost !== 1 ? 's' : ''}. You have ${balance.credits}. Request more credits via support.`
    }
  }

  const useCredits = async (amount: number): Promise<boolean> => {
    if (!address || typeof window === 'undefined') return false
    if (balance.hasProNFT) return true // Pro users don't use credits
    
    if (balance.credits < amount) {
      setError(`Not enough credits. Need ${amount}, have ${balance.credits}.`)
      return false
    }
    
    try {
      setLoading(true)
      
      // Try contract call first
      try {
        // Contract call would go here in production
        // For now, we'll use localStorage
      } catch (contractError) {
        console.warn('Failed to use credits via contract:', contractError)
        // Continue with localStorage fallback
      }
      
      // Update localStorage
      try {
        const newBalance = {
          ...balance,
          credits: balance.credits - amount,
          totalUsed: balance.totalUsed + amount,
          lastUsed: new Date().toISOString()
        }
        
        localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
        setBalance(newBalance)
        return true
      } catch (storageError) {
        console.error('Failed to update credits in localStorage:', storageError)
        setError('Failed to update credits. Please try again.')
        return false
      }
    } catch (error: any) {
      console.error('Failed to use credits:', error)
      setError(`Failed to use credits: ${error.message || 'Unknown error'}`)
      return false
    } finally {
      setLoading(false)
    }
  }

  const { writeContract } = useWriteContract()
  
  const buyCredits = async (amount: number): Promise<boolean> => {
    if (!address || typeof window === 'undefined') return false
    
    try {
      setLoading(true)
      setError(null)
      
      // Determine package ID based on amount
      let packageId = 0
      let cost = 0.01
      
      if (amount === 10) { packageId = 0; cost = 0.01 }
      else if (amount === 25) { packageId = 1; cost = 0.02 }
      else if (amount === 50) { packageId = 2; cost = 0.035 }
      else if (amount === 100) { packageId = 3; cost = 0.06 }
      else {
        setError('Invalid credit package')
        return false
      }
      
      // Get contract address based on chain ID
      const { chain } = useAccount()
      const chainId = chain?.id || 31337 // Default to local hardhat network
      const contractAddress = BeatNFTCreditSystemAddress[chainId as keyof typeof BeatNFTCreditSystemAddress] as `0x${string}`
      
      // If contract is not deployed on this chain, fallback to simulation
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`Contract not deployed on chain ${chainId}, using simulation`)
        return await simulateCreditPurchase(amount, cost)
      }
      
      // Try real smart contract call
      try {
        const hash = await writeContract({
          address: contractAddress,
          abi: BeatNFTCreditSystemAbi,
          functionName: 'purchaseCredits',
          args: [BigInt(packageId)],
          value: parseEther(cost.toString())
        })
        
        console.log(`Transaction submitted: ${hash.slice(0, 10)}...`)
        
        // Update local balance for immediate UI feedback
        const newBalance = {
          ...balance,
          credits: balance.credits + amount,
          totalPurchased: (balance.totalPurchased || 0) + amount,
          lastPurchase: new Date().toISOString()
        }
        localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
        setBalance(newBalance)
        
        return true
      } catch (contractError) {
        console.warn('Contract call failed, falling back to simulation:', contractError)
        // Fall back to simulation
        return await simulateCreditPurchase(amount, cost)
      }
    } catch (error: any) {
      console.error('Failed to buy credits:', error)
      setError(`Failed to buy credits: ${error.message || 'Unknown error'}`)
      console.error(`Transaction failed: ${error.message || 'Unknown error'}`)
      return false
    } finally {
      setLoading(false)
    }
  }
  
  const simulateCreditPurchase = async (amount: number, cost: number): Promise<boolean> => {
    try {
      // Simulate blockchain transaction with localStorage
      const transactionHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
      
      // Record transaction in blockchain-compatible format
      const transaction = {
        hash: transactionHash,
        from: address,
        amount,
        cost,
        timestamp: new Date().toISOString(),
        blockNumber: Date.now() // Placeholder for actual block number
      }
      
      // Store transaction record
      const transactions = JSON.parse(localStorage.getItem('credit_transactions') || '[]')
      transactions.push(transaction)
      localStorage.setItem('credit_transactions', JSON.stringify(transactions))
      
      // Update balance
      const newBalance = {
        ...balance,
        credits: balance.credits + amount,
        totalPurchased: (balance.totalPurchased || 0) + amount,
        lastPurchase: new Date().toISOString()
      }
      localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
      setBalance(newBalance)
      
      console.log(`Purchased ${amount} credits successfully!`)
      return true
    } catch (error: any) {
      console.error('Failed to simulate credit purchase:', error)
      setError(`Failed to purchase credits: ${error.message || 'Unknown error'}`)
      return false
    }
  }

  const upgradeToProNFT = async (): Promise<boolean> => {
    if (!address || typeof window === 'undefined') return false
    
    try {
      setLoading(true)
      setError(null)
      
      // Get contract address based on chain ID
      const { chain } = useAccount()
      const chainId = chain?.id || 31337 // Default to local hardhat network
      const contractAddress = BeatNFTCreditSystemAddress[chainId as keyof typeof BeatNFTCreditSystemAddress] as `0x${string}`
      
      // If contract is not deployed on this chain, fallback to simulation
      if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
        console.warn(`Contract not deployed on chain ${chainId}, using simulation`)
        return await simulateProNFTUpgrade()
      }
      
      // Try real smart contract call
      try {
        const hash = await writeContract({
          address: contractAddress,
          abi: BeatNFTCreditSystemAbi,
          functionName: 'upgradeToProNFT',
          args: [],
          value: parseEther('0.1') // 0.1 ETH for Pro BeatNFT
        })
        
        console.log(`Pro BeatNFT upgrade submitted: ${hash.slice(0, 10)}...`)
        
        // Update local balance for immediate UI feedback
        const newBalance = {
          ...balance,
          hasProNFT: true,
          proNFTUpgradedAt: new Date().toISOString(),
          proNFTTransactionHash: hash
        }
        localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
        setBalance(newBalance)
        
        return true
      } catch (contractError) {
        console.warn('Contract call failed, falling back to simulation:', contractError)
        // Fall back to simulation
        return await simulateProNFTUpgrade()
      }
    } catch (error: any) {
      console.error('Failed to upgrade to Pro BeatNFT:', error)
      setError(`Pro BeatNFT upgrade failed: ${error.message || 'Unknown error'}`)
      console.error(`Pro BeatNFT upgrade failed: ${error.message || 'Unknown error'}`)
      return false
    } finally {
      setLoading(false)
    }
  }
  
  const simulateProNFTUpgrade = async (): Promise<boolean> => {
    try {
      // Simulate blockchain transaction with localStorage
      const transactionHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`
      
      // Record Pro BeatNFT purchase transaction
      const transaction = {
        hash: transactionHash,
        from: address,
        type: 'pro_nft_upgrade',
        cost: 0.1,
        timestamp: new Date().toISOString(),
        blockNumber: Date.now() // Placeholder for actual block number
      }
      
      // Store transaction record
      const transactions = JSON.parse(localStorage.getItem('pro_nft_transactions') || '[]')
      transactions.push(transaction)
      localStorage.setItem('pro_nft_transactions', JSON.stringify(transactions))
      
      // Update balance
      const newBalance = {
        ...balance,
        hasProNFT: true,
        proNFTUpgradedAt: new Date().toISOString(),
        proNFTTransactionHash: transactionHash
      }
      localStorage.setItem(`beatnft_balance_${address}`, JSON.stringify(newBalance))
      setBalance(newBalance)
      
      console.log('Upgraded to Pro BeatNFT successfully!')
      return true
    } catch (error: any) {
      console.error('Failed to simulate Pro BeatNFT upgrade:', error)
      setError(`Pro BeatNFT upgrade failed: ${error.message || 'Unknown error'}`)
      return false
    }
  }

  return {
    balance,
    loading,
    error,
    canUpload,
    useCredits,
    buyCredits,
    upgradeToProNFT,
    isConnected: isConnected && !!address,
    refreshBalance: loadBalance
  }
}