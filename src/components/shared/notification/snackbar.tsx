import { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './snackbar.scss'

export type SnackBarMessageTypes = 'error' | 'info' | 'success'
export interface Props {
  timer: number
  messageType: SnackBarMessageTypes
  title: string
  message: string
}

export const SnackBar = (props: Props) => {
  const [closeTimeout, setCloseTimeout] = useState(0)
  console.log('SnackBar')

  useEffect(() => {
    beginCloseTimeout()
  }, [])

  const closeSnackBar = () => {
    clearTimeout(closeTimeout)
    const element = document.getElementById('snackbar-fixed-container')
    console.log('element', element)
    if (element) {
      ReactDOM.unmountComponentAtNode(element)
    }
  }

  const beginCloseTimeout = () => {
    if (props.timer) {
      const timeout = setTimeout(() => closeSnackBar(), props.timer)
      setCloseTimeout(timeout)
    }
  }

  return (
    <div
      className={`snackbar-container ${props.messageType}-container`}
      onMouseEnter={() => clearTimeout(closeTimeout)}
      onMouseLeave={() => beginCloseTimeout()}
    >
      <div>
        <div className="snackbar-info-container">
          <div>
            <div className={`snackbar-icon ${props.messageType}-snackbar-icon`}></div>
          </div>
          <div>
            <h5 className={`${props.messageType}-title`}>{props.title}</h5>
            <h5 className="notification-text"> {props.message}</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

const triggerSnackbar = (title: string, message: string, messageType: SnackBarMessageTypes) => {
  const validMessageTypes = ['error', 'info', 'warning', 'success']
  if (!validMessageTypes.includes(messageType)) {
    throw Error('Invalid snackbar message type')
  }
  ReactDOM.render(
    <SnackBar messageType={messageType} timer={4000} title={title} message={message} />,
    document.getElementById('snackbar-fixed-container'),
  )
}

export const showErrorMessage = (title: string, message: string) => {
  triggerSnackbar(title, message, 'error')
}

export const showInfoMessage = (title: string, message: string) => {
  triggerSnackbar(title, message, 'info')
}

export const showSuccessMessage = (title: string, message: string) => {
  triggerSnackbar(title, message, 'success')
}
