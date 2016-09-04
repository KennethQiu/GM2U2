'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     queryInterface.createTable(
    'playlists',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        //Todo use it to save a array of widgets
        ///timeWidget.findAll().then(function(array){console.log(array[0].$modelOptions.name.singular)});
        // > a
        // [ { id: 1, model: 'timeWidget' },
        //   { id: 1, model: 'weatherWidget' } ]
        // > var myJsonString = JSON.stringify(a);
        widgets:{
          type: Sequelize.JSON,
        },
        //foreign key usage
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'cascade',
            onDelete: 'cascade'
        }
      },
      {
        engine: 'MYISAM',                     // default: 'InnoDB'
        charset: 'latin1',                    // default: null
        schema: 'public'                      // default: public, PostgreSQL only.
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    
      // Add reverting commands here.
      // Return a promise to correctly handle asynchronicity.

      // Example:
      return queryInterface.dropTable('playlists');
    
  }
};
