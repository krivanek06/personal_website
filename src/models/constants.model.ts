export const URL_LINKED_IN = 'https://www.linkedin.com/in/eduard-krivanek-714760148/'
export const URL_GITHUB = 'https://github.com/krivanek06'
export const URL_INSTAGRAM = 'https://www.instagram.com/eduard_krivanek/'
export const EMAIL_MYSELF = 'krivaneda@gmail.com'

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const PROVIDING_SERVICES = [
  'Web Development',
  'Angular',
  'NestJS',
  'NodeJS',
  'TypeScript',
  'GraphQL API',
  'REST API',
  'Web Design',
]

export const EMAIL_PATTERN = /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/

interface Env {
  MY_EMAIL: string
  EMAILJS_PUBLIC_KEY: string
  EMAILJS_SERVICE_ID_EMAIL: string
  EMAILJS_TEMPLATE_SELF: string

  DEV_TO_BLOGS: string
}

export const Environments: Env = {
  MY_EMAIL: import.meta.env.PUBLIC_MY_EMAIL,
  EMAILJS_PUBLIC_KEY: import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID_EMAIL: import.meta.env.PUBLIC_EMAILJS_SERVICE_ID_EMAIL,
  EMAILJS_TEMPLATE_SELF: import.meta.env.PUBLIC_EMAILJS_TEMPLATE_SELF,
  DEV_TO_BLOGS: import.meta.env.PUBLIC_DEV_TO_BLOGS,
}
