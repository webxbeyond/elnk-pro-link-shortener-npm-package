# Elnk.pro Link Shortener - NPM Package

A comprehensive Node.js library for creating and managing short URLs using the elnk.pro API. This package provides a complete, promise-based interface for interacting with the elnk.pro link shortening service.

## 🚀 Features

### Core Features
- 🔗 Create short URLs from long URLs
- 📦 Bulk URL shortening support
- 🎯 Custom alias support for branded short URLs
- 🔑 Secure API key authentication
- 🏗️ Promise-based API with async/await support
- 🛡️ Comprehensive error handling

### Enhanced Features
- 📊 Link analytics and statistics
- 🗑️ Delete and update existing links
- 🔍 Search and filter links
- 📋 List all links with pagination
- 🌐 Domain management
- 🔄 Retry logic for failed requests
- ⚡ Built-in URL validation
- 🎲 Random alias generation
- 📈 Click statistics and tracking
- 🧪 Connection testing
- 🔧 Configurable timeouts and base URLs

## 📦 Installation

```bash
npm install elnk-pro-link-shortener
```

## 🚀 Quick Start

```javascript
const ElnkProShortener = require('elnk-pro-link-shortener');

// Initialize with your API key
const shortener = new ElnkProShortener({
    apiKey: 'your-elnk-pro-api-key'
});

// Create a short URL
async function createShortUrl() {
    try {
        const result = await shortener.createShortUrl('https://www.example.com');
        
        if (result.success) {
            console.log('Short URL:', result.data.shortUrl);
            console.log('Original URL:', result.data.originalUrl);
            console.log('Link ID:', result.data.id);
        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Exception:', error.message);
    }
}

createShortUrl();
```

## ⚙️ Configuration

### Basic Configuration

```javascript
const shortener = new ElnkProShortener({
    apiKey: 'your-api-key',        // Required: Your elnk.pro API key
    domainId: 'your-domain-id',    // Optional: Custom domain ID
    projectId: 'your-project-id',  // Optional: Project ID
    timeout: 30000,                // Optional: Request timeout (default: 30000ms)
    baseURL: 'https://elnk.pro/api' // Optional: API base URL
});
```

### Getting API Credentials

To use this library, you need:

1. **API Key** (required): Your elnk.pro authentication token
2. **Domain ID** (optional): For using custom domains
3. **Project ID** (optional): For organizing links under projects

