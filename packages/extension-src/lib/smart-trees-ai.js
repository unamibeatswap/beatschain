/**
 * Smart Trees AI Intelligence System
 * Local AI-powered insights that grow with user interactions
 * 100% local storage, no blockchain integration
 */

class SmartTreesAI {
    constructor(chromeAI = null, userInputManager = null) {
        this.chromeAI = chromeAI;
        this.userInputManager = userInputManager;
        this.isInitialized = false;
        this.insights = new Map();
        this.dataPoints = new Map();
        this.patterns = new Map();
        
        // Insight categories
        this.categories = {
            PERFORMANCE: 'performance',
            OPPORTUNITIES: 'opportunities', 
            OPTIMIZATION: 'optimization',
            COLLABORATION: 'collaboration',
            MARKET: 'market'
        };
    }

    async initialize() {
        try {
            // Load existing insights from storage
            await this.loadStoredData();
            
            // Initialize pattern recognition
            this.initializePatternTracking();
            
            this.isInitialized = true;
            console.log('✅ Smart Trees AI initialized');
            return true;
        } catch (error) {
            console.error('Smart Trees AI initialization failed:', error);
            return false;
        }
    }

    async loadStoredData() {
        try {
            const stored = await chrome.storage.local.get([
                'smartTrees_insights',
                'smartTrees_dataPoints', 
                'smartTrees_patterns'
            ]);
            
            if (stored.smartTrees_insights) {
                this.insights = new Map(Object.entries(stored.smartTrees_insights));
            }
            
            if (stored.smartTrees_dataPoints) {
                this.dataPoints = new Map(Object.entries(stored.smartTrees_dataPoints));
            }
            
            if (stored.smartTrees_patterns) {
                this.patterns = new Map(Object.entries(stored.smartTrees_patterns));
            }
            
        } catch (error) {
            console.error('Failed to load Smart Trees data:', error);
        }
    }

    async saveData() {
        try {
            await chrome.storage.local.set({
                smartTrees_insights: Object.fromEntries(this.insights),
                smartTrees_dataPoints: Object.fromEntries(this.dataPoints),
                smartTrees_patterns: Object.fromEntries(this.patterns)
            });
        } catch (error) {
            console.error('Failed to save Smart Trees data:', error);
        }
    }

    initializePatternTracking() {
        // Track user behavior patterns
        this.trackingCategories = {
            UPLOAD_PATTERNS: 'upload_timing',
            GENRE_PREFERENCES: 'genre_choices',
            SOCIAL_ACTIVITY: 'social_links',
            RADIO_SUCCESS: 'radio_responses',
            LICENSE_CHOICES: 'license_preferences'
        };
    }

    // Record user activity for pattern analysis
    recordActivity(type, data) {
        if (!this.isInitialized) return;
        
        const timestamp = Date.now();
        const activityId = `${type}_${timestamp}`;
        
        const activity = {
            type,
            data: this.sanitizeData(data),
            timestamp,
            processed: false
        };
        
        this.dataPoints.set(activityId, activity);
        
        // Trigger pattern analysis if enough data points
        if (this.dataPoints.size % 5 === 0) {
            this.analyzePatterns();
        }
        
        this.saveData();
    }

