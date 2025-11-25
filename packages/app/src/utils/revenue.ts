// BeatsChain Revenue Model

export const REVENUE_MODEL = {
  // Platform commission on beat sales
  PLATFORM_COMMISSION: 0.15, // 15% platform fee
  PRODUCER_SHARE: 0.85, // 85% goes to producer
  
  // Subscription revenue (100% to platform)
  SUBSCRIPTION_PLANS: {
    basic: { price: 9.99, features: ['Enhanced analytics', 'Priority support'] },
    pro: { price: 29.99, features: ['Advanced tools', 'Custom branding', 'API access'] },
    enterprise: { price: 99.99, features: ['White label', 'Custom integrations', 'Dedicated support'] }
  },

  // Revenue calculation
  calculateRevenue: (beatPrice: number) => ({
    platformRevenue: beatPrice * REVENUE_MODEL.PLATFORM_COMMISSION,
    producerRevenue: beatPrice * REVENUE_MODEL.PRODUCER_SHARE,
    totalSale: beatPrice
  })
}

// Example: $30 beat sale
// Platform gets: $4.50 (15%)
// Producer gets: $25.50 (85%)

export const getRevenueBreakdown = (sales: { beatPrice: number, subscriptions: number }) => {
  const beatRevenue = sales.beatPrice * REVENUE_MODEL.PLATFORM_COMMISSION
  const subscriptionRevenue = sales.subscriptions * REVENUE_MODEL.SUBSCRIPTION_PLANS.basic.price
  
  return {
    beatCommissions: beatRevenue,
    subscriptionRevenue,
    totalRevenue: beatRevenue + subscriptionRevenue
  }
}