import { useForm } from 'react-hook-form'
import { EMAIL_PATTERN } from '../../models/constants.model'

export const FormContactMe = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
    // TODO: send email
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
      </div>

      {/* additional info */}
      <div className="g-form-control">
        <label>Additional Information</label>
        <textarea
          className="min-h-[200px]"
          {...register('additionalInformation', {
            maxLength: 1000,
          })}
        />
      </div>

      <div className="flex justify-center">
        <button className="w-10/12" type="submit">
          <span>Send</span>
        </button>
      </div>
    </form>
  )
}
