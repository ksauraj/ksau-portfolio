import { getAllPosts } from '@/lib/blog'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export function GET() {
  const posts = getAllPosts()
  return NextResponse.json(posts)
}
