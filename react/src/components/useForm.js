import { useState, useEffect } from 'react'

const useForm = (callback, validateForm, formType, loggedInUser) => {

  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // If there are no errors, submit the form by using the callback from the parent
    if (Object.keys(errors).length === 0 && isSubmitting) {
      // When no errors, enters into here
      setIsSubmitting(false)
      callback()
    }
    if (formType === 'login' && errors.login) {
        // Reset password field to blank when there is a login error
        const temp = { ...values }
        temp.password = ''
        setValues(temp)
    }
  // eslint-disable-next-line
  }, [errors])

  const handleSubmit = async (event) => {
    if (event) event.preventDefault()
    const trimmedValues = { }
    Object.keys(values).map(key => trimmedValues[key] = values[key].replace(/\s/g,''));
    setValues(trimmedValues)
    setErrors(await validateForm(trimmedValues,formType,loggedInUser))
    setIsSubmitting(true)
  }

  const handleChange = (event) => {
    event.persist()
    setValues(values => ({ ...values, [event.target.name]: event.target.value }))
  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    setValues
  }
}

export default useForm