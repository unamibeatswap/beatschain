/**
 * Block templates for common patterns
 * 
 * These templates can be used in the Sanity Studio to quickly add
 * pre-configured blocks to pages.
 */

export const blockTemplates = [
  {
    title: 'FAQ Section',
    value: {
      _type: 'accordionBlock',
      title: 'Frequently Asked Questions',
      allowMultiple: true,
      colorScheme: 'blue',
      items: [
        {
          title: 'Question 1',
          content: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Answer to question 1',
                }
              ]
            }
          ],
          isOpen: true
        },
        {
          title: 'Question 2',
          content: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Answer to question 2',
                }
              ]
            }
          ]
        }
      ],
      animation: {
        type: 'fadeIn',
        delay: 0,
        duration: 500
      }
    }
  },
  {
    title: 'Feature Tabs',
    value: {
      _type: 'tabsBlock',
      title: 'Product Features',
      style: 'boxed',
      colorScheme: 'purple',
      tabs: [
        {
          title: 'Feature 1',
          icon: '🚀',
          content: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Description of feature 1',
                }
              ]
            }
          ]
        },
        {
          title: 'Feature 2',
          icon: '⚡',
          content: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Description of feature 2',
                }
              ]
            }
          ]
        }
      ],
      animation: {
        type: 'slideUp',
        delay: 0,
        duration: 500
      }
    }
  },
  {
    title: 'Feature Cards',
    value: {
      _type: 'featureCardsBlock',
      title: 'Key Features',
      subtitle: 'Discover what makes us unique',
      columns: 3,
      style: 'shadowed',
      cards: [
        {
          title: 'Feature 1',
          description: 'Description of feature 1',
          icon: '⛓️'
        },
        {
          title: 'Feature 2',
          description: 'Description of feature 2',
          icon: '💰'
        },
        {
          title: 'Feature 3',
          description: 'Description of feature 3',
          icon: '🌍'
        }
      ],
      animation: {
        type: 'zoomIn',
        delay: 0,
        duration: 500
      }
    }
  },
  {
    title: 'How It Works Steps',
    value: {
      _type: 'stepsBlock',
      title: 'How It Works',
      subtitle: 'Follow these simple steps to get started',
      layout: 'vertical',
      steps: [
        {
          title: 'Step 1: Sign Up',
          description: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Create your account and connect your wallet',
                }
              ]
            }
          ]
        },
        {
          title: 'Step 2: Browse Beats',
          description: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Explore our marketplace to find the perfect beat',
                }
              ]
            }
          ]
        },
        {
          title: 'Step 3: Purchase',
          description: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: 'Buy the beat with cryptocurrency and own it as an NFT',
                }
              ]
            }
          ]
        }
      ],
      animation: {
        type: 'slideIn',
        delay: 0,
        duration: 500
      }
    }
  }
];

// Function to register block templates in the Sanity Studio
export function registerBlockTemplates(templates) {
  return {
    name: 'blockTemplates',
    title: 'Block Templates',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string'
      },
      {
        name: 'contentBlocks',
        title: 'Content Blocks',
        type: 'array',
        of: [
          { type: 'tabsBlock' },
          { type: 'accordionBlock' },
          { type: 'featureCardsBlock' },
          { type: 'stepsBlock' },
          { type: 'testimonialsBlock' },
          { type: 'pricingTableBlock' }
        ],
        options: {
          templates: templates
        }
      }
    ]
  };
}