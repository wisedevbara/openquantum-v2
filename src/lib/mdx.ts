import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import type { MDXComponents } from 'mdx/types'

/**
 * lib/mdx.ts - Utilities for reading and parsing MDX content
 * 
 * Provides functions to:
 * - List all articles from src/content/artikel/
 * - Fetch single article by slug
 * - Parse frontmatter metadata from MDX files
 * - Compile MDX source into React components (via next-mdx-remote)
 * 
 * Frontmatter format:
 * ```yaml
 * ---
 * title: "Judul Artikel"
 * description: "Deskripsi singkat artikel"
 * date: "YYYY-MM-DD"
 * author: "Nama Penulis" (optional)
 * ---
 * ```
 */

const contentDirectory = join(process.cwd(), 'src/content/artikel')

/**
 * Get all article slugs (filenames without .mdx extension)
 */
export function getArticleSlugs(): string[] {
  const filenames = readdirSync(contentDirectory)
  return filenames
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx$/, ''))
}

/**
 * Get sorted list of all articles with metadata
 * Returns articles sorted by date descending (newest first)
 */
export function getAllArticles(): Array<{
  slug: string
  metadata: {
    title: string
    description: string
    date: string
    author?: string
  }
}> {
  const slugs = getArticleSlugs()
  
  const articles = slugs.map(slug => {
    const fullPath = join(contentDirectory, `${slug}.mdx`)
    const fileContents = readFileSync(fullPath, 'utf8')
    
    const { data } = matter(fileContents)
    
    return {
      slug,
      metadata: {
        title: data.title || slug,
        description: data.description || '',
        date: data.date || '',
        ...(data.author ? { author: data.author } : {}),
      }
    }
  })
  
  // Sort by date descending (newest first)
  return articles.sort((a, b) => {
    if (a.metadata.date < b.metadata.date) return 1
    if (a.metadata.date > b.metadata.date) return -1
    return 0
  })
}

/**
 * Get a single article by slug
 * Returns full article data including content
 */
export function getArticleBySlug(slug: string): {
  slug: string
  metadata: {
    title: string
    description: string
    date: string
    author?: string
  }
  content: string
} | null {
  try {
    const fullPath = join(contentDirectory, `${slug}.mdx`)
    const fileContents = readFileSync(fullPath, 'utf8')
    
    const { data, content } = matter(fileContents)
    
    return {
      slug,
      metadata: {
        title: data.title || slug,
        description: data.description || '',
        date: data.date || '',
        ...(data.author ? { author: data.author } : {}),
      },
      content
    }
  } catch (error) {
    // File not found or other error
    return null
  }
}

/**
 * Compile MDX source into React components
 * Uses next-mdx-remote's compileMDX (RSC-compatible) so that custom
 * React components (e.g. 3D visualizations) can be embedded in article body.
 * 
 * @returns React.ReactNode ready to render (thread the provided components map)
 */
export async function compileMdx(
  mdxSource: string,
  components?: MDXComponents
): Promise<React.ReactNode> {
  const { content } = await compileMDX({
    source: mdxSource,
    options: {
      // remark-gfm enables GitHub-flavored markdown (tables, strikethrough, etc.)
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  })

  return content
}

/**
 * Format date string for display
 * Input: "2024-01-15" -> Output: "15 Januari 2024"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  
  return `${day} ${month} ${year}`
}