const ElnkProShortener = require('../src/ElnkProShortener');
const axios = require('axios');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('ElnkProShortener Enhanced Features', () => {
    let elnkPro;
    
    beforeEach(() => {
        elnkPro = new ElnkProShortener({
            apiKey: 'test-api-key-123',
            domainId: 'test-domain',
            projectId: 'test-project'
        });
        
        // Reset all mocks
        jest.clearAllMocks();
        
        // Mock axios.create to return a mock instance with all methods
        const mockAxiosInstance = {
            post: jest.fn(),
            get: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
            defaults: {
                headers: {}
            }
        };
        
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        
        // Override the client with our mock instance
        elnkPro.client = mockAxiosInstance;
    });

    describe('deleteLink', () => {
        test('should delete link successfully', async () => {
            elnkPro.client.delete.mockResolvedValue({
                status: 200,
                data: { message: 'Link deleted successfully' }
            });

            const result = await elnkPro.deleteLink('test-link-id');

            expect(result).toEqual({
                success: true,
                message: 'Link deleted successfully'
            });
            expect(elnkPro.client.delete).toHaveBeenCalledWith('/links/test-link-id');
        });

        test('should handle delete link error', async () => {
            elnkPro.client.delete.mockRejectedValue({
                response: {
                    status: 404,
                    data: { message: 'Link not found' }
                }
            });

            const result = await elnkPro.deleteLink('non-existent-id');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Link not found');
        });

        test('should throw error for missing link ID', async () => {
            await expect(elnkPro.deleteLink('')).rejects.toThrow('Link ID is required');
        });
    });

    describe('updateLink', () => {
        test('should update link successfully', async () => {
            const updateData = {
                destination: 'https://updated-example.com',
                title: 'Updated Title'
            };

            elnkPro.client.put.mockResolvedValue({
                status: 200,
                data: {
                    data: {
                        id: 'test-link-id',
                        destination: 'https://updated-example.com',
                        title: 'Updated Title'
                    }
                }
            });

            const result = await elnkPro.updateLink('test-link-id', updateData);

            expect(result.success).toBe(true);
            expect(result.data.destination).toBe('https://updated-example.com');
            expect(elnkPro.client.put).toHaveBeenCalledWith('/links/test-link-id', updateData);
        });

        test('should throw error for missing update data', async () => {
            await expect(elnkPro.updateLink('test-id', {})).rejects.toThrow('Update data is required');
        });
    });

    describe('getLinkStats', () => {
        test('should get link statistics successfully', async () => {
            const mockStats = {
                clicks: 150,
                uniqueClicks: 75,
                countries: ['US', 'UK', 'CA'],
                browsers: { Chrome: 80, Firefox: 20 }
            };

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: { data: mockStats }
            });

            const result = await elnkPro.getLinkStats('test-link-id', { period: 'week' });

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockStats);
            expect(elnkPro.client.get).toHaveBeenCalledWith('/links/test-link-id/stats?period=week');
        });

        test('should handle stats request without options', async () => {
            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: { data: { clicks: 0 } }
            });

            const result = await elnkPro.getLinkStats('test-link-id');

            expect(result.success).toBe(true);
            expect(elnkPro.client.get).toHaveBeenCalledWith('/links/test-link-id/stats');
        });
    });

    describe('getAllLinks', () => {
        test('should get all links with pagination', async () => {
            const mockLinks = [
                { id: '1', url: 'abc123', destination: 'https://example1.com' },
                { id: '2', url: 'def456', destination: 'https://example2.com' }
            ];

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: {
                    data: mockLinks,
                    pagination: { current_page: 1, total_pages: 5 }
                }
            });

            const result = await elnkPro.getAllLinks({ page: 1, limit: 10 });

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockLinks);
            expect(result.pagination).toEqual({ current_page: 1, total_pages: 5 });
            expect(elnkPro.client.get).toHaveBeenCalledWith('/links?page=1&limit=10');
        });

        test('should get all links with search and sort options', async () => {
            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: { data: [] }
            });

            await elnkPro.getAllLinks({ 
                search: 'example',
                sort: 'created_at',
                order: 'desc'
            });

            expect(elnkPro.client.get).toHaveBeenCalledWith('/links?page=1&limit=25&search=example&sort=created_at&order=desc');
        });
    });

    describe('getDomains', () => {
        test('should get domains list successfully', async () => {
            const mockDomains = [
                { id: '1', domain: 'example.com', status: 'active' },
                { id: '2', domain: 'test.com', status: 'active' }
            ];

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: { data: mockDomains }
            });

            const result = await elnkPro.getDomains();

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockDomains);
            expect(elnkPro.client.get).toHaveBeenCalledWith('/domains');
        });
    });

    describe('searchLinks', () => {
        test('should search links with various criteria', async () => {
            const mockResults = [
                { id: '1', url: 'search123', destination: 'https://searchexample.com' }
            ];

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: { data: mockResults }
            });

            const searchOptions = {
                query: 'search',
                domain: 'example.com',
                dateFrom: new Date('2023-01-01'),
                dateTo: new Date('2023-12-31')
            };

            const result = await elnkPro.searchLinks(searchOptions);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockResults);
            expect(elnkPro.client.get).toHaveBeenCalledWith(
                '/links/search?q=search&domain=example.com&date_from=2023-01-01&date_to=2023-12-31&page=1&limit=25'
            );
        });
    });

    describe('testConnection', () => {
        test('should test connection successfully', async () => {
            const mockUser = { id: '123', email: 'test@example.com' };

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: { data: mockUser }
            });

            const result = await elnkPro.testConnection();

            expect(result.success).toBe(true);
            expect(result.message).toBe('Connection successful');
            expect(result.user).toEqual(mockUser);
            expect(elnkPro.client.get).toHaveBeenCalledWith('/user');
        });

        test('should handle connection failure', async () => {
            elnkPro.client.get.mockRejectedValue({
                response: {
                    status: 401,
                    data: { message: 'Unauthorized' }
                }
            });

            const result = await elnkPro.testConnection();

            expect(result.success).toBe(false);
            expect(result.message).toBe('Unauthorized');
        });
    });

    describe('bulkDeleteLinks', () => {
        test('should delete multiple links successfully', async () => {
            elnkPro.client.delete
                .mockResolvedValueOnce({ status: 200, data: {} })
                .mockResolvedValueOnce({ status: 200, data: {} })
                .mockRejectedValueOnce({
                    response: { status: 404, data: { message: 'Not found' } }
                });

            const result = await elnkPro.bulkDeleteLinks(['id1', 'id2', 'id3']);

            expect(result.success).toBe(false); // Because one failed
            expect(result.data.successCount).toBe(2);
            expect(result.data.errorCount).toBe(1);
            expect(result.data.successful).toHaveLength(2);
            expect(result.data.failed).toHaveLength(1);
        });

        test('should throw error for empty array', async () => {
            await expect(elnkPro.bulkDeleteLinks([])).rejects.toThrow('Link IDs array is required and cannot be empty');
        });
    });

    describe('createShortUrlWithRetry', () => {
        test('should succeed on first attempt', async () => {
            elnkPro.client.post.mockResolvedValue({
                status: 201,
                data: {
                    data: { id: 'test-id' }
                }
            });

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: {
                    data: {
                        id: 'test-id',
                        url: 'abc123',
                        destination: 'https://example.com',
                        domain_id: 0
                    }
                }
            });

            const result = await elnkPro.createShortUrlWithRetry('https://example.com');

            expect(result.success).toBe(true);
            expect(elnkPro.client.post).toHaveBeenCalledTimes(1);
        });

        test('should retry on server error and eventually succeed', async () => {
            elnkPro.client.post
                .mockRejectedValueOnce({
                    response: { status: 500, data: { message: 'Server error' } }
                })
                .mockResolvedValueOnce({
                    status: 201,
                    data: { data: { id: 'test-id' } }
                });

            elnkPro.client.get.mockResolvedValue({
                status: 200,
                data: {
                    data: {
                        id: 'test-id',
                        url: 'abc123',
                        destination: 'https://example.com',
                        domain_id: 0
                    }
                }
            });

            const result = await elnkPro.createShortUrlWithRetry('https://example.com', null, {
                maxRetries: 2,
                retryDelay: 10 // Fast retry for testing
            });

            expect(result.success).toBe(true);
            expect(elnkPro.client.post).toHaveBeenCalledTimes(2);
        }, 10000);

        test('should not retry on client error', async () => {
            elnkPro.client.post.mockRejectedValue({
                response: { status: 400, data: { message: 'Bad request' } }
            });

            const result = await elnkPro.createShortUrlWithRetry('https://example.com');

            expect(result.success).toBe(false);
            expect(result.message).toBe('Bad request');
            expect(elnkPro.client.post).toHaveBeenCalledTimes(1);
        });
    });
});

