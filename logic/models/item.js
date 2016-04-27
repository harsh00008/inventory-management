var mysql = require('mysql');
var Sequelize = require('sequelize');
var database = require('../db/dbconfig').database;
var db = new Sequelize(database.name, database.username,database.password, database.connection);

var Item = db.define('item',{
    item_id: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    tag_id:{
        type: Sequelize.INTEGER,
        unique: true
    },
    name:{
        type: Sequelize.STRING
    },
    description:{
        type: Sequelize.TEXT
    },
    unit_cost:{
        type: Sequelize.DOUBLE,
        defaultValue: 0
    },
    serial: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    purchase_date: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    disposed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    disposal_date: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    approved:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    other_information: {
        type: Sequelize.TEXT
    }
});


module.exports = {
    ItemModel: Item
};