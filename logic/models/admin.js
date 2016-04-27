var mysql = require('mysql');
var Sequelize = require('sequelize');
var database = require('../db/dbconfig').database;
var db = new Sequelize(database.name, database.username,database.password, database.connection);

var Admin = db.define('admin',{
    user_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    email:{
        type: Sequelize.STRING,
        unique: true
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    token:{
        type: Sequelize.STRING
    }
});

module.exports = {
    AdminModel : Admin
};