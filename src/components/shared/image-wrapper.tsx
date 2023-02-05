import { useState } from 'react'

export interface ImageWrapper {
  src: string
  alt: string
  fallbackPath: string
  classes?: string
}
export const ImageWrapper = ({ src, alt, fallbackPath, classes }: ImageWrapper) => {
  const [error, setError] = useState(false)

  const onError = () => {
    setError(true)
  }

  return error ? (
    <img loading="lazy" src={fallbackPath} alt={alt} onError={onError} className={classes} />
  ) : (
    <img loading="lazy" src={src} alt={alt} onError={onError} className={classes} />
  )
}
