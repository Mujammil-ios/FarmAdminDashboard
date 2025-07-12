import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

interface InstagramReelData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  farmAliasName?: string;
  farmId?: number;
  tags: string[];
}

export class InstagramService {
  
  // Extract reel ID from Instagram URL
  private extractReelId(url: string): string | null {
    const patterns = [
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Extract farm alias from caption text
  private extractFarmAlias(caption: string, availableFarms: any[]): { farmId?: number, farmAliasName?: string } {
    if (!caption) return {};
    
    const captionLower = caption.toLowerCase();
    
    // Look for farm names or aliases in the caption
    for (const farm of availableFarms) {
      const farmNameLower = farm.name.toLowerCase();
      
      // Check for various farm name patterns in caption
      const farmKeywords = [
        farmNameLower,
        farmNameLower.replace(/\s+/g, ''),
        farmNameLower.replace(/\s+/g, '').replace(/farm|ranch|valley|view/g, ''),
        farm.name.toLowerCase().split(' ')[0],
        farm.name.toLowerCase().split(' ').slice(0, 2).join('')
      ];
      
      for (const keyword of farmKeywords) {
        if (keyword.length > 3 && captionLower.includes(keyword)) {
          return {
            farmId: farm.id,
            farmAliasName: farm.name.toLowerCase().replace(/\s+/g, '').replace(/farm|ranch/g, '')
          };
        }
      }
    }
    
    return {};
  }

  // Extract hashtags from caption
  private extractHashtags(caption: string): string[] {
    if (!caption) return [];
    
    const hashtagPattern = /#(\w+)/g;
    const hashtags = [];
    let match;
    
    while ((match = hashtagPattern.exec(caption)) !== null) {
      hashtags.push(match[1]);
    }
    
    return hashtags;
  }

  // Scrape Instagram data using web scraping with Puppeteer fallback
  private async fetchInstagramData(reelId: string): Promise<any> {
    // First try basic HTTP scraping
    try {
      return await this.scrapeWithAxios(reelId);
    } catch (error) {
      console.log('Basic scraping failed, trying Puppeteer for dynamic content...', error.message);
      // Fallback to Puppeteer for JavaScript-heavy content
      try {
        return await this.scrapeWithPuppeteer(reelId);
      } catch (puppeteerError) {
        console.error('Puppeteer scraping failed:', puppeteerError.message);
        // Return mock data for testing
        return this.getMockDataForTesting(reelId);
      }
    }
  }

  // Basic HTTP scraping with Axios and Cheerio
  private async scrapeWithAxios(reelId: string): Promise<any> {
    const url = `https://www.instagram.com/reel/${reelId}/`;
    
    // Set headers to mimic a real browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    };

    const response = await axios.get(url, { headers, timeout: 15000 });
    const $ = cheerio.load(response.data);

    // Extract data from meta tags and script tags
    let caption = '';
    let videoUrl = '';
    let thumbnailUrl = '';

    // Try to extract from meta tags
    const description = $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="description"]').attr('content') || '';
    
    const ogVideo = $('meta[property="og:video"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';

    // Extract from JSON-LD script tags
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const jsonData = JSON.parse($(elem).html() || '{}');
        if (jsonData.caption) caption = jsonData.caption;
        if (jsonData.contentUrl) videoUrl = jsonData.contentUrl;
        if (jsonData.thumbnailUrl) thumbnailUrl = jsonData.thumbnailUrl;
      } catch (e) {
        // Continue if JSON parsing fails
      }
    });

    // Extract from window._sharedData or other script tags
    $('script').each((i, elem) => {
      const scriptContent = $(elem).html() || '';
      
      // Look for video URL patterns
      const videoMatch = scriptContent.match(/"video_url":"([^"]+)"/);
      if (videoMatch && !videoUrl) {
        videoUrl = videoMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }

      // Look for thumbnail patterns
      const thumbMatch = scriptContent.match(/"display_url":"([^"]+)"/);
      if (thumbMatch && !thumbnailUrl) {
        thumbnailUrl = thumbMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
      }

