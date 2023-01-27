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

      {/* side content */}
      <div className="flex justify-end mt-[160px] ">
        <div className="flex gap-20 z-10">
          <div className="text-center w-9/12 md:w-full m-auto md:flex-1">
            Providing comprehensive web development and consulting services to help clients create
            high-quality, user-friendly websites and applications that meet their specific needs and goals.
          </div>

          <div className="text-center hidden md:block flex-1">
            Whether it's building a custom web application, creating an e-commerce platform, or revamping an
            existing website, I have the skills and expertise to bring your vision to life.
          </div>
        </div>
      </div>

      {/* side content */}
      <div className="flex justify-start mt-[220px]">
        <div className="mt-12 w-8/12 flex flex-col gap-10">
          <h2 className="g-heading-2">
            What Can I <span className="text-g-primary">Expect?</span>
          </h2>

          <div className="flex justify-start">
            <div className="w-8/12 text-start">
              High-quality and user-friendly websites and applications tailored to your business needs
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-8/12 text-end">
              Expertise in both front-end and back-end development for seamless user experience
            </div>
          </div>

          <div className="flex justify-start">
            <div className="w-8/12 text-start">
              Dedicated, professional approach with focus on delivering on time and within budget
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-8/12 text-end">
              Strong communication and collaboration skills, understanding unique needs and goals
            </div>
          </div>

          <div className="flex justify-start">
            <div className="w-8/12 text-start">
              Up-to-date with latest technologies and industry trends, ensuring your website is at the
              forefront of innovation
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const DevelopmentBackground = ({ children }: ContentProjectionProps) => {
  return (
    <div className="py-4 md:py-16 min-h-screen">
      {DevelopmentIcons.map((d) => (
        <div className={`${d.divClasses} bg-g-overlay-dark absolute group transition-all`}>
          <img
            src={d.src}
            alt={d.alt}
            className={` ${d.imgHeight} opacity-30 group-hover:opacity-80 duration-300`}
          />
        </div>
      ))}

      {/* content */}
      {children}
    </div>
  )
}
