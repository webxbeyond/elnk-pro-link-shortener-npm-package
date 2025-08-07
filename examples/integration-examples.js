const ElnkProShortener = require('../index');

/**
 * Express.js integration example
 * This example shows how to integrate the elnk.pro shortener with an Express.js web application
 */

// Example Express.js route
async function createShortUrlRoute(req, res) {
    const { apiKey } = req.headers;
    const { url, alias } = req.body;
    
    if (!apiKey) {
        return res.status(401).json({
            error: 'API key required in headers'
        });
    }
    
    if (!url) {
        return res.status(400).json({
            error: 'URL is required'
        });
    }
    
    try {
        const shortener = new ElnkProShortener({ apiKey });
        const result = await shortener.createShortUrl(url, alias);
        
        if (result.success) {
            res.json({
                success: true,
                data: result.data
            });
        } else {
            res.status(400).json({
                success: false,
                error: result.message
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

/**
 * CLI integration example
 * This example shows how to use the shortener in a command-line tool
 */
async function cliExample() {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log('Usage: node cli-example.js <api-key> <url> [alias]');
        process.exit(1);
    }
    
    const [apiKey, url, alias] = args;
    
    try {
        const shortener = new ElnkProShortener({ apiKey });
        
        console.log(`Creating short URL for: ${url}`);
        if (alias) {
            console.log(`Using custom alias: ${alias}`);
        }
        
        const result = await shortener.createShortUrl(url, alias);
        
        if (result.success) {
            console.log('\n✅ Success!');
            console.log(`Short URL: ${result.data.shortUrl}`);
            console.log(`Link ID: ${result.data.id}`);
        } else {
            console.log('\n❌ Failed!');
            console.log(`Error: ${result.message}`);
            process.exit(1);
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

/**
 * Website integration example
 * This example shows how to create a simple URL shortening service
 */
class UrlShorteningService {
    constructor(apiKey, options = {}) {
        this.shortener = new ElnkProShortener({
            apiKey,
            ...options
        });
        this.cache = new Map();
        this.analytics = [];
    }
    
    async shortenUrl(originalUrl, customAlias = null, userId = null) {
        try {
            // Check cache first
            const cacheKey = `${originalUrl}-${customAlias || 'auto'}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }
            
            // Create short URL
            const result = await this.shortener.createShortUrl(originalUrl, customAlias);
            
            if (result.success) {
                // Store in cache
                this.cache.set(cacheKey, result.data);
                
                // Track analytics
                this.analytics.push({
                    ...result.data,
                    userId,
                    timestamp: new Date().toISOString()
                });
                
                return result.data;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            throw new Error(`Failed to create short URL: ${error.message}`);
        }
    }
    
    async bulkShortenUrls(urls, baseAlias = null, userId = null) {
        const result = await this.shortener.createBulkShortUrls(urls, baseAlias);
        
        if (result.success) {
            // Track successful URLs in analytics
            result.data.successful.forEach(link => {
                this.analytics.push({
                    ...link,
                    userId,
                    timestamp: new Date().toISOString()
                });
            });
        }
        
        return result;
    }
    
    getAnalytics(userId = null) {
        let analytics = this.analytics;
        
        if (userId) {
            analytics = analytics.filter(entry => entry.userId === userId);
        }
        
        return {
            totalUrls: analytics.length,
            totalClicks: analytics.reduce((sum, entry) => sum + (entry.clicks || 0), 0),
            recentUrls: analytics.slice(-10),
            userCount: new Set(analytics.map(entry => entry.userId).filter(Boolean)).size
        };
    }
    
    clearCache() {
        this.cache.clear();
    }
}

/**
 * Database integration example (pseudo-code)
 * This example shows how to integrate with a database
 */
class DatabaseIntegratedShortener {
    constructor(apiKey, database) {
        this.shortener = new ElnkProShortener({ apiKey });
        this.db = database;
    }
    
    async createAndStore(originalUrl, customAlias = null, userId = null) {
        try {
            // Create short URL
            const result = await this.shortener.createShortUrl(originalUrl, customAlias);
            
            if (result.success) {
                // Store in database
                await this.db.collection('short_urls').insertOne({
                    linkId: result.data.id,
                    originalUrl: result.data.originalUrl,
                    shortUrl: result.data.shortUrl,
                    customAlias: result.data.customAlias,
                    userId: userId,
                    clicks: result.data.clicks || 0,
                    createdAt: new Date(result.data.createdAt),
                    lastUpdated: new Date()
                });
                
                return result.data;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Database integration error:', error);
            throw error;
        }
    }
    
    async updateClickCount(linkId) {
        try {
            // Get updated details from API
            const details = await this.shortener.getLinkDetails(linkId);
            
            if (details.success) {
                // Update database
                await this.db.collection('short_urls').updateOne(
                    { linkId: linkId },
                    { 
                        $set: { 
                            clicks: details.data.clicks,
                            lastUpdated: new Date()
                        }
                    }
                );
                
                return details.data.clicks;
            }
        } catch (error) {
            console.error('Failed to update click count:', error);
        }
        
        return null;
    }
    
    async getUserUrls(userId) {
        return await this.db.collection('short_urls')
            .find({ userId: userId })
            .sort({ createdAt: -1 })
            .toArray();
    }
}

// Export examples for use
module.exports = {
    createShortUrlRoute,
    cliExample,
    UrlShorteningService,
    DatabaseIntegratedShortener
};

// Run CLI example if this file is executed directly
if (require.main === module) {
    cliExample();
}
