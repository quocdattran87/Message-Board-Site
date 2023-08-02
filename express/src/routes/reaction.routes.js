module.exports = (express, app) => {
    const controller = require('../controllers/reaction.controller.js')
    const router = express.Router()

    // Select all reactions
    router.get('/', controller.all)

    // Create a new reaction
    router.post('/', controller.create)

    // Create a new reaction
    router.delete('/deleteAllByPost/:post_id', controller.destroyAllByPostID)
    router.delete('/deleteAllByReply/:post_id', controller.destroyAllByReplyID)
    router.delete('/deleteAllByReply2/:post_id', controller.destroyAllByReply2ID)
    router.delete('/deleteAllByUser/:user_id', controller.destroyAllByUserID)

    // Add routes to server
    app.use('/api/reactions', router)
}
  