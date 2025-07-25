module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'name' column
    await queryInterface.removeColumn('Users', 'name');
    // Alter 'firstName' and 'lastName' to NOT NULL
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('Users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add the 'name' column back (nullable)
    await queryInterface.addColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Revert 'firstName' and 'lastName' to allow null
    await queryInterface.changeColumn('Users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('Users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
