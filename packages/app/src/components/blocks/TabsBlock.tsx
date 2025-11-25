'use client'

import { useState } from 'react'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity-client'

interface Tab {
  title: string
  content: any[]
  icon?: string
}

interface Animation {
  type?: 'none' | 'fadeIn' | 'slideUp' | 'slideIn' | 'zoomIn' | 'bounce'
  delay?: number
  duration?: number
}

interface TabsBlockProps {
  title?: string
  tabs: Tab[]
  style?: 'default' | 'pills' | 'underline' | 'boxed'
  colorScheme?: 'default' | 'purple' | 'green' | 'red' | 'gray'
  customClass?: string
  animation?: Animation
}

export default function TabsBlock({ 
  title, 
  tabs, 
  style = 'default',
  colorScheme = 'default',
  customClass = '',
  animation = { type: 'none', delay: 0, duration: 500 }
}: TabsBlockProps) {
  const [activeTab, setActiveTab] = useState(0)

  if (!tabs || tabs.length === 0) return null

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
      
      <div className="tabs-container">
        {/* Tab Navigation */}
        <div className={`tabs-header ${getTabsHeaderClass(style)}`}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab-button ${getTabButtonClass(style, index === activeTab, colorScheme)}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.title}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className={`tab-content ${getTabContentClass(style)}`}>
          {tabs[activeTab]?.content && (
            <div className="prose max-w-none">
              <PortableText
                value={tabs[activeTab].content}
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
      </div>
    </div>
  )
}

// Helper functions for styling
function getTabsHeaderClass(style: string): string {
  switch (style) {
    case 'pills':
      return 'flex space-x-2 mb-4'
    case 'underline':
      return 'flex border-b border-gray-200 mb-4'
    case 'boxed':
      return 'flex mb-0'
    default:
      return 'flex space-x-4 mb-4'
  }
}

function getTabButtonClass(style: string, isActive: boolean, colorScheme: string): string {
  // Get color based on scheme
  const getActiveColor = () => {
    switch (colorScheme) {
      case 'purple': return 'bg-purple-600 text-white'
      case 'green': return 'bg-green-600 text-white'
      case 'red': return 'bg-red-600 text-white'
      case 'gray': return 'bg-gray-700 text-white'
      default: return 'bg-blue-600 text-white'
    }
  }
  
  const getActiveTextColor = () => {
    switch (colorScheme) {
      case 'purple': return 'border-purple-600 text-purple-600'
      case 'green': return 'border-green-600 text-green-600'
      case 'red': return 'border-red-600 text-red-600'
      case 'gray': return 'border-gray-700 text-gray-700'
      default: return 'border-blue-600 text-blue-600'
    }
  }
  
  switch (style) {
    case 'pills':
      return `px-4 py-2 rounded-full ${
        isActive
          ? getActiveColor()
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`
    case 'underline':
      return `px-4 py-2 -mb-px ${
        isActive
          ? `border-b-2 ${getActiveTextColor()}`
          : 'text-gray-500 hover:text-gray-700'
      }`
    case 'boxed':
      return `px-4 py-2 ${
        isActive
          ? `bg-white border-t border-l border-r border-gray-200 rounded-t-lg ${getActiveTextColor().split(' ')[1]}`
          : 'bg-gray-100 text-gray-500 hover:text-gray-700'
      }`
    default:
      return `px-4 py-2 ${
        isActive
          ? getActiveTextColor().split(' ')[1]
          : 'text-gray-500 hover:text-gray-700'
      }`
  }
}

function getTabContentClass(style: string): string {
  switch (style) {
    case 'boxed':
      return 'border border-gray-200 rounded-b-lg p-6'
    default:
      return 'pt-4'
  }
}