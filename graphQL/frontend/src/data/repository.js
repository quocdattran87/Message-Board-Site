// Reference: Adapted from Week 10 tutorial
import { request, gql } from 'graphql-request'

// --- Constants ----------------------------------------------------------------------------------
const GRAPH_QL_URL = 'http://localhost:4001/graphql'

// --- Users --------------------------------------------------------------------------------------
async function getUsers() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_users {
        id,
        username,
        email,
        firstName,
        lastName,
        date,
        accountActive,
        visitors,
        posts {
          id
          message
        }
        replies {
          id
          message
          username
        }
        reply2s {
          id
          message
          username
        }
      }
    }
  `
  const data = await request(GRAPH_QL_URL, query)

  return data.all_users
}

async function getUser(user_id) {
  const id = parseInt(user_id)
  // Query with parameters (variables)
  const query = gql`
    query ($id: Int) {
      user_by_id(id: $id) {
        id,
        username,
        visitors
      }
    }
  `
  const variables = { id } 
  const data = await request(GRAPH_QL_URL, query, variables)
  return data.user_by_id
}

// User Mutations
async function deactivateUser(id) {
  const query = gql`
    mutation ($id: Int) {
      deactivate_user(id: $id)
    }
  `
  const variables = { id }
  const data = await request(GRAPH_QL_URL, query, variables)

  return data.deactivate_user
}

async function activateUser(id) {
  const query = gql`
    mutation ($id: Int) {
      activate_user(id: $id)
    }
  `
  const variables = { id }
  const data = await request(GRAPH_QL_URL, query, variables)

  return data.activate_user
}

// --- Posts --------------------------------------------------------------------------------------
async function getPosts(id) {
  const user_id = parseInt(id)
  // Query with parameters (variables)
  const query = gql`
    query ($user_id: Int) {
      all_posts_by_id(user_id: $user_id) {
        id,
        message,
        image,
        user_id,
        postActive
      }
    }
  `
  const variables = { user_id } 
  const data = await request(GRAPH_QL_URL, query, variables)

  return data.all_posts_by_id
}

// Post mutations
async function deactivatePost(id, post_type) {
  const query = gql`
    mutation ($id: Int, $post_type: String) {
      deactivate_post(id: $id, post_type: $post_type)
    }
  `
  const variables = { id, post_type }
  const data = await request(GRAPH_QL_URL, query, variables)
  return data.deactivate_post
}

async function activatePost(id, post_type) {
  const query = gql`
    mutation ($id: Int, $post_type: String) {
      activate_post(id: $id, post_type: $post_type)
    }
  `
  const variables = { id, post_type }
  const data = await request(GRAPH_QL_URL, query, variables)
  return data.activate_post
}


// --- Replies --------------------------------------------------------------------------------------
async function getReplies(id) {
  const user_id = parseInt(id)
  // Query with parameters (variables)
  const query = gql`
    query ($user_id: Int) {
      all_replies_by_id(user_id: $user_id) {
        id,
        message,
        user_id,
        replyActive
      }
    }
  `
  const variables = { user_id } 
  const data = await request(GRAPH_QL_URL, query, variables)

  return data.all_replies_by_id
}

async function getReplies2(id) {
  const user_id = parseInt(id)
  // Query with parameters (variables)
  const query = gql`
    query ($user_id: Int) {
      all_replies2_by_id(user_id: $user_id) {
        id,
        message,
        user_id,
        reply2Active
      }
    }
  `
  const variables = { user_id } 
  const data = await request(GRAPH_QL_URL, query, variables)

  return data.all_replies2_by_id
}

// --- Reactions --------------------------------------------------------------------------------------
async function getReactions() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_reactions {
        id,
        post_id,
        post_type,
        reaction,
        user_id
      }
    }
  `
  const data = await request(GRAPH_QL_URL, query)

  return data.all_reactions
}

// --- Follows --------------------------------------------------------------------------------------
async function getFollows() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_follows {
        id,
        follower,
        following
      }
    }
  `
  const data = await request(GRAPH_QL_URL, query)

  return data.all_follows
}

// --- Daily Visits --------------------------------------------------------------------------------------
async function getDailyVisits() {
  // Simply query with no parameters.
  const query = gql`
    {
      all_visits {
        date,
        visitors
      }
    }
  `
  const data = await request(GRAPH_QL_URL, query)

  return data.all_visits
}

// ---- Subscriptions --------------------------------------------------------------------------------------
async function dislike() {
  const query = gql`
    mutation Test {
      updateReaction(id: "21") {
        id
        dislikes
      }
    }
  `
  await request('http://localhost:4000/graphql', query)
}

async function resetDislikes() {
  const query = gql`
    mutation Test {
      resetReaction(id: "21") {
        id
        dislikes
      }
    }
  `
  await request('http://localhost:4000/graphql', query)
}

async function getDislikes() {
  const query = gql`
    query Test {
      getReactions {
        id
        dislikes
      }
    }
  `
  const data = await request('http://localhost:4000/graphql', query)
  return data.getReactions[0].dislikes
}

export {
  getUser, getUsers, deactivateUser, activateUser,
  getPosts, getReplies, getReplies2, activatePost, deactivatePost,
  getReactions, getFollows, getDailyVisits,
  dislike, getDislikes, resetDislikes
}
