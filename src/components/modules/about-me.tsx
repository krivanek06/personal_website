import { useEffect, useState } from 'react'
import type { BlogPost, ContentProjectionProps } from '../../models'
import { getBlogPosts } from '../functions'
import { CardBlogPost } from '../shared/card-blogpost'
import { CardPresentation2Content } from '../shared/card-presentation-2'

export const AboutMePage = () => {
  return (
    <div className="relative">
      <AboutMeBackground>
        <div className="g-layout-wide ">
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
          loading="lazy"
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

      <div className="grid lg:grid-cols-2 2xl:grid-cols-3 md:min-h-[90vh] ">
        <div className="relative min-h-[630px] sm:max-lg:hidden lg:block">
          {/* picture */}
          <picture>
            <source type="image/webp" srcSet="/images/myself_transparent_2.webp" />
            <img
              src="/images/myself_transparent_2.png"
              alt="author image"
              className="h-full min-h-[850px] object-cover absolute -z-10 top-[-18%] sm:top-[-10%] lg:h-[1290px] max-sm:left-[-40px]"
            />
          </picture>

          {/* card */}
          <CardPresentation2Content
            bgClasses="bg-g-primary-transparent-dark hover:bg-g-primary-transparent-dark2"
            classes="w-[290px] sm:w-[420px] bottom-0 md:bottom-[10%] absolute sm:right-[-20%] md:opacity-70 hover:opacity-90  right-[2%]"
          >
            <AboutMeText />
          </CardPresentation2Content>
        </div>

        {/* blog posts */}
        <div className="g-fading-component-wrapper-parent max-sm:flex max-sm:overflow-x-scroll sm:grid sm:place-content-center 2xl:col-span-2 max-md:gap-3 max-sm:p-4 max-sm:pr-8 max-sm:mt-6">
          <AboutMeBlogPosts />
        </div>
      </div>
    </>
  )
}

const AboutMeText = () => {
  return (
    <p className="w-11/12 m-auto text-white  flex flex-col gap-4 duration-500  hover:z-20">
      <span>
        I specialize in delivering custom web solutions to clients with unique needs, and work closely with
        them to understand their requirements and design a solution that fits their specific needs. I am
        well-versed in a variety of technologies, including Angular, NestJS, GraphQL, and REST API's.
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

      setData(data)
    }

    dataFetch()
  }, [])

  const moveLeft = 'md:ml-[-80px] md:mr-[80px]'
  const moveRight = 'md:ml-[80px] md:mr-[-80px]'
  // max 6 blogposts
  const maxBlogs = data.length > 6 ? 6 : data.length

  return (
    <>
      {[...Array(maxBlogs)].map((_, index) => (
        <div
          key={data[index].title}
          className={`g-fading-component-wrapper duration-500 h-[230px] min-w-[360px] max-w-[550px] md:-mb-10 bg-black rounded-xl hover:z-10 ${
            index % 2 === 0 ? moveLeft : moveRight
          }`}
        >
          <CardBlogPost
            title={data[index].title}
            description={data[index].description}
            imageUrl={data[index].imageUrl}
            postUrl={data[index].postUrl}
            publishedDate={data[index].publishedDate}
            userFullName={data[index].userFullName}
            userProfileImageUrl={data[index].userProfileImageUrl}
            tagList={data[index].tagList}
            index={index}
          />
        </div>
      ))}
    </>
  )
}
