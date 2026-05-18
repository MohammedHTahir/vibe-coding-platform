import 'server-only'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  slug: string
  author?: string
  tags?: string[]
  category?: string
  image?: string
  draft?: boolean
  canonical?: string
  cluster_id?: string
  blog_type?: string
  content_type?: string
}

export interface BlogPost {
  slug: string
  filePath: string
  frontmatter: BlogFrontmatter
  content: string
}

async function ensureDir() {
  try {
    await fs.access(BLOG_DIR)
  } catch {
    return false
  }
  return true
}

/** List all published (non-draft) posts, sorted newest first. */
export async function listPosts(): Promise<BlogPost[]> {
  if (!(await ensureDir())) return []
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true })
  const posts = await Promise.all(
    entries
      .filter(
        (e) =>
          e.isFile() &&
          /\.mdx?$/.test(e.name) &&
          !/^README\.mdx?$/i.test(e.name)
      )
      .map(async (e) => {
        const filePath = path.join(BLOG_DIR, e.name)
        const raw = await fs.readFile(filePath, 'utf8')
        const { data, content } = matter(raw)
        const slug =
          (data.slug as string | undefined) ?? e.name.replace(/\.mdx?$/, '')
        return {
          slug,
          filePath,
          frontmatter: { ...(data as BlogFrontmatter), slug },
          content,
        }
      })
  )
  return posts
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

/** Get one post by slug, or null. */
export async function getPost(slug: string): Promise<BlogPost | null> {
  const all = await listPosts()
  return all.find((p) => p.slug === slug) ?? null
}

/** All slugs (for generateStaticParams). */
export async function listSlugs(): Promise<string[]> {
  return (await listPosts()).map((p) => p.slug)
}
