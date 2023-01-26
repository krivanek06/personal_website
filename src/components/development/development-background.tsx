export interface Props {
  children?: any
}

export const DevelopmentBackground = ({ children }: Props) => {
  return (
    <div className="py-4 md:py-16 h-screen">
      <img src="/logos/angular.png" alt="" className="h-[70px] g-image-shadow top-[200px] left-[14%]" />

      {/* content */}
      {children}
    </div>
  )
}
