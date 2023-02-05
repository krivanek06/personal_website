import type { Image } from '../../models'

export interface Props {
  title: string
  description?: string
  img: Image
  additionalClasses?: string
}

export const CardPresentation = ({ title, description, img, additionalClasses }: Props) => {
  return (
    <div
      className={`rounded-lg relative overflow-hidden min-h-[320px] group transition-all bg-black ${additionalClasses}`}
    >
      <img
        loading="lazy"
        src={img.src}
        alt={img.alt}
        className="object-cover absolute opacity-70 group-hover:opacity-90 duration-700 h-full w-full "
      />

      {/* dark explanation */}
      <div className="text-center p-4 absolute flex items-center justify-center w-full bottom-[30%] group-hover:bottom-2 duration-700  min-h-[110px] bg-g-overlay-dark hover:bg-g-overlay-medium flex-col gap-0 group-hover:gap-4  ">
        <h3 className="text-g-primary g-heading-3 sm:animate-pulse group-hover:animate-none">{title}</h3>
        <p className="g-fade scale-0 h-0 group-hover:h-auto group-hover:scale-100 pb-4 ">{description}</p>
      </div>
    </div>
  )
}
