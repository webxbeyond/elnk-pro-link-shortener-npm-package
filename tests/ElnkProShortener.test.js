const ElnkProShortener = require('../src/ElnkProShortener');

// Mock axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
        defaults: {
            headers: {}
        }
    }))
}));

const axios = require('axios');

describe('ElnkProShortener', () => {
    let shortener;
    let mockAxiosInstance;
    
    beforeEach(() => {
        mockAxiosInstance = {
            post: jest.fn(),
            get: jest.fn(),
            defaults: {
                headers: {}
            }
        };
        
        axios.create.mockReturnValue(mockAxiosInstance);
        
        shortener = new ElnkProShortener({
            apiKey: 'test-api-key'
        });
        
        // Reset mocks
        jest.clearAllMocks();
    });
    
    describe('Constructor', () => {
        test('should create instance with required API key', () => {
            expect(shortener.apiKey).toBe('test-api-key');
            expect(shortener.baseURL).toBe('https://elnk.pro/api');
        });
        
        test('should throw error without API key', () => {
            expect(() => {
                new ElnkProShortener({});
            }).toThrow('API key is required');
        });
        
        test('should set optional configuration', () => {
            const config = {
                apiKey: 'test-key',
                domainId: 'domain-123',
                projectId: 'project-456',
                timeout: 15000
            };
            
            const customShortener = new ElnkProShortener(config);
            
            expect(customShortener.domainId).toBe('domain-123');
            expect(customShortener.projectId).toBe('project-456');
            expect(customShortener.timeout).toBe(15000);
        });
    });
    
    describe('createShortUrl', () => {
        test('should create short URL successfully', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123'
                    }
                }
            };
            
            const mockLinkDetails = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123',
                        url: 'abc123',
                        destination: 'https://www.example.com',
                        clicks: 0,
                        created_at: '2024-01-01T00:00:00.000Z'
                    }
                }
            };
            
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            mockAxiosInstance.get.mockResolvedValue(mockLinkDetails);
            
            const result = await shortener.createShortUrl('https://www.example.com');
            
            expect(result.success).toBe(true);
            expect(result.data.id).toBe('link-123');
            expect(result.data.originalUrl).toBe('https://www.example.com');
            expect(result.data.shortUrl).toBe('https://elnk.pro/abc123');
        });
        
        test('should create short URL with custom alias', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123'
                    }
                }
            };
            
            const mockLinkDetails = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123',
                        url: 'my-alias',
                        destination: 'https://www.example.com',
                        clicks: 0,
                        created_at: '2024-01-01T00:00:00.000Z'
                    }
                }
            };
            
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            mockAxiosInstance.get.mockResolvedValue(mockLinkDetails);
            
            const result = await shortener.createShortUrl('https://www.example.com', 'my-alias');
            
            expect(result.success).toBe(true);
            expect(result.data.customAlias).toBe('my-alias');
            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/links', expect.objectContaining({
                url: 'my-alias'
            }));
        });
        
        test('should handle API errors', async () => {
            const mockError = {
                response: {
                    status: 400,
                    data: {
                        message: 'Invalid URL'
                    }
                }
            };
            
            mockAxiosInstance.post.mockRejectedValue(mockError);
            
            const result = await shortener.createShortUrl('invalid-url');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Invalid URL');
            expect(result.statusCode).toBe(400);
        });
        
        test('should throw error for missing URL', async () => {
            await expect(shortener.createShortUrl()).rejects.toThrow('Original URL is required');
        });
    });
    
    describe('createBulkShortUrls', () => {
        test('should create multiple URLs successfully', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123'
                    }
                }
            };
            
            const mockLinkDetails = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123',
                        url: 'abc123',
                        destination: 'https://www.example.com',
                        clicks: 0,
                        created_at: '2024-01-01T00:00:00.000Z'
                    }
                }
            };
            
            mockAxiosInstance.post.mockResolvedValue(mockResponse);
            mockAxiosInstance.get.mockResolvedValue(mockLinkDetails);
            
            const urls = ['https://www.example1.com', 'https://www.example2.com'];
            const result = await shortener.createBulkShortUrls(urls);
            
            expect(result.success).toBe(true);
            expect(result.data.successCount).toBe(2);
            expect(result.data.errorCount).toBe(0);
        });
        
        test('should handle mixed success and failure', async () => {
            let callCount = 0;
            
            mockAxiosInstance.post.mockImplementation(() => {
                callCount++;
                if (callCount === 1) {
                    return Promise.resolve({
                        status: 200,
                        data: { data: { id: 'link-123' } }
                    });
                } else {
                    return Promise.reject({
                        response: {
                            status: 400,
                            data: { message: 'Invalid URL' }
                        }
                    });
                }
            });
            
            mockAxiosInstance.get.mockResolvedValue({
                status: 200,
                data: {
                    data: {
                        id: 'link-123',
                        url: 'abc123',
                        destination: 'https://www.example1.com',
                        clicks: 0,
                        created_at: '2024-01-01T00:00:00.000Z'
                    }
                }
            });
            
            const urls = ['https://www.example1.com', 'invalid-url'];
            const result = await shortener.createBulkShortUrls(urls);
            
            expect(result.success).toBe(false);
            expect(result.data.successCount).toBe(1);
            expect(result.data.errorCount).toBe(1);
            expect(result.data.failed[0].url).toBe('invalid-url');
        });
        
        test('should throw error for empty array', async () => {
            await expect(shortener.createBulkShortUrls([])).rejects.toThrow('URLs array is required and cannot be empty');
        });
    });
    
    describe('getLinkDetails', () => {
        test('should get link details successfully', async () => {
            const mockResponse = {
                status: 200,
                data: {
                    data: {
                        id: 'link-123',
                        url: 'abc123',
                        destination: 'https://www.example.com',
                        clicks: 42
                    }
                }
            };
            
            mockAxiosInstance.get.mockResolvedValue(mockResponse);
            
            const result = await shortener.getLinkDetails('link-123');
            
            expect(result.success).toBe(true);
            expect(result.data.id).toBe('link-123');
            expect(result.data.clicks).toBe(42);
        });
        
        test('should throw error for missing link ID', async () => {
            await expect(shortener.getLinkDetails()).rejects.toThrow('Link ID is required');
        });
    });
    
    describe('constructShortUrl', () => {
        test('should construct URL with default domain', () => {
            const linkData = {
                url: 'abc123',
                domain_id: 0
            };
            
            const url = shortener.constructShortUrl(linkData);
            expect(url).toBe('https://elnk.pro/abc123');
        });
        
        test('should return false for missing URL slug', () => {
            const linkData = {};
            
            const url = shortener.constructShortUrl(linkData);
            expect(url).toBe(false);
        });
    });
    
    describe('Static methods', () => {
        test('isValidUrl should validate URLs correctly', () => {
            expect(ElnkProShortener.isValidUrl('https://www.example.com')).toBe(true);
            expect(ElnkProShortener.isValidUrl('http://test.com')).toBe(true);
            expect(ElnkProShortener.isValidUrl('invalid-url')).toBe(false);
            expect(ElnkProShortener.isValidUrl('')).toBe(false);
        });
    });
    
    describe('Configuration methods', () => {
        test('should update API key', () => {
            shortener.setApiKey('new-api-key');
            expect(shortener.apiKey).toBe('new-api-key');
            expect(shortener.client.defaults.headers['Authorization']).toBe('Bearer new-api-key');
        });
        
        test('should throw error for empty API key', () => {
            expect(() => {
                shortener.setApiKey('');
            }).toThrow('API key is required');
        });
        
        test('should update domain and project IDs', () => {
            shortener.setDomainId('domain-456');
            shortener.setProjectId('project-789');
            
            expect(shortener.domainId).toBe('domain-456');
            expect(shortener.projectId).toBe('project-789');
        });
        
        test('should return configuration without API key', () => {
            shortener.setDomainId('domain-123');
            shortener.setProjectId('project-456');
            
            const config = shortener.getConfig();
            
            expect(config.domainId).toBe('domain-123');
            expect(config.projectId).toBe('project-456');
            expect(config.timeout).toBe(30000);
            expect(config.baseURL).toBe('https://elnk.pro/api');
            expect(config.apiKey).toBeUndefined();
        });
    });
    
    describe('Error handling', () => {
        test('should handle network errors', async () => {
            const networkError = new Error('Network Error');
            networkError.request = {};
            
            mockAxiosInstance.post.mockRejectedValue(networkError);
            
            const result = await shortener.createShortUrl('https://www.example.com');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('No response received from API server');
        });
        
        test('should handle unknown errors', async () => {
            const unknownError = new Error('Unknown error');
            
            mockAxiosInstance.post.mockRejectedValue(unknownError);
            
            const result = await shortener.createShortUrl('https://www.example.com');
            
            expect(result.success).toBe(false);
            expect(result.message).toBe('Unknown error');
        });
    });
});
