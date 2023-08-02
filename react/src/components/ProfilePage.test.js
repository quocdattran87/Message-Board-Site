// Adapted from week 9 tutorial

import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { getTestLoggedInUser } from '../data/testRepository'
import ProfilePage from './ProfilePage'

// Global data for tests
let loggedInUser
let follows
let container

// Runs once before tests, here global test data is initialised
beforeAll(() => {
    loggedInUser = getTestLoggedInUser()
    follows = loggedInUser.following
})

// Runs before each test, here the Users component is rendered and the container is stored
beforeEach(() => {
    const utils = render(
    <BrowserRouter>
        <ProfilePage loggedInUser={loggedInUser} />,
    </BrowserRouter>)
    container = utils.container
})

test('Render profile page', () => {
    expect(container).toBeInTheDocument()
})

// Check that the list of followers displayed shows the same usernames of followers stored in the database for each user
test('Contains all followers', () => {
    const followBoard = container.querySelector('.following-list')
    expect_ToHaveLength(followBoard, follows.length)

    const following = followBoard.getElementsByClassName('followed-user')
    for(let i = 0; i < following.length; i++) {
        const text_following = following[i].querySelector('.following').textContent

        expect(text_following).toContain('@'+follows[i].user.username)
    }
})

// This test is to verify that the edit button page allows user to go to the edit profile page
test('Press edit button to load edit page', () => {
    const button = screen.getByRole('button', {name: /edit-profile/i}) // This looks for 'aria-label' tag
    expect(button).toBeInTheDocument()

    fireEvent.click(button)
    expect(global.window.location.pathname).toEqual('/edit-profile')
})


function expect_ToHaveLength(followBoard, length) {
    expect(followBoard).toBeInTheDocument()

    const followed = followBoard.getElementsByClassName('followed-user')
    expect(followed).toHaveLength(length)
}

