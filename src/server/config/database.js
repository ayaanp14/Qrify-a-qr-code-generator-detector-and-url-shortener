const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

const dbConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "ayaan",
  DB: "qrcode",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  logging: false // Disable logging or set to console.log for debugging
});

// Create raw MySQL connection pool
const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  waitForConnections: true,
  connectionLimit: dbConfig.pool.max,
  queueLimit: 0
});

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
    
    const connection = await pool.getConnection();
    console.log('Raw MySQL connection established successfully.');
    connection.release();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = {
  sequelize,
  pool,
  query: async (sql, params) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  }
};