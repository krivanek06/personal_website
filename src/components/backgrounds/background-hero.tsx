import { Ball } from '../shared/ball'

export interface Props {
  children?: any
}

export const BackgroundHero = ({ children }: Props) => {
  return (
    <div className="g-hero-background h-screen">
      {/* abstract image */}
      <img
        src="/images/bg_abstract_1.png"
        className="g-hero-mask-image absolute top-0 left-[-1px] -z-10 "
      ></img>

      {/* myself */}
      <img
        src="/images/myself_only_body_3.png"
        alt="author image"
        className="h-full object-cover absolute right-[-20%] top-[-3%] 2xl:right-[-5%] "
      />

      {/* content */}
      {children}

      {/* orange balls */}
      <Ball type="2" key={1} className="absolute left-[10%] bottom-[30%]" />
    </div>
  )
}
