module.exports = (express, app) => {
    const controller = require('../controllers/reply2.controller.js')
    const router = express.Router()

    // Select all replies
    router.get('/', controller.all)

    // Create a new reply
    router.post('/', controller.create)

    // Delete a reply
    router.delete('/delete/:id', controller.destroyOne)

    // Add routes to server
    app.use('/api/replies2', router)
}
  