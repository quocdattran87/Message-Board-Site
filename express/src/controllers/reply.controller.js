const db = require('../database');

// Select all posts from the database.
exports.all = async (req, res) => {
  const replies = await db.reply.findAll({ include: db.post })
  res.json(replies)
}

// Create a post in the database.
exports.create = async (req, res) => {
  const reply = await db.reply.create({
    post_id: req.body.post_id,
    user_id: req.body.user_id,
    message: req.body.message,
    username: req.body.username,
    date: Date.now(),
    replyActive: true
  })
  res.json(reply)
}

// Delete reply in the database.
exports.destroyOne = async (req, res) => {
  // CASCADE delete will remove all children
  const reply = await db.reply.destroy({ where: { id: req.params.id }})
  res.json(reply)
}
