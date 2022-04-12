import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory: string = path.join(process.cwd(), 'posts')

export type Post = {
  id: string,
  contentHtml?: string,
  title: string,
  date: string
}

export function getSortedPosts(): Post[] {
  const fileNames: string[] = fs.readdirSync(postsDirectory)
  const allPosts: Post[] = fileNames.map(fileName => {
    const fullPath: string = path.join(postsDirectory, fileName)
    const fileContents: string = fs.readFileSync(fullPath, 'utf-8')
    const matterResult = matter(fileContents)

    const id: string = fileName.replace(/\.md$/, '')
    const title: string = matterResult.data.title
    const date: string = matterResult.data.date
    const post: Post = { id, title, date }

    return post
  })

  return allPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else if (a.date > b.date) {
      return -1
    } else {
      return 0
    }
  })
}

export function getAllPostIds() {
  const fileNames: string[] = fs.readdirSync(postsDirectory)

  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPost(id: string) {
  const fullPath: string = path.join(postsDirectory, `${id}.md`)
  const fileContents: string = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml: string = processedContent.toString()
  const title: string = matterResult.data.title
  const date: string = matterResult.data.date
  const post: Post = {
    id,
    contentHtml,
    title,
    date
  }

  return post
}