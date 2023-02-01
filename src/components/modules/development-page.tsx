import { useInView } from 'react-intersection-observer'
import { ContentProjectionProps, DevelopmentIcons } from '../../models'

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

const DevelopmentContent = () => {
  return (
    <div>
      <h2 className="text-center flex flex-col">
        <span className="g-heading-1  g-text-shadow-primary">Full Stack Development</span>
        <span className="g-heading-2">Custom Websites and Applications</span>
      </h2>

      {/* main content */}
      <DevelopmentMainParagraphs />

      {/* side content */}
      <div className="flex justify-start mt-[220px]">
        <div className="mt-12 w-8/12 flex flex-col gap-10 z-10">
          <h2 className="g-heading-2 space-x-3">
            <span className="">What Can I</span>
            <span className="text-g-primary">Expect?</span>
          </h2>

          <SideSection isStart={true}>
            High-quality and user-friendly websites and applications tailored to your business needs
          </SideSection>

          <SideSection isStart={false}>
            Expertise in both front-end and back-end development for seamless user experience
          </SideSection>

          <SideSection isStart={true}>
            Dedicated, professional approach with focus on delivering on time and within budget
          </SideSection>

          <SideSection isStart={false}>
            Strong communication and collaboration skills, understanding unique needs and goals
          </SideSection>

          <SideSection isStart={true}>
            Up-to-date with latest technologies and industry trends, ensuring your website is at the forefront
            of innovation
          </SideSection>
        </div>
      </div>
    </div>
  )
}

interface SideSectionProps {
  isStart: boolean
  children: any
}
const SideSection = ({ isStart, children }: SideSectionProps) => {
  const wrapperClass = isStart ? 'justify-start' : 'justify-end'
  const childClass = isStart ? 'text-start' : 'text-end'

  return (
    <div className={`flex text-g-gray ${wrapperClass}`}>
      <div className={`w-8/12 ${childClass} `}>{children}</div>
    </div>
  )
}

const DevelopmentMainParagraphs = () => {
  const { ref, inView, entry } = useInView()

  return (
    <div className="flex justify-end mt-[160px]">
      <div ref={ref} className="flex gap-20 z-10">
        <div
          className={`text-center text-xl w-9/12 md:w-full m-auto md:flex-1 text-g-gray-medium ${
            inView ? 'animate-reveal' : 'opacity-0'
          }`}
        >
          Providing comprehensive web development and consulting services to help clients create high-quality,
          user-friendly websites and applications that meet their specific needs and goals
        </div>

        <div
          className={`text-center text-xl hidden md:block text-g-gray-medium flex-1 ${
            inView ? 'animate-reveal' : 'opacity-0'
          }`}
        >
          Whether it's building a custom web application, creating an e-commerce platform, or revamping an
          existing website, I have the skills and expertise to bring your vision to life
        </div>
      </div>
    </div>
  )
}

const DevelopmentBackground = ({ children }: ContentProjectionProps) => {
  return (
    <div className="min-h-screen ">
      {DevelopmentIcons.map((d) => {
        const { ref, inView, entry } = useInView()

        return (
          <div
            ref={ref}
            key={d.src}
            className={`${d.divClasses}  bg-g-overlay-dark absolute group transition-all ${
              inView ? 'animate-reveal' : 'invisible'
            }  `}
          >
            <img
              src={d.src}
              alt={d.alt}
              className={` ${d.imgHeight} opacity-30 group-hover:opacity-80 duration-700`}
            />
          </div>
        )
      })}

      {/* content */}
      {children}
    </div>
  )
}
