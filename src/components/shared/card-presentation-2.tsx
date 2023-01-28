export interface Props {
  title: string
  description?: string
  children?: any
  height?: string
}

export const CardPresentation2 = ({ title, description, children, height }: Props) => {
  return (
    <div
      className={`grid md:grid-cols-6 overflow-hidden gap-6 p-2 border border-g-border hover:border-g-primary rounded-lg transition-all text-center bg-g-primary-transparent-low hover:bg-g-primary-transparent-medium opacity-40 hover:opacity-90 duration-500 ${height}`}
    >
      <div className="md:col-span-2 flex items-center">
        <div>
          <h3 className="g-heading-3 text-g-primary">{title}</h3>
          <p className="w-11/12 m-auto text-g-gray">{description}</p>
        </div>
      </div>
      <div className={`m-4  md:col-span-4 relative`}>{children}</div>
    </div>
  )
}

export interface Card2Props {
  description: string
  classes?: string
}

export const CardPresentation2OnlyText = ({ description, classes }: Card2Props) => {
  return (
    <div
      className={`px-4 py-6 border border-g-border hover:border-g-primary rounded-lg transition-all text-center bg-g-primary-transparent-low hover:bg-g-primary-transparent-medium opacity-40 hover:opacity-90 duration-500 ${classes}`}
    >
      <p className="w-11/12 m-auto text-g-gray">{description}</p>
    </div>
  )
}