    sanitizeData(data) {
        if (!data || typeof data !== 'object') return {};
        
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = value.substring(0, 200).replace(/[<>\"'&]/g, '');
            } else if (typeof value === 'number') {
                sanitized[key] = Math.min(Math.max(value, -999999), 999999);
            } else if (typeof value === 'boolean') {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }

    // Analyze patterns and generate insights
    async analyzePatterns() {
        try {
            const recentActivities = Array.from(this.dataPoints.values())
                .filter(activity => Date.now() - activity.timestamp < 7 * 24 * 60 * 60 * 1000) // Last 7 days
                .sort((a, b) => b.timestamp - a.timestamp);
            
            if (recentActivities.length < 3) return;
            
            // Analyze different pattern types
            await this.analyzeUploadPatterns(recentActivities);
            await this.analyzeGenrePreferences(recentActivities);
            await this.analyzeSocialActivity(recentActivities);
            await this.analyzeRadioSuccess(recentActivities);
            
        } catch (error) {
            console.error('Pattern analysis failed:', error);
        }
    }

    async analyzeUploadPatterns(activities) {
        const uploads = activities.filter(a => a.type === 'beat_upload' || a.type === 'radio_upload');
        if (uploads.length < 2) return;
        
        // Analyze timing patterns
        const uploadTimes = uploads.map(u => new Date(u.timestamp));
        const dayOfWeek = this.getMostCommonDay(uploadTimes);
        const hourOfDay = this.getMostCommonHour(uploadTimes);
        
        if (dayOfWeek && hourOfDay) {
            await this.generateInsight(
                this.categories.OPTIMIZATION,
                'Upload Timing Pattern',
                `Your uploads typically happen on ${dayOfWeek}s around ${hourOfDay}:00. Consider scheduling social media posts to coincide with your creative sessions.`,
                { pattern: 'upload_timing', confidence: 0.8 }
            );
        }
    }

    async analyzeGenrePreferences(activities) {
        const genreActivities = activities.filter(a => 
            a.data.genre && (a.type === 'beat_upload' || a.type === 'license_generation')
        );
        
        if (genreActivities.length < 3) return;
        
        const genreCounts = {};
        genreActivities.forEach(activity => {
            const genre = activity.data.genre;
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
        
        const topGenre = Object.entries(genreCounts)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (topGenre && topGenre[1] >= 2) {
            await this.generateInsight(
                this.categories.PERFORMANCE,
                'Genre Specialization',
                `${topGenre[0]} represents ${Math.round(topGenre[1] / genreActivities.length * 100)}% of your recent work. Consider building a brand around this genre or exploring complementary styles.`,
                { pattern: 'genre_focus', genre: topGenre[0], confidence: 0.9 }
            );
        }
    }

    async analyzeSocialActivity(activities) {
        const socialData = activities.filter(a => a.data.socialLinks || a.data.musicPlatforms || a.data.profileUpdate);
        if (socialData.length === 0) return;
        
        const platforms = new Set();
        const musicPlatforms = new Set();
        
        socialData.forEach(activity => {
            if (activity.data.socialLinks) {
                Object.keys(activity.data.socialLinks).forEach(platform => platforms.add(platform));
            }
            if (activity.data.musicPlatforms) {
                Object.keys(activity.data.musicPlatforms).forEach(platform => {
                    if (activity.data.musicPlatforms[platform]) {
                        musicPlatforms.add(platform);
                    }
                });
            }
        });
        
        const totalPlatforms = platforms.size + musicPlatforms.size;
        
        if (totalPlatforms > 0) {
            let insightText = `You're active on ${totalPlatforms} platform(s)`;
            
            if (musicPlatforms.size >= 3) {
                insightText += ` including ${musicPlatforms.size} music platforms. This multi-platform presence is excellent for discoverability and fan engagement.`;
            } else if (musicPlatforms.size > 0) {
                insightText += `. Consider expanding to more music platforms like Spotify, SoundCloud, or YouTube for broader reach.`;
            } else {
                insightText += ` but no music platforms detected. Add your Spotify, SoundCloud, or YouTube links to maximize music discovery.`;
            }
            
            await this.generateInsight(
                this.categories.OPPORTUNITIES,
                'Platform Presence Analysis',
                insightText,
                { 
                    pattern: 'platform_presence', 
                    socialPlatforms: Array.from(platforms),
                    musicPlatforms: Array.from(musicPlatforms),
                    confidence: 0.8 
                }
            );
        }
    }

    async analyzeRadioSuccess(activities) {
        const radioSubmissions = activities.filter(a => a.type === 'radio_submission');
        const radioResponses = activities.filter(a => a.type === 'radio_response');
        
        if (radioSubmissions.length >= 2) {
            const successRate = radioResponses.length / radioSubmissions.length;
            
            if (successRate > 0.3) {
                await this.generateInsight(
                    this.categories.PERFORMANCE,
                    'Radio Success Pattern',
                    `Your radio submissions have a ${Math.round(successRate * 100)}% response rate. This is above average - consider increasing submission frequency.`,
                    { pattern: 'radio_success', rate: successRate, confidence: 0.8 }
                );
            }
        }
    }

    async generateInsight(category, title, description, metadata = {}) {
        if (!this.chromeAI || !this.chromeAI.apis.prompt) {
            // Use template-based insights without AI
            return this.createTemplateInsight(category, title, description, metadata);
        }
        
        try {
            // Enhance insight with AI
            const prompt = `Enhance this music industry insight with actionable advice:
            
Title: ${title}
Description: ${description}
Category: ${category}
Context: Independent music artist using BeatsChain for NFT minting and radio submission

Provide 2-3 specific, actionable recommendations in a professional but encouraging tone. Keep it under 150 words.`;
            
            const enhanced = await this.chromeAI.apis.prompt.prompt(prompt);
            
            return this.createInsight(category, title, enhanced || description, metadata);
            
        } catch (error) {
            console.error('AI insight enhancement failed:', error);
            return this.createTemplateInsight(category, title, description, metadata);
        }
    }

    createInsight(category, title, description, metadata) {
        const insightId = `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const insight = {
            id: insightId,
            category,
            title: this.sanitizeString(title),
            description: this.sanitizeString(description),
            metadata,
            timestamp: Date.now(),
            viewed: false,
            dismissed: false,
            actionTaken: false
        };
        
        this.insights.set(insightId, insight);
        this.saveData();
        
        return insight;
    }

    createTemplateInsight(category, title, description, metadata) {
        // Template-based insights with professional advice
        const templates = {
            [this.categories.PERFORMANCE]: {
                suffix: "Track your progress and consider documenting your journey for fans.",
                icon: "📊"
            },
            [this.categories.OPPORTUNITIES]: {
                suffix: "Research similar artists and identify collaboration opportunities.",
                icon: "🎯"
            },
            [this.categories.OPTIMIZATION]: {
                suffix: "Small improvements in workflow can lead to significant productivity gains.",
                icon: "⚡"
            },
            [this.categories.COLLABORATION]: {
                suffix: "Building relationships in the music industry is key to long-term success.",
                icon: "🤝"
            },
            [this.categories.MARKET]: {
                suffix: "Stay informed about industry trends and adapt your strategy accordingly.",
                icon: "📈"
            }
        };
        
        const template = templates[category] || templates[this.categories.PERFORMANCE];
        const enhancedDescription = `${description} ${template.suffix}`;
        
        return this.createInsight(category, title, enhancedDescription, {
            ...metadata,
            icon: template.icon,
            template: true
        });
    }

    sanitizeString(str) {
        if (!str) return '';
        return String(str)
            .replace(/[<>\"'&]/g, match => {
                const map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
                return map[match];
            })
            .substring(0, 300);
    }

    // Get insights for UI display
    getInsights(limit = 5) {
        return Array.from(this.insights.values())
            .filter(insight => !insight.dismissed)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }

    // Mark insight as viewed
    markViewed(insightId) {
        const insight = this.insights.get(insightId);
        if (insight) {
            insight.viewed = true;
            this.saveData();
        }
    }

    // Dismiss insight
    dismissInsight(insightId) {
        const insight = this.insights.get(insightId);
        if (insight) {
            insight.dismissed = true;
            this.saveData();
        }
    }

    // Mark action taken on insight
    markActionTaken(insightId) {
        const insight = this.insights.get(insightId);
        if (insight) {
            insight.actionTaken = true;
            this.saveData();
        }
    }

    // Trigger new insight generation manually
    async growNewBranch() {
        try {
            await this.analyzePatterns();
            
            // Generate summary insight if enough data
            const recentInsights = this.getInsights(10);
            if (recentInsights.length >= 3) {
                await this.generateSummaryInsight(recentInsights);
            }
            
            return this.getInsights(1)[0]; // Return newest insight
            
        } catch (error) {
            console.error('Failed to grow new branch:', error);
            return null;
        }
    }

    async generateSummaryInsight(recentInsights) {
        const categories = recentInsights.map(i => i.category);
        const mostCommon = this.getMostCommonCategory(categories);
        
        if (mostCommon) {
            await this.generateInsight(
                this.categories.MARKET,
                'Weekly Intelligence Summary',
                `Your recent activity shows focus on ${mostCommon}. This suggests you're in a ${this.getCategoryPhase(mostCommon)} phase of your music career.`,
                { pattern: 'weekly_summary', focus: mostCommon, confidence: 0.6 }
            );
        }
    }

    getCategoryPhase(category) {
        const phases = {
            [this.categories.PERFORMANCE]: 'growth and analysis',
            [this.categories.OPPORTUNITIES]: 'exploration and networking',
            [this.categories.OPTIMIZATION]: 'refinement and efficiency',
            [this.categories.COLLABORATION]: 'partnership building',
            [this.categories.MARKET]: 'strategic planning'
        };
        return phases[category] || 'development';
    }

    // Utility methods
    getMostCommonDay(dates) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = {};
        
        dates.forEach(date => {
            const day = days[date.getDay()];
            dayCounts[day] = (dayCounts[day] || 0) + 1;
        });
        
        return Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0]?.[0];
    }

    getMostCommonHour(dates) {
        const hourCounts = {};
        
        dates.forEach(date => {
            const hour = date.getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        return Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0]?.[0];
    }

    getMostCommonCategory(categories) {
        const counts = {};
        categories.forEach(cat => {
            counts[cat] = (counts[cat] || 0) + 1;
        });
        return Object.entries(counts).sort(([,a], [,b]) => b - a)[0]?.[0];
    }

    // Clean up old data (keep last 30 days)
    async cleanup() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        // Clean old data points
        for (const [key, dataPoint] of this.dataPoints.entries()) {
            if (dataPoint.timestamp < thirtyDaysAgo) {
                this.dataPoints.delete(key);
            }
        }
        
        // Clean old insights (keep dismissed ones for 7 days)
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        for (const [key, insight] of this.insights.entries()) {
            if (insight.dismissed && insight.timestamp < sevenDaysAgo) {
                this.insights.delete(key);
            }
        }
        
        await this.saveData();
    }
}

// Export for Chrome extension compatibility
window.SmartTreesAI = SmartTreesAI;