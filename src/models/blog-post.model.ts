export interface BlogPostLocalHost {
  posts: BlogPost[]
  date: string | Date
}

export interface BlogPost {
  title: string
  description: string
  postUrl: string
  imageUrl: string
  publishedDate: string
  userFullName: string
  userProfileImageUrl: string
  tagList: string[]
}
