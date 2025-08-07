const ElnkProShortener = require('../index');

// Replace with your actual API key
const API_KEY = 'your-elnk-pro-api-key';

async function basicUsageExample() {
    console.log('🔗 Elnk.pro Link Shortener - Basic Usage Example\n');
    
    // Initialize the shortener
    const shortener = new ElnkProShortener({
        apiKey: API_KEY
    });
    
    try {
        console.log('1. Creating a basic short URL...');
        const result1 = await shortener.createShortUrl('https://www.example.com');
        
        if (result1.success) {
            console.log('✅ Success!');
            console.log(`   Short URL: ${result1.data.shortUrl}`);
            console.log(`   Original URL: ${result1.data.originalUrl}`);
            console.log(`   Link ID: ${result1.data.id}\n`);
        } else {
            console.log('❌ Failed:', result1.message);
        }
        
        console.log('2. Creating a short URL with custom alias...');
        const result2 = await shortener.createShortUrl(
            'https://www.github.com',
            'my-github'
        );
        
        if (result2.success) {
            console.log('✅ Success!');
            console.log(`   Short URL: ${result2.data.shortUrl}`);
            console.log(`   Custom Alias: ${result2.data.customAlias}\n`);
        } else {
            console.log('❌ Failed:', result2.message);
        }
        
        console.log('3. Creating multiple URLs in bulk...');
        const urls = [
            'https://www.google.com',
            'https://www.stackoverflow.com',
            'https://www.nodejs.org'
        ];
        
        const bulkResult = await shortener.createBulkShortUrls(urls, 'batch');
        
        if (bulkResult.success) {
            console.log('✅ Bulk creation completed!');
            console.log(`   Total URLs: ${bulkResult.data.total}`);
            console.log(`   Successful: ${bulkResult.data.successCount}`);
            console.log(`   Failed: ${bulkResult.data.errorCount}\n`);
            
            bulkResult.data.successful.forEach((link, index) => {
                console.log(`   ${index + 1}. ${link.shortUrl} -> ${link.originalUrl}`);
            });
        } else {
            console.log('❌ Bulk creation failed');
        }
        
        console.log('\n4. Getting link details...');
        if (result1.success) {
            const details = await shortener.getLinkDetails(result1.data.id);
            
            if (details.success) {
                console.log('✅ Link details retrieved!');
                console.log(`   Clicks: ${details.data.clicks || 0}`);
                console.log(`   Created: ${details.data.created_at || 'N/A'}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Exception occurred:', error.message);
    }
}

// URL validation example
function urlValidationExample() {
    console.log('\n📝 URL Validation Example\n');
    
    const testUrls = [
        'https://www.example.com',
        'http://test.com',
        'invalid-url',
        'ftp://files.example.com',
        'https://subdomain.example.com/path?param=value'
    ];
    
    testUrls.forEach(url => {
        const isValid = ElnkProShortener.isValidUrl(url);
        console.log(`${isValid ? '✅' : '❌'} ${url}`);
    });
}

// Configuration example
function configurationExample() {
    console.log('\n⚙️  Configuration Example\n');
    
    const shortener = new ElnkProShortener({
        apiKey: API_KEY,
        domainId: 'your-domain-id',    // Optional
        projectId: 'your-project-id',  // Optional
        timeout: 15000                 // 15 seconds timeout
    });
    
    console.log('Current configuration:', shortener.getConfig());
    
    // Update configuration
    shortener.setDomainId('new-domain-id');
    shortener.setProjectId('new-project-id');
    
    console.log('Updated configuration:', shortener.getConfig());
}

// Run examples
async function runExamples() {
    if (API_KEY === 'your-elnk-pro-api-key') {
        console.log('❌ Please replace the API_KEY variable with your actual elnk.pro API key');
        console.log('   Get your API key from https://elnk.pro\n');
        
        // Still run validation and configuration examples
        urlValidationExample();
        configurationExample();
        return;
    }
    
    await basicUsageExample();
    urlValidationExample();
    configurationExample();
}

// Run the examples
runExamples().catch(console.error);
