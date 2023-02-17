import { useEffect } from 'react'
import './blob.scss'

export const Blob = () => {
  useEffect(() => {
    console.log('blob')
    const blob = document.getElementById('blob')

    document.body.onpointermove = (event) => {
      const { clientX, pageY } = event

      if (!blob) {
        return
      }
      blob.animate(
        {
          left: `${clientX}px`,
          top: `${pageY}px`,
        },
        { duration: 6000, fill: 'forwards' },
      )
    }
  }, [])

  return (
    <>
      <div id="blob" className="hidden lg:block"></div>
    </>
  )
}
