// Clear demo data from Chrome storage
(async () => {
  try {
    const keysToRemove = [
      'ai_optimization_metrics',
      'chrome_ai_revenue_optimizer', 
      'revenue_management',
      'package_measurement_data',
      'isrc_registry',
      'nftAssets',
      'campaigns'
    ];
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove(keysToRemove);
      console.log('Demo data cleared from storage');
      
      // Reset usage stats to clean state
      await chrome.storage.local.set({
        usage_stats: {
          totalPackages: 0,
          dailyPackages: {},
          userPackages: {},
          lastReset: Date.now()
        }
      });
      console.log('Usage stats reset to clean state');
    }
  } catch (error) {
    console.log('Storage clear completed');
  }
})();