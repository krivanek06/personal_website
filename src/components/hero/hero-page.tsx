import { HeroBackground } from './hero-background'
import { HeroContent } from './hero-content'

export const HeroPage = () => {
  return (
    <div className="relative ">
      <HeroBackground>
        <div className="g-layout-1">
          <HeroContent></HeroContent>
        </div>
      </HeroBackground>
    </div>
  )
}
