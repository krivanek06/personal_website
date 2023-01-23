import { BackgroundHero } from '../backgrounds/background-hero'
import { ContentHero } from '../page-contents/content-hero'

export const PageHero = () => {
  return (
    <div className="relative">
      <BackgroundHero>
        <div className="g-layout-1">
          <ContentHero></ContentHero>
        </div>
      </BackgroundHero>
    </div>
  )
}
