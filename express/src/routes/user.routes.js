module.exports = (express, app) => {
  const controller = require('../controllers/user.controller.js')
  const router = express.Router()

  // Select all users.
  router.get('/', controller.all)


  router.get('/select_id/:id', controller.one)
  // Select a single user by username
  router.get('/select_username/:username', controller.username)
  // Select a single user by email.
  router.get('/select_email/:email', controller.email)

  // Select one user from the database if username and password are a match.
  router.get('/login', controller.login)

  // Create a new user.
  router.post('/', controller.create)

  // Edit a user.
  router.put('/:id', controller.edit)
  router.put('/2fa/:id', controller.twoFactorAuthentication)
  router.put('/visit/:id', controller.incrementProfileVisit)

  // Delete a post.
  router.delete('/delete/:id', controller.destroyOne)

  // Add routes to server.
  app.use('/api/users', router)
}
