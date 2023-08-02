// Adapted from week 9 tutorial

import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SignUpPage from './SignUpPage'


// Global data for tests.
let container

// Runs before each test, here the Users component is rendered and the container is stored.
beforeEach(() => {
    const utils = render(
    <BrowserRouter>
        <SignUpPage />,
    </BrowserRouter>)
    container = utils.container
})

test('Render signup page', () => {
    expect(container).toBeInTheDocument()
})

test('Test signup input fields', () => {
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

    input = screen.getByLabelText('Password')
    fireEvent.change(input, { target: { value: '11111111' } })
    expect(input.value).toBe('11111111')
})

test('Check link will wnd with the correct /login postfix in url', () => {
    const link = screen.getByRole('link', {name: /here/i})
    expect(link.href.substr(link.href.length-6)).toBe('/login')
})
