var database = {
  name: 'inventory',
  username: 'root',
  password: '',
  connection: {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
          max: 5,
          min: 0,
          idle: 1000
      }
    }
};

module.exports.database = database;