module.exports = (express, app) => {
  const controller = require('../controllers/post.controller.js')
  const router = express.Router()

  // Select all posts.
  router.get('/', controller.all)

  // Select all posts for a single user
  router.get('/:id', controller.one)

  // Create a new post.
  router.post('/', controller.create)

  // Edit a post.
  router.put('/:id', controller.edit)

  // Delete a post.
  router.delete('/delete/:id', controller.destroyOne)

  // Add routes to server.
  app.use('/api/posts', router)
}
