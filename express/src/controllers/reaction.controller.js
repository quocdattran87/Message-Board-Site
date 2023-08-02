const db = require('../database');

// Select all posts from the database.
exports.all = async (req, res) => {
  const reactions = await db.reaction.findAll()
  res.json(reactions)
}

// Create a reaction in the database.
exports.create = async (req, res) => {
  const reaction =  await db.reaction.findOne({where: {'user_id': req.body.user_id, 'post_id': req.body.post_id, "post_type": req.body.post_type }})
    // Create new reaction is one doesn't exist
    if (reaction === null) {

        const reactions = await db.reaction.create({
          user_id: req.body.user_id,
          post_id: req.body.post_id,
          post_type: req.body.post_type,
          reaction: req.body.reaction
        })
        res.json(reactions)
    } 
    // If reaction exists and is different, update it
    else if (reaction !== null && req.body.reaction !== reaction.dataValues.reaction) {
      reaction.reaction = req.body.reaction
      await reaction.save()
      res.json(reaction)
    }
    // Do nothing if reaction exists andf is the same
    else {
      res.json(null)
    }
}

// Delete reaction by reply id in the database.
exports.destroyAllByPostID = async (req, res) => {
  const reaction = await db.reaction.destroy({ where: { 'post_id': req.params.post_id, 'post_type': 'post' }})
  res.json(reaction)
}

// Delete reaction by reply id in the database.
exports.destroyAllByReplyID = async (req, res) => {
  const reaction = await db.reaction.destroy({ where: { 'post_id': req.params.post_id, 'post_type': 'reply' }})
  res.json(reaction)
}

exports.destroyAllByReply2ID = async (req, res) => {
  console.log("REGERWGESRGREG\n\n\n")
  const reaction = await db.reaction.destroy({ where: { 'post_id': req.params.post_id, 'post_type': 'reply2' }})
  res.json(reaction)
}

// Delete reply in the database.
exports.destroyAllByUserID = async (req, res) => {
  // CASCADE delete will remove all children
  const reaction = await db.reaction.destroy({ where: { 'user_id': req.params.user_id, 'post_type': 'reply' }})
  res.json(reaction)
}
