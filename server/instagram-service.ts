// Instagram Service for automated reel data import

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
      const farmAliasLower = farm.aliasName?.toLowerCase() || '';
      
      if (captionLower.includes(farmNameLower) || 
          (farmAliasLower && captionLower.includes(farmAliasLower))) {
        return {
          farmId: farm.id,
          farmAliasName: farm.aliasName || farm.name
        };
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

  // Mock Instagram API response - In production, you'd use Instagram Basic Display API
  private async fetchInstagramData(reelId: string): Promise<any> {
    // This is a mock response that simulates what you'd get from Instagram API
    // In production, you would use Instagram Basic Display API or Graph API
    
    const mockData = {
      'DLjO6ybS5KB': {
        caption: 'Beautiful morning at Green Valley Farm! 🌅 Experience the perfect sunrise with our organic farming. #greenvally #organicfarm #sunrise #booking #farmstay',
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

    return mockData[reelId] || null;
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