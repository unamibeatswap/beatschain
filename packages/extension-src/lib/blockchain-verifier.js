/**
 * Blockchain Transaction Verifier
 * Provides real blockchain verification for generated transactions
 */

class BlockchainVerifier {
    constructor() {
        this.networks = {
            mumbai: {
                name: 'Polygon Mumbai Testnet',
                rpc: 'https://rpc-mumbai.maticvigil.com/',
                explorer: 'https://mumbai.polygonscan.com',
                chainId: 80001
            },
            polygon: {
                name: 'Polygon Mainnet', 
                rpc: 'https://polygon-rpc.com/',
                explorer: 'https://polygonscan.com',
                chainId: 137
            }
        };
    }

    async verifyTransaction(txHash, network = 'mumbai') {
        try {
            const networkConfig = this.networks[network];
            if (!networkConfig) {
                throw new Error(`Unsupported network: ${network}`);
            }

            // Check if transaction exists on blockchain
            const response = await fetch(networkConfig.rpc, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getTransactionByHash',
                    params: [txHash],
                    id: 1
                })
            });

            const result = await response.json();
            
            if (result.result) {
                return {
                    verified: true,
                    transaction: result.result,
                    network: networkConfig.name,
                    explorerUrl: `${networkConfig.explorer}/tx/${txHash}`
                };
            } else {
                // Check Chrome storage for locally generated transaction
                return await this.verifyLocalTransaction(txHash);
            }
        } catch (error) {
            console.error('Blockchain verification failed:', error);
            return {
                verified: false,
                error: error.message,
                isLocal: true
            };
        }
    }

    async verifyLocalTransaction(txHash) {
        try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
                const key = `tx_${txHash}`;
                const result = await chrome.storage.local.get(key);
                
                if (result[key]) {
                    return {
                        verified: true,
                        isLocal: true,
                        transaction: result[key],
                        note: 'Transaction generated locally - not on blockchain',
                        warning: 'This is a simulated transaction for development purposes'
                    };
                }
            }
            
            return {
                verified: false,
                error: 'Transaction not found in local storage or blockchain',
                isLocal: false
            };
        } catch (error) {
            return {
                verified: false,
                error: error.message,
                isLocal: false
            };
        }
    }

    async createRealBlockchainTransaction(recipientAddress, metadataUri, privateKey) {
        // This would implement real blockchain transaction creation
        // For now, we clearly mark simulated transactions
        const timestamp = Date.now();
        const simulatedTx = {
            hash: '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)), 
                b => b.toString(16).padStart(2, '0')).join(''),
            to: recipientAddress,
            data: metadataUri,
            timestamp: timestamp,
            blockNumber: null, // Not mined yet
            status: 'simulated',
            warning: 'DEVELOPMENT MODE: This is a simulated transaction'
        };

        // Store with clear simulation marker
        if (typeof chrome !== 'undefined' && chrome.storage) {
            const key = `tx_${simulatedTx.hash}`;
            await chrome.storage.local.set({ 
                [key]: {
                    ...simulatedTx,
                    type: 'SIMULATED_DEVELOPMENT_TRANSACTION',
                    created: new Date().toISOString()
                }
            });
        }

        return simulatedTx;
    }

    getVerificationMessage(txHash, verificationResult) {
        if (verificationResult.verified && verificationResult.isLocal) {
            return `⚠️ DEVELOPMENT MODE: Transaction ${txHash} is simulated for testing purposes. Not on blockchain.`;
        } else if (verificationResult.verified) {
            return `✅ VERIFIED: Transaction ${txHash} confirmed on ${verificationResult.network}`;
        } else {
            return `❌ NOT FOUND: Transaction ${txHash} not found on blockchain or local storage`;
        }
    }
}

window.BlockchainVerifier = BlockchainVerifier;