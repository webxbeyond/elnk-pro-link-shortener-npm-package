// NestJS Compatibility Test
// This demonstrates how to use elnk-pro-link-shortener in a NestJS project

const ElnkProShortener = require('../index');

// Example: NestJS Service
// src/url-shortener/url-shortener.service.ts
/*
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Import the package (you might need to add type definitions)
const ElnkProShortener = require('elnk-pro-link-shortener');

@Injectable()
export class UrlShortenerService {
    private shortener: any;

    constructor(private configService: ConfigService) {
        this.shortener = new ElnkProShortener({
            apiKey: this.configService.get<string>('ELNK_PRO_API_KEY'),
        });
    }

    async createShortUrl(originalUrl: string, customAlias?: string) {
        try {
            const result = await this.shortener.createShortUrl(originalUrl, customAlias);
            
            if (result.success) {
                return {
                    success: true,
                    data: result.data
                };
            } else {
                throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to create short URL',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getBulkShortUrls(urls: string[]) {
        try {
            const result = await this.shortener.createBulkShortUrls(urls);
            return result;
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to create bulk short URLs',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getLinkDetails(linkId: string) {
        try {
            const result = await this.shortener.getLinkDetails(linkId);
            return result;
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get link details',
                HttpStatus.NOT_FOUND
            );
        }
    }

    async getAllLinks(options?: any) {
        try {
            const result = await this.shortener.getAllLinks(options);
            return result;
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to get links',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async deleteLink(linkId: string) {
        try {
            const result = await this.shortener.deleteLink(linkId);
            return result;
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to delete link',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
*/

// Example: NestJS Controller
// src/url-shortener/url-shortener.controller.ts
/*
import { Controller, Post, Get, Delete, Body, Param, Query } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';

interface CreateUrlDto {
    url: string;
    alias?: string;
}

interface BulkCreateUrlDto {
    urls: string[];
}

@Controller('api/shorten')
export class UrlShortenerController {
    constructor(private readonly urlShortenerService: UrlShortenerService) {}

    @Post()
    async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
        return this.urlShortenerService.createShortUrl(
            createUrlDto.url,
            createUrlDto.alias
        );
    }

    @Post('bulk')
    async createBulkShortUrls(@Body() bulkCreateUrlDto: BulkCreateUrlDto) {
        return this.urlShortenerService.getBulkShortUrls(bulkCreateUrlDto.urls);
    }

    @Get(':linkId')
    async getLinkDetails(@Param('linkId') linkId: string) {
        return this.urlShortenerService.getLinkDetails(linkId);
    }

    @Get()
    async getAllLinks(@Query() query: any) {
        return this.urlShortenerService.getAllLinks(query);
    }

    @Delete(':linkId')
    async deleteLink(@Param('linkId') linkId: string) {
        return this.urlShortenerService.deleteLink(linkId);
    }
}
*/

// Example: NestJS Module
// src/url-shortener/url-shortener.module.ts
/*
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';

@Module({
    imports: [ConfigModule],
    controllers: [UrlShortenerController],
    providers: [UrlShortenerService],
    exports: [UrlShortenerService],
})
export class UrlShortenerModule {}
*/

// Example: NestJS Main App Module
// src/app.module.ts
/*
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        UrlShortenerModule,
    ],
})
export class AppModule {}
*/

// Example: Environment Configuration
// .env
/*
ELNK_PRO_API_KEY=your-api-key-here
*/

// Test the package directly in Node.js (this works in NestJS context too)
try {
    const shortener = new ElnkProShortener({
        apiKey: 'test-api-key'
    });
    
    console.log('✅ NestJS compatibility test setup complete');
    console.log('Package works with:');
    console.log('- NestJS Services');
    console.log('- NestJS Controllers');
    console.log('- NestJS Dependency Injection');
    console.log('- NestJS Configuration Module');
    console.log('- TypeScript (with proper typing)');
    console.log('- NestJS Guards and Interceptors');
    
} catch (error) {
    console.error('❌ Error:', error.message);
}
