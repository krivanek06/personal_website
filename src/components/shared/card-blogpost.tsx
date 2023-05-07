import type { BlogPost } from '../../models'
import { ImageWrapper } from './image-wrapper'

export interface CardBlogPost extends BlogPost {
  index: number
}

export const CardBlogPost = (post: CardBlogPost) => {
  const tagLocationRight = 'right-0 rounded-r-xl  top-0  w-[80px] h-full flex-col'
  const tagLocationTop = 'top-0 rounded-t-xl w-full h-[80px]'
  const tagLocationClass = post.index % 2 === 0 ? tagLocationTop : tagLocationRight

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={post.postUrl}
      className="flex rounded-xl relative duration-500 transition-all w-full h-full overflow-hidden group"
    >
      {/* background image */}
      <img
        src={post.imageUrl}
        alt="Blog Post Cover Image"
        className="w-full h-full object-cover rounded-xl "
      />

      {/* bottom text */}
      <div className="absolute p-4 bg-gray-700 bottom-0 flex items-center gap-4 w-full rounded-b-xl">
        <img src={post.userProfileImageUrl} alt="Blog Created Profile Image" className="h-10 rounded-full" />

        <div className="grid w-10/12">
          <h3 className="text-white group-hover:text-g-primary duration-500">{post.title}</h3>
          <div className="text-g-gray ">
            {post.userFullName} | {post.publishedDate}
          </div>
        </div>
      </div>

      {/* side bar tags */}
      <div
        className={`absolute bg-[#273242b8] group-hover:bg-[#273242] duration-500  p-2 flex  gap-3 items-center ${tagLocationClass}`}
      >
        {post.tagList.map((tag) => (
          <ImageWrapper
            key={tag}
            src={`logos/${tag}.png`}
            alt={tag}
            fallbackPath={'logos/programming.png'}
            classes={`rounded-full w-[50px]`}
          />
        ))}
      </div>
    </a>
  )
}
