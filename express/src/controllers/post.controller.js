const db = require('../database');

// Select all posts from the database.
exports.all = async (req, res) => {
  const posts = await db.post.findAll({ include: [{model: db.user}, {model: db.reply, include: [{model: db.reply2 }]}], order: [['id', 'DESC']]})
  res.json(posts)
}

// Select posts for a specific user. Include any replies and replys
exports.one = async (req, res) => {
  let temp = {}
  await db.user.findOne({ where: { id: req.params.id } }).
    then( user => { temp.user = user})
  await db.post.findAll({where: {'user_id' : req.params.id }, order: [['id', 'DESC']]}).
    then( posts => { temp.posts = posts})
  await db.reply.findAll({where: {'user_id' : req.params.id }, order: [['id', 'DESC']]}).
    then( replies => { temp.replies = replies})
  await db.reply2.findAll({where: {'user_id' : req.params.id }, order: [['id', 'DESC']]}).
    then( replies2 => { temp.replies2 = replies2})
  res.json(temp)
}

// Create a post in the database.
exports.create = async (req, res) => {
  const post = await db.post.create({
    message: req.body.message,
    date: Date.now(),
    image: req.body.image,
    user_id: req.body.user_id,
    postActive: true
  })
  res.json(post)
}

// Edit a post in the database.
exports.edit = async (req, res) => {
  const post = await db.post.findByPk(req.params.id)
  post.message = req.body.message
  post.image = req.body.image
  await post.save()
  res.json(post)
}

// Delete post in the database.
exports.destroyOne = async (req, res) => {
  // CASCADE delete will remove all children
  const post = await db.post.destroy({ where: { id: req.params.id }})
  res.json(post)
}
