// BeatsChain Solana-First Service Worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'store_nft') {
    // Store both Ethereum and Solana NFT data
    chrome.storage.local.get(['nft_history'], (result) => {
      const history = result.nft_history || [];
      const nftData = {
        ...request.data,
        network: request.data.network || 'solana-devnet', // Default to Solana
        timestamp: Date.now()
      };
      history.unshift(nftData);
      chrome.storage.local.set({ nft_history: history.slice(0, 50) });
      console.log('✅ NFT stored:', nftData.network, nftData.txHash || nftData.signature);
    });
  } else if (request.action === 'store_radio_submission') {
    chrome.storage.local.get(['radio_submissions'], (result) => {
      const history = result.radio_submissions || [];
      history.unshift(request.data);
      chrome.storage.local.set({ radio_submissions: history.slice(0, 50) });
    });
  } else if (request.action === 'store_solana_transaction') {
    // Store Solana-specific transaction data
    chrome.storage.local.get(['solana_transactions'], (result) => {
      const transactions = result.solana_transactions || [];
      transactions.unshift({
        ...request.data,
        timestamp: Date.now(),
        network: 'solana-devnet'
      });
      chrome.storage.local.set({ solana_transactions: transactions.slice(0, 100) });
      console.log('✅ Solana transaction stored:', request.data.signature);
    });
  } else if (request.action === 'get_nft_history') {
    chrome.storage.local.get(['nft_history'], (result) => {
      sendResponse({ data: result.nft_history || [] });
    });
    return true;
  } else if (request.action === 'get_radio_history') {
    chrome.storage.local.get(['radio_submissions'], (result) => {
      sendResponse({ data: result.radio_submissions || [] });
    });
    return true;
  } else if (request.action === 'get_solana_transactions') {
    chrome.storage.local.get(['solana_transactions'], (result) => {
      sendResponse({ data: result.solana_transactions || [] });
    });
    return true;
  }
});

// Initialize Solana-first configuration on install
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 BeatsChain Solana-First Extension installed');
  chrome.storage.local.set({
    'solana_network': 'devnet',
    'prefer_solana': true,
    'real_minting': true
  });
});