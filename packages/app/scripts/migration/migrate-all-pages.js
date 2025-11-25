/**
 * Migrate all hardcoded pages to Sanity blocks
 * 
 * This script converts remaining hardcoded pages to Sanity blocks
 * while maintaining backward compatibility.
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

// Pages to migrate
const pagesToMigrate = [
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    blocks: [
      {
        _type: 'accordionBlock',
        _key: 'faq_accordion_1',
        title: 'General Questions',
        allowMultiple: true,
        colorScheme: 'blue',
        items: [
          {
            title: 'What is BeatsChain?',
            content: [
              {
                _type: 'block',
                _key: 'faq_gen_1',
                style: 'normal',
                markDefs: [],
                children: [
                  {
                    _type: 'span',
                    _key: 'faq_gen_1_span',
                    text: 'BeatsChain is a Web3 beat marketplace where South African producers can sell beats as NFTs. Artists can buy beats with crypto, own them forever, and producers earn automatic royalties.',
                    marks: []
                  }
                ]
              }
            ],
            isOpen: true
          },
          {
            title: 'How do I get started?',
            content: [
              {
                _type: 'block',
                _key: 'faq_gen_2',
                style: 'normal',
                markDefs: [],
                children: [
                  {
                    _type: 'span',
                    _key: 'faq_gen_2_span',
                    text: 'To get started, connect your wallet, create an account, and start browsing beats. If you\'re a producer, you can also upload your own beats to sell.',
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
        _key: 'faq_accordion_2',
        title: 'For Producers',
        allowMultiple: true,
        colorScheme: 'purple',
        items: [
          {
            title: 'How do I upload beats?',
            content: [
              {
                _type: 'block',
                _key: 'faq_prod_1',
                style: 'normal',
                markDefs: [],
                children: [
                  {
                    _type: 'span',
                    _key: 'faq_prod_1_span',
                    text: 'To upload beats, go to your dashboard, click "Upload Beat", fill in the details, set your price, and mint your beat as an NFT.',
                    marks: []
                  }
                ]
              }
            ]
          },
          {
            title: 'How do royalties work?',
            content: [
              {
                _type: 'block',
                _key: 'faq_prod_2',
                style: 'normal',
                markDefs: [],
                children: [
                  {
                    _type: 'span',
                    _key: 'faq_prod_2_span',
                    text: 'When you mint a beat, you can set a royalty percentage. Every time your beat is resold on the secondary market, you\'ll automatically receive that percentage as a royalty payment.',
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
        _key: 'faq_accordion_3',
        title: 'For Artists',
        allowMultiple: true,
        colorScheme: 'green',
        items: [
          {
            title: 'How do I buy beats?',
            content: [
              {
                _type: 'block',
                _key: 'faq_art_1',
                style: 'normal',
                markDefs: [],
                children: [
                  {
                    _type: 'span',
                    _key: 'faq_art_1_span',
                    text: 'Browse the marketplace, listen to previews, and when you find a beat you like, click "Buy Now" to purchase it using cryptocurrency.',
                    marks: []
                  }
                ]
              }
            ]
          },
          {
            title: 'What rights do I get when I buy a beat?',
            content: [
              {
                _type: 'block',
                _key: 'faq_art_2',
                style: 'normal',
                markDefs: [],
                children: [
                  {
                    _type: 'span',
                    _key: 'faq_art_2_span',
                    text: 'When you buy a beat, you get the rights specified in the license attached to the NFT. This typically includes the right to use the beat in your own music, but specific terms may vary.',
                    marks: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    blocks: [
      {
        _type: 'block',
        _key: 'terms_intro',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'terms_intro_span',
            text: 'Last updated: July 1, 2023',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'terms_h1',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'terms_h1_span',
            text: '1. Introduction',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'terms_p1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'terms_p1_span',
            text: 'Welcome to BeatsChain. These Terms of Service govern your use of our website and services.',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'terms_h2',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'terms_h2_span',
            text: '2. Definitions',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'terms_p2',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'terms_p2_span',
            text: '"Beat NFT" refers to a non-fungible token representing ownership of a beat on the blockchain.',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'terms_p3',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'terms_p3_span',
            text: '"Platform" refers to the BeatsChain website and services.',
            marks: []
          }
        ]
      }
    ]
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    blocks: [
      {
        _type: 'block',
        _key: 'privacy_intro',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'privacy_intro_span',
            text: 'Last updated: July 1, 2023',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'privacy_h1',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'privacy_h1_span',
            text: '1. Information We Collect',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'privacy_p1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'privacy_p1_span',
            text: 'We collect information you provide directly to us, such as when you create an account, connect your wallet, or contact us.',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'privacy_h2',
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'privacy_h2_span',
            text: '2. Wallet Information',
            marks: []
          }
        ]
      },
      {
        _type: 'block',
        _key: 'privacy_p2',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'privacy_p2_span',
            text: 'When you connect your wallet, we collect your wallet address and transaction history on our platform.',
            marks: []
          }
        ]
      }
    ]
  }
];

// Migrate pages
async function migratePages() {
  console.log(`🔄 Migrating ${pagesToMigrate.length} pages to Sanity blocks...`);
  
  for (const page of pagesToMigrate) {
    try {
      console.log(`\nChecking for existing ${page.slug} page...`);
      const existingPage = await client.fetch('*[_type == "page" && slug.current == $slug][0]', { slug: page.slug });
      
      if (existingPage) {
        console.log(`Updating existing ${page.slug} page...`);
        await client.patch(existingPage._id)
          .set({
            contentBlocks: page.blocks
          })
          .commit();
        console.log(`✅ ${page.slug} page updated successfully!`);
      } else {
        console.log(`Creating new ${page.slug} page...`);
        await client.create({
          _type: 'page',
          title: page.title,
          slug: {
            _type: 'slug',
            current: page.slug
          },
          contentBlocks: page.blocks,
          seo: {
            metaTitle: page.title,
            metaDescription: `BeatsChain - ${page.title}`
          }
        });
        console.log(`✅ ${page.slug} page created successfully!`);
      }
    } catch (error) {
      console.error(`❌ Error migrating ${page.slug} page:`, error);
    }
  }
  
  console.log('\n🎉 Page migration completed!');
}

migratePages();