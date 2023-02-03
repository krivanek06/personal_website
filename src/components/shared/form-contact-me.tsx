import { send } from '@emailjs/browser'
import { useForm } from 'react-hook-form'
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID_EMAIL,
  EMAILJS_TEMPLATE_SELF,
} from '../../environments/environment'
import type { ContactMeForm } from '../../models'
import { EMAIL_PATTERN } from '../../models/constants.model'
import { showErrorMessage, showInfoMessage, showSuccessMessage } from './notification/snackbar'

export const FormContactMe = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const onSubmit = (data: any) => {
    const emailData = data as ContactMeForm
    showInfoMessage('Submitting form', 'You are about to send an email')

    // send email
    send(EMAILJS_SERVICE_ID_EMAIL, EMAILJS_TEMPLATE_SELF, emailData, EMAILJS_PUBLIC_KEY).then(
      (result) => {
        console.log(result.text)
        showSuccessMessage(
          'Successful submission',
          'You have successfully sent an email, we will concat you back in short notice',
        )
      },
      (error) => {
        console.log(error.text)
        showErrorMessage(
          'Error submitting the form',
          'He have experienced and error, please send and email to krivaneda@gmail.com',
        )
      },
    )

    // reset form
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" id="contactMeForm">
      {/* full name */}
      <div className="g-form-control">
        <label>Full name*</label>
        <input
          type="text"
          {...register('fullName', {
            required: true,
            maxLength: 100,
            minLength: 6,
          })}
        />

        {errors.fullName && errors.fullName.type === 'required' && (
          <p className="g-form-error-message">Full name is required</p>
        )}
        {errors.fullName && errors.fullName.type === 'maxLength' && (
          <p className="g-form-error-message">Full name max characters are 100</p>
        )}
        {errors.fullName && errors.fullName.type === 'minLength' && (
          <p className="g-form-error-message">Full name min characters are 6</p>
        )}
      </div>

      {/* email */}
      <div className="g-form-control">
        <label>Email*</label>
        <input
          type="text"
          {...register('email', {
            required: true,
            pattern: EMAIL_PATTERN,
          })}
        />

        {errors.email && errors.email.type === 'required' && (
          <p className="g-form-error-message">Email is required</p>
        )}
        {errors.email && errors.email.type === 'pattern' && (
          <p className="g-form-error-message">Email is not valid</p>
        )}
      </div>

      {/* company */}
      <div className="g-form-control">
        <label>Company</label>
        <input
          type="text"
          {...register('company', {
            maxLength: 100,
          })}
        />
        {errors.company && errors.company.type === 'required' && (
          <p className="g-form-error-message">Company is required</p>
        )}
        {errors.company && errors.company.type === 'maxLength' && (
          <p className="g-form-error-message">Max length is 100 characters</p>
        )}
      </div>

      {/* additional info */}
      <div className="g-form-control">
        <label>Additional Information*</label>
        <textarea
          className="min-h-[200px]"
          {...register('message', {
            required: true,
            maxLength: 1000,
          })}
        />

        {errors.message && errors.message.type === 'required' && (
          <p className="g-form-error-message">Additional information is required</p>
        )}
        {errors.message && errors.message.type === 'maxLength' && (
          <p className="g-form-error-message">Additional max length is 1000 characters</p>
        )}
      </div>

      <div className="flex justify-center">
        <button className="w-10/12" type="submit">
          <span>Send</span>
        </button>
      </div>
    </form>
  )
}
