export interface Props {
  title: string
  description?: string
  children?: any
  classes?: string
}

export const CardPresentation2 = ({ title, description, children, classes }: Props) => {
  return (
    <div
      className={`relative p-4 overflow-hidden group  border border-g-primary sm:border-g-border hover:border-g-primary rounded-lg transition-all text-center bg-g-primary-transparent-low hover:bg-g-primary-transparent-medium ${classes}`}
    >
      <div className="absolute top-[48%] sm::top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 z-10 group-hover:opacity-10 duration-500 w-full">
        <h3 className="g-heading-3 text-g-primary-dark sm:text-g-primary">{title}</h3>
        <p className="w-11/12 m-auto text-g-gray g-body-2">{description}</p>
      </div>

      <div className={`m-4 md:col-span-4 relative opacity-20 group-hover:opacity-100 duration-500`}>
        {children}
      </div>
    </div>
  )
}

export interface Card2Props {
  children: any
  classes?: string
  bgClasses?: string
}

export const CardPresentation2Content = ({ children, classes, bgClasses }: Card2Props) => {
  const bgClassesUsed = bgClasses ?? 'bg-g-primary-transparent-low hover:bg-g-primary-transparent-medium'
  return (
    <div
      className={`p-2 sm:px-4 sm:py-6 border border-g-border hover:border-g-primary rounded-lg transition-all  ${bgClassesUsed} duration-500 ${classes}`}
    >
      {children}
    </div>
  )
}
