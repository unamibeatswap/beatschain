import { beat } from './beat'
import { web3Beat } from './web3Beat'
import { producer } from './producer'
import { post, blockContent } from './post'
import { page } from './page'
import { category } from './category'
import { author } from './author'
import { siteSettings } from './siteSettings'
import { heroSection } from './heroSection'
import { blogHero } from './blogHero'
import { contentBlock } from './contentBlock'
import { paginatedList, interactiveForm, mediaGallery, dynamicTable } from './advancedContentBlocks'
import { web3Stats } from './web3ContentBlocks'
import { beatCardStyle, producerCardStyle } from './cardStyles'
import { paginationStyle, contactFormStyle } from './uiComponents'
import { navigation } from './navigation'
import { walletConnect } from './walletConnect'
import { guide } from './guide'
import { 
  tabsBlock, 
  accordionBlock, 
  featureCardsBlock, 
  stepsBlock, 
  testimonialsBlock, 
  pricingTableBlock 
} from './enterpriseBlocks'

export const schemaTypes = [
  // Core content types
  beat,
  web3Beat,
  producer,
  
  // Content management
  post,
  blockContent,
  page,
  category,
  author,
  
  // Site configuration
  siteSettings,
  navigation,
  walletConnect,
  
  // Dynamic content
  heroSection,
  blogHero,
  contentBlock,
  
  // Advanced content blocks
  paginatedList,
  interactiveForm,
  mediaGallery,
  dynamicTable,
  
  // Enterprise content blocks
  tabsBlock,
  accordionBlock,
  featureCardsBlock,
  stepsBlock,
  testimonialsBlock,
  pricingTableBlock,
  
  // Web3 content blocks
  web3Stats,
  
  // UI Components
  beatCardStyle,
  producerCardStyle,
  paginationStyle,
  contactFormStyle,
  // Guides
  guide,
]