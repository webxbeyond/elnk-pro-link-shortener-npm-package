const ElnkProShortener = require('../index');

async function demonstrateEnhancedFeatures() {
    console.log('🚀 ElnkProShortener Enhanced Features Demo\n');

    // Initialize the client
    const elnkPro = new ElnkProShortener({
        apiKey: 'your-api-key-here',
        domainId: 'your-domain-id', // optional
        projectId: 'your-project-id' // optional
    });

    try {
        console.log('1. Testing API Connection...');
        const connectionTest = await elnkPro.testConnection();
        if (connectionTest.success) {
            console.log('✅ Connection successful!');
            console.log('👤 User:', connectionTest.user.email || 'N/A');
        } else {
            console.log('❌ Connection failed:', connectionTest.message);
            return;
        }

        console.log('\n2. Getting User Information...');
        const userInfo = await elnkPro.getUserInfo();
        if (userInfo.success) {
            console.log('✅ User info retrieved successfully');
            console.log('📊 Account details:', JSON.stringify(userInfo.data, null, 2));
        }

        console.log('\n3. Creating Short URLs with Retry Logic...');
        const url1 = await elnkPro.createShortUrlWithRetry(
            'https://example.com/very-long-url-that-needs-shortening',
            null,
            { maxRetries: 3, retryDelay: 1000 }
        );

        if (url1.success) {
            console.log('✅ Short URL created:', url1.data.shortUrl);
            
            // Store the link ID for later operations
            const linkId = url1.data.id;

            console.log('\n4. Getting Link Statistics...');
            const stats = await elnkPro.getLinkStats(linkId, { period: 'week' });
            if (stats.success) {
                console.log('📈 Link statistics:', JSON.stringify(stats.data, null, 2));
            }

            console.log('\n5. Updating the Link...');
            const updateResult = await elnkPro.updateLink(linkId, {
                title: 'Updated Link Title',
                description: 'This link has been updated via API'
            });

            if (updateResult.success) {
                console.log('✅ Link updated successfully');
            }

            console.log('\n6. Getting Updated Link Details...');
            const linkDetails = await elnkPro.getLinkDetails(linkId);
            if (linkDetails.success) {
                console.log('🔗 Updated link details:', JSON.stringify(linkDetails.data, null, 2));
            }
        }

        console.log('\n7. Creating Multiple URLs (Bulk Operation)...');
        const urls = [
            'https://example.com/page1',
            'https://example.com/page2',
            'https://example.com/page3'
        ];

        const bulkResult = await elnkPro.createBulkShortUrls(urls, 'demo-bulk');
        console.log('📦 Bulk creation results:');
        console.log(`✅ Successful: ${bulkResult.data.successCount}`);
        console.log(`❌ Failed: ${bulkResult.data.errorCount}`);

        if (bulkResult.data.successful.length > 0) {
            console.log('Created URLs:');
            bulkResult.data.successful.forEach((url, index) => {
                console.log(`  ${index + 1}. ${url.shortUrl} -> ${url.originalUrl}`);
            });
        }

        console.log('\n8. Getting All Links with Pagination...');
        const allLinks = await elnkPro.getAllLinks({
            page: 1,
            limit: 10,
            sort: 'created_at',
            order: 'desc'
        });

        if (allLinks.success) {
            console.log(`📋 Found ${allLinks.data.length} links`);
            if (allLinks.pagination) {
                console.log(`📄 Page ${allLinks.pagination.current_page} of ${allLinks.pagination.total_pages}`);
            }
        }

        console.log('\n9. Searching Links...');
        const searchResults = await elnkPro.searchLinks({
            query: 'example',
            page: 1,
            limit: 5
        });

        if (searchResults.success) {
            console.log(`🔍 Found ${searchResults.data.length} matching links`);
            searchResults.data.forEach((link, index) => {
                console.log(`  ${index + 1}. ${link.url} -> ${link.destination || link.location_url}`);
            });
        }

        console.log('\n10. Getting Domains List...');
        const domains = await elnkPro.getDomains();
        if (domains.success) {
            console.log(`🌐 Found ${domains.data.length} domains`);
            domains.data.forEach((domain, index) => {
                console.log(`  ${index + 1}. ${domain.domain} (Status: ${domain.status})`);
            });
        }

        console.log('\n11. Finding Link by URL...');
        if (url1.success) {
            const foundLink = await elnkPro.findLinkByUrl(url1.data.shortUrl);
            if (foundLink.success) {
                console.log('🎯 Link found:', foundLink.data.id);
            }
        }

        console.log('\n12. Demonstrating Bulk Delete...');
        if (bulkResult.data.successful.length > 0) {
            const linkIds = bulkResult.data.successful.map(link => link.id).slice(0, 2);
            const deleteResults = await elnkPro.bulkDeleteLinks(linkIds);
            
            console.log('🗑️ Bulk delete results:');
            console.log(`✅ Deleted: ${deleteResults.data.successCount}`);
            console.log(`❌ Failed: ${deleteResults.data.errorCount}`);
        }

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
    }

    console.log('\n13. Demonstrating Static Utility Methods...');
    
    // URL Validation
    console.log('\n🔍 URL Validation:');
    const validationResult = ElnkProShortener.validateUrl('https://example.com');
    console.log('Valid URL result:', validationResult);

    const invalidValidation = ElnkProShortener.validateUrl('not-a-url');
    console.log('Invalid URL result:', invalidValidation);

    // Custom validation options
    const strictValidation = ElnkProShortener.validateUrl('http://localhost:3000', {
        allowLocalhost: false,
        allowedProtocols: ['https']
    });
    console.log('Strict validation result:', strictValidation);

    // Alias Generation
    console.log('\n🎲 Alias Generation:');
    console.log('Random alias (8 chars):', ElnkProShortener.generateAlias());
    console.log('Random alias (12 chars, letters only):', ElnkProShortener.generateAlias(12, false));
    console.log('Random alias (10 chars, with special chars):', ElnkProShortener.generateAlias(10, true, true));

    // Byte Formatting
    console.log('\n📊 Byte Formatting:');
    console.log('1024 bytes:', ElnkProShortener.formatBytes(1024));
    console.log('1536 bytes (1 decimal):', ElnkProShortener.formatBytes(1536, 1));
    console.log('1GB:', ElnkProShortener.formatBytes(1024 * 1024 * 1024));

    console.log('\n✨ Enhanced features demonstration completed!');
}

