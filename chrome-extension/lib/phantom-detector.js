// Phantom Wallet Detection Content Script
(function() {
    'use strict';
    
    // Check for Phantom wallet
    function detectPhantom() {
        if (window.solana && window.solana.isPhantom) {
            console.log('✅ Phantom wallet detected');
            return true;
        }
        
        // Check for phantom object
        if (window.phantom && window.phantom.solana) {
            console.log('✅ Phantom wallet detected (phantom object)');
            return true;
        }
        
        return false;
    }
    
    // Send detection result to extension
    function reportPhantomStatus() {
        const isPhantomAvailable = detectPhantom();
        
        // Store result for extension access
        window.phantomDetected = isPhantomAvailable;
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('phantomDetected', {
            detail: { available: isPhantomAvailable }
        }));
    }
    
    // Run detection immediately
    reportPhantomStatus();
    
    // Also check after page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', reportPhantomStatus);
    }
    
    // Check periodically for late-loading wallets
    setTimeout(reportPhantomStatus, 1000);
    setTimeout(reportPhantomStatus, 3000);
})();