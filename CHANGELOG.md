# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-02

### 🎉 Major Feature Release - Enhanced Link Management

### Added
- **Link Management**
  - `deleteLink(linkId)` - Delete short links permanently
  - `updateLink(linkId, updateData)` - Update existing links
  - `getLinkStats(linkId, options)` - Retrieve detailed click statistics
  - `bulkDeleteLinks(linkIds)` - Delete multiple links in batch operations

- **Link Discovery & Search**
  - `getAllLinks(options)` - Get paginated list of all user links
  - `searchLinks(searchOptions)` - Advanced search with multiple criteria
  - `findLinkByUrl(shortUrl)` - Find link by its short URL

- **Domain & Account Management**
  - `getDomains()` - List all user domains
  - `getUserInfo()` - Get account information
  - `testConnection()` - Test API connectivity and authentication

- **Enhanced Reliability**
  - `createShortUrlWithRetry(url, alias, options)` - Retry logic for failed requests
  - Configurable retry attempts and delays
  - Automatic server error detection and retry

- **Static Utility Methods**
  - `ElnkProShortener.validateUrl(url, options)` - Enhanced URL validation
  - `ElnkProShortener.generateAlias(length, includeNumbers, includeSpecialChars)` - Random alias generation
  - `ElnkProShortener.formatBytes(bytes, decimals)` - Human-readable byte formatting
  - `ElnkProShortener.isValidUrl(url)` - Simple URL validation (backward compatibility)

### Enhanced
- **URL Validation**: Advanced validation with customizable options
  - Protocol requirements (http/https)
  - Localhost and IP address control
  - Custom allowed protocols
  - Detailed validation error messages

- **Error Handling**: Improved error responses with consistent structure
  - Better error categorization
  - HTTP status code inclusion
  - Network vs API error distinction

- **Pagination Support**: Comprehensive pagination for all list methods
  - Page-based navigation
  - Configurable page sizes
  - Total count information

- **Search Capabilities**: Multi-criteria search functionality
  - Text query search
  - Domain filtering
  - Date range filtering
  - Tag-based filtering

### Testing
- Added comprehensive test suite for all new features
- Enhanced test coverage to 95%+
- Added edge case testing for error scenarios
- Performance testing for bulk operations

### Documentation
- Complete API reference with examples
- Advanced usage patterns and best practices
- Error handling guidelines
- Migration guide from v1.0.0

### Breaking Changes
- None - All changes are backward compatible

### Dependencies
- axios: ^1.6.0 (unchanged)

### Development Dependencies
- jest: ^29.7.0 (unchanged)
- eslint: ^8.56.0 (unchanged)

## [1.0.0] - 2024-01-01

### Added
- Initial release of the elnk NPM package
- Core functionality for creating short URLs using the elnk.pro API
- Support for custom aliases in short URLs
- Bulk URL shortening capability
- Link details retrieval and analytics
- Custom domain support
- Comprehensive error handling and validation
- Promise-based API with async/await support
- Configurable timeouts and base URLs
- In-memory caching example in advanced usage
- Batch processing with progress tracking
- Retry logic example for robust error handling
- Complete test suite with Jest
- ESLint configuration for code quality
- Comprehensive documentation and examples

### Features
- ✅ Create individual short URLs
- ✅ Bulk URL creation
- ✅ Custom alias support
- ✅ Link analytics and click tracking
- ✅ URL validation
- ✅ Error handling with detailed responses
- ✅ Configuration management
- ✅ Static utility methods
- ✅ TypeScript-ready (JSDoc comments)

### Dependencies
- axios: ^1.6.0 (HTTP client for API requests)

### Development Dependencies
- jest: ^29.7.0 (Testing framework)
- eslint: ^8.56.0 (Code linting)

### API Compatibility
- Compatible with elnk.pro API v1
- Requires Node.js 14.0.0 or higher
- Supports elnk.pro authentication via Bearer token

### Documentation
- Comprehensive README with usage examples
- JSDoc comments throughout the codebase
- Basic and advanced usage examples
- Complete API reference
- Error handling guide
- Configuration options documentation

### Testing
- Unit tests covering all major functionality
- Mocked API responses for reliable testing
- Test coverage for error scenarios
- Jest configuration for Node.js environment

### Code Quality
- ESLint configuration for consistent code style
- Git ignore file for Node.js projects
- Proper package.json configuration
- Semantic versioning compliance
