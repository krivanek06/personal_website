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
      <h2 className="text-center flex flex-col g-heading-1 space-x-4">
        <span className="g-text-shadow-primary">Full Stack Development</span>
        <span className="hidden sm:block ">Custom Websites and Applications</span>
      </h2>

      {/* main content */}
      <DevelopmentMainParagraphs />

      {/* side content */}
      <div className="flex justify-start mt-[60px] md:mt-[220px]">
        <div className="mt-12 md:w-8/12 flex flex-col gap-10 z-10">
          <h2 className="g-heading-2 space-x-3 text-center md:text-start">
            <span className="">What Can I</span>
            <span className="text-g-primary-dark sm:text-g-primary">Expect?</span>
          </h2>

          <SideSection isStart={true}>
            High-quality and user-friendly websites and applications{' '}
            <span className="text-white">tailored to your business needs</span>
          </SideSection>

          <SideSection isStart={false}>
            Expertise in both <span className="text-white">front-end and back-end development</span> for
            seamless user experience
          </SideSection>

          <SideSection isStart={true}>
            Dedicated, professional approach with focus on{' '}
            <span className="text-white">delivering on time and within budget</span>
          </SideSection>

          <SideSection isStart={false}>
            Strong communication and collaboration skills,{' '}
            <span className="text-white">understanding unique needs and goals</span>
          </SideSection>

          <SideSection isStart={true}>
            <span className="text-white">Up-to-date with latest technologies and industry trends</span>,
            ensuring your application is at the forefront of innovation
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
    <div className={`flex text-g-gray-light g-body-2 ${wrapperClass}`}>
      <div className={`w-10/12 md:w-8/12 ${childClass} `}>{children}</div>
    </div>
  )
}

const DevelopmentMainParagraphs = () => {
  const { ref, inView, entry } = useInView()

  return (
    <div className="flex justify-end ">
      <div ref={ref} className="flex gap-20 z-10">
        <div
          className={`text-center g-body-1 w-11/12 md:w-full m-auto md:flex-1 text-g-gray-light ${
            inView ? 'animate-reveal' : 'opacity-0'
          }`}
        >
          Providing comprehensive{' '}
          <span className="text-g-primary">web development and consulting services</span> to help clients
          create high-quality applications that meet their{' '}
          <span className="text-white">specific needs and goals</span>
        </div>

        <div
          className={`text-center g-body-1 hidden md:block text-g-gray-light flex-1 ${
            inView ? 'animate-reveal' : 'opacity-0'
          }`}
        >
          Building <span className="text-white">custom web applications</span>, creating an e-commerce
          platforms, or revamping an existing websites, I have the skills and expertise to{' '}
          <span className="text-g-primary">bring your vision to life</span>
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
            className={`${d.divClasses}  absolute group   transition-all hover:z-50 ${
              inView ? 'animate-reveal' : 'invisible'
            }  `}
          >
            <img
              loading="lazy"
              src={d.src}
              alt={d.alt}
              className={` ${d.imgHeight} opacity-40 md:group-hover:opacity-80 duration-700 m-auto `}
            />

            <div className="hidden md:block w-44 p-2 bg-black border border-g-primary scale-0 group-hover:scale-100 transition-all duration-500 rounded-lg text-center mt-4 z-10 text-g-primary">
              {d.alt}
            </div>
          </div>
        )
      })}

      {/* content */}
      {children}
    </div>
  )
}
