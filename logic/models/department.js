var mysql = require('mysql');
var Sequelize = require('sequelize');
var database = require('../db/dbconfig').database;
var db = new Sequelize(database.name, database.username,database.password, database.connection);


var Department = db.define('department', {
    department_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    manager:{
        type: Sequelize.STRING
    },
    location: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    token:{
        type: Sequelize.STRING
    }
});

module.exports = {
    DepartmentModel: Department
};