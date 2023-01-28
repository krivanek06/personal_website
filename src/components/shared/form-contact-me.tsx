import { useState } from 'react'

export const FormContactMe = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    additionalInformation: 'female',
  })

  const onSubmit = (event: any) => {
    event.preventDefault()
    //Reset form
    console.log(formData)
  }

  const handleChange = (event: any) => {
    const { name, value, type } = event.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="g-form-control">
        <label>Full name</label>
        <input type="text" name="name" value={formData.fullName} onChange={handleChange} />
      </div>

      <div className="g-form-control">
        <label>Email</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
      </div>

      <div className="g-form-control">
        <label>Company</label>
        <input type="text" name="company" value={formData.company} onChange={handleChange} />
      </div>

      <div className="g-form-control">
        <label>Additional Information</label>
        <textarea
          className="min-h-[200px]"
          name="additional information"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-center">
        <button className="w-10/12">
          <span>Send</span>
        </button>
      </div>
    </form>
  )
}
