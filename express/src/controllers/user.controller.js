const db = require('../database');
const argon2 = require('argon2');

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.user.findAll()
  res.json(users)
}


// Select one user from the database.
exports.one = async (req, res) => {
  const user = await db.user.findOne({ where: { id: req.params.id } })
  let temp = user.dataValues
  await db.follow.findAll({where: {'follower' : user.id }, include: db.user }).
    then(following=> {
      temp.following = following})
  await db.follow.findAll({where: {'following' : user.id }}).
    then(followers=> {
      temp.followers = followers})
  res.json(user)
}

// Select one user from the database.
exports.username = async (req, res) => {
  const user = await db.user.findOne({ where: { username: req.params.username } })
  res.json(user)
}

// Select one user from the database.
exports.email = async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.params.email } })
  res.json(user)
}

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
  const user = await db.user.findOne({ where: { email: req.query.email } })  
  let temp = {}
  if(user === null || await argon2.verify(user.password_hash, req.query.password) === false) {
    // Login failed.
    res.json(null)}
  else {
    temp = user.dataValues
    await db.follow.findAll({where: {'follower' : user.id }, include: db.user }).
      then(following=> {
        temp.following = following})
    await db.follow.findAll({where: {'following' : user.id }}).
      then(followers=> {
        temp.followers = followers})
    res.json(temp) }
}

// Create a user in the database.
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id })
  const user = await db.user.create({
    username: req.body.username,
    email: req.body.email,
    password_hash: hash,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    date: req.body.date,
    profilePic: null,
    accountActive: true,
    visitors: 0
  })
  res.json(user)
}

// Edit a user in the database.
exports.edit = async (req, res) => {
  const user = await db.user.findByPk(req.params.id)

  // Update username in any existing replies
  await db.reply2.findAll({
    where: { username: user.username } 
  }).then(result => {
      result.map(reply => {
          reply.username = req.body.username
          reply.save()
      })
  })
  await db.reply.findAll({
    where: { username: user.username } 
  }).then(result => {
      result.map(reply => {
          reply.username = req.body.username
          reply.save()
      })
  })
  // Update user
  user.username = req.body.username
  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.email = req.body.email
  user.profilePic = req.body.profilePic
  await user.save()
  res.json(user)
}

exports.twoFactorAuthentication = async (req, res) => {
  const user = await db.user.findByPk(req.params.id)
  user.twoFactorAuthentication = req.body.twoFactorAuthentication
  await user.save()
  res.json(user)
}

// Delete post in the database.
exports.destroyOne = async (req, res) => {
  // CASCADE delete will remove all children
  const user = await db.user.destroy({ where: { id: req.params.id }})
  res.json(user)
}

exports.incrementProfileVisit = async (req, res) => {
  const user = await db.user.findByPk(req.params.id)
  user.visitors += 1
  await user.save()
  res.json(user)
}
