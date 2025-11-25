'use client'

import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity-client'
import TabsBlock from './TabsBlock'
import AccordionBlock from './AccordionBlock'
import FeatureCardsBlock from './FeatureCardsBlock'
import StepsBlock from './StepsBlock'
import TestimonialsBlock from './TestimonialsBlock'
import PricingTableBlock from './PricingTableBlock'

interface ContentBlockRendererProps {
  blocks: any[]
}

export default function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        // Handle different block types
        switch (block._type) {
          case 'tabsBlock':
            return (
              <TabsBlock
                key={block._key || index}
                title={block.title}
                tabs={block.tabs}
                style={block.style}
                colorScheme={block.colorScheme}
                customClass={block.customClass}
                animation={block.animation}
              />
            )
            
          case 'accordionBlock':
            return (
              <AccordionBlock
                key={block._key || index}
                title={block.title}
                items={block.items}
                allowMultiple={block.allowMultiple}
                colorScheme={block.colorScheme}
                customClass={block.customClass}
                animation={block.animation}
              />
            )
            
          case 'featureCardsBlock':
            return (
              <FeatureCardsBlock
                key={block._key || index}
                title={block.title}
                subtitle={block.subtitle}
                cards={block.cards}
                columns={block.columns}
                style={block.style}
              />
            )
            
          case 'stepsBlock':
            return (
              <StepsBlock
                key={block._key || index}
                title={block.title}
                subtitle={block.subtitle}
                steps={block.steps}
                layout={block.layout}
              />
            )
            
          case 'testimonialsBlock':
            return (
              <TestimonialsBlock
                key={block._key || index}
                title={block.title}
                testimonials={block.testimonials}
                display={block.display}
              />
            )
            
          case 'pricingTableBlock':
            return (
              <PricingTableBlock
                key={block._key || index}
                title={block.title}
                subtitle={block.subtitle}
                plans={block.plans}
              />
            )
            
          case 'block':
            return (
              <div key={block._key || index} className="prose max-w-none my-6">
                <PortableText
                  value={[block]}
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
            )
            
          case 'image':
            return block.asset ? (
              <div key={block._key || index} className="my-8">
                <img
                  src={urlFor(block).width(800).url()}
                  alt={block.alt || ' '}
                  className="w-full h-auto rounded-lg"
                />
                {block.caption && (
                  <p className="text-sm text-gray-500 mt-2">{block.caption}</p>
                )}
              </div>
            ) : null
            
          default:
            // For other block types, render a placeholder or nothing
            console.log(`Unhandled block type: ${block._type}`)
            return null
        }
      })}
    </div>
  )
}