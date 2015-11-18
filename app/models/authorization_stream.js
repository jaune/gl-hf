"use strict";

module.exports = function(sequelize, DataTypes) {
 
  var AuthorizationStream = sequelize.define('AuthorizationStream', {
    provider_id: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        AuthorizationStream.belongsTo(models.Account, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return AuthorizationStream;
};