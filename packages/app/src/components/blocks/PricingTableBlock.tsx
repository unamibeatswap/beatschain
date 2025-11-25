'use client'

import Link from 'next/link'

interface PricingPlan {
  name: string
  price: string
  interval?: string
  description?: string
  features: string[]
  cta?: {
    text: string
    url: string
  }
  highlighted?: boolean
}

interface PricingTableBlockProps {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
}

export default function PricingTableBlock({ 
  title, 
  subtitle, 
  plans 
}: PricingTableBlockProps) {
  if (!plans || plans.length === 0) return null

  return (
    <div className="my-12">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
          {subtitle && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div 
            key={index} 
            className={`pricing-plan rounded-lg overflow-hidden ${
              plan.highlighted 
                ? 'border-2 border-blue-500 shadow-lg relative' 
                : 'border border-gray-200 shadow-sm'
            }`}
          >
            {/* Popular Badge */}
            {plan.highlighted && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Popular
              </div>
            )}
            
            {/* Plan Header */}
            <div className={`p-6 ${plan.highlighted ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.interval && (
                  <span className="text-gray-500 ml-1">/{plan.interval}</span>
                )}
              </div>
              {plan.description && (
                <p className="mt-2 text-gray-600">{plan.description}</p>
              )}
            </div>
            
            {/* Features */}
            <div className="p-6">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* CTA Button */}
            {plan.cta && (
              <div className="px-6 pb-6">
                <Link 
                  href={plan.cta.url}
                  className={`block w-full py-2 px-4 rounded-md text-center font-medium ${
                    plan.highlighted 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  {plan.cta.text}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}