Visit [elnk.pro](https://elnk.pro) to get your API credentials.

## 📚 API Reference

### Constructor

#### `new ElnkProShortener(config)`

Creates a new instance of the ElnkProShortener.

**Parameters:**
- `config` (Object): Configuration object
  - `apiKey` (string, required): Your elnk.pro API key
  - `domainId` (string, optional): Custom domain ID
  - `projectId` (string, optional): Project ID
  - `timeout` (number, optional): Request timeout in milliseconds (default: 30000)
  - `baseURL` (string, optional): API base URL (default: 'https://elnk.pro/api')

### Core Methods

#### `createShortUrl(originalUrl, customAlias)`

Creates a short URL from a long URL.

**Parameters:**
- `originalUrl` (string, required): The URL to shorten
- `customAlias` (string, optional): Custom alias for the short URL

**Returns:** `Promise<Object>`

```javascript
const result = await shortener.createShortUrl('https://www.example.com', 'my-custom-alias');

// Result structure:
{
    success: true,
    data: {
        id: 'link-id',
        originalUrl: 'https://www.example.com',
        shortUrl: 'https://elnk.pro/abc123',
        customAlias: 'my-custom-alias',
        clicks: 0,
        createdAt: '2024-01-01T00:00:00.000Z'
    }
}
```

#### `createBulkShortUrls(urls, baseAlias)`

Creates multiple short URLs in bulk.

**Parameters:**
- `urls` (Array<string>, required): Array of URLs to shorten
- `baseAlias` (string, optional): Base alias (will be suffixed with numbers)

**Returns:** `Promise<Object>`

```javascript
const urls = [
    'https://www.example.com',
    'https://www.google.com',
    'https://www.github.com'
];

const result = await shortener.createBulkShortUrls(urls, 'my-links');

// Result structure:
{
    success: true,
    data: {
        successful: [...], // Array of successfully created short URLs
        failed: [...],     // Array of failed attempts with error messages
        total: 3,
        successCount: 3,
        errorCount: 0
    }
}
```

#### `getLinkDetails(linkId)`

Retrieves details for a specific link.

**Parameters:**
- `linkId` (string, required): The ID of the link

**Returns:** `Promise<Object>`

```javascript
const details = await shortener.getLinkDetails('link-id');

// Result structure:
{
    success: true,
    data: {
        id: 'link-id',
        url: 'abc123',
        destination: 'https://www.example.com',
        clicks: 42,
        created_at: '2024-01-01T00:00:00.000Z',
        // ... other link properties
    }
}
```

#### `getDomainDetails(domainId)`

Retrieves details for a specific domain.

**Parameters:**
- `domainId` (string, required): The ID of the domain

**Returns:** `Promise<Object>`

```javascript
const domain = await shortener.getDomainDetails('domain-id');
```

### Enhanced Link Management

#### `deleteLink(linkId)`

Deletes a short link permanently.

**Parameters:**
- `linkId` (string, required): The ID of the link to delete

**Returns:** `Promise<Object>`

```javascript
const result = await shortener.deleteLink('link-id');

// Result structure:
{
    success: true,
    message: 'Link deleted successfully'
}
```

#### `updateLink(linkId, updateData)`

Updates an existing short link.

**Parameters:**
- `linkId` (string, required): The ID of the link to update
- `updateData` (Object, required): Data to update
  - `destination` (string, optional): New destination URL
  - `url` (string, optional): New custom alias
  - `title` (string, optional): Link title
  - `description` (string, optional): Link description

**Returns:** `Promise<Object>`

```javascript
const result = await shortener.updateLink('link-id', {
    destination: 'https://new-example.com',
    title: 'Updated Title',
    description: 'Updated description'
});
```

#### `getLinkStats(linkId, options)`

Retrieves click statistics for a link.

**Parameters:**
- `linkId` (string, required): The ID of the link
- `options` (Object, optional): Query options
  - `period` (string, optional): Time period ('day', 'week', 'month', 'year', 'all')
  - `timezone` (string, optional): Timezone for statistics

**Returns:** `Promise<Object>`

```javascript
const stats = await shortener.getLinkStats('link-id', { 
    period: 'week',
    timezone: 'America/New_York'
});

// Result structure:
{
    success: true,
    data: {
        clicks: 150,
        uniqueClicks: 75,
        countries: ['US', 'UK', 'CA'],
        browsers: { Chrome: 80, Firefox: 20 },
        // ... other statistics
    }
}
```

### Link Discovery and Management

#### `getAllLinks(options)`

Retrieves a list of all user's links with pagination.

**Parameters:**
- `options` (Object, optional): Query options
  - `page` (number, optional): Page number (default: 1)
  - `limit` (number, optional): Results per page (default: 25)
  - `search` (string, optional): Search term
  - `sort` (string, optional): Sort field ('created_at', 'clicks', 'title')
  - `order` (string, optional): Sort order ('asc', 'desc')

**Returns:** `Promise<Object>`

```javascript
const links = await shortener.getAllLinks({
    page: 1,
    limit: 10,
    search: 'example',
    sort: 'created_at',
    order: 'desc'
});

// Result structure:
{
    success: true,
    data: [...], // Array of links
    pagination: {
        current_page: 1,
        total_pages: 5,
        total_items: 50
    }
}
```

#### `searchLinks(searchOptions)`

Searches links by various criteria.

**Parameters:**
- `searchOptions` (Object, optional): Search criteria
  - `query` (string, optional): Search query
  - `domain` (string, optional): Filter by domain
  - `tag` (string, optional): Filter by tag
  - `dateFrom` (Date, optional): Filter from date
  - `dateTo` (Date, optional): Filter to date
  - `page` (number, optional): Page number
  - `limit` (number, optional): Results per page

**Returns:** `Promise<Object>`

```javascript
const results = await shortener.searchLinks({
    query: 'example',
    domain: 'elnk.pro',
    dateFrom: new Date('2024-01-01'),
    dateTo: new Date('2024-12-31'),
    page: 1,
    limit: 20
});
```

#### `getDomains()`

Retrieves a list of user's domains.

**Returns:** `Promise<Object>`

```javascript
const domains = await shortener.getDomains();

// Result structure:
{
    success: true,
    data: [
        {
            id: 'domain-1',
            domain: 'example.com',
            status: 'active'
        },
        // ... more domains
    ]
}
```

### Utility and Connection Methods

#### `testConnection()`

Tests API connection and authentication.

**Returns:** `Promise<Object>`

```javascript
const test = await shortener.testConnection();

// Result structure:
{
    success: true,
    message: 'Connection successful',
    user: {
        id: 'user-id',
        email: 'user@example.com'
    }
}
```

#### `getUserInfo()`

Retrieves current user account information.

**Returns:** `Promise<Object>`

```javascript
const userInfo = await shortener.getUserInfo();
```

#### `findLinkByUrl(shortUrl)`

Finds a link by its short URL.

**Parameters:**
- `shortUrl` (string, required): The short URL to find

**Returns:** `Promise<Object>`

```javascript
const link = await shortener.findLinkByUrl('https://elnk.pro/abc123');
```

### Bulk Operations

#### `bulkDeleteLinks(linkIds)`

Deletes multiple links in bulk.

**Parameters:**
- `linkIds` (Array<string>, required): Array of link IDs to delete

**Returns:** `Promise<Object>`

```javascript
const result = await shortener.bulkDeleteLinks(['id1', 'id2', 'id3']);

// Result structure:
{
    success: false, // false if any deletions failed
    data: {
        successful: [
            { linkId: 'id1', success: true },
            { linkId: 'id2', success: true }
        ],
        failed: [
            { linkId: 'id3', error: 'Not found' }
        ],
        total: 3,
        successCount: 2,
        errorCount: 1
    }
}
```

#### `createShortUrlWithRetry(originalUrl, customAlias, options)`

Creates a short URL with retry logic for failed requests.

**Parameters:**
- `originalUrl` (string, required): The URL to shorten
- `customAlias` (string, optional): Custom alias
- `options` (Object, optional): Retry options
  - `maxRetries` (number, optional): Maximum retries (default: 3)
  - `retryDelay` (number, optional): Delay between retries in ms (default: 1000)

**Returns:** `Promise<Object>`

```javascript
const result = await shortener.createShortUrlWithRetry(
    'https://example.com',
    null,
    { maxRetries: 5, retryDelay: 2000 }
);
```

### Configuration Methods

#### `setApiKey(apiKey)`

Updates the API key.

**Parameters:**
- `apiKey` (string, required): New API key

#### `setDomainId(domainId)`

Sets the domain ID.

**Parameters:**
- `domainId` (string): Domain ID

#### `setProjectId(projectId)`

Sets the project ID.

**Parameters:**
- `projectId` (string): Project ID

#### `getConfig()`

Returns current configuration (excluding API key for security).

**Returns:** `Object`

### Static Utility Methods

#### `ElnkProShortener.validateUrl(url, options)`

Enhanced URL validation with customizable options.

**Parameters:**
- `url` (string): URL to validate
- `options` (Object, optional): Validation options
  - `requireProtocol` (boolean, optional): Require http/https protocol (default: true)
  - `allowLocalhost` (boolean, optional): Allow localhost URLs (default: true)
  - `allowIP` (boolean, optional): Allow IP addresses (default: true)
  - `allowedProtocols` (Array<string>, optional): Allowed protocols (default: ['http', 'https'])

**Returns:** `Object`

```javascript
// Basic validation
const result = ElnkProShortener.validateUrl('https://example.com');
console.log(result);
// {
//     valid: true,
//     protocol: 'https:',
//     hostname: 'example.com',
//     pathname: '/',
//     search: ''
// }

// Custom validation options
const strictResult = ElnkProShortener.validateUrl('http://localhost:3000', {
    allowLocalhost: false,
    allowedProtocols: ['https']
});
console.log(strictResult);
// {
//     valid: false,
//     error: 'Localhost URLs are not allowed'
// }
```

#### `ElnkProShortener.isValidUrl(url)`

Simple URL validation (backward compatibility).

**Parameters:**
- `url` (string): URL to validate

**Returns:** `boolean`

```javascript
const isValid = ElnkProShortener.isValidUrl('https://example.com');
console.log(isValid); // true
```

#### `ElnkProShortener.generateAlias(length, includeNumbers, includeSpecialChars)`

Generates a random alias for short URLs.

**Parameters:**
- `length` (number, optional): Length of the alias (default: 8)
- `includeNumbers` (boolean, optional): Include numbers (default: true)
- `includeSpecialChars` (boolean, optional): Include special characters (default: false)

**Returns:** `string`

```javascript
// Generate random 8-character alias with letters and numbers
const alias1 = ElnkProShortener.generateAlias();
console.log(alias1); // e.g., 'aBc123Xy'

// Generate 12-character alias with letters only
const alias2 = ElnkProShortener.generateAlias(12, false);
console.log(alias2); // e.g., 'aBcDefGhiJkL'

// Generate 10-character alias with special characters
const alias3 = ElnkProShortener.generateAlias(10, true, true);
console.log(alias3); // e.g., 'aBc-123_Xy'
```

#### `ElnkProShortener.formatBytes(bytes, decimals)`

Formats bytes to human-readable format.

**Parameters:**
- `bytes` (number): Bytes to format
- `decimals` (number, optional): Number of decimal places (default: 2)

**Returns:** `string`

```javascript
console.log(ElnkProShortener.formatBytes(1024)); // '1 KB'
console.log(ElnkProShortener.formatBytes(1536, 1)); // '1.5 KB'
console.log(ElnkProShortener.formatBytes(1048576)); // '1 MB'
console.log(ElnkProShortener.formatBytes(1073741824)); // '1 GB'
```

## 📝 Advanced Examples

### Complete Link Management Workflow

```javascript
const ElnkProShortener = require('elnk-pro-link-shortener');

async function linkManagementDemo() {
    const shortener = new ElnkProShortener({
        apiKey: 'your-api-key',
        domainId: 'your-domain-id'
    });

    try {
        // 1. Test connection
        const connectionTest = await shortener.testConnection();
        if (!connectionTest.success) {
            throw new Error('Connection failed: ' + connectionTest.message);
        }
        console.log('✅ Connected successfully');

        // 2. Create a short URL
        const shortUrl = await shortener.createShortUrl(
            'https://example.com/very-long-url',
            'my-custom-alias'
        );
        console.log('🔗 Created:', shortUrl.data.shortUrl);

        // 3. Get link statistics
        const stats = await shortener.getLinkStats(shortUrl.data.id, {
            period: 'week'
        });
        console.log('📊 Stats:', stats.data);

        // 4. Update the link
        await shortener.updateLink(shortUrl.data.id, {
            title: 'My Updated Link',
            description: 'Updated via API'
        });
        console.log('✏️ Link updated');

        // 5. Search for links
        const searchResults = await shortener.searchLinks({
            query: 'example',
            limit: 5
        });
        console.log('🔍 Found links:', searchResults.data.length);

        // 6. Get all links with pagination
        const allLinks = await shortener.getAllLinks({
            page: 1,
            limit: 10,
            sort: 'created_at',
            order: 'desc'
        });
        console.log('📋 Total links:', allLinks.data.length);

        // 7. Bulk operations
        const urls = [
            'https://example.com/page1',
            'https://example.com/page2',
            'https://example.com/page3'
        ];
        const bulkResult = await shortener.createBulkShortUrls(urls, 'bulk');
        console.log('📦 Bulk created:', bulkResult.data.successCount);

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

linkManagementDemo();
```

### Error Handling Best Practices

```javascript
async function robustLinkCreation(url, alias) {
    const shortener = new ElnkProShortener({
        apiKey: 'your-api-key'
    });

    try {
        // Validate URL first
        const validation = ElnkProShortener.validateUrl(url, {
            requireProtocol: true,
            allowLocalhost: false
        });

        if (!validation.valid) {
            throw new Error(`Invalid URL: ${validation.error}`);
        }

        // Use retry logic for robustness
        const result = await shortener.createShortUrlWithRetry(url, alias, {
            maxRetries: 3,
            retryDelay: 1000
        });

        if (result.success) {
            console.log('✅ Short URL created:', result.data.shortUrl);
            return result.data;
        } else {
            console.error('❌ Failed to create short URL:', result.message);
            return null;
        }

    } catch (error) {
        console.error('❌ Exception:', error.message);
        return null;
    }
}

// Usage
robustLinkCreation('https://example.com', 'my-alias');
```

### Batch Processing with Rate Limiting

```javascript
async function processBatchWithRateLimit(urls, delayMs = 1000) {
    const shortener = new ElnkProShortener({
        apiKey: 'your-api-key'
    });

    const results = [];
    
    for (let i = 0; i < urls.length; i++) {
        try {
            console.log(`Processing ${i + 1}/${urls.length}: ${urls[i]}`);
            
            const result = await shortener.createShortUrl(urls[i]);
            results.push(result);
            
            // Rate limiting - wait between requests
            if (i < urls.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
            
        } catch (error) {
            console.error(`Failed to process ${urls[i]}:`, error.message);
            results.push({ success: false, error: error.message, url: urls[i] });
        }
    }
    
    return results;
}
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run linting:

```bash
npm run lint
```

## 📊 Error Handling

All methods return a consistent response format:

### Success Response
```javascript
{
    success: true,
    data: {
        // Method-specific data
    },
    // Optional pagination info
    pagination: {
        current_page: 1,
        total_pages: 5
    }
}
```

### Error Response
```javascript
{
    success: false,
    message: 'Error description',
    statusCode: 400 // HTTP status code (when available)
}
```

### Common Error Types

- **Authentication Errors**: Invalid API key
- **Validation Errors**: Missing required parameters
- **Rate Limiting**: Too many requests
- **Server Errors**: elnk.pro service issues
- **Network Errors**: Connection problems

## 🔧 Configuration Options

### Timeout Configuration
```javascript
const shortener = new ElnkProShortener({
    apiKey: 'your-api-key',
    timeout: 60000 // 60 seconds
});
```

### Custom Base URL
```javascript
const shortener = new ElnkProShortener({
    apiKey: 'your-api-key',
    baseURL: 'https://custom-elnk-instance.com/api'
});
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GPL-2.0-or-later License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@elnk.pro
- 🌐 Website: [elnk.pro](https://elnk.pro)
- 📚 Documentation: [elnk.pro/docs](https://elnk.pro/docs)
- 🐛 Issues: [GitHub Issues](https://github.com/webxbeyond/elnk-pro-link-shortener-npm-package/issues)

## 🔄 Changelog

### v1.1.0 (Latest)
- ✨ Added link deletion and update capabilities
- 📊 Added link statistics and analytics
- 🔍 Added search and filter functionality
- 📋 Added pagination support for listing links
- 🌐 Added domain management features
- 🔄 Added retry logic for failed requests
- 🧪 Added connection testing
- 🎲 Added random alias generation
- 📈 Enhanced URL validation with custom options
- 🛠️ Added utility functions for formatting
- 🧹 Improved error handling and response consistency

### v1.0.0
- 🎉 Initial release
- 🔗 Basic URL shortening functionality
- 📦 Bulk URL creation
- 🎯 Custom alias support
- 🔑 API key authentication

**Returns:** `boolean`

```javascript
const isValid = ElnkProShortener.isValidUrl('https://www.example.com');
console.log(isValid); // true
```

## Usage Examples

### Basic URL Shortening

```javascript
const ElnkProShortener = require('elnk-pro-link-shortener');

const shortener = new ElnkProShortener({
    apiKey: 'your-api-key'
});

async function example() {
    // Simple URL shortening
    const result = await shortener.createShortUrl('https://www.verylongwebsite.com/some/very/long/path');
    console.log('Short URL:', result.data.shortUrl);
}
```

### Custom Alias

```javascript
async function customAlias() {
    const result = await shortener.createShortUrl(
        'https://www.example.com',
        'my-brand'
    );
    
    if (result.success) {
        console.log('Branded URL:', result.data.shortUrl); // https://elnk.pro/my-brand
    }
}
```

### Bulk URL Creation

```javascript
async function bulkShortening() {
    const urls = [
        'https://www.example1.com',
        'https://www.example2.com',
        'https://www.example3.com'
    ];
    
    const result = await shortener.createBulkShortUrls(urls, 'batch');
    
    console.log(`Created ${result.data.successCount} short URLs`);
    console.log(`Failed: ${result.data.errorCount}`);
    
    result.data.successful.forEach((link, index) => {
        console.log(`${index + 1}. ${link.shortUrl} -> ${link.originalUrl}`);
    });
}
```

### Error Handling

```javascript
async function withErrorHandling() {
    try {
        const result = await shortener.createShortUrl('https://www.example.com');
        
        if (result.success) {
            console.log('Success:', result.data.shortUrl);
        } else {
            console.error('API Error:', result.message);
            if (result.statusCode) {
                console.error('Status Code:', result.statusCode);
            }
        }
    } catch (error) {
        console.error('Exception:', error.message);
    }
}
```

### Using with Custom Domain

```javascript
const shortener = new ElnkProShortener({
    apiKey: 'your-api-key',
    domainId: 'your-domain-id',
    projectId: 'your-project-id'
});

async function customDomain() {
    const result = await shortener.createShortUrl('https://www.example.com');
    // Will use your custom domain if configured
    console.log('Short URL:', result.data.shortUrl);
}
```

### Link Analytics

```javascript
async function analytics() {
    // Create a short URL
    const createResult = await shortener.createShortUrl('https://www.example.com');
    
    if (createResult.success) {
        const linkId = createResult.data.id;
        
        // Get detailed analytics
        const details = await shortener.getLinkDetails(linkId);
        
        if (details.success) {
            console.log('Clicks:', details.data.clicks);
            console.log('Created:', details.data.created_at);
        }
    }
}
```

## Error Handling

The library provides comprehensive error handling. All methods return a consistent response format:

```javascript
// Success response
{
    success: true,
    data: { /* response data */ }
}

// Error response
{
    success: false,
    message: 'Error description',
    statusCode: 400 // HTTP status code (if applicable)
}
```

Common error scenarios:
- Invalid API key
- Network connectivity issues
- Invalid URLs
- Rate limiting
- Missing required parameters

## TypeScript Support

TypeScript definitions are not included in this version but can be added in future releases. For now, you can create your own type definitions or use JSDoc comments for better IDE support.

## Requirements

- Node.js 14.0.0 or higher
- Valid elnk.pro API key

## Dependencies

- `axios`: HTTP client for making API requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the GPL v2 or later - see the LICENSE file for details.

## Support

For support, please contact [elnk.pro support](https://elnk.pro) or create an issue in the repository.

## Changelog

### 1.0.0
- Initial release
- Basic URL shortening functionality
- Bulk URL creation
- Custom alias support
- Link analytics
- Comprehensive error handling
