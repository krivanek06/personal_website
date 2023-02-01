import type { BlogPost } from '../../models'

export const CardBlogPost = (post: BlogPost) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="#"
      className="rounded-lg relative opacity-50 hover:opacity-100 duration-500 transition-all w-full h-full overflow-hidden"
    >
      {/* background image */}
      <img
        src={post.imageUrl}
        alt="Blog Post Cover Image"
        className="w-full h-full object-cover rounded-lg "
      />

      {/* bottom text */}
      <div className="absolute p-4 bg-slate-700 bottom-0 flex items-center gap-4 w-full rounded-b-lg">
        <img src={post.userProfileImageUrl} alt="Blog Created Profile Image" className="h-10 rounded-full" />

        <div className="grid">
          <h3 className="text-white">{post.title}</h3>
          <div className="text-g-gray-medium">
            {post.userFullName} | {post.publishedDate}
          </div>
        </div>
      </div>
    </a>
  )
}
