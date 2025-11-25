/**
 * Fallback content for pages
 * 
 * This module provides fallback content for pages in case Sanity content is not available.
 * This ensures no breaking changes during the migration process.
 */

const fallbackContent = {
  // Contact page
  'contact': {
    title: 'Contact Us',
    content: `
      <div class="max-w-3xl mx-auto">
        <p class="mb-6 text-lg">Have questions about BeatsChain? We're here to help! Fill out the form below and our team will get back to you as soon as possible.</p>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <form class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Your Name</label>
              <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Enter your name" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Enter your email" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Subject</label>
              <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option>Producer Support</option>
                <option>Buyer Support</option>
                <option>Technical Issue</option>
                <option>Partnership Inquiry</option>
                <option>Media & Press</option>
                <option>General Inquiry</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Message</label>
              <textarea rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Enter your message"></textarea>
            </div>
            
            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    `
  },
  
  // FAQ page
  'faq': {
    title: 'Frequently Asked Questions',
    content: `
      <div class="max-w-3xl mx-auto">
        <p class="mb-6 text-lg">Find answers to the most common questions about BeatsChain and our services.</p>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-medium text-gray-900">What is BeatsChain?</h3>
            <p class="mt-2 text-gray-600">BeatsChain is a Web3 beat marketplace where South African producers can sell beats as NFTs. Artists can buy beats with crypto, own them forever, and producers earn automatic royalties.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-medium text-gray-900">How do I buy beats?</h3>
            <p class="mt-2 text-gray-600">Connect your wallet, browse the marketplace, and purchase beats directly with cryptocurrency. Once purchased, you'll own the beat as an NFT.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-medium text-gray-900">How do royalties work?</h3>
            <p class="mt-2 text-gray-600">Producers earn automatic royalties through our smart contract whenever their beats are resold on the secondary market.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-medium text-gray-900">What cryptocurrencies do you accept?</h3>
            <p class="mt-2 text-gray-600">We currently accept ETH and MATIC for beat purchases.</p>
          </div>
        </div>
      </div>
    `
  },
  
  // Terms page
  'terms': {
    title: 'Terms of Service',
    content: `
      <div class="max-w-3xl mx-auto prose prose-indigo">
        <p>Last updated: July 1, 2023</p>
        
        <h2>1. Introduction</h2>
        <p>Welcome to BeatsChain. These Terms of Service govern your use of our website and services.</p>
        
        <h2>2. Definitions</h2>
        <p>"Beat NFT" refers to a non-fungible token representing ownership of a beat on the blockchain.</p>
        <p>"Platform" refers to the BeatsChain website and services.</p>
        
        <h2>3. Account Registration</h2>
        <p>To use certain features of the Platform, you must register for an account and connect a compatible cryptocurrency wallet.</p>
        
        <h2>4. Beat Ownership & Licensing</h2>
        <p>Purchasing a Beat NFT grants you specific rights to the underlying beat as specified in the license attached to the NFT.</p>
        
        <h2>5. Royalties</h2>
        <p>Producers receive automatic royalties on secondary sales as specified in the smart contract.</p>
        
        <h2>6. Prohibited Activities</h2>
        <p>Users may not engage in any illegal activities or violate these terms while using the Platform.</p>
        
        <h2>7. Termination</h2>
        <p>We reserve the right to terminate or suspend your account for violations of these terms.</p>
        
        <h2>8. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of the Platform constitutes acceptance of the updated terms.</p>
      </div>
    `
  },
  
  // Privacy page
  'privacy': {
    title: 'Privacy Policy',
    content: `
      <div class="max-w-3xl mx-auto prose prose-indigo">
        <p>Last updated: July 1, 2023</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, connect your wallet, or contact us.</p>
        
        <h2>2. Wallet Information</h2>
        <p>When you connect your wallet, we collect your wallet address and transaction history on our platform.</p>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
        
        <h2>4. Sharing Your Information</h2>
        <p>We do not sell your personal information. We may share information with service providers, for legal reasons, or in connection with a business transfer.</p>
        
        <h2>5. Security</h2>
        <p>We implement reasonable security measures to protect your information.</p>
        
        <h2>6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal information.</p>
        
        <h2>7. Changes to This Policy</h2>
        <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
      </div>
    `
  },
  
  // Guide page
  'guide': {
    title: 'BeatsChain User Guide',
    content: `
      <div class="max-w-3xl mx-auto prose prose-indigo">
        <h2>Getting Started</h2>
        <p>Welcome to BeatsChain! This guide will help you navigate our platform and make the most of your experience.</p>
        
        <h3>1. Connect Your Wallet</h3>
        <p>Click the "Connect Wallet" button in the top right corner to connect your Web3 wallet.</p>
        
        <h3>2. Browse Beats</h3>
        <p>Explore our marketplace to discover beats from talented South African producers.</p>
        
        <h3>3. Purchase Beats</h3>
        <p>When you find a beat you like, click "Buy Now" to purchase it as an NFT using cryptocurrency.</p>
        
        <h3>4. For Producers</h3>
        <p>If you're a producer, you can upload your beats by clicking "Upload" in the dashboard.</p>
        
        <h2>Understanding Beat NFTs</h2>
        <p>Beat NFTs represent ownership of a beat on the blockchain. When you purchase a Beat NFT, you gain specific rights to use the beat as specified in the attached license.</p>
        
        <h2>Royalties System</h2>
        <p>Our smart contract automatically distributes royalties to producers when their beats are resold on the secondary market.</p>
        
        <h2>Need Help?</h2>
        <p>If you have any questions or need assistance, please visit our <a href="/faq">FAQ</a> or <a href="/contact">contact us</a>.</p>
      </div>
    `
  },
  
  // Disclaimer page
  'disclaimer': {
    title: 'Disclaimer',
    content: `
      <div class="max-w-3xl mx-auto prose prose-indigo">
        <p>Last updated: July 1, 2023</p>
        
        <h2>General Disclaimer</h2>
        <p>The information provided on BeatsChain is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
        
        <h2>No Financial Advice</h2>
        <p>The information contained on BeatsChain is not intended as, and shall not be understood or construed as, financial advice. We are not a financial advisor, registered investment advisor, or broker-dealer.</p>
        
        <h2>Cryptocurrency Risks</h2>
        <p>Cryptocurrency investments are volatile and high-risk. Never invest money that you cannot afford to lose. Always conduct your own research before making any investment decisions.</p>
        
        <h2>NFT Ownership</h2>
        <p>Owning a Beat NFT grants you specific rights as outlined in the license attached to the NFT. It does not necessarily grant you full copyright ownership of the underlying beat.</p>
        
        <h2>External Links</h2>
        <p>BeatsChain may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy of information on these sites.</p>
        
        <h2>Changes to This Disclaimer</h2>
        <p>We may update this disclaimer from time to time. We will notify you of any changes by posting the new disclaimer on this page.</p>
      </div>
    `
  }
};

export default fallbackContent;