// Adapted from week 9 tutorial

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { getUsers, getTestPosts, getTestLoggedInUser } from '../data/testRepository'
import MessageBoard from './MessageBoard'

// Global data for tests.
let loggedInUser
let posts
let container

// Runs once before tests, here global test data is initialised.
beforeAll(() => {
    loggedInUser = getTestLoggedInUser()
    posts = getTestPosts()
})

// Runs before each test, here the Users component is rendered and the container is stored.
beforeEach(() => {
    const utils = render(
    <BrowserRouter>
        <MessageBoard loggedInUser={loggedInUser} test={true} />,
    </BrowserRouter>)
    container = utils.container
})

test('Render message board', () => {
    expect(container).toBeInTheDocument()
})

// Check the same amount of post boxes are shown as the amount of messages in the test data
// Also check the username, pictures, and username matches for each post
test('Contains all posts', () => {
    // Use the container to query the document.
    const messageBoard = container.querySelector('.message-board')
    expect_ToHaveLength(messageBoard, posts.length)
  
    // Ensure the users data has been displayed.
    const messages = messageBoard.getElementsByClassName('border')
    for(let i = 0; i < messages.length; i++) {
        const text_username = messages[i].querySelector('.post-username').textContent
        const text_message = messages[i].querySelector('.message-field').textContent
        const text_picture = messages[i].querySelector('.message-pic')

        expect(text_username).toContain('@'+getUsers(posts[i].user.id)[0].username)
        if (posts[i].postActive) {
            expect(text_message).toContain(posts[i].message)
        }
        if (!posts[i].postActive) {
            expect(text_message).toContain("[**** This post has been deleted by the admin***\n **** This thread is now closed***]")
        }
        if (text_picture !== null) {
            expect(text_picture.src).toContain(posts[i].image)
        } else {
            expect(text_picture).toBeNull()
        }
    }
})

// Check that the counts of all reactions per test post matches the amount of likes + dislikes displayed on the page for the same message
test('Has correct reaction counts', () => {
    const messageBoard = container.querySelector('.message-board')
    expect_ToHaveLength(messageBoard, posts.length)
    const messages = messageBoard.getElementsByClassName('border')

    for(let i = 0; i < messages.length; i++) {
        const likes = parseInt(messages[i].querySelector('.likes-count-posts').textContent)
        const dislikes = parseInt(messages[i].querySelector('.dislikes-count-posts').textContent)

        expect(likes+dislikes).toBe(posts[i].reactions.length)
    }
})

function expect_ToHaveLength(messageBoard, length) {
    expect(messageBoard).toBeInTheDocument()

    const messages = messageBoard.getElementsByClassName('border')
    expect(messages).toHaveLength(length)
}