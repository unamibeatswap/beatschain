export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    beatsPerMonth: number
    storageGB: number
    analyticsRetention: number
  }

}

export interface UserSubscription {
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean

  createdAt: Date
  updatedAt: Date
}

export const BEATNFT_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    interval: 'month',
    features: [
      '10 Free BeatNFT Credits',
      'MP3 uploads only (1 credit each)',
      'Basic analytics',
      'Community support'
    ],
    limits: {
      beatsPerMonth: 10,
      storageGB: 1,
      analyticsRetention: 30
    }
  },
  {
    id: 'pro-nft',
    name: 'Pro BeatNFT',
    price: 0.1, // ETH price
    interval: 'month',
    features: [
      'Unlimited uploads (all formats)',
      'MP3, WAV, ZIP support',
      'Advanced analytics',
      'Priority support',
      'Revenue insights',
      'No credit consumption'
    ],
    limits: {
      beatsPerMonth: -1, // unlimited
      storageGB: -1, // unlimited
      analyticsRetention: -1 // unlimited
    }
  }
]

// Legacy plans for backward compatibility
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = BEATNFT_PLANS