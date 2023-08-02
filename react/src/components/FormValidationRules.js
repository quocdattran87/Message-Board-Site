import { verifyUser, findByUsername, findByEmail } from '../data/repository';


export default async function validateForm(values, formType, loggedInUser) {
  let errors = {}
  if (!values.username && (formType === 'signup' || formType === 'edit')) {
    errors.username = 'Username is required'
  } else if ((formType === 'signup' || formType === 'edit') && values.username.length > 40) {
    errors.username = 'Username length cannot be greater than 40.'
  } else if (formType === 'signup' && await findByUsername(values.username.toLowerCase()) !== null) {
    errors.username = 'Username is already registered.'
  } else if (formType === 'edit' && await findByUsername(values.username.toLowerCase()) !== null && values.username.toLowerCase() !== loggedInUser.username.toLowerCase()) {
    errors.username = 'Username is already registered.'
  }

  if (!values.firstName && (formType === 'signup' || formType === 'edit')) {
    errors.firstName = 'First name is required'
  } else if (formType === 'signup' || formType === 'edit') {
    if (values.firstName.length > 40) {errors.firstName = 'First name length cannot be greater than 40.'}
  }

  if (!values.lastName && (formType === 'signup' || formType === 'edit')) {
    errors.lastName = 'Last name is required'
  } else if (formType === 'signup' || formType === 'edit') {
    if (values.lastName.length > 40) {errors.lastName = 'Last name length cannot be greater than 40.'}
  }

  if (!values.email) {
    errors.email = 'Email address is required'
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid'
  } else if (values.email.length > 40 && (formType === 'signup' || formType === 'edit')) {
    errors.email = 'Email length cannot be greater than 40.'
  } else if (await findByEmail(values.email.toLowerCase()) !== null && (formType === 'signup')) {
    errors.email = 'Email is already registered.'
  } else if (await findByEmail(values.email.toLowerCase()) !== null && (formType === 'edit') && values.email.toLowerCase() !== loggedInUser.email.toLowerCase()) {
    errors.email = 'Email is already registered.'
  }

  if (formType !== 'edit') {
    if (!values.password) {
      errors.password = 'Password is required'
    } else if (values.password.length < 8 && formType === 'signup') {
      errors.password = 'Password must be 8 or more characters'
    }
  }
  // Check login details with all users in localStorage
  if (Object.keys(errors).length === 0 && formType === 'login') {
    if (await verifyUser(values.email, values.password) === false) {
      errors.login = 'Incorrect email and password combination'
    }
  }

  return errors
}