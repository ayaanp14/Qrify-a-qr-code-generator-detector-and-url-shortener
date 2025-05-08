module.exports = (sequelize, Sequelize) => {
    const QR = sequelize.define("qr", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        defaultValue: 200
      },
      color: {
        type: Sequelize.STRING,
        defaultValue: '#000000'
      },
      bgColor: {
        type: Sequelize.STRING,
        defaultValue: '#ffffff'
      },
      image: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: false,
      tableName: 'qrcodes'
    });
  
    return QR;
  };