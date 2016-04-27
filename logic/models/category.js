var mysql = require('mysql');
var Sequelize = require('sequelize');
var database = require('../db/dbconfig').database;
var db = new Sequelize(database.name, database.username,database.password, database.connection);

var Category = db.define('category', {
    category_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_name:{
        type: Sequelize.STRING
    }
});


module.exports = {
    CategoryModel: Category
};