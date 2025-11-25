# Sanity-Web3 Implementation Guide

## Overview

This guide explains how to complete the integration between Sanity CMS and the BeatsChain Web3 application. The implementation follows a clear separation of concerns:

- **Sanity CMS**: Manages static content, styling, SEO metadata, and images
- **Web3/Firebase**: Handles dynamic data, user accounts, transactions, and analytics

## Setup Instructions

### 1. Environment Setup

Ensure your environment variables are properly set:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=3tpr4tci
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03

# For write operations (seeding)
SANITY_API_TOKEN=your_write_token
```

### 2. Seed Initial Styles

Run the seeding script to create default styles in Sanity:

```bash
cd packages/app
SANITY_API_TOKEN=your_token node scripts/seed-sanity-styles.js
```

This will create default styles for:
- Beat cards
- Producer cards
- Pagination
- Contact form

### 3. Create Content in Sanity Studio

1. Access Sanity Studio at `/studio`
2. Create pages with proper SEO metadata:
   - Homepage
   - Contact
   - Producers
   - Blog
3. Upload logo and favicon:
   - Logo: 240×80px (SVG or PNG)
   - Mobile Logo: 40×40px
   - Favicon: 512×512px
   - Touch Icon: 180×180px
4. Configure footer navigation and social links

## Component Usage

### BeatNFT Cards

Use the `SanityBeatCard` component to display beats with Sanity styling:

```tsx
import SanityBeatCard from '@/components/SanityBeatCard'

// In your component
<SanityBeatCard beat={beatData} onPurchase={handlePurchase} />
```

### Producer Cards

Use the `ProducerCard` component for producer profiles:

```tsx
import ProducerCard from '@/components/ProducerCard'

// In your component
<ProducerCard producer={producerData} />
```

### Pagination

Use the enhanced `Pagination` component:

```tsx
import { Pagination } from '@/components/Pagination'

// In your component
<Pagination
  currentPage={currentPage}
  totalItems={items.length}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}
/>
```

### Web3 Contact Form

Use the `Web3ContactForm` component for the contact page:

```tsx
import Web3ContactForm from '@/components/Web3ContactForm'

// In your component
<Web3ContactForm onSubmitSuccess={handleSuccess} />
```

## Customizing Styles

All styling can be customized through Sanity Studio:

1. Go to `/studio`
2. Navigate to the appropriate document type:
   - Beat Card Style
   - Producer Card Style
   - Pagination Style
   - Contact Form Style
3. Edit the default style or create new styles
4. Set `isDefault: true` for the style you want to use

## Platform Fee Note

The platform fee is hardcoded to 15% to match the smart contract, regardless of what's set in Sanity. This ensures consistency between the UI and the blockchain.

## SEO Implementation

The implementation includes comprehensive SEO features:

- Meta titles and descriptions
- Open Graph images (1200×630px)
- Structured data (JSON-LD)
- Canonical URLs
- Robots.txt customization

## Testing

After implementation, test the following:

1. **Logo Display**: Verify logo appears in header
2. **Card Styling**: Check that cards use Sanity styles
3. **Pagination**: Test pagination with different page counts
4. **Contact Form**: Test form submission with wallet connection
5. **SEO**: Validate meta tags and structured data

## Troubleshooting

If components don't display Sanity styles:

1. Check that styles have been seeded in Sanity
2. Verify that one style has `isDefault: true`
3. Check browser console for any errors in the hooks
4. Ensure the Sanity client is properly configured

## Next Steps

1. **Content Population**: Add more pages and blog posts
2. **Style Customization**: Create additional style variations
3. **SEO Optimization**: Add structured data for rich results
4. **Analytics Integration**: Track page performance