import { DevelopmentBackground } from './development-background'
import { DevelopmentContent } from './development-content'

export const DevelopmentPage = () => {
  return (
    <div className="relative">
      <DevelopmentBackground>
        <div className="g-layout-1">
          <DevelopmentContent></DevelopmentContent>
        </div>
      </DevelopmentBackground>
    </div>
  )
}