describe('ElnkProShortener Static Methods', () => {
    describe('validateUrl', () => {
        test('should validate valid URLs', () => {
            const result = ElnkProShortener.validateUrl('https://example.com');
            
            expect(result.valid).toBe(true);
            expect(result.protocol).toBe('https:');
            expect(result.hostname).toBe('example.com');
        });

        test('should reject URLs without protocol when required', () => {
            const result = ElnkProShortener.validateUrl('example.com', { requireProtocol: true });
            
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Invalid URL format');
        });

        test('should reject localhost when not allowed', () => {
            const result = ElnkProShortener.validateUrl('http://localhost:3000', { allowLocalhost: false });
            
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Localhost URLs are not allowed');
        });

        test('should reject IP addresses when not allowed', () => {
            const result = ElnkProShortener.validateUrl('http://192.168.1.1', { allowIP: false });
            
            expect(result.valid).toBe(false);
            expect(result.error).toBe('IP addresses are not allowed');
        });

        test('should reject disallowed protocols', () => {
            const result = ElnkProShortener.validateUrl('ftp://example.com', { 
                allowedProtocols: ['http', 'https'] 
            });
            
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Protocol must be one of');
        });

        test('should handle empty or invalid input', () => {
            expect(ElnkProShortener.validateUrl('').valid).toBe(false);
            expect(ElnkProShortener.validateUrl(null).valid).toBe(false);
            expect(ElnkProShortener.validateUrl(123).valid).toBe(false);
        });
    });

    describe('isValidUrl (backward compatibility)', () => {
        test('should return boolean for valid URL', () => {
            expect(ElnkProShortener.isValidUrl('https://example.com')).toBe(true);
            expect(ElnkProShortener.isValidUrl('invalid-url')).toBe(false);
        });
    });

    describe('generateAlias', () => {
        test('should generate alias with default settings', () => {
            const alias = ElnkProShortener.generateAlias();
            
            expect(alias).toHaveLength(8);
            expect(/^[a-zA-Z0-9]+$/.test(alias)).toBe(true);
        });

        test('should generate alias with custom length', () => {
            const alias = ElnkProShortener.generateAlias(12);
            
            expect(alias).toHaveLength(12);
        });

        test('should generate alias without numbers', () => {
            const alias = ElnkProShortener.generateAlias(10, false);
            
            expect(/^[a-zA-Z]+$/.test(alias)).toBe(true);
        });

        test('should generate alias with special characters', () => {
            const alias = ElnkProShortener.generateAlias(10, true, true);
            
            expect(/^[a-zA-Z0-9_-]+$/.test(alias)).toBe(true);
        });
    });

    describe('formatBytes', () => {
        test('should format bytes correctly', () => {
            expect(ElnkProShortener.formatBytes(0)).toBe('0 Bytes');
            expect(ElnkProShortener.formatBytes(1024)).toBe('1 KB');
            expect(ElnkProShortener.formatBytes(1048576)).toBe('1 MB');
            expect(ElnkProShortener.formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
        });

        test('should format with custom decimal places', () => {
            expect(ElnkProShortener.formatBytes(1536, 0)).toBe('2 KB');
            expect(ElnkProShortener.formatBytes(1536, 1)).toBe('1.5 KB');
        });
    });
});
