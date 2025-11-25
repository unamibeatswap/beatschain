/**
 * Security Validation Script
 * Comprehensive security check for production readiness
 */

class SecurityValidator {
    constructor() {
        this.issues = [];
        this.warnings = [];
        this.passed = [];
    }

    async validateAll() {
        console.log('🔒 Running comprehensive security validation...');
        
        // 1. File existence checks
        await this.checkVulnerableFiles();
        
        // 2. Code pattern analysis
        await this.checkCodePatterns();
        
        // 3. Configuration validation
        await this.checkConfiguration();
        
        // 4. Chrome extension security
        await this.checkExtensionSecurity();
        
        // 5. Generate report
        return this.generateReport();
    }

    async checkVulnerableFiles() {
        console.log('📁 Checking for vulnerable files...');
        
        const vulnerableFiles = [
            'popup/popup-backup.js',
            'popup/popup-fixed.js'
        ];
        
        for (const file of vulnerableFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    this.issues.push(`CRITICAL: Vulnerable file exists: ${file}`);
                } else {
                    this.passed.push(`Vulnerable file removed: ${file}`);
                }
            } catch (error) {
                this.passed.push(`Vulnerable file not found: ${file}`);
            }
        }
    }

    async checkCodePatterns() {
        console.log('🔍 Analyzing code patterns...');
        
        const filesToCheck = [
            'popup/popup.js',
            'lib/thirdweb.js',
            'lib/audio-manager.js',
            'lib/download-manager.js'
        ];
        
        const dangerousPatterns = [
            {
                pattern: /process\.env\./g,
                severity: 'HIGH',
                message: 'process.env usage detected - should use config system'
            },
            {
                pattern: /innerHTML\s*=/g,
                severity: 'MEDIUM', 
                message: 'innerHTML usage detected - potential XSS risk'
            },
            {
                pattern: /eval\s*\\(/g,
                severity: 'CRITICAL',
                message: 'eval() usage detected - code injection risk'
            },
            {
                pattern: /document\\.write/g,
                severity: 'HIGH',
                message: 'document.write usage detected - XSS risk'
            },
            {
                pattern: /039a88d61f538316a611/g,
                severity: 'CRITICAL',
                message: 'Hardcoded Pinata API key detected'
            },
            {
                pattern: /15d14b953368d4d5c830c6e05f4767d63443da92da3359a7223ae115315beb91/g,
                severity: 'CRITICAL',
                message: 'Hardcoded Pinata secret key detected'
            }
        ];\n        \n        for (const file of filesToCheck) {\n            try {\n                const response = await fetch(file);\n                if (response.ok) {\n                    const content = await response.text();\n                    \n                    for (const check of dangerousPatterns) {\n                        const matches = content.match(check.pattern);\n                        if (matches) {\n                            const message = `${check.severity}: ${check.message} in ${file} (${matches.length} occurrences)`;\n                            if (check.severity === 'CRITICAL') {\n                                this.issues.push(message);\n                            } else {\n                                this.warnings.push(message);\n                            }\n                        }\n                    }\n                } else {\n                    this.warnings.push(`Could not analyze ${file}`);\n                }\n            } catch (error) {\n                this.warnings.push(`Failed to check ${file}: ${error.message}`);\n            }\n        }\n    }\n\n    async checkConfiguration() {\n        console.log('⚙️ Validating configuration...');\n        \n        // Check Chrome storage API availability\n        if (typeof chrome === 'undefined' || !chrome.storage) {\n            this.issues.push('CRITICAL: Chrome storage API not available');\n            return;\n        }\n        \n        try {\n            // Test config system\n            const testKey = 'security_test_' + Date.now();\n            await chrome.storage.local.set({ [testKey]: 'test' });\n            const result = await chrome.storage.local.get(testKey);\n            \n            if (result[testKey] === 'test') {\n                this.passed.push('Chrome storage API functional');\n                await chrome.storage.local.remove(testKey);\n            } else {\n                this.issues.push('CRITICAL: Chrome storage API not working correctly');\n            }\n        } catch (error) {\n            this.issues.push(`CRITICAL: Chrome storage test failed: ${error.message}`);\n        }\n    }\n\n    async checkExtensionSecurity() {\n        console.log('🛡️ Checking extension security...');\n        \n        // Check manifest permissions\n        try {\n            const manifest = chrome.runtime.getManifest();\n            \n            // Validate required permissions\n            const requiredPermissions = ['storage'];\n            for (const permission of requiredPermissions) {\n                if (manifest.permissions && manifest.permissions.includes(permission)) {\n                    this.passed.push(`Required permission granted: ${permission}`);\n                } else {\n                    this.issues.push(`CRITICAL: Missing required permission: ${permission}`);\n                }\n            }\n            \n            // Check for overly broad permissions\n            const dangerousPermissions = ['<all_urls>', 'tabs', 'history', 'bookmarks'];\n            for (const permission of dangerousPermissions) {\n                if (manifest.permissions && manifest.permissions.includes(permission)) {\n                    this.warnings.push(`Potentially dangerous permission: ${permission}`);\n                }\n            }\n            \n        } catch (error) {\n            this.issues.push(`Failed to validate manifest: ${error.message}`);\n        }\n        \n        // Check CSP compliance\n        if (typeof window !== 'undefined') {\n            // Test for inline script execution\n            try {\n                const testScript = document.createElement('script');\n                testScript.textContent = 'window.cspTest = true;';\n                document.head.appendChild(testScript);\n                \n                if (window.cspTest) {\n                    this.warnings.push('Inline scripts can execute - CSP may be too permissive');\n                } else {\n                    this.passed.push('CSP properly blocks inline scripts');\n                }\n                \n                document.head.removeChild(testScript);\n            } catch (error) {\n                this.passed.push('CSP properly blocks inline script injection');\n            }\n        }\n    }\n\n    generateReport() {\n        const report = {\n            timestamp: new Date().toISOString(),\n            summary: {\n                critical_issues: this.issues.length,\n                warnings: this.warnings.length,\n                passed_checks: this.passed.length,\n                overall_status: this.issues.length === 0 ? 'PASS' : 'FAIL'\n            },\n            details: {\n                critical_issues: this.issues,\n                warnings: this.warnings,\n                passed_checks: this.passed\n            }\n        };\n        \n        console.log('📊 Security Validation Report:');\n        console.log(`Status: ${report.summary.overall_status}`);\n        console.log(`Critical Issues: ${report.summary.critical_issues}`);\n        console.log(`Warnings: ${report.summary.warnings}`);\n        console.log(`Passed Checks: ${report.summary.passed_checks}`);\n        \n        if (this.issues.length > 0) {\n            console.error('❌ Critical Issues Found:');\n            this.issues.forEach(issue => console.error(`  - ${issue}`));\n        }\n        \n        if (this.warnings.length > 0) {\n            console.warn('⚠️ Warnings:');\n            this.warnings.forEach(warning => console.warn(`  - ${warning}`));\n        }\n        \n        return report;\n    }\n\n    isProductionReady() {\n        return this.issues.length === 0;\n    }\n}\n\n// Export for use in other scripts\nwindow.SecurityValidator = SecurityValidator;\n\n// Auto-run validation if in extension context\nif (typeof chrome !== 'undefined' && chrome.runtime) {\n    const validator = new SecurityValidator();\n    validator.validateAll().then(report => {\n        if (validator.isProductionReady()) {\n            console.log('✅ Security validation passed - ready for production');\n        } else {\n            console.error('❌ Security validation failed - production blocked');\n        }\n    });\n}