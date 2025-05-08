module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emailId: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subject: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    from: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    snippet: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'emails',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'emailId']
      },
      {
        fields: ['userId']
      }
    ]
  });

  return Email;
};