// Configuration validation
function validateConfiguration() {
    console.log('⚙️ Configuration Validation:');
    
    const config = {
        apiKey: 'your-api-key-here',
        domainId: 'optional-domain-id',
        projectId: 'optional-project-id',
        timeout: 30000,
        baseURL: 'https://elnk.pro/api'
    };

    console.log('Required fields:');
    console.log('- API Key:', config.apiKey ? '✅ Set' : '❌ Missing');
    
    console.log('Optional fields:');
    console.log('- Domain ID:', config.domainId ? '✅ Set' : '⚠️ Not set (will use default)');
    console.log('- Project ID:', config.projectId ? '✅ Set' : '⚠️ Not set');
    console.log('- Timeout:', config.timeout ? `✅ ${config.timeout}ms` : '⚠️ Using default');
    console.log('- Base URL:', config.baseURL ? `✅ ${config.baseURL}` : '⚠️ Using default');
}

// Error handling examples
async function demonstrateErrorHandling() {
    console.log('\n🚨 Error Handling Examples:');

    const elnkPro = new ElnkProShortener({
        apiKey: 'invalid-api-key-for-testing'
    });

    try {
        // This should fail with authentication error
        const result = await elnkPro.testConnection();
        if (!result.success) {
            console.log('Expected auth error:', result.message);
        }
    } catch (error) {
        console.log('Caught error:', error.message);
    }

    // Validation errors
    try {
        await elnkPro.deleteLink(''); // Should throw validation error
    } catch (error) {
        console.log('Validation error:', error.message);
    }

    try {
        await elnkPro.updateLink('test-id', {}); // Should throw validation error
    } catch (error) {
        console.log('Update validation error:', error.message);
    }

    try {
        await elnkPro.createBulkShortUrls([]); // Should throw validation error
    } catch (error) {
        console.log('Bulk validation error:', error.message);
    }
}

// Run the demonstration
if (require.main === module) {
    console.log('='.repeat(60));
    console.log('   ElnkProShortener Enhanced Features Demo');
    console.log('='.repeat(60));
    console.log('\n📝 Note: Replace "your-api-key-here" with your actual API key');
    console.log('🔗 Get your API key from: https://elnk.pro/dashboard\n');

    validateConfiguration();
    
    // Uncomment the line below to run the live demo (requires valid API key)
    // demonstrateEnhancedFeatures();
    
    demonstrateErrorHandling();
}

module.exports = {
    demonstrateEnhancedFeatures,
    validateConfiguration,
    demonstrateErrorHandling
};
