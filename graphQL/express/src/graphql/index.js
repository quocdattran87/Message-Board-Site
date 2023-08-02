// Reference: Adapted from Week 10 tutorial
const { buildSchema } = require("graphql")
const db = require("../database")

const graphql = { }

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.schema = buildSchema(`
  # The GraphQL types are declared first.
  type User {
    id: Int,
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    date: String,
    accountActive: Boolean,
    visitors: Int,
    posts: [Post],
    replies: [Reply],
    reply2s: [Reply2]
  }

  type Post {
    id: Int,
    message: String,
    image: String,
    user_id: Int,
    postActive: Boolean
  }

  type Reply {
    id: Int,
    message: String,
    username: String,
    user_id: Int,
    replyActive: Boolean
  }

  type Reply2 {
    id: Int,
    message: String,
    username: String,
    user_id: Int,
    reply2Active: Boolean
  }

  type Reaction {
    id: Int,
    post_id: Int,
    post_type: String,
    reaction: Int,
    user_id: Int
  }

  type Follow {
    id: Int,
    follower: Int,
    following: Int,
  }

  type Admin {
    date: String,
    visitors: Int
  }

  # Queries (read-only operations).
  type Query {
    all_users: [User],
    user_by_id(id: Int): User,
    all_posts_by_id(user_id: Int): [Post],
    all_replies_by_id(user_id: Int): [Reply],
    all_replies2_by_id(user_id: Int): [Reply2],
    all_reactions: [Reaction],
    all_follows: [Follow],
    all_visits: [Admin]
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    deactivate_user(id: Int): Boolean,
    activate_user(id: Int): Boolean,
    deactivate_post(id: Int, post_type: String): Boolean,
    activate_post(id: Int, post_type: String): Boolean
  }
`)

// The root provides a resolver function for each API endpoint.
graphql.root = {
  // Queries.
  all_users: async () => {
    return await db.user.findAll({ include: [{ model: db.post, as: "posts" }, { model: db.reply, as: "replies" }, { model: db.reply2, as: "reply2s" } ] })
  },
  user_by_id: async (args) => {
    return await db.user.findByPk(args.id)
  },
  all_posts_by_id: async (args) => {
    return await db.post.findAll({ where: {'user_id' : args.user_id }})
  },
  all_replies_by_id: async (args) => {
    return await db.reply.findAll({ where: {'user_id' : args.user_id }})
  },
  all_replies2_by_id: async (args) => {
    return await db.reply2.findAll({ where: {'user_id' : args.user_id }})
  },
  all_reactions: async () => {
    return await db.reaction.findAll()
  },
  all_follows: async () => {
    return await db.follow.findAll()
  },
  all_visits: async () => {
    return await db.admin.findAll()
  },

  // Mutations.
  deactivate_user: async (args) => {
    const user = await db.user.findByPk(args.id)
    if(user === null)
      return false
    user.accountActive = false
    await user.save()
    return true
  },
  activate_user: async (args) => {
    const user = await db.user.findByPk(args.id)
    if(user === null)
      return false
    user.accountActive = true
    await user.save()
    return true
  },
  deactivate_post: async (args) => {
    console.log(args)
    if (args.post_type === 'post') {
      const post = await db.post.findByPk(args.id)
      if(post === null)
        return false
      post.postActive = false
      await post.save()
      return true
    }
    if (args.post_type === 'reply') {
      const reply = await db.reply.findByPk(args.id)
      if(reply === null)
        return false
      reply.replyActive = false
      await reply.save()
      return true
    }
    if (args.post_type === 'reply2') {
      const reply2 = await db.reply2.findByPk(args.id)
      if(reply2 === null)
        return false
      reply2.reply2Active = false
      await reply2.save()
      return true
    }
  },
  activate_post: async (args) => {
    if (args.post_type === 'post') {
      const post = await db.post.findByPk(args.id)
      if(post === null)
        return false
      post.postActive = true
      await post.save()
      return true
    }
    if (args.post_type === 'reply') {
      const reply = await db.reply.findByPk(args.id)
      if(reply === null)
        return false
      reply.replyActive = true
      await reply.save()
      return true
    }
    if (args.post_type === 'reply2') {
      const reply2 = await db.reply2.findByPk(args.id)
      if(reply2 === null)
        return false
      reply2.reply2Active = true
      await reply2.save()
      return true
    }
  }
}

module.exports = graphql


//-----Subscriptions (PORT 4000)----------------------------------------------------------------------------------------
const { createServer, createPubSub } = require('@graphql-yoga/node')

const pubsub = createPubSub()

let reactions = [
  {
    id: '21',
    dislikes: 0
  }
]

const server = createServer({
  schema: {
    typeDefs: `      
      type Query {
        getReactions: [Reaction]
      }

      type Reaction {
        id: String,
        dislikes: Int,
      }

      type Mutation {
        updateReaction(id: String): Reaction
        resetReaction(id: String): Reaction
      }

      type PostSubscriptionResult {
        mutation: String
        data: Reaction
      }

      type Subscription {
        post: PostSubscriptionResult,
        checkDislikes: PostSubscriptionResult
      }
    `,
    resolvers: {
      Query: {
        getReactions: () => {
          return reactions
        }
      },
      Mutation: {
        updateReaction: (parent, args) => {
          const reaction = reactions.find((reaction) => reaction.id === args.id)
          reaction.dislikes += 1
          
          if (reaction.dislikes >= 5) {
            pubsub.publish('post', {
              mutation: 'updateReaction',
              data: reaction,
            })
          }
          return reaction
        },
        resetReaction: (parent, args) => {
          const reaction = reactions.find((reaction) => reaction.id === args.id)
          reaction.dislikes = 0
          return reaction
        }
      },
      Subscription: {
        post: {
          subscribe: () => pubsub.subscribe('post'),
          resolve: (payload) => payload
        },
        checkDislikes: {
          subscribe: () => pubsub.subscribe('checkDislikes'),
          resolve: (payload) => payload
        }
      }
    }
  },
  graphiql: true,
})

server.start()

