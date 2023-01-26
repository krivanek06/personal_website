export interface Props {
  children?: any
}

export const DevelopmentBackground = ({ children }: Props) => {
  return (
    <div className="py-4 md:py-16 h-screen">
      {/* content */}
      {children}
    </div>
  )
}
