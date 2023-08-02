const db = require('../database');
const argon2 = require('argon2');

// Select all users from the database.
exports.all = async (req, res) => {
  const users = await db.admin.findAll()
  res.json(users)
}

exports.incrementSiteVisit = async (req, res) => {
  const visits = await db.admin.findByPk(req.params.date)
  if (visits === null) {
    // Create a new entry for a new day
    const visits = await db.admin.create({
      date: req.params.date,
      visitors: 1
    })
    res.json(visits)
  } else {
    // Update existing date entry
    visits.visitors += 1
    await visits.save()
    res.json(visits)
  }
}
