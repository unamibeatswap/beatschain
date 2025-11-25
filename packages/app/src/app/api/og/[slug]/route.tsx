import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { SanityAdapter } from '@/adapters/sanityAdapter'

export const runtime = 'edge'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    
    // Try to fetch post data from Sanity
    let post = null
    let imageUrl = null
    
    try {
      // Use Sanity adapter to get blog post
      // Note: This is a simplified version since we don't have a blog post adapter yet
      // In a real implementation, you'd create a proper blog post adapter
      const sanityAdapter = new SanityAdapter()
      
      // For now, use a direct fetch since we don't have a getBlogPost method
      const client = await import('@/lib/sanity-client').then(mod => mod.client)
      
      if (client) {
        post = await client.fetch(`
          *[_type == "post" && slug.current == $slug][0] {
            title,
            excerpt,
            mainImage,
            author->{ name }
          }
        `, { slug })
        
        // Get image URL if available
        if (post?.mainImage?.asset?._ref) {
          // Convert Sanity image reference to URL
          const { urlFor } = await import('@/lib/sanity-client')
          imageUrl = urlFor(post.mainImage).url()
        }
      }
    } catch (error) {
      console.warn('Failed to fetch post from Sanity:', error)
    }
    
    // If no post found, use fallback data
    const title = post?.title || `Blog Post: ${slug}`
    const subtitle = post?.excerpt || 'Read on BeatsChain'
    const author = post?.author?.name || 'BeatsChain Team'
    
    // Create image response
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: imageUrl 
              ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${imageUrl})` 
              : 'linear-gradient(to bottom right, #f43f5e, #f97316)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontSize: 60,
            fontWeight: 800,
            color: 'white',
            padding: '0 120px',
            textAlign: 'center',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 30,
              left: 30,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: 900,
                background: 'white',
                color: '#f43f5e',
                padding: '8px 16px',
                borderRadius: '8px',
              }}
            >
              BeatsChain Blog
            </div>
          </div>
          
          <div style={{ maxWidth: '900px' }}>
            {title}
          </div>
          
          {subtitle && (
            <div
              style={{
                fontSize: 30,
                fontWeight: 400,
                opacity: 0.9,
                marginTop: 20,
                maxWidth: '800px',
              }}
            >
              {subtitle.length > 100 ? subtitle.substring(0, 100) + '...' : subtitle}
            </div>
          )}
          
          <div
            style={{
              position: 'absolute',
              bottom: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: 'calc(100% - 60px)',
              padding: '0 30px',
            }}
          >
            <div
              style={{
                fontSize: 24,
                opacity: 0.8,
              }}
            >
              By {author}
            </div>
            
            <div
              style={{
                fontSize: 24,
                opacity: 0.8,
              }}
            >
              beatschain.app/blog
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating blog OG image:', error)
    
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #f43f5e, #f97316)',
            color: 'white',
            fontSize: 60,
            fontWeight: 800,
          }}
        >
          BeatsChain Blog
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}