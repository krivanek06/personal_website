import type { ContentProjectionProps } from '../../models'
import { CardPresentation2Content } from '../shared/card-presentation-2'

export const AboutMePage = () => {
  return (
    <div className="relative">
      <AboutMeBackground>
        <div className="g-layout-1 h-[135vh]">
          <AboutMeContent></AboutMeContent>
        </div>
      </AboutMeBackground>
    </div>
  )
}

const AboutMeBackground = ({ children }: ContentProjectionProps) => {
  return (
    <div className="">
      <div className="absolute bg-g-overlay-dark -z-10 h-full g-about-me-background">
        <img
          src="/images/bg_abstract.jpeg"
          alt="Abstract Background Image"
          className="min-h-full object-cover opacity-25"
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

      <div className="grid lg:grid-cols-2 min-h-[90vh] ">
        <div className="relative hidden lg:block">
          {/* picture */}
          <img
            src="/images/myself_only_body_3.png"
            alt="author image"
            className="h-full object-cover absolute  -z-10"
          />
          {/* card */}
          <CardPresentation2Content
            bgClasses="bg-g-primary-transparent-medium hover:bg-g-primary-transparent-dark"
            classes="w-[420px] bottom-0 absolute right-[-20%] opacity-70 hover:opacity-90 "
          >
            <p className="w-11/12 m-auto text-g-gray flex flex-col gap-4">
              <span>
                As a professional web developer, I have a passion for creating high-quality, visually
                stunning, and easy-to-use web applications.
              </span>
              <span>
                With several years of experience in both front-end and back-end development, I am well-versed
                in a variety of technologies, including Angular, NestJS, GraphQL, and REST API's. I specialize
                in delivering custom web solutions to clients with unique needs, and work closely with them to
                understand their requirements and design a solution that fits their specific needs.
              </span>
              <span>
                My goal is to help businesses stay on the cutting edge of technology by creating modern,
                efficient, and high-performing web applications, whether it's a new project or software
                modernization.
              </span>
            </p>
          </CardPresentation2Content>
        </div>

        {/* blog posts */}
        <div>blogposts</div>
      </div>
    </>
  )
}
