import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Define base URL for absolute URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    
    // Get blog posts from Sanity (with fallback)
    let blogPosts: any[] = []
    try {
      const { client } = await import('@/lib/sanity-client')
      blogPosts = await client.fetch(`
        *[_type == "post"] | order(publishedAt desc)[0...10] {
          _id,
          title,
          slug,
          excerpt,
          publishedAt
        }
      `)
    } catch (error) {
      console.warn('Sanity fetch failed, using empty blog posts')
      blogPosts = []
    }

    // Get beats from test data
    let beats: any[] = []
    try {
      const { TestDataManager } = await import('@/utils/testData')
      const testBeats = TestDataManager.getTestBeats()
      beats = testBeats.slice(0, 10).map(beat => ({
        id: beat.id,
        title: beat.title,
        description: beat.description,
        createdAt: beat.createdAt,
        audioUrl: beat.audioUrl,
        genre: beat.genre,
        producer: beat.producerName
      }))
    } catch (error) {
      console.warn('Test data fetch failed, using mock beats')
      beats = [
        {
          id: '1',
          title: 'Dark Trap Beat',
          description: 'Hard hitting trap beat with dark melodies',
          createdAt: new Date(),
          audioUrl: 'https://example.com/beat1.mp3',
          genre: 'Trap',
          producer: 'BeatMaker SA'
        }
      ]
    }

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>BeatsChain - Latest Beats</title>
    <description>Discover the latest beats from talented producers on BeatsChain</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <itunes:author>BeatsChain</itunes:author>
    <itunes:category text="Music"/>
    <image>
      <url>${baseUrl}/api/og?title=${encodeURIComponent('BeatsChain')}</url>
      <title>BeatsChain</title>
      <link>${baseUrl}</link>
    </image>
    
    ${beats.map(beat => `
    <item>
      <title>${beat.title} - ${beat.genre} Beat by ${beat.producer}</title>
      <description>${beat.description} | Genre: ${beat.genre} | Producer: ${beat.producer}</description>
      <link>${baseUrl}/marketplace?beat=${beat.id}</link>
      <guid>beat-${beat.id}</guid>
      <pubDate>${new Date(beat.createdAt).toUTCString()}</pubDate>
      <category>${beat.genre}</category>
      <author>${beat.producer}</author>
      ${beat.audioUrl && beat.audioUrl !== 'https://example.com/beat1.mp3' ? `<enclosure url="${beat.audioUrl}" type="audio/mpeg"/>` : ''}
      <content:encoded><![CDATA[
        <div>
          <p>${beat.description}</p>
          <p>Genre: ${beat.genre} | Producer: ${beat.producer}</p>
          <p><a href="${baseUrl}/marketplace?beat=${beat.id}">Listen on BeatsChain</a></p>
          <img src="${baseUrl}/api/og?title=${encodeURIComponent(beat.title)}&type=beat" width="1200" height="630" alt="${beat.title}" />
        </div>
      ]]></content:encoded>
    </item>
    `).join('')}
    
    ${blogPosts.map((post: any) => `
    <item>
      <title>${post.title}</title>
      <description>${post.excerpt || 'Latest blog post from BeatsChain'}</description>
      <link>${baseUrl}/blog/${post.slug?.current || post.slug}</link>
      <guid>blog-${post._id}</guid>
      <pubDate>${new Date(post.publishedAt || Date.now()).toUTCString()}</pubDate>
      <category>Blog</category>
      <author>BeatsChain Team</author>
      <content:encoded><![CDATA[
        <div>
          <p>${post.excerpt || 'Latest blog post from BeatsChain'}</p>
          <p><a href="${baseUrl}/blog/${post.slug?.current || post.slug}">Read on BeatsChain</a></p>
          <img src="${baseUrl}/api/og?title=${encodeURIComponent(post.title)}&type=blog" width="1200" height="630" alt="${post.title}" />
        </div>
      ]]></content:encoded>
    </item>
    `).join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'RSS generation failed' }, { status: 500 })
  }
}