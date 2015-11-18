"use strict";

module.exports = function(sequelize, DataTypes) {
 
  var Account = sequelize.define('Account', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    displayName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Account.hasMany(models.AuthorizationStream);
        Account.hasMany(models.AuthorizationTwitch);
      }
    }
  });

  return Account;
};
