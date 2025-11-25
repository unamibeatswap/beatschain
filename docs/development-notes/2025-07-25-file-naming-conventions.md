# BeatsChain File Naming Conventions - July 25, 2025

## Established Patterns

### Service Layer Files
- **Pattern**: `{service}Manager.ts` or `{service}.ts`
- **Examples**: 
  - `toastManager.ts` - Toast notification service
  - `currency.ts` - Currency utilities
  - `imageOptimization.ts` - Image processing utilities

### Hook Files
- **Pattern**: `use{Feature}.ts` or `use{Feature}.enhanced.ts`
- **Examples**:
  - `useToast.ts` - Toast management hook
  - `useBeatNFT.enhanced.ts` - Enhanced BeatNFT functionality
  - `useFileUpload.enhanced.ts` - Enhanced file upload
  - `useWeb3Auth.ts` - Web3 authentication

### Context Files
- **Pattern**: `{Feature}Context.tsx` or `{Feature}Context.enhanced.tsx`
- **Examples**:
  - `NotificationContext.enhanced.tsx` - Enhanced notification system
  - `UnifiedAuthContext.tsx` - Authentication context
  - `SIWEContext.tsx` - Sign-in with Ethereum context

### Component Files
- **Pattern**: `{ComponentName}.tsx` or `{ComponentName}.enhanced.tsx`
- **Examples**:
  - `BeatCard.tsx` - Beat display component
  - `PurchaseModal.enhanced.tsx` - Enhanced purchase modal
  - `DashboardLayout.tsx` - Dashboard layout wrapper

### Page Files
- **Pattern**: `page.tsx` (Next.js 13+ App Router)
- **Location**: `/app/{route}/page.tsx`
- **Examples**:
  - `/app/upload/page.tsx` - Upload page
  - `/app/dashboard/page.tsx` - Dashboard page
  - `/app/music-dashboard/page.tsx` - Music lover dashboard

## Enhancement Suffix Pattern

### When to Use `.enhanced`
- **Significant Improvements**: Major functionality additions
- **Backward Compatibility**: When replacing existing functionality
- **Performance Upgrades**: Optimized versions of existing files
- **Architecture Changes**: Structural improvements

### Examples of Enhanced Files
```
useFileUpload.ts → useFileUpload.enhanced.ts
PurchaseModal.tsx → PurchaseModal.enhanced.tsx
NotificationContext.tsx → NotificationContext.enhanced.tsx
```

## Directory Structure Context

### Core Architecture
```
src/
├── components/           # React components
│   ├── {Feature}/       # Feature-specific components
│   └── {ComponentName}.tsx
├── hooks/               # Custom React hooks
│   └── use{Feature}.ts
├── context/             # React contexts
│   └── {Feature}Context.tsx
├── utils/               # Utility functions and services
│   └── {service}Manager.ts
├── types/               # TypeScript type definitions
│   └── {feature}.ts
└── app/                 # Next.js App Router pages
    └── {route}/page.tsx
```

### Feature Organization
- **Related files grouped by feature**
- **Shared utilities in `/utils`**
- **Type definitions in `/types`**
- **Page components in `/app`**

## Naming Rationale

### Service Files
- **`toastManager.ts`**: Manages toast notifications (service pattern)
- **Singular naming**: Represents a single service instance
- **Manager suffix**: Indicates state management and coordination

### Hook Files
- **`useToast.ts`**: React hook for toast functionality
- **`use` prefix**: Standard React hook naming convention
- **Descriptive name**: Clearly indicates functionality

### Context Files
- **`NotificationContext.enhanced.tsx`**: React context for notifications
- **Context suffix**: Indicates React context provider
- **Enhanced suffix**: Improved version of existing context

### Component Files
- **`BeatCard.tsx`**: Component for displaying beat information
- **PascalCase**: Standard React component naming
- **Descriptive**: Name clearly indicates component purpose

## Migration Strategy Context

### Gradual Enhancement Pattern
1. **Create enhanced version**: `{file}.enhanced.{ext}`
2. **Migrate gradually**: Update imports one by one
3. **Remove original**: Once migration complete
4. **Rename enhanced**: Remove `.enhanced` suffix

### Example Migration
```typescript
// Step 1: Create enhanced version
NotificationContext.enhanced.tsx

// Step 2: Update imports gradually
import { NotificationProvider } from '@/context/NotificationContext.enhanced'

// Step 3: Eventually rename
NotificationContext.enhanced.tsx → NotificationContext.tsx
```

## Documentation Files

### Development Notes Pattern
- **Format**: `YYYY-MM-DD-{topic}-{type}.md`
- **Examples**:
  - `2025-07-25-toast-notification-architecture-fix.md`
  - `2025-07-24-user-dashboard-plan.md`
  - `2025-07-23-blockchain-events.md`

### Types of Documentation
- **`-plan.md`**: Implementation plans and strategies
- **`-fix.md`**: Problem analysis and solutions
- **`-analysis.md`**: Comprehensive issue analysis
- **`-assessment.md`**: Business impact assessments
- **`-system.md`**: System architecture documentation

## Best Practices

### File Naming
1. **Be descriptive**: Name should indicate file purpose
2. **Use consistent patterns**: Follow established conventions
3. **Avoid abbreviations**: Use full words for clarity
4. **Use appropriate suffixes**: `.enhanced`, `.types`, `.utils`

### Directory Organization
1. **Group by feature**: Related files together
2. **Separate concerns**: Components, hooks, utils in different directories
3. **Consistent structure**: Follow established patterns
4. **Clear hierarchy**: Logical nesting of directories

### Documentation
1. **Date prefix**: YYYY-MM-DD for chronological order
2. **Descriptive titles**: Clear indication of content
3. **Type suffix**: Indicates document type and purpose
4. **Consistent format**: Follow established markdown structure

---

*These naming conventions ensure consistency, maintainability, and clear understanding of file purposes across the BeatsChain codebase.*