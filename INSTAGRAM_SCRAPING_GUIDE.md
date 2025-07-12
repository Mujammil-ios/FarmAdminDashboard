# Instagram Reel Automation Guide

## Overview
This system provides automated Instagram reel data extraction using advanced web scraping techniques. It handles both static and dynamic content to efficiently import 50+ reels for your mobile app feed.

## Technology Stack
- **Primary Scraping**: Axios + Cheerio for fast HTML parsing
- **Fallback Scraping**: Puppeteer for JavaScript-heavy content
- **Data Extraction**: Multi-pattern regex for captions, videos, and thumbnails
- **Farm Detection**: Smart keyword matching from reel captions

## How It Works

### 1. URL Processing
```javascript
// Supports these Instagram URL formats:
https://www.instagram.com/reel/DLjO6ybS5KB/
https://www.instagram.com/p/DLjO6ybS5KB/
```

### 2. Two-Level Scraping Approach

#### Level 1: Basic HTTP Scraping (Fast)
- Uses Axios with browser-like headers
- Parses HTML with Cheerio
- Extracts from meta tags and script tags
- Handles most public Instagram reels

#### Level 2: Puppeteer Scraping (Comprehensive)
- Launches headless Chrome browser
- Waits for JavaScript content to load
- Extracts dynamic data from loaded DOM
- Handles complex Instagram pages

### 3. Data Extraction Patterns

#### Captions
```javascript
// Multiple extraction patterns:
"edge_media_to_caption".*?"text":"([^"]+)"
"caption":"([^"]+)"
"accessibility_caption":"([^"]+)"
meta[property="og:description"]
```

#### Video URLs
```javascript
// Video URL patterns:
"video_url":"([^"]+)"
meta[property="og:video"]
```

#### Thumbnails
```javascript
// Thumbnail patterns:
"display_url":"([^"]+)"
meta[property="og:image"]
```

### 4. Smart Farm Detection
The system automatically detects farms from captions using:
- Exact farm name matching
- Farm name without spaces
- Farm keywords (removing "farm", "ranch", "valley")
- First word of farm name
- Two-word combinations

## API Endpoint

### Import Instagram Reel
```http
POST /api/reels/import-instagram
Content-Type: application/json

{
  "instagramUrl": "https://www.instagram.com/reel/DLjO6ybS5KB/"
}
```

### Response Format
```json
{
  "title": "Beautiful morning at Green Valley Farm! 🌅 Experience the perfect sunrise",
  "description": "Beautiful morning at Green Valley Farm! 🌅 Experience the perfect sunrise with our organic farming.",
  "videoUrl": "https://scontent.cdninstagram.com/v/video123.mp4",
  "thumbnailUrl": "https://scontent.cdninstagram.com/v/thumb123.jpg",
  "duration": 30,
  "farmId": 1,
  "farmAliasName": "greenvalley",
  "tags": ["greenvalley", "organicfarm", "sunrise", "booking", "farmstay"]
}
```

## Usage Instructions

### 1. Access Reel Management
Navigate to `/reels` in your admin dashboard

### 2. Click "Import from Instagram"
Opens the Instagram import dialog

### 3. Paste Instagram URL
Enter any public Instagram reel URL

### 4. Import Data
System automatically:
- Fetches reel data using web scraping
- Detects farm from caption
- Extracts hashtags as tags
- Gets video and thumbnail URLs
- Generates clean title and description

### 5. Preview and Use
- Review the imported data
- Click "Use This Data" to populate the form
- Make any adjustments
- Save the reel

## Bulk Import Strategy

For 50+ reels:
1. Prepare list of Instagram URLs
2. Import 5-10 reels at a time to avoid rate limiting
3. Review and adjust farm assignments
4. Use consistent hashtag strategy
5. Set proper display orders for feed algorithm

## Technical Considerations

### Rate Limiting
- Instagram may rate limit aggressive scraping
- Implement delays between requests for bulk imports
- Use different IP addresses or proxies if needed

### Content Availability
- Only works with public Instagram reels
- Private accounts require authentication
- Some reels may have restricted access

### Error Handling
- Graceful fallback to mock data for testing
- Clear error messages for failed imports
- Retry logic for temporary failures

## Security & Compliance

### Legal Considerations
- Only scrape publicly available content
- Respect Instagram's robots.txt
- Follow fair use guidelines
- Don't scrape copyrighted material

### Technical Security
- Validate all URLs before processing
- Sanitize extracted data
- Use secure headers for requests
- Implement proper error handling

## Testing URLs
Use these URLs for testing the import functionality:
```
https://www.instagram.com/reel/DLjO6ybS5KB/
https://www.instagram.com/reel/DLaJuZBNdl_/
https://www.instagram.com/reel/DLVLmgESGEF/
https://www.instagram.com/reel/DLSRWSPyxEp/
```

## Troubleshooting

### Common Issues
1. **No data extracted**: Instagram may have changed their HTML structure
2. **Farm not detected**: Add farm keywords to caption or manual assignment
3. **Slow imports**: Instagram content loading time varies
4. **Rate limiting**: Wait between imports or use different IP

### Solutions
- Check browser console for detailed error messages
- Verify Instagram URL format
- Ensure reel is publicly accessible
- Contact support for persistent issues

## Future Enhancements
- Batch URL import from CSV
- Instagram account authentication
- Video download for local storage
- Automated hashtag suggestions
- Performance analytics integration