module.exports = (express, app) => {
  const controller = require('../controllers/admin.controller.js')
  const router = express.Router()

  // Select all users.
  router.get('/', controller.all)

  router.put('/visit/:date', controller.incrementSiteVisit)

  // Add routes to server.
  app.use('/api/admin', router)
}
