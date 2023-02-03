import type { BlogPost, BlogPostLocalHost, DevToBlog } from '../../models'
import { Environments } from './../../models/constants.model'
import { isDateToday } from './date.util'

const LOCAL_STORAGE_KEY = 'dev_to_blogs'

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  // check in local
  const localBlogs = getBlogPostFromLocalHost()
  if (localBlogs) {
    return localBlogs
  }

  // fetch remote
  const remoteBlogs = await fetchBlogPosts()

  // format
  const remoteBlogsFormatted = remoteBlogs.map((d) => formatBlogPosts(d))

  // save to local
  saveBlogPostToLocalHost(remoteBlogsFormatted)

  return remoteBlogsFormatted
}

const fetchBlogPosts = async (): Promise<DevToBlog[]> => {
  const data = (await (await fetch(Environments.DEV_TO_BLOGS)).json()) as DevToBlog[]
  return data
}

const formatBlogPosts = (devToBlog: DevToBlog): BlogPost => {
  return {
    title: devToBlog.title,
    description: devToBlog.description,
    imageUrl: devToBlog?.cover_image ?? devToBlog.social_image,
    postUrl: devToBlog.url,
    publishedDate: devToBlog.readable_publish_date,
    userFullName: devToBlog.user.name,
    userProfileImageUrl: devToBlog.user.profile_image,
  }
}

const saveBlogPostToLocalHost = (posts: BlogPost[]): void => {
  const date = new Date()
  const blogLocal: BlogPostLocalHost = {
    date,
    posts,
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogLocal))
}

const getBlogPostFromLocalHost = (): BlogPost[] | undefined => {
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY)

  // not in local storage
  if (!localData) {
    return undefined
  }

  const localDataParsed = JSON.parse(localData) as BlogPostLocalHost

  // old date
  if (!isDateToday(localDataParsed.date)) {
    return undefined
  }

  return localDataParsed.posts
}
