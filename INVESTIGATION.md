# BeatsChain OpenGraph Investigation

## Issue: Green Gradient Instead of Real Cover Image

### Problem Statement
- Beat 1753451090862 shows green gradient in OpenGraph instead of real cover image
- Beat data exists in frontend (can play beat)
- API returns "Beat data not found" - cache miss

### Investigation Timeline

#### ✅ Confirmed Working
- Frontend beat playback works
- Beat data exists in localStorage
- OpenGraph generation logic is correct
- Image fitting approach fixed (backgroundImage with contain)

#### ❌ Root Cause: Cache Miss
- `/api/beat-metadata/1753451090862` returns 404
- `global.beatMetadataCache` is empty
- `BeatMetadataSync` component not populating server cache

### Technical Flow Analysis

```
Frontend (localStorage) → BeatMetadataSync → API Cache → OpenGraph Generation
     ✅ Working           ❌ BROKEN      ❌ Empty     ❌ Fallback
```

### Next Steps
1. Debug BeatMetadataSync component mounting
2. Verify sync timing vs social scraping
3. Add cache population logging
4. Test sync trigger conditions

### Files to Investigate
- `/src/hooks/useBeatMetadataSync.ts` - Sync logic
- `/src/context/Web3DataContext.tsx` - Data source
- `/src/app/api/beat-metadata/[id]/route.ts` - Cache endpoint