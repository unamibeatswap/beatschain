# BeatsChain Architecture Analysis - July 21, 2025

## Hybrid Architecture Overview

BeatsChain implements a hybrid architecture combining traditional CMS (Sanity) with Web3/blockchain technologies. This document analyzes the separation of concerns and integration points between these systems.

## 1. Data Layer Separation

### 1.1 Sanity CMS Data
- **Content Types**: Blog posts, pages, site settings, navigation
- **Access Pattern**: GROQ queries via Sanity client
- **Update Mechanism**: Sanity Studio UI
- **Primary Files**:
  - `/packages/app/src/lib/sanity-client.ts`
  - `/packages/app/src/lib/sanity.ts`
  - `/packages/app/sanity/schemas/*`

### 1.2 Web3/Blockchain Data
- **Content Types**: Beats, producers, transactions, ownership records
- **Access Pattern**: Smart contract calls via wagmi hooks
- **Update Mechanism**: Blockchain transactions
- **Primary Files**:
  - `/packages/app/src/context/Web3DataContext.tsx`
  - `/packages/app/src/hooks/useBeatNFT.ts`
  - `/packages/hardhat/contracts/*`

## 2. Integration Points

### 2.1 Component Level Integration
Components often need to fetch and display data from both sources:

```typescript
// Example of hybrid data fetching in a component
useEffect(() => {
  // Fetch from Sanity
  const fetchSanityData = async () => {
    const data = await client.fetch(`*[_type == "producer"]`)
    // Process Sanity data
  }
  
  // Fetch from Web3
  const fetchWeb3Data = async () => {
    const data = await readContract(...)
    // Process Web3 data
  }
  
  fetchSanityData()
  fetchWeb3Data()
}, [])
```

### 2.2 Context Providers
The application uses separate context providers for different data sources:

- `Web3Provider.tsx`: Provides Web3 connection and authentication
- `Web3DataContext.tsx`: Provides blockchain data
- Sanity data is typically fetched directly in components

### 2.3 Image Handling
Images come from two different sources and are handled differently:

- **Sanity Images**: Processed with `urlFor` utility from `@sanity/image-url`
- **Web3 Images**: Typically IPFS URLs that need gateway prefixing

## 3. Current Architecture Issues

### 3.1 Inconsistent Data Fetching
- Some components fetch Sanity data server-side, others client-side
- Web3 data is always fetched client-side but with inconsistent patterns
- No clear strategy for when to use which approach

### 3.2 Duplicate Implementations
- Multiple Sanity client implementations with different configurations
- Redundant utility functions for similar operations
- Inconsistent error handling between sources

### 3.3 Unclear Boundaries
- Some components mix concerns between data sources
- No clear pattern for handling hybrid data
- Inconsistent loading and error states

## 4. Recommended Architecture Improvements

### 4.1 Clear Data Source Boundaries
- Define clear interfaces for each data source
- Create adapters for consistent data access patterns
- Establish conventions for when to use each source

### 4.2 Unified Error Handling
- Implement consistent error handling across data sources
- Create shared error boundary components
- Define fallback strategies for each data type

### 4.3 Consistent Loading Patterns
- Create unified loading state management
- Implement skeleton loaders for all content types
- Handle race conditions between data sources

### 4.4 Centralized Configuration
- Consolidate Sanity client configuration
- Create a single source of truth for Web3 configuration
- Document integration points clearly

## 5. Implementation Strategy

### 5.1 Refactor Data Access Layer
- Create clear interfaces for data access
- Implement adapters for different data sources
- Ensure consistent error handling

### 5.2 Enhance Component Architecture
- Create source-agnostic UI components
- Implement data source adapters
- Ensure consistent loading and error states

### 5.3 Improve Developer Experience
- Document data flow patterns
- Create examples for hybrid data access
- Implement proper TypeScript interfaces

## 6. Conclusion

The hybrid architecture of BeatsChain combining Sanity CMS and Web3 technologies provides flexibility but introduces complexity. By establishing clear boundaries, consistent patterns, and proper error handling, we can maintain the benefits while reducing the maintenance burden and improving reliability.