module.exports = (sequelize, Sequelize) => {
    const URL = sequelize.define("url", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      longUrl: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shortUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      urlCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      clicks: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: false,
      tableName: 'urls'
    });
  
    return URL;
  };