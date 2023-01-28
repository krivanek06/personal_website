import type { ContentProjectionProps } from '../../models'
import { CardPresentation2OnlyText } from '../shared/card-presentation-2'

export const AboutMePage = () => {
  return (
    <div className="relative">
      <AboutMeBackground>
        <div className="g-layout-1">
          <AboutMeContent></AboutMeContent>
        </div>
      </AboutMeBackground>
    </div>
  )
}

const AboutMeBackground = ({ children }: ContentProjectionProps) => {
  return (
    <div className="">
      <div className="absolute h-[110vh] bg-g-overlay-dark -z-10">
        <img
          src="/images/bg_abstract.jpeg"
          alt="Abstract Background Image"
          className="min-h-full object-fill opacity-25"
        ></img>
      </div>
      {/* content */}
      {children}
    </div>
  )
}

const AboutMeContent = () => {
  return (
    <>
      <h2 className="g-heading-1 text-center mb-12 space-x-3 py-4">
        <span className="g-text-shadow-white ">About</span>
        <span className=" g-text-shadow-primary">Me</span>
      </h2>

      <div className="grid lg:grid-cols-2 min-h-[90vh]">
        <div className="relative hidden lg:block">
          {/* picture */}
          <img
            src="/images/myself_only_body_3.png"
            alt="author image"
            className="h-full object-cover absolute  -z-10"
          />
          {/* card */}
          <CardPresentation2OnlyText
            classes="w-[320px] bottom-[20%] absolute right-[-10%]"
            description="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
          />
        </div>

        {/* blog posts */}
        <div>blogposts</div>
      </div>
    </>
  )
}
