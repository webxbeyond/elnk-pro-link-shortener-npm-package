const axios = require('axios');

/**
 * ElnkProShortener - A Node.js library for creating short URLs using the elnk.pro API
 * 
 * @class ElnkProShortener
 */
class ElnkProShortener {
    /**
     * Create an instance of ElnkProShortener
     * 
     * @param {Object} config - Configuration object
     * @param {string} config.apiKey - The elnk.pro API key (required)
     * @param {string} [config.domainId] - The domain ID (optional)
     * @param {string} [config.projectId] - The project ID (optional)
     * @param {number} [config.timeout=30000] - Request timeout in milliseconds
     * @param {string} [config.baseURL='https://elnk.pro/api'] - Base API URL
     */
    constructor(config = {}) {
        if (!config.apiKey) {
            throw new Error('API key is required');
        }
        
        this.apiKey = config.apiKey;
        this.domainId = config.domainId || null;
        this.projectId = config.projectId || null;
        this.timeout = config.timeout || 30000;
        this.baseURL = config.baseURL || 'https://elnk.pro/api';
        
        // Configure axios instance
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Accept': 'application/json'
            }
        });
    }
    
    /**
     * Create a short URL
     * 
     * @param {string} originalUrl - The original URL to shorten
     * @param {string} [customAlias] - Custom alias for the short URL
     * @returns {Promise<Object>} Response object with success status and data
     */
    async createShortUrl(originalUrl, customAlias = null) {
        if (!originalUrl) {
            throw new Error('Original URL is required');
        }
        
        try {
            const data = {
                destination: originalUrl,
                type: 'link'
            };
            
            // Add optional fields if available
            if (this.domainId) {
                data.domain_id = this.domainId;
            }
            
            if (this.projectId) {
                data.project_id = this.projectId;
            }
            
            if (customAlias) {
                data.url = customAlias;
            } else {
                data.url = null; // Let API generate random alias
            }
            
            // Remove null values
            Object.keys(data).forEach(key => {
                if (data[key] === null) {
                    delete data[key];
                }
            });
            
            const response = await this.client.post('/links', data);
            
            if (response.status >= 200 && response.status < 300) {
                const linkId = response.data.data?.id || response.data.id;
                
                if (linkId) {
                    // Get link details to construct the full short URL
                    const linkDetails = await this.getLinkDetails(linkId);
                    
                    if (linkDetails.success) {
                        const shortUrl = this.constructShortUrl(linkDetails.data);
                        
                        return {
                            success: true,
                            data: {
                                id: linkId,
                                originalUrl: originalUrl,
                                shortUrl: shortUrl,
                                customAlias: customAlias,
                                clicks: linkDetails.data.clicks || 0,
                                createdAt: linkDetails.data.created_at || new Date().toISOString()
                            }
                        };
                    }
                }
                
                return {
                    success: true,
                    data: response.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    /**
     * Create multiple short URLs in bulk
     * 
     * @param {Array<string>} urls - Array of URLs to shorten
     * @param {string} [baseAlias] - Base alias for URLs (will be suffixed with numbers)
     * @returns {Promise<Object>} Response object with success status and results
     */
    async createBulkShortUrls(urls, baseAlias = null) {
        if (!Array.isArray(urls) || urls.length === 0) {
            throw new Error('URLs array is required and cannot be empty');
        }
        
        const results = [];
        const errors = [];
        
        for (let i = 0; i < urls.length; i++) {
            try {
                const url = urls[i].trim();
                if (!url) continue;
                
                let customAlias = null;
                if (baseAlias) {
                    customAlias = urls.length > 1 ? `${baseAlias}-${i + 1}` : baseAlias;
                }
                
                const result = await this.createShortUrl(url, customAlias);
                
                if (result.success) {
                    results.push(result.data);
                } else {
                    errors.push({
                        url: url,
                        error: result.message
                    });
                }
            } catch (error) {
                errors.push({
                    url: urls[i],
                    error: error.message
                });
            }
        }
        
        return {
            success: errors.length === 0,
            data: {
                successful: results,
                failed: errors,
                total: urls.length,
                successCount: results.length,
                errorCount: errors.length
            }
        };
    }
    
    /**
     * Get details of a short link
     * 
     * @param {string} linkId - The ID of the link
     * @returns {Promise<Object>} Response object with success status and link details
     */
    async getLinkDetails(linkId) {
        if (!linkId) {
            throw new Error('Link ID is required');
        }
        
        try {
            const response = await this.client.get(`/links/${linkId}`);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    /**
     * Get domain details
     * 
     * @param {string} domainId - The ID of the domain
     * @returns {Promise<Object>} Response object with success status and domain details
     */
    async getDomainDetails(domainId) {
        if (!domainId) {
            throw new Error('Domain ID is required');
        }
        
        try {
            const response = await this.client.get(`/domains/${domainId}`);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Delete a short link
     * 
     * @param {string} linkId - The ID of the link to delete
     * @returns {Promise<Object>} Response object with success status
     */
    async deleteLink(linkId) {
        if (!linkId) {
            throw new Error('Link ID is required');
        }
        
        try {
            const response = await this.client.delete(`/links/${linkId}`);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    message: 'Link deleted successfully'
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Update an existing short link
     * 
     * @param {string} linkId - The ID of the link to update
     * @param {Object} updateData - Data to update
     * @param {string} [updateData.destination] - New destination URL
     * @param {string} [updateData.url] - New custom alias
     * @param {string} [updateData.title] - Link title
     * @param {string} [updateData.description] - Link description
     * @returns {Promise<Object>} Response object with success status and updated data
     */
    async updateLink(linkId, updateData) {
        if (!linkId) {
            throw new Error('Link ID is required');
        }
        
        if (!updateData || Object.keys(updateData).length === 0) {
            throw new Error('Update data is required');
        }
        
        try {
            const response = await this.client.put(`/links/${linkId}`, updateData);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data || response.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Get click statistics for a link
     * 
     * @param {string} linkId - The ID of the link
     * @param {Object} [options] - Query options
     * @param {string} [options.period] - Time period (day, week, month, year, all)
     * @param {string} [options.timezone] - Timezone for statistics
     * @returns {Promise<Object>} Response object with success status and statistics
     */
    async getLinkStats(linkId, options = {}) {
        if (!linkId) {
            throw new Error('Link ID is required');
        }
        
        try {
            const params = new URLSearchParams();
            
            if (options.period) {
                params.append('period', options.period);
            }
            
            if (options.timezone) {
                params.append('timezone', options.timezone);
            }
            
            const queryString = params.toString();
            const url = `/links/${linkId}/stats${queryString ? `?${queryString}` : ''}`;
            
            const response = await this.client.get(url);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data || response.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Get list of all user's links
     * 
     * @param {Object} [options] - Query options
     * @param {number} [options.page=1] - Page number for pagination
     * @param {number} [options.limit=25] - Number of results per page
     * @param {string} [options.search] - Search term
     * @param {string} [options.sort] - Sort field (created_at, clicks, title)
     * @param {string} [options.order] - Sort order (asc, desc)
     * @returns {Promise<Object>} Response object with success status and links list
     */
    async getAllLinks(options = {}) {
        try {
            const params = new URLSearchParams();
            
            params.append('page', options.page || 1);
            params.append('limit', options.limit || 25);
            
            if (options.search) {
                params.append('search', options.search);
            }
            
            if (options.sort) {
                params.append('sort', options.sort);
            }
            
            if (options.order) {
                params.append('order', options.order);
            }
            
            const response = await this.client.get(`/links?${params.toString()}`);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data || response.data,
                    pagination: response.data.pagination || null
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Get list of user's domains
     * 
     * @returns {Promise<Object>} Response object with success status and domains list
     */
    async getDomains() {
        try {
            const response = await this.client.get('/domains');
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data || response.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Search links by various criteria
     * 
     * @param {Object} searchOptions - Search criteria
     * @param {string} [searchOptions.query] - Search query
     * @param {string} [searchOptions.domain] - Filter by domain
     * @param {string} [searchOptions.tag] - Filter by tag
     * @param {Date} [searchOptions.dateFrom] - Filter from date
     * @param {Date} [searchOptions.dateTo] - Filter to date
     * @param {number} [searchOptions.page=1] - Page number
     * @param {number} [searchOptions.limit=25] - Results per page
     * @returns {Promise<Object>} Response object with search results
     */
    async searchLinks(searchOptions = {}) {
        try {
            const params = new URLSearchParams();
            
            if (searchOptions.query) {
                params.append('q', searchOptions.query);
            }
            
            if (searchOptions.domain) {
                params.append('domain', searchOptions.domain);
            }
            
            if (searchOptions.tag) {
                params.append('tag', searchOptions.tag);
            }
            
            if (searchOptions.dateFrom) {
                params.append('date_from', searchOptions.dateFrom.toISOString().split('T')[0]);
            }
            
            if (searchOptions.dateTo) {
                params.append('date_to', searchOptions.dateTo.toISOString().split('T')[0]);
            }
            
            params.append('page', searchOptions.page || 1);
            params.append('limit', searchOptions.limit || 25);
            
            const response = await this.client.get(`/links/search?${params.toString()}`);
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data || response.data,
                    pagination: response.data.pagination || null
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || `API request failed with status code: ${response.status}`
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }
    
    /**
     * Construct the full short URL from link data
     * 
     * @param {Object} linkData - Link data from API
     * @returns {string|false} The constructed short URL or false if failed
     */
    constructShortUrl(linkData) {
        const urlSlug = linkData.url;
        const domainId = linkData.domain_id;
        
        if (!urlSlug) {
            return false;
        }
        
        // If domain_id is 0 or not set, use default elnk.pro domain
        if (!domainId || domainId === 0) {
            return `https://elnk.pro/${urlSlug}`;
        }
        
        // For custom domains, we would need to fetch domain details
        // For now, return with default domain
        return `https://elnk.pro/${urlSlug}`;
    }
    
    /**
     * Handle API errors
     * 
     * @param {Error} error - The error object
     * @returns {Object} Formatted error response
     */
    handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return {
                success: false,
                message: error.response.data?.message || `API request failed with status code: ${error.response.status}`,
                statusCode: error.response.status
            };
        } else if (error.request) {
            // The request was made but no response was received
            return {
                success: false,
                message: 'No response received from API server'
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            return {
                success: false,
                message: error.message || 'Unknown error occurred'
            };
        }
    }
    
    /**
     * Validate URL format with enhanced options
     * 
     * @param {string} url - URL to validate
     * @param {Object} [options] - Validation options
     * @param {boolean} [options.requireProtocol=true] - Require http/https protocol
     * @param {boolean} [options.allowLocalhost=true] - Allow localhost URLs
     * @param {boolean} [options.allowIP=true] - Allow IP addresses
     * @param {Array<string>} [options.allowedProtocols=['http', 'https']] - Allowed protocols
     * @returns {Object} Validation result with success status and details
     */
    static validateUrl(url, options = {}) {
        const defaultOptions = {
            requireProtocol: true,
            allowLocalhost: true,
            allowIP: true,
            allowedProtocols: ['http', 'https']
        };
        
        const opts = { ...defaultOptions, ...options };
        
        if (!url || typeof url !== 'string') {
            return {
                valid: false,
                error: 'URL must be a non-empty string'
            };
        }
        
        try {
            const parsedUrl = new URL(url);
            
            // Check protocol
            if (opts.requireProtocol && !opts.allowedProtocols.includes(parsedUrl.protocol.slice(0, -1))) {
                return {
                    valid: false,
                    error: `Protocol must be one of: ${opts.allowedProtocols.join(', ')}`
                };
            }
            
            // Check localhost
            if (!opts.allowLocalhost && (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')) {
                return {
                    valid: false,
                    error: 'Localhost URLs are not allowed'
                };
            }
            
            // Check IP addresses
            if (!opts.allowIP && /^\d+\.\d+\.\d+\.\d+$/.test(parsedUrl.hostname)) {
                return {
                    valid: false,
                    error: 'IP addresses are not allowed'
                };
            }
            
            // Check for valid hostname
            if (!parsedUrl.hostname || parsedUrl.hostname.length === 0) {
                return {
                    valid: false,
                    error: 'URL must have a valid hostname'
                };
            }
            
            return {
                valid: true,
                protocol: parsedUrl.protocol,
                hostname: parsedUrl.hostname,
                pathname: parsedUrl.pathname,
                search: parsedUrl.search
            };
        } catch (error) {
            return {
                valid: false,
                error: 'Invalid URL format'
            };
        }
    }

    /**
     * Validate URL format (simple version for backward compatibility)
     * 
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid URL
     */
    static isValidUrl(url) {
        const result = ElnkProShortener.validateUrl(url);
        return result.valid;
    }
    
    /**
     * Set API key
     * 
     * @param {string} apiKey - New API key
     */
    setApiKey(apiKey) {
        if (!apiKey) {
            throw new Error('API key is required');
        }
        
        this.apiKey = apiKey;
        this.client.defaults.headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    /**
     * Set domain ID
     * 
     * @param {string} domainId - Domain ID
     */
    setDomainId(domainId) {
        this.domainId = domainId;
    }
    
    /**
     * Set project ID
     * 
     * @param {string} projectId - Project ID
     */
    setProjectId(projectId) {
        this.projectId = projectId;
    }
    
    /**
     * Get current configuration
     * 
     * @returns {Object} Current configuration (excluding API key for security)
     */
    getConfig() {
        return {
            domainId: this.domainId,
            projectId: this.projectId,
            timeout: this.timeout,
            baseURL: this.baseURL
        };
    }

    /**
     * Test API connection and authentication
     * 
     * @returns {Promise<Object>} Connection test result
     */
    async testConnection() {
        try {
            const response = await this.client.get('/user');
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    message: 'Connection successful',
                    user: response.data.data || response.data
                };
            } else {
                return {
                    success: false,
                    message: 'Authentication failed'
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Get account/user information
     * 
     * @returns {Promise<Object>} User account details
     */
    async getUserInfo() {
        try {
            const response = await this.client.get('/user');
            
            if (response.status >= 200 && response.status < 300) {
                return {
                    success: true,
                    data: response.data.data || response.data
                };
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Failed to get user information'
                };
            }
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Find a link by its short URL
     * 
     * @param {string} shortUrl - The short URL to find
     * @returns {Promise<Object>} Link details if found
     */
    async findLinkByUrl(shortUrl) {
        try {
            // Extract the slug from the short URL
            const url = new URL(shortUrl);
            const slug = url.pathname.substring(1); // Remove leading slash
            
            if (!slug) {
                return {
                    success: false,
                    message: 'Invalid short URL format'
                };
            }
            
            // Search for the link
            const searchResult = await this.searchLinks({ query: slug });
            
            if (searchResult.success && searchResult.data.length > 0) {
                // Find exact match
                const exactMatch = searchResult.data.find(link => 
                    link.url === slug || this.constructShortUrl(link) === shortUrl
                );
                
                if (exactMatch) {
                    return {
                        success: true,
                        data: exactMatch
                    };
                }
            }
            
            return {
                success: false,
                message: 'Link not found'
            };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Bulk delete multiple links
     * 
     * @param {Array<string>} linkIds - Array of link IDs to delete
     * @returns {Promise<Object>} Bulk deletion results
     */
    async bulkDeleteLinks(linkIds) {
        if (!Array.isArray(linkIds) || linkIds.length === 0) {
            throw new Error('Link IDs array is required and cannot be empty');
        }
        
        const results = [];
        const errors = [];
        
        for (const linkId of linkIds) {
            try {
                const result = await this.deleteLink(linkId);
                
                if (result.success) {
                    results.push({ linkId, success: true });
                } else {
                    errors.push({ linkId, error: result.message });
                }
            } catch (error) {
                errors.push({ linkId, error: error.message });
            }
        }
        
        return {
            success: errors.length === 0,
            data: {
                successful: results,
                failed: errors,
                total: linkIds.length,
                successCount: results.length,
                errorCount: errors.length
            }
        };
    }

    /**
     * Generate a random alias
     * 
     * @param {number} [length=8] - Length of the alias
     * @param {boolean} [includeNumbers=true] - Include numbers
     * @param {boolean} [includeSpecialChars=false] - Include special characters
     * @returns {string} Generated alias
     */
    static generateAlias(length = 8, includeNumbers = true, includeSpecialChars = false) {
        let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        if (includeNumbers) {
            chars += '0123456789';
        }
        
        if (includeSpecialChars) {
            chars += '-_';
        }
        
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return result;
    }

    /**
     * Format bytes to human readable format
     * 
     * @param {number} bytes - Bytes to format
     * @param {number} [decimals=2] - Number of decimal places
     * @returns {string} Formatted size
     */
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * Create a short URL with retry logic
     * 
     * @param {string} originalUrl - The original URL to shorten
     * @param {string} [customAlias] - Custom alias for the short URL
     * @param {Object} [options] - Retry options
     * @param {number} [options.maxRetries=3] - Maximum number of retries
     * @param {number} [options.retryDelay=1000] - Delay between retries in ms
     * @returns {Promise<Object>} Response object with success status and data
     */
    async createShortUrlWithRetry(originalUrl, customAlias = null, options = {}) {
        const { maxRetries = 3, retryDelay = 1000 } = options;
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await this.createShortUrl(originalUrl, customAlias);
                
                if (result.success) {
                    return result;
                }
                
                lastError = result;
                
                // If it's not a server error, don't retry
                if (result.statusCode && result.statusCode < 500) {
                    break;
                }
                
                // Wait before retrying
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                }
            } catch (error) {
                lastError = this.handleError(error);
                
                // Wait before retrying
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                }
            }
        }
        
        return lastError || {
            success: false,
            message: 'Failed to create short URL after multiple attempts'
        };
    }
}

module.exports = ElnkProShortener;
