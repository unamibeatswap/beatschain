import { Metadata } from 'next'
import { client } from '@/lib/sanity-client'
import { generateSocialMetadata } from '@/lib/socialShare.enhanced'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    // Fetch the blog post from Sanity
    const post = await client.fetch(`
      *[_type == "post" && slug.current == $slug][0] {
        title,
        excerpt,
        mainImage,
        publishedAt
      }
    `, { slug: params.slug })
    
    if (!post) {
      return {
        title: 'Blog Post Not Found',
        description: 'The requested blog post could not be found.'
      }
    }
    
    // Generate metadata with proper social sharing
    return generateSocialMetadata({
      title: post.title,
      description: post.excerpt || 'Read our latest blog post on BeatsChain',
      imageUrl: post.mainImage,
      type: 'article',
      path: `/blog/${params.slug}`
    })
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    
    // Fallback metadata
    return {
      title: 'BeatsChain Blog',
      description: 'Web3 beat marketplace blog - Latest insights on music production and blockchain technology'
    }
  }
}