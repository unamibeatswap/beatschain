'use client'

import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity-client'

interface Step {
  title: string
  description: any[]
  image?: any
}

interface StepsBlockProps {
  title?: string
  subtitle?: string
  steps: Step[]
  layout?: 'vertical' | 'horizontal'
}

export default function StepsBlock({ 
  title, 
  subtitle, 
  steps, 
  layout = 'vertical' 
}: StepsBlockProps) {
  if (!steps || steps.length === 0) return null

  return (
    <div className="my-12">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {title && <h2 className="text-3xl font-bold mb-3">{title}</h2>}
          {subtitle && <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      {/* Steps */}
      <div className={`steps-container ${layout === 'horizontal' ? 'flex flex-wrap justify-center gap-8' : 'space-y-12'}`}>
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step ${layout === 'horizontal' ? 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]' : 'flex items-start gap-6'}`}
          >
            {/* Step Number */}
            <div className={`step-number ${layout === 'horizontal' ? 'mb-4' : 'flex-shrink-0'}`}>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white text-xl font-bold">
                {index + 1}
              </div>
            </div>
            
            <div className={`step-content ${layout === 'horizontal' ? '' : 'flex-grow'}`}>
              {/* Step Title */}
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              
              {/* Step Image (if available) */}
              {step.image && (
                <div className="mb-4">
                  <img
                    src={urlFor(step.image).width(800).url()}
                    alt={step.title}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              {/* Step Description */}
              <div className="prose max-w-none">
                <PortableText
                  value={step.description}
                  components={{
                    types: {
                      image: ({value}) => (
                        <img
                          src={urlFor(value).width(800).url()}
                          alt={value.alt || ' '}
                          className="rounded-lg my-4"
                        />
                      ),
                    },
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}