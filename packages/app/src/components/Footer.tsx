'use client'

import React, { useEffect, useState } from 'react'
import { getSiteSettings } from '@/lib/sanity-client'

export function Footer() {
  const [footerData, setFooterData] = useState<any>(null)
  
  useEffect(() => {
    async function loadFooterData() {
      try {
        const settings = await getSiteSettings()
        if (settings?.footer) setFooterData(settings.footer)
      } catch (error) {
        console.error('Error loading footer data:', error)
      }
    }
    loadFooterData()
  }, [])
  return (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">BeatsChain</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {footerData?.companyInfo || 'Connecting South African producers with global artists through blockchain technology.'}
            </p>
            <p className="text-gray-300 text-sm">
              {footerData?.address || '1033 Section 1, Madadeni, 2951\nSouth Africa'}
            </p>
          </div>
          
          {/* Navigation Groups from Sanity */}
          {footerData?.navigationGroups ? (
            footerData.navigationGroups.map((group: any, index: number) => (
              <div key={index}>
                <h4 className="text-base font-medium mb-4">{group.title}</h4>
                <div className="flex flex-col gap-2">
                  {group.links?.map((link: any, linkIndex: number) => (
                    <a 
                      key={linkIndex}
                      href={link.url} 
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Platform - Default */}
              <div>
                <h4 className="text-base font-medium mb-4">Platform</h4>
                <div className="flex flex-col gap-2">
                  <a href="/beatnfts" className="text-gray-300 hover:text-white text-sm transition-colors">BeatNFTs</a>
                  <a href="/producers" className="text-gray-300 hover:text-white text-sm transition-colors">Producers</a>
                  {/* Credit Market link removed */}
                  <a href="/creator-dashboard" className="text-gray-300 hover:text-white text-sm transition-colors">Creator Hub</a>
                </div>
              </div>
              
              {/* Resources - Default */}
              <div>
                <h4 className="text-base font-medium mb-4">Resources</h4>
                <div className="flex flex-col gap-2">
                  <a href="/guide" className="text-gray-300 hover:text-white text-sm transition-colors">📚 Guide</a>
                  <a href="/blog" className="text-gray-300 hover:text-white text-sm transition-colors">Blog</a>
                  <a href="/faq" className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</a>
                  <a href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Contact</a>
                </div>
              </div>
              
              {/* Legal - Default */}
              <div>
                <h4 className="text-base font-medium mb-4">Legal</h4>
                <div className="flex flex-col gap-2">
                  <a href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">Terms of Use</a>
                  <a href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
                  <a href="/disclaimer" className="text-gray-300 hover:text-white text-sm transition-colors">Risk Disclaimer</a>
                  <span className="text-gray-400 text-xs">POPIA Compliant</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} BeatsChain.
            </p>
            {footerData?.legalText ? (
              <div className="text-xs text-gray-400">
                {footerData.legalText}
              </div>
            ) : (
              <div className="flex gap-2 text-xs text-gray-400">
                <span>🇿🇦 Made in South Africa</span>
                <span>•</span>
                <span>⛓️ Web3 Native</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-xs text-gray-400">Follow us:</span>
            {footerData?.socialLinks ? (
              footerData.socialLinks.map((social: any, index: number) => (
                <a 
                  key={index}
                  href={social.url} 
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {social.platform}
                </a>
              ))
            ) : (
              <>
                <a href="https://instagram.com/beatschain" className="text-gray-300 hover:text-white text-sm transition-colors">Instagram</a>
                {/* Discord link removed */}
              </>
            )}
          </div>
        </div>
        
        {/* Foundation Attribution */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">
            A product of{' '}
            <a 
              href="https://www.unamifoundation.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Unami Foundation NPC
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Empowering communities through blockchain technology
          </p>
        </div>
        
        {/* Compliance Notice */}
        <div className="mt-6 p-4 bg-gray-700 rounded-md">
          <p className="text-xs text-gray-300 text-center mb-2">
            ⚠️ Cryptocurrency trading involves risk. BeatsChain is not a financial advisor. 
            Users must comply with local regulations including SARB and FICA requirements. 
            Only invest what you can afford to lose.
          </p>
          <p className="text-xs text-gray-400 text-center">
            We use Google Analytics for marketing insights. Your Web3 data stays private on the blockchain. 
            Wallet connections and preferences are stored locally on your device.
          </p>
        </div>
      </div>
    </footer>
  )
}
