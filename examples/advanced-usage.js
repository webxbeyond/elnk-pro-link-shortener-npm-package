const ElnkProShortener = require('../index');

// Replace with your actual API key
const API_KEY = 'your-elnk-pro-api-key';

class AdvancedElnkShortener {
    constructor(apiKey, options = {}) {
        this.shortener = new ElnkProShortener({
            apiKey,
            ...options
        });
        this.cache = new Map(); // Simple in-memory cache
    }
    
    /**
     * Create short URL with caching to avoid duplicates
     */
    async createShortUrlWithCache(originalUrl, customAlias = null) {
        const cacheKey = `${originalUrl}-${customAlias || 'auto'}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            console.log('📋 Retrieved from cache:', this.cache.get(cacheKey));
            return {
                success: true,
                data: this.cache.get(cacheKey),
                fromCache: true
            };
        }
        
        // Create new short URL
        const result = await this.shortener.createShortUrl(originalUrl, customAlias);
        
        if (result.success) {
            // Store in cache
            this.cache.set(cacheKey, result.data);
        }
        
        return { ...result, fromCache: false };
    }
    
    /**
     * Batch process URLs from a file or array with progress tracking
     */
    async batchProcessUrls(urls, options = {}) {
        const {
            batchSize = 5,
            delayBetweenBatches = 1000,
            baseAlias = null,
            onProgress = null
        } = options;
        
        const results = [];
        const errors = [];
        
        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize);
            const batchNumber = Math.floor(i / batchSize) + 1;
            const totalBatches = Math.ceil(urls.length / batchSize);
            
            console.log(`🚀 Processing batch ${batchNumber}/${totalBatches} (${batch.length} URLs)`);
            
            const batchPromises = batch.map(async (url, index) => {
                try {
                    const globalIndex = i + index;
                    let customAlias = null;
                    
                    if (baseAlias) {
                        customAlias = `${baseAlias}-${globalIndex + 1}`;
                    }
                    
                    const result = await this.createShortUrlWithCache(url, customAlias);
                    
                    if (result.success) {
                        results.push({
                            index: globalIndex,
                            ...result.data,
                            fromCache: result.fromCache
                        });
                    } else {
                        errors.push({
                            index: globalIndex,
                            url,
                            error: result.message
                        });
                    }
                    
                    // Progress callback
                    if (onProgress) {
                        onProgress(globalIndex + 1, urls.length);
                    }
                    
                } catch (error) {
                    errors.push({
                        index: i + index,
                        url,
                        error: error.message
                    });
                }
            });
            
            await Promise.all(batchPromises);
            
            // Delay between batches to avoid rate limiting
            if (i + batchSize < urls.length && delayBetweenBatches > 0) {
                console.log(`⏸️  Waiting ${delayBetweenBatches}ms before next batch...`);
                await this.delay(delayBetweenBatches);
            }
        }
        
        return {
            success: errors.length === 0,
            data: {
                results,
                errors,
                summary: {
                    total: urls.length,
                    successful: results.length,
                    failed: errors.length,
                    cached: results.filter(r => r.fromCache).length,
                    new: results.filter(r => !r.fromCache).length
                }
            }
        };
    }
    
    /**
     * Generate analytics report for created links
     */
    async generateAnalyticsReport(linkIds) {
        console.log('📊 Generating analytics report...');
        
        const analytics = [];
        
        for (const linkId of linkIds) {
            try {
                const details = await this.shortener.getLinkDetails(linkId);
                
                if (details.success) {
                    analytics.push({
                        id: linkId,
                        shortUrl: this.shortener.constructShortUrl(details.data),
                        destination: details.data.destination,
                        clicks: details.data.clicks || 0,
                        createdAt: details.data.created_at,
                        alias: details.data.url
                    });
                }
            } catch (error) {
                console.error(`Failed to get analytics for ${linkId}:`, error.message);
            }
        }
        
        // Sort by clicks (descending)
        analytics.sort((a, b) => b.clicks - a.clicks);
        
        return {
            totalLinks: analytics.length,
            totalClicks: analytics.reduce((sum, link) => sum + link.clicks, 0),
            averageClicks: analytics.length > 0 ? 
                (analytics.reduce((sum, link) => sum + link.clicks, 0) / analytics.length).toFixed(2) : 0,
            topPerformers: analytics.slice(0, 5),
            allLinks: analytics
        };
    }
    
    /**
     * Utility method for delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🗑️  Cache cleared');
    }
    
    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

// Example usage
async function advancedExample() {
    console.log('🚀 Advanced Elnk.pro Shortener Example\n');
    
    if (API_KEY === 'your-elnk-pro-api-key') {
        console.log('❌ Please replace the API_KEY variable with your actual elnk.pro API key');
        return;
    }
    
    const advancedShortener = new AdvancedElnkShortener(API_KEY, {
        timeout: 15000
    });
    
    try {
        // Example 1: Batch processing with progress
        console.log('1. Batch processing URLs with progress tracking...\n');
        
        const urlList = [
            'https://www.github.com',
            'https://www.stackoverflow.com',
            'https://www.nodejs.org',
            'https://www.npmjs.com',
            'https://www.expressjs.com',
            'https://www.mongodb.com',
            'https://www.docker.com'
        ];
        
        const batchResult = await advancedShortener.batchProcessUrls(urlList, {
            batchSize: 3,
            delayBetweenBatches: 2000,
            baseAlias: 'dev-tools',
            onProgress: (current, total) => {
                const percent = ((current / total) * 100).toFixed(1);
                console.log(`   Progress: ${current}/${total} (${percent}%)`);
            }
        });
        
        console.log('\n✅ Batch processing completed!');
        console.log('Summary:', batchResult.data.summary);
        
        // Example 2: Caching demonstration
        console.log('\n2. Demonstrating caching...\n');
        
        console.log('Creating URL first time:');
        const firstCall = await advancedShortener.createShortUrlWithCache('https://www.example.com', 'test-cache');
        console.log(`From cache: ${firstCall.fromCache}`);
        
        console.log('\nCreating same URL again:');
        const secondCall = await advancedShortener.createShortUrlWithCache('https://www.example.com', 'test-cache');
        console.log(`From cache: ${secondCall.fromCache}`);
        
        // Example 3: Analytics report
        if (batchResult.success && batchResult.data.results.length > 0) {
            console.log('\n3. Generating analytics report...\n');
            
            const linkIds = batchResult.data.results.map(r => r.id);
            const report = await advancedShortener.generateAnalyticsReport(linkIds);
            
            console.log('📊 Analytics Report:');
            console.log(`   Total Links: ${report.totalLinks}`);
            console.log(`   Total Clicks: ${report.totalClicks}`);
            console.log(`   Average Clicks: ${report.averageClicks}`);
            
            if (report.topPerformers.length > 0) {
                console.log('\n🏆 Top Performers:');
                report.topPerformers.forEach((link, index) => {
                    console.log(`   ${index + 1}. ${link.shortUrl} - ${link.clicks} clicks`);
                });
            }
        }
        
        // Cache statistics
        console.log('\n4. Cache statistics:');
        const cacheStats = advancedShortener.getCacheStats();
        console.log(`   Cache size: ${cacheStats.size} entries`);
        
    } catch (error) {
        console.error('❌ Error in advanced example:', error.message);
    }
}

// Error handling and retry logic example
async function retryExample() {
    console.log('\n🔄 Retry Logic Example\n');
    
    async function createWithRetry(shortener, url, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`Attempt ${attempt}/${maxRetries} for ${url}`);
                
                const result = await shortener.createShortUrl(url);
                
                if (result.success) {
                    console.log(`✅ Success on attempt ${attempt}`);
                    return result;
                } else {
                    console.log(`❌ Failed on attempt ${attempt}: ${result.message}`);
                    
                    if (attempt === maxRetries) {
                        throw new Error(`Failed after ${maxRetries} attempts: ${result.message}`);
                    }
                    
                    // Wait before retry (exponential backoff)
                    const delay = Math.pow(2, attempt) * 1000;
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                console.log(`❌ Exception on attempt ${attempt}: ${error.message}`);
                
                if (attempt === maxRetries) {
                    throw error;
                }
            }
        }
    }
    
    if (API_KEY !== 'your-elnk-pro-api-key') {
        const shortener = new ElnkProShortener({ apiKey: API_KEY });
        
        try {
            await createWithRetry(shortener, 'https://www.example-retry.com');
        } catch (error) {
            console.error('Final error:', error.message);
        }
    } else {
        console.log('❌ Please set your API key to test retry functionality');
    }
}

// Run examples
async function runAdvancedExamples() {
    await advancedExample();
    await retryExample();
}

runAdvancedExamples().catch(console.error);
