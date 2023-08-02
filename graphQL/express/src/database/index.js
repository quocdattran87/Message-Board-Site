const { Sequelize, DataTypes } = require('sequelize')
const config = require('./config.js')

const db = {
  Op: Sequelize.Op
}

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
})

// Include models.
db.user = require('./models/user.js')(db.sequelize, DataTypes)
db.post = require('./models/post.js')(db.sequelize, DataTypes)
db.reply = require('./models/reply.js')(db.sequelize, DataTypes)
db.reply2 = require('./models/reply2.js')(db.sequelize, DataTypes)
db.follow = require('./models/follow.js')(db.sequelize, DataTypes)
db.reaction = require('./models/reaction.js')(db.sequelize, DataTypes)
db.admin = require('./models/admin.js')(db.sequelize, DataTypes)

// Relate user and post. One to Many
db.user.hasMany(db.post, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'CASCADE' })
db.post.belongsTo(db.user, { foreignKey: 'user_id', targetKey: 'id'})

// Relate user and reply. One to Many
db.user.hasMany(db.reply, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'CASCADE' })
db.reply.belongsTo(db.user, { foreignKey: 'user_id', targetKey: 'id'})
// Relate post and reply. One to Many
db.post.hasMany(db.reply, { foreignKey: 'post_id', sourceKey: 'id', onDelete: 'CASCADE' })
db.reply.belongsTo(db.post, { foreignKey: 'post_id', targetKey: 'id'})

// Relate user and reply2. One to Many
db.user.hasMany(db.reply2, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'CASCADE' })
db.reply2.belongsTo(db.user, { foreignKey: 'user_id', targetKey: 'id'})
// Relate reply and reply2. One to Many
db.reply.hasMany(db.reply2, { foreignKey: 'reply_id', sourceKey: 'id', onDelete: 'CASCADE' })
db.reply2.belongsTo(db.reply, { foreignKey: 'reply_id', targetKey: 'id'})

// Relate users follower and following. One to Many
db.user.hasMany(db.follow, { foreignKey: 'follower', sourceKey: 'id', onDelete: 'CASCADE' })
db.user.hasMany(db.follow, { foreignKey: 'following', sourceKey: 'id', onDelete: 'CASCADE' })
db.follow.belongsTo(db.user, { foreignKey: 'follower', targetKey: 'id'})
db.follow.belongsTo(db.user, { foreignKey: 'following', targetKey: 'id'})

// Relate user and posts to reactions. One to Many
db.user.hasMany(db.reaction, { foreignKey: 'user_id', sourceKey: 'id', onDelete: 'CASCADE' })
db.reaction.belongsTo(db.user, { foreignKey: 'user_id', targetKey: 'id'})

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync()

  // // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true })

  await seedData()
}

async function seedData() {
  const count = await db.user.count()

  // Only seed data if necessary.
  if(count > 0)
    return

  const argon2 = require('argon2')

  let hash = await argon2.hash('11111111', { type: argon2.argon2id })
  await db.user.create({ username: 'foffman', email: 's3827826@student.rmit.edu.au', password_hash: hash, firstName: 'Quoc', lastName: 'Tran', profilePic: null, date:'Monday, August 8, 2022', accountActive: true, visitors: 9 })
  hash = await argon2.hash('11111111', { type: argon2.argon2id })
  await db.user.create({ username: 'link', email: 'link@link.com', password_hash: hash, firstName: 'Mario', lastName: 'Luigi', profilePic: null, date: 'Monday, August 8, 2022', accountActive: true, visitors: 21 })
  hash = await argon2.hash('11111111', { type: argon2.argon2id })
  await db.user.create({ username: 'zelda', email: 'zelda@zelda.com', password_hash: hash, firstName: 'Zelda', lastName: 'Link', profilePic: null, date: 'Monday, August 8, 2022', accountActive: false, visitors: 15 })

  await db.post.create({ message: 'awesome sauce', date: '2022-09-17T07:52:39.000Z', image: null, user_id: 1, postActive: true })
  await db.post.create({ message: 'awesome sauce part 2', date: '2022-09-18T07:52:39.000Z', image: null, user_id: 2, postActive: true })
  await db.post.create({ message: 'awesome sauce part 3', date: '2022-09-18T07:52:39.000Z', image: null, user_id: 1, postActive: false })
  await db.post.create({ message: 'awesome sauce part 4', date: '2022-10-01T07:52:39.000Z', image: null, user_id: 3, postActive: true })

  await db.reply.create({ message: 'reply to awesome sauce part 3', date: '2022-09-19T07:52:39.000Z', username: 'link', user_id: 2, post_id: 3, replyActive: true })

  await db.reply2.create({ message: 'reply2 to awesome sauce part 3', date: '2022-09-19T07:52:39.000Z', username: 'link', user_id: 2, reply_id: 1, reply2Active: true })

  await db.follow.create({ follower: 1, following: 2 })
  await db.follow.create({ follower: 2, following: 1 })
  await db.follow.create({ follower: 3, following: 1 })

  await db.reaction.create({ user_id: 1, post_id: 3, post_type: "post", reaction: 1 })
  await db.reaction.create({ user_id: 1, post_id: 2, post_type: "post", reaction: 0 })

  await db.admin.create({ date: 'October 2, 2022', visitors: 217 })
  await db.admin.create({ date: 'October 1, 2022', visitors: 345 })
  await db.admin.create({ date: 'September 30, 2022', visitors: 168 })
  await db.admin.create({ date: 'September 29, 2022', visitors: 736 })
  await db.admin.create({ date: 'September 28, 2022', visitors: 943 })
  await db.admin.create({ date: 'September 27, 2022', visitors: 453 })
  await db.admin.create({ date: 'September 26, 2022', visitors: 284 })
  await db.admin.create({ date: 'September 25, 2022', visitors: 643 })
  await db.admin.create({ date: 'September 24, 2022', visitors: 642 })
  await db.admin.create({ date: 'September 23, 2022', visitors: 221 })
}

module.exports = db