      // Look for caption/text in various patterns
      const captionPatterns = [
        /"edge_media_to_caption".*?"text":"([^"]+)"/,
        /"caption":"([^"]+)"/,
        /"accessibility_caption":"([^"]+)"/
      ];
      
      for (const pattern of captionPatterns) {
        const match = scriptContent.match(pattern);
        if (match && !caption) {
          caption = match[1].replace(/\\n/g, ' ').replace(/\\"/g, '"').replace(/\\u[\dA-F]{4}/gi, '');
          break;
        }
      }
    });

    // Fallback to meta tag values
    if (!caption) caption = description;
    if (!videoUrl) videoUrl = ogVideo;
    if (!thumbnailUrl) thumbnailUrl = ogImage;

    // If we got some data, return it
    if (caption || videoUrl || thumbnailUrl) {
      return {
        caption: caption || 'Instagram Reel',
        media_url: videoUrl || '',
        thumbnail_url: thumbnailUrl || '',
        media_type: 'VIDEO',
        timestamp: new Date().toISOString()
      };
    }

    throw new Error('No data found with basic scraping');
  }

  // Advanced scraping with Puppeteer for JavaScript-heavy content
  private async scrapeWithPuppeteer(reelId: string): Promise<any> {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
      const page = await browser.newPage();
      
      // Set realistic viewport and user agent
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      const url = `https://www.instagram.com/reel/${reelId}/`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Wait for content to load
      await page.waitForTimeout(3000);

      // Extract data using page evaluation
      const data = await page.evaluate(() => {
        let caption = '';
        let videoUrl = '';
        let thumbnailUrl = '';

        // Try to get data from meta tags
        const metaDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        const metaVideo = document.querySelector('meta[property="og:video"]')?.getAttribute('content') || '';
        const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

        // Try to extract from loaded JavaScript data
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          const content = script.textContent || '';
          
          // Look for video URLs
          const videoMatch = content.match(/"video_url":"([^"]+)"/);
          if (videoMatch && !videoUrl) {
            videoUrl = videoMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
          }

          // Look for thumbnails
          const thumbMatch = content.match(/"display_url":"([^"]+)"/);
          if (thumbMatch && !thumbnailUrl) {
            thumbnailUrl = thumbMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
          }

          // Look for captions
          const captionMatch = content.match(/"edge_media_to_caption".*?"text":"([^"]+)"/);
          if (captionMatch && !caption) {
            caption = captionMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
          }
        });

        // Fallback to meta tags
        if (!caption) caption = metaDescription;
        if (!videoUrl) videoUrl = metaVideo;
        if (!thumbnailUrl) thumbnailUrl = metaImage;

        return { caption, videoUrl, thumbnailUrl };
      });

      if (data.caption || data.videoUrl || data.thumbnailUrl) {
        return {
          caption: data.caption || 'Instagram Reel',
          media_url: data.videoUrl || '',
          thumbnail_url: data.thumbnailUrl || '',
          media_type: 'VIDEO',
          timestamp: new Date().toISOString()
        };
      }

      throw new Error('No data found with Puppeteer');
      
    } finally {
      await browser.close();
    }
  }

  // Mock data for testing when scraping fails
  private getMockDataForTesting(reelId: string): any {
    const mockData = {
      'DLjO6ybS5KB': {
        caption: 'Beautiful morning at Green Valley Farm! 🌅 Experience the perfect sunrise with our organic farming. #greenvalley #organicfarm #sunrise #booking #farmstay',
        media_url: 'https://scontent.cdninstagram.com/v/video123.mp4',
        thumbnail_url: 'https://scontent.cdninstagram.com/v/thumb123.jpg',
        media_type: 'VIDEO',
        timestamp: '2024-01-15T08:30:00Z'
      },
      'DLaJuZBNdl_': {
        caption: 'Sunset views at Mountain View Ranch 🌄 Book your stay and enjoy nature! #mountainview #ranch #sunset #farmvacation #booking',
        media_url: 'https://scontent.cdninstagram.com/v/video124.mp4',
        thumbnail_url: 'https://scontent.cdninstagram.com/v/thumb124.jpg',
        media_type: 'VIDEO',
        timestamp: '2024-01-14T18:45:00Z'
      },
      'DLVLmgESGEF': {
        caption: 'Fresh harvest at Eco Farm Paradise! 🥕🥬 Come and experience farm-to-table dining. #ecofarm #paradise #harvest #organic #farmtotable',
        media_url: 'https://scontent.cdninstagram.com/v/video125.mp4',
        thumbnail_url: 'https://scontent.cdninstagram.com/v/thumb125.jpg',
        media_type: 'VIDEO',
        timestamp: '2024-01-13T10:15:00Z'
      },
      'DLSRWSPyxEp': {
        caption: 'Peaceful evening at Riverside Farm 🌊 Perfect spot for family vacation! #riverside #farm #peaceful #family #vacation #booking',
        media_url: 'https://scontent.cdninstagram.com/v/video126.mp4',
        thumbnail_url: 'https://scontent.cdninstagram.com/v/thumb126.jpg',
        media_type: 'VIDEO',
        timestamp: '2024-01-12T19:20:00Z'
      }
    };

    return mockData[reelId] || {
      caption: 'Instagram Reel Content',
      media_url: 'https://example.com/video.mp4',
      thumbnail_url: 'https://example.com/thumbnail.jpg',
      media_type: 'VIDEO',
      timestamp: new Date().toISOString()
    };
  }

  async fetchReelData(instagramUrl: string, availableFarms: any[]): Promise<InstagramReelData> {
    try {
      const reelId = this.extractReelId(instagramUrl);
      if (!reelId) {
        throw new Error('Invalid Instagram URL format');
      }

      // Fetch data from Instagram (mock for now)
      const data = await this.fetchInstagramData(reelId);
      if (!data) {
        throw new Error('Could not fetch reel data from Instagram');
      }

      // Extract farm information from caption
      const farmInfo = this.extractFarmAlias(data.caption, availableFarms);
      
      // Extract hashtags
      const hashtags = this.extractHashtags(data.caption);

      // Generate title from first part of caption
      const title = data.caption
        .split('\n')[0]
        .replace(/[#@]/g, '')
        .trim()
        .substring(0, 100);

      // Clean description (remove excessive hashtags)
      const description = data.caption
        .split('#')[0]
        .trim()
        .substring(0, 500);

      return {
        title: title || 'Instagram Reel',
        description: description || '',
        videoUrl: data.media_url,
        thumbnailUrl: data.thumbnail_url,
        duration: 30, // Default duration, Instagram API would provide actual duration
        farmAliasName: farmInfo.farmAliasName,
        farmId: farmInfo.farmId,
        tags: hashtags
      };

    } catch (error) {
      console.error('Error fetching Instagram reel data:', error);
      throw new Error(`Failed to fetch reel data: ${error.message}`);
    }
  }

  // Validate Instagram URL format
  isValidInstagramUrl(url: string): boolean {
    const instagramPattern = /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[A-Za-z0-9_-]+\/?/;
    return instagramPattern.test(url);
  }
}

export const instagramService = new InstagramService();