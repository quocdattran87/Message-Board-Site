const express = require("express")
const cors = require("cors")
const db = require("./src/database")

// Database will be sync'ed in the background.
db.sync()

const app = express()

// Parse requests of content-type - application/json.
app.use(express.json({limit: '50mb'}))

// Add CORS support.
app.use(cors())


// Simple Hello World route.
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" })
})

// Add user routes.
require("./src/routes/user.routes.js")(express, app)
require("./src/routes/post.routes.js")(express, app)
require("./src/routes/reply.routes.js")(express, app)
require("./src/routes/reply2.routes.js")(express, app)
require("./src/routes/follow.routes.js")(express, app)
require("./src/routes/reaction.routes.js")(express, app)
require("./src/routes/admin.routes.js")(express, app)

// Set port, listen for requests.
const PORT = 4002
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
