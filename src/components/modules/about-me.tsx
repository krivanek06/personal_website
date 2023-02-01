import { useEffect, useState } from 'react'
import type { BlogPost, ContentProjectionProps } from '../../models'
import { getBlogPosts } from '../functions'
import { CardBlogPost } from '../shared/card-blogpost'
import { CardPresentation2Content } from '../shared/card-presentation-2'

export const AboutMePage = () => {
  return (
    <div className="relative">
      <AboutMeBackground>
        <div className="g-layout-wide h-[135vh]">
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

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 min-h-[90vh] ">
        <div className="relative hidden lg:block">
          {/* picture */}
          <img
            src="/images/myself_only_body_3.png"
            alt="author image"
            className="h-full object-cover absolute -z-10 top-[-5%]"
          />
          {/* card */}
          <CardPresentation2Content
            bgClasses="bg-g-primary-transparent-medium hover:bg-g-primary-transparent-dark"
            classes="w-[420px] bottom-0 absolute right-[-20%] opacity-70 hover:opacity-90 "
          >
            <AboutMeText />
          </CardPresentation2Content>
        </div>

        {/* blog posts */}
        <div className="g-fading-component-wrapper-parent grid place-content-center xl:col-span-2">
          <AboutMeBlogPosts />
        </div>
      </div>
    </>
  )
}

const AboutMeText = () => {
  return (
    <p className="w-11/12 m-auto text-g-gray-medium hover:text-white flex flex-col gap-4 duration-500">
      <span>
        I specialize in delivering custom web solutions to clients with unique needs, and work closely with
        them to understand their requirements and design a solution that fits their specific needs.
      </span>
      <span>
        With several years of experience in both front-end and back-end development, I am well-versed in a
        variety of technologies, including Angular, NestJS, GraphQL, and REST API's.
      </span>
      <span>
        My goal is to help businesses stay on the cutting edge of technology by creating modern, efficient,
        and high-performing web applications, whether it's a new project or software modernization.
      </span>
    </p>
  )
}

const AboutMeBlogPosts = () => {
  const [data, setData] = useState<BlogPost[]>([])

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await getBlogPosts()

      console.log(data)
      setData(data)
    }

    dataFetch()
  }, [])

  const moveLeft = 'ml-[-100px] mr-[100px]'
  const moveRight = 'ml-[100px] mr-[-100px]'

  return (
    <>
      {data.map((d, index) => (
        <div
          key={d.title}
          className={`g-fading-component-wrapper duration-500 h-[230px] -mb-10 bg-black rou rounded-lg hover:z-10 ${
            index % 2 === 0 ? moveLeft : moveRight
          }`}
        >
          <CardBlogPost
            title={d.title}
            description={d.description}
            imageUrl={d.imageUrl}
            postUrl={d.postUrl}
            publishedDate={d.publishedDate}
            userFullName={d.userFullName}
            userProfileImageUrl={d.userProfileImageUrl}
          />
        </div>
      ))}
    </>
  )
}
