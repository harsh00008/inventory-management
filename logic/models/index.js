var mysql = require('mysql');
var Sequelize = require('sequelize');
var database = require('../db/dbconfig').database;
var db = new Sequelize(database.name, database.username,database.password, database.connection);
var Admin = require('./admin').AdminModel;
var Category = require('./category').CategoryModel;
var Department = require('./department').DepartmentModel;
var Item = require('./item').ItemModel;

Item.sync();
Department.sync();
Category.sync();
Admin.sync();


Item.belongsTo(Department, {
    foreignKey: 'department_id'
});

Item.belongsTo(Category, {
    foreignKey: 'category_id'
});



db.sync().then(function(){
    Admin.findById(1).then(function(admin){
        if(admin){
            admin.updateAttributes({
                username: 'admin',
                password: '5f4dcc3b5aa765d61d8327deb882cf99',
                email: 'admin@inventory.com'
            })
        }else{
            Admin.create({
                user_id: 1,
                username: 'admin',
                password: '5f4dcc3b5aa765d61d8327deb882cf99',
                email : 'admin@inventory.com'
            });
        }
    });

    Category.findById(1).then(function(category){
        if(category){
            category.updateAttributes({
                category_name: 'Default Category'
            });
        }else{
            Category.create({
                category_id: 1,
                category_name: 'Default Category'
            });
        }
    });

    Department.findById(1).then(function(department){
        if(department){
            department.updateAttributes({
                name: 'Default Department',
                username: 'default-department',
                phone: '000-000-0000',
                password: '5f4dcc3b5aa765d61d8327deb882cf99',
                manager: 'No Manager',
                location: 'No location',
                email: 'default@inventory.com'
            });
        }else{
            Department.create({
                department_id: 1,
                name: 'Default Department',
                username: 'default-department',
                phone: '000-000-0000',
                password: '5f4dcc3b5aa765d61d8327deb882cf99',
                manager: 'No Manager',
                location: 'No location',
                email: 'default@inventory.com'
            });
        }
    });
});

module.exports = {
    getAdminModel : function(){
        return Admin;
    },
    getCategoryModel : function(){
        return Category;
    },
    getDepartmentModel : function(){
        return Department;
    },
    getItemModel: function(){
        return Item;
    }
};