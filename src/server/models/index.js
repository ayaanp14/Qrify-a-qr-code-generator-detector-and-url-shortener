const dbConfig = require("../config/database.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.qr = require("./qr.model.js")(sequelize, Sequelize);
db.url = require("./url.model.js")(sequelize, Sequelize);
db.ShortenedUrl = require("./url.model.js")(sequelize, Sequelize);

module.exports = db;