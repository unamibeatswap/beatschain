'use client'

// import { formatPrice, PriceDisplayProps } from '@/utils/currency' // Temporarily disabled

interface PriceDisplayProps {
  ethPrice: number
  showBoth?: boolean
  primary?: 'ETH' | 'ZAR'
  className?: string
}

const formatPrice = (ethPrice: number) => ({
  formatted: {
    eth: `${ethPrice} ETH`,
    zar: `R${Math.round(ethPrice * 18000).toLocaleString()}`
  }
})

export default function PriceDisplay({ 
  ethPrice, 
  showBoth = true, 
  primary = 'ETH',
  className = '' 
}: PriceDisplayProps) {
  const price = formatPrice(ethPrice)
  
  if (!showBoth) {
    return (
      <span className={className}>
        {primary === 'ETH' ? price.formatted.eth : price.formatted.zar}
      </span>
    )
  }
  
  return (
    <div className={className}>
      <div className="font-bold text-lg">
        {primary === 'ETH' ? price.formatted.eth : price.formatted.zar}
      </div>
      <div className="text-sm text-gray-500">
        {primary === 'ETH' ? price.formatted.zar : price.formatted.eth}
      </div>
    </div>
  )
}