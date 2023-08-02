const testUsers = [
    { id: 1, username: 'foffman', email: 's3827826@student.rmit.edu.au', password_hash: '$argon2id$v=19$m=4096,t=3,p=1$rV/2aDvnszSar8PmOAliOA$/kydK1sd6j9D7CkODfUGWd5b84jYe3gd8cYWBQEvk7A', firstName: 'Quoc', lastName: 'Tran', profilePic: null, date:'Monday, August 8, 2022', twoFactorAuthentication: null },
    { id: 2, username: 'link', email: 'link@link.com', password_hash: '$argon2id$v=19$m=4096,t=3,p=1$8sWbCNIqBt5WpuJBMd9vqg$YFGyG3ZXy43OQRpdEswm79UkQgIRtcVZ6aG8fB8CU6g', firstName: 'Mario', lastName: 'Luigi', profilePic: null, date: 'Monday, August 8, 2022', twoFactorAuthentication: null },
    { id: 3, username: 'zelda', email: 'zelda@zelda.com', password_hash: '$argon2id$v=19$m=4096,t=3,p=1$VUG+2MZ98H9aK3chyTrl1g$1azUamdWLs8pWZhpb+eCnrHrHd2SzIM56FCEI5Q0Ue4', firstName: 'Zelda', lastName: 'Link', profilePic: null, date: 'Monday, August 8, 2022', twoFactorAuthentication: null }
]

const testReactions = [
    { user_id: 1, post_id: 3, post_type: "post", reaction: 1 },
    { user_id: 1, post_id: 2, post_type: "post", reaction: 0 }
]

const testPosts = [
    { id: 1, message: 'awesome sauce part 1', date: '2022-09-17T07:52:39.000Z', image: 'a64BitStringImage', user_id: 1, user: testUsers[0], reactions: [], replies: [], postActive: true },
    { id: 2, message: 'awesome sauce part 2', date: '2022-09-18T07:52:39.000Z', image: null, user_id: 2, user: testUsers[1], reactions: [testReactions[1]], replies: [], postActive: false },
    { id: 3, message: 'awesome sauce part 3', date: '2022-09-18T07:52:39.000Z', image: null, user_id: 3, user: testUsers[2], reactions: [testReactions[0]], replies: [], postActive: true },
    { id: 4, message: 'awesome sauce part 4', date: '2022-08-17T07:52:39.000Z', image: 'a64BitStringImage', user_id: 1, user: testUsers[0], reactions: [], replies: [], postActive: true },
    { id: 5, message: 'awesome sauce part 5', date: '2022-09-16T07:52:39.000Z', image: null, user_id: 2, user: testUsers[1], reactions: [], replies: [], postActive: true },
    { id: 6, message: 'awesome sauce part 6', date: '2022-09-15T07:52:39.000Z', image: null, user_id: 3, user: testUsers[2], reactions: [], replies: [], postActive: false },
    { id: 7, message: 'awesome sauce part 7', date: '2022-09-14T07:52:39.000Z', image: null, user_id: 1, user: testUsers[0], reactions: [], replies: [], postActive: true },
    { id: 8, message: 'awesome sauce part 8', date: '2022-09-13T07:52:39.000Z', image: 'a64BitStringImage', user_id: 2, user: testUsers[1], reactions: [], replies: [], postActive: true },
    { id: 9, message: 'awesome sauce part 9', date: '2022-09-12T07:52:39.000Z', image: 'a64BitStringImage', user_id: 3, user: testUsers[2], reactions: [], replies: [], postActive: true }
]


const testLoggedInUser = {id: 1, username: 'foffman', email: 's3827826@student.rmit.edu.au', password_hash: '$argon2id$v=19$m=4096,t=3,p=1$rV/2aDvnszSar8PmOAliOA$/kydK1sd6j9D7CkODfUGWd5b84jYe3gd8cYWBQEvk7A', firstName: 'Quoc', lastName: 'Tran', profilePic: null, date:'Monday, August 8, 2022', followers: [], following: [{id: 2, follower: 2, following: 1, user: testUsers[0]}, {id: 3, follower: 2, following: 3, user: testUsers[2]}], twoFactorAuthentication: null}


function getUsers(id = null) {
    // Returns all users if ID is null, otherwise the ID is used to filter the users.
    return id === null ? testUsers : testUsers.filter((user) => user.id === id )
  }


function getTestPosts() {
    return testPosts
}

function getTestLoggedInUser() {
    return testLoggedInUser
}

function getTestReactions() {
    return testReactions
}

export {
    getUsers, getTestPosts, getTestLoggedInUser, getTestReactions
}