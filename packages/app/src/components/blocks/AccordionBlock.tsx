'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity-client'

interface AccordionItem {
  title: string
  content: any[]
  isOpen?: boolean
}

interface Animation {
  type?: 'none' | 'fadeIn' | 'slideUp' | 'slideIn' | 'zoomIn' | 'bounce'
  delay?: number
  duration?: number
}

interface AccordionBlockProps {
  title?: string
  items: AccordionItem[]
  allowMultiple?: boolean
  colorScheme?: 'default' | 'purple' | 'green' | 'red' | 'gray'
  customClass?: string
  animation?: Animation
}

export default function AccordionBlock({ 
  title, 
  items, 
  allowMultiple = false,
  colorScheme = 'default',
  customClass = '',
  animation = { type: 'none', delay: 0, duration: 500 }
}: AccordionBlockProps) {
  const [openItems, setOpenItems] = useState<boolean[]>(
    items?.map(item => !!item.isOpen) || []
  )

  if (!items || items.length === 0) return null

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => {
        const newState = [...prev]
        newState[index] = !newState[index]
        return newState
      })
    } else {
      setOpenItems(prev => 
        prev.map((_, i) => i === index ? !prev[index] : false)
      )
    }
  }

  // Get color based on scheme
  const getAccentColor = () => {
    switch (colorScheme) {
      case 'purple': return 'border-purple-500'
      case 'green': return 'border-green-500'
      case 'red': return 'border-red-500'
      case 'gray': return 'border-gray-700'
      default: return 'border-blue-500'
    }
  }
  
  // Get animation class
  const getAnimationClass = () => {
    if (!animation || animation.type === 'none') return '';
    
    const animationClasses = {
      fadeIn: 'animate-fadeIn',
      slideUp: 'animate-slideUp',
      slideIn: 'animate-slideIn',
      zoomIn: 'animate-zoomIn',
      bounce: 'animate-bounce'
    };
    
    return animationClasses[animation.type] || '';
  };
  
  // Get animation style
  const getAnimationStyle = () => {
    if (!animation || animation.type === 'none') return {};
    
    return {
      animationDelay: `${animation.delay || 0}ms`,
      animationDuration: `${animation.duration || 500}ms`
    };
  };
  
  return (
    <div 
      className={`my-8 ${customClass} ${getAnimationClass()}`}
      style={getAnimationStyle()}
    >
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      <div className={`accordion-container border rounded-lg divide-y ${getAccentColor()}`}>
        {items.map((item, index) => (
          <div key={index} className="accordion-item">
            <button
              className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
              onClick={() => toggleItem(index)}
            >
              <span className="font-medium">{item.title}</span>
              <span className="transform transition-transform">
                {openItems[index] ? '−' : '+'}
              </span>
            </button>
            
            {openItems[index] && (
              <div className="p-4 pt-0 prose max-w-none">
                <PortableText
                  value={item.content}
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
            )}
          </div>
        ))}
      </div>
    </div>
  )
}