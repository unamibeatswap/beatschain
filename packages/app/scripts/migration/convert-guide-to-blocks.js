/**
 * Convert Guide page to Sanity blocks
 * 
 * This script converts the hardcoded Guide page content to Sanity blocks
 * with tabs, accordions, and other advanced content blocks.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Initialize Sanity client
const token = process.env.NEXT_PUBLIC_SANITY_API_TOKEN;
console.log('Token available:', !!token);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3tpr4tci',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: token,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
});

// Guide page content converted to blocks
const guidePageBlocks = [
  {
    _type: 'tabsBlock',
    _key: 'guide_tabs_1',
    title: 'BeatsChain User Guide',
    style: 'boxed',
    colorScheme: 'purple',
    tabs: [
      {
        title: 'Getting Started',
        icon: '🚀',
        content: [
          {
            _type: 'block',
            _key: 'getting_started_1',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'getting_started_span_1',
                text: 'Welcome to BeatsChain! This guide will help you navigate our platform and make the most of your experience.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'getting_started_2',
            style: 'h3',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'getting_started_span_2',
                text: '1. Connect Your Wallet',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'getting_started_3',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'getting_started_span_3',
                text: 'Click the "Connect Wallet" button in the top right corner to connect your Web3 wallet.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'getting_started_4',
            style: 'h3',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'getting_started_span_4',
                text: '2. Browse Beats',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'getting_started_5',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'getting_started_span_5',
                text: 'Explore our marketplace to discover beats from talented South African producers.',
                marks: []
              }
            ]
          }
        ]
      },
      {
        title: 'For Producers',
        icon: '🎹',
        content: [
          {
            _type: 'block',
            _key: 'producers_1',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'producers_span_1',
                text: 'As a producer on BeatsChain, you can upload and sell your beats as NFTs, earning royalties whenever they are resold.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'producers_2',
            style: 'h3',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'producers_span_2',
                text: 'Uploading Beats',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'producers_3',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'producers_span_3',
                text: 'Navigate to your dashboard and click "Upload Beat" to start the process. You\'ll need to provide details about your beat and set pricing.',
                marks: []
              }
            ]
          }
        ]
      },
      {
        title: 'For Artists',
        icon: '🎤',
        content: [
          {
            _type: 'block',
            _key: 'artists_1',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'artists_span_1',
                text: 'As an artist on BeatsChain, you can browse and purchase beats directly from producers, with full ownership rights secured on the blockchain.',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'artists_2',
            style: 'h3',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'artists_span_2',
                text: 'Purchasing Beats',
                marks: []
              }
            ]
          },
          {
            _type: 'block',
            _key: 'artists_3',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'artists_span_3',
                text: 'Browse the marketplace, listen to previews, and when you find a beat you like, click "Buy Now" to purchase it using cryptocurrency.',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    _type: 'accordionBlock',
    _key: 'guide_accordion_1',
    title: 'Frequently Asked Questions',
    allowMultiple: true,
    colorScheme: 'green',
    items: [
      {
        title: 'What is a BeatNFT?',
        content: [
          {
            _type: 'block',
            _key: 'faq_1_content',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'faq_1_span',
                text: 'A BeatNFT is a non-fungible token that represents ownership of a beat on the blockchain. When you purchase a BeatNFT, you gain specific rights to use the beat as specified in the attached license.',
                marks: []
              }
            ]
          }
        ],
        isOpen: true
      },
      {
        title: 'How do royalties work?',
        content: [
          {
            _type: 'block',
            _key: 'faq_2_content',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'faq_2_span',
                text: 'Our smart contract automatically distributes royalties to producers when their beats are resold on the secondary market. The royalty percentage is set by the producer when the beat is first minted.',
                marks: []
              }
            ]
          }
        ]
      },
      {
        title: 'What cryptocurrencies do you accept?',
        content: [
          {
            _type: 'block',
            _key: 'faq_3_content',
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: 'faq_3_span',
                text: 'We currently accept ETH (Ethereum) and MATIC (Polygon) for beat purchases.',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    _type: 'featureCardsBlock',
    _key: 'guide_features_1',
    title: 'Platform Features',
    subtitle: 'Discover what makes BeatsChain unique',
    columns: 3,
    style: 'shadowed',
    cards: [
      {
        title: 'Blockchain Ownership',
        description: 'All beats are minted as NFTs on the blockchain, providing verifiable ownership and provenance.',
        icon: '⛓️'
      },
      {
        title: 'Automatic Royalties',
        description: 'Producers earn royalties automatically whenever their beats are resold on the secondary market.',
        icon: '💰'
      },
      {
        title: 'Global Marketplace',
        description: 'Connect with producers and artists from around the world in our decentralized marketplace.',
        icon: '🌍'
      }
    ]
  }
];

// Check if the Guide page already exists in Sanity
async function updateGuidePage() {
  try {
    console.log('Checking for existing Guide page...');
    const existingPage = await client.fetch('*[_type == "page" && slug.current == "guide"][0]');
    
    if (existingPage) {
      console.log('Updating existing Guide page...');
      await client.patch(existingPage._id)
        .set({
          contentBlocks: guidePageBlocks
        })
        .commit();
      console.log('✅ Guide page updated successfully!');
    } else {
      console.log('Creating new Guide page...');
      await client.create({
        _type: 'page',
        title: 'BeatsChain User Guide',
        slug: {
          _type: 'slug',
          current: 'guide'
        },
        contentBlocks: guidePageBlocks,
        seo: {
          metaTitle: 'BeatsChain User Guide',
          metaDescription: 'Learn how to use BeatsChain, the Web3 beat marketplace connecting SA producers with global artists.'
        }
      });
      console.log('✅ Guide page created successfully!');
    }
  } catch (error) {
    console.error('Error updating Guide page:', error);
  }
}

updateGuidePage();