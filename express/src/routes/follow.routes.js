module.exports = (express, app) => {
    const controller = require('../controllers/follow.controller.js')
    const router = express.Router()

    // Select all replies
    router.get('/', controller.all)

    // Create a new reply
    router.post('/', controller.create)

    // Delete a follow relation
    router.delete('/delete/:follower:following', controller.destroyOne)

    // Add routes to server
    app.use('/api/follows', router)
}
  