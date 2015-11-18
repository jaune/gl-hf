"use strict";

module.exports = function(sequelize, DataTypes) {
 
  var AuthorizationTwitch = sequelize.define('AuthorizationTwitch', {
    username: DataTypes.STRING,
    provider_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        AuthorizationTwitch.belongsTo(models.Account, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return AuthorizationTwitch;
};