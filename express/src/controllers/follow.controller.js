const db = require('../database');

// Select all posts from the database.
exports.all = async (req, res) => {
  const follows = await db.follow.findAll()
  res.json(follows)
}

// Create a post in the database.
exports.create = async (req, res) => {
  const follows = await db.follow.create({
    follower: req.body.follower,
    following: req.body.following
  })
  res.json(follows)
}

// Delete reply in the database.
exports.destroyOne = async (req, res) => {
  const follows = await db.follow.destroy({ 
    where: { 
      follower: req.params.follower,
      following: req.params.following
    }})
  res.json(follows)
}
