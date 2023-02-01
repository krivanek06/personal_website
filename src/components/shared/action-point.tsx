import { useInView } from 'react-intersection-observer'

export interface Props {
  title: string
  description: string
  iconContent: any
  animationClasses?: string
}

export const ActionPoints = ({ title, description, iconContent, animationClasses }: Props) => {
  const { ref, inView, entry } = useInView()

  return (
    <div ref={ref} className={` ${inView ? animationClasses : ''}`}>
      <div className="flex items-start gap-2 mb-2">
        {/* icon */}
        <div className="-mt-3 p-3 border border-g-gray rounded-full">{iconContent}</div>

        {/* svg */}
        <svg
          className="mt-3 fill-g-gray stroke-g-gray"
          width="80"
          height="12"
          viewBox="0 0 55 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line y1="6" x2="46.3855" y2="6" />
          <ellipse cx="49.6987" cy="6" rx="5.3012" ry="6" />
        </svg>
        <h3 className="text-g-primary g-heading-4">{title}</h3>
      </div>

      <p className="pl-4 text-g-gray g-body-2">{description}</p>
    </div>
  )
}
