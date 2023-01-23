export interface Props {
  type: '1' | '2'
  className?: string
}
export const Ball = ({ type, className }: Props) => {
  const ballClass = type === '1' ? 'g-ball-1' : 'g-ball-2'

  return <div className={`g-ball-general ${ballClass} ${className}`}></div>
}
