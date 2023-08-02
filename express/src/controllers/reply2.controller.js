const db = require('../database');

// Select all posts from the database.
exports.all = async (req, res) => {
  const replies = await db.reply2.findAll({ include: db.reply })
  res.json(replies)
}

// Create a post in the database.
exports.create = async (req, res) => {
  const reply = await db.reply2.create({
    reply_id: req.body.reply_id,
    user_id: req.body.user_id,
    message: req.body.message,
    username: req.body.username,
    date: Date.now(),
    reply2Active: true
  })
  res.json(reply)
}

// Delete reply in the database.
exports.destroyOne = async (req, res) => {
  const reply = await db.reply2.destroy({ where: { id: req.params.id }})
  res.json(reply)
}
