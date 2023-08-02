// Adapted from week 9 tutorial

import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { getTestLoggedInUser } from '../data/testRepository'
import EditProfilePage from './EditProfilePage'

// Global data for tests
let loggedInUser
let container

// Runs once before tests, here global test data is initialised
beforeAll(() => {
    loggedInUser = getTestLoggedInUser()
})

// Runs before each test, here the Users component is rendered and the container is stored
beforeEach(() => {
    const utils = render(
    <BrowserRouter>
        <EditProfilePage loggedInUser={loggedInUser} />,
    </BrowserRouter>)
    container = utils.container
})

test('Render edit profile page', () => {
    expect(container).toBeInTheDocument()
})

// Check that the prepopulated fields are the same as the fields of the currentLogged in user that is stored in the test data
test('Check prepopulated fields match loggedInUser', () => {
    // Inside EditProfilePage
    let input = screen.getByLabelText('Username')
    expect(input.value).toBe(loggedInUser.username)

    input = screen.getByLabelText('First Name')
    expect(input.value).toBe(loggedInUser.firstName)

    input = screen.getByLabelText('Last Name')
    expect(input.value).toBe(loggedInUser.lastName)

    input = screen.getByLabelText('Email Address')
    expect(input.value).toBe(loggedInUser.email)
})

// Check the input fields of the form change as user inputs text
test('Test edit input fields', () => {
    let input = screen.getByLabelText('Username')
    fireEvent.change(input, { target: { value: 'Loppy' } })
    expect(input.value).toBe('Loppy')

    input = screen.getByLabelText('First Name')
    fireEvent.change(input, { target: { value: 'Quoc' } })
    expect(input.value).toBe('Quoc')

    input = screen.getByLabelText('Last Name')
    fireEvent.change(input, { target: { value: 'Tran' } })
    expect(input.value).toBe('Tran')

    input = screen.getByLabelText('Email Address')
    fireEvent.change(input, { target: { value: 's3827826@student.rmit.edu.au' } })
    expect(input.value).toBe('s3827826@student.rmit.edu.au')
})

// Test that the cancel button will take the user back to their profile page
test('Press cancel button and load profile page', () => {
    const button = screen.getByRole('button', {name: /edit-cancel/i}) // This looks for 'aria-label' tag
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(global.window.location.pathname).toEqual('/profile')
})

