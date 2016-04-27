var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var db = require('./logic/models/index');
var jwtService = require('./logic/jwt/jwt');
var jwt = require('jsonwebtoken');
var secret = require('./logic/jwt/secret').secret;

// MODELS
var adminModel = db.getAdminModel();
var categoryModel = db.getCategoryModel();
var departmentModel = db.getDepartmentModel();
var itemModel = db.getItemModel();

var app = express();
var port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(bodyParser.json());


//use this directory for angular
app.use(express.static(__dirname + '/public'));


app.get('/api/test', function(req,res){
    res.send({"message" : "api online"});
});

app.post('/api/admin/login', function(req, res){
    res.setHeader('Content-Type','application/json');
    var username = req.body.username;
    var password = req.body.password;

    if(username && password){
        adminModel.findOne({
            where: {
                username: username,
                password: password
            }
        }).then(function(user){
            if(user){
                return user;
            }else{
                res.status(400).send({error: "Invalid login"});
            }

        }).then(function(user){
            if(!user.token){
                token = jwt.sign({ id: user.user_id, username: user.username, email: user.email, user_role: 'admin' },secret,{expiresIn: '2 days'});
                user.updateAttributes({
                    token: token
                });
                res.status(200).send({token: token, user_role: 'admin', user: user.email, user_role: 'admin' });
            }else{
                res.status(200).send({token: user.token, user_role: 'admin', user: user.email, user_role: 'admin' });
            }
        })
            .catch(function(error){
                console.log(error);
            });
    }else{
        res.status(400).send({error : "Invalid request"});
    }

});

app.post('/api/admin/category', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    var categoryName = req.body.category_name;
    if(categoryName && categoryName !== ''){
        categoryModel.create({
            category_name : categoryName
        }).then(function(category){
            res.status(200).send({message: "Created category", id: category.category_id});
        });
    }else{
        res.status(400).send({error: 'No category name provided'});
    }

});

app.put('/api/admin/category/:id', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }
    var categoryId = parseInt(req.params.id);
    var categoryName = req.body.category_name;


    if(categoryName && !isNaN(categoryId)){
        categoryModel.findOne({
            where: {
                category_id : categoryId
            }
        }).then(function(category){
            if(category){
                category.update({
                    category_name : categoryName
                }).then(function(category){
                    if(category){
                        return res.status(200).send({message: "Category updated"});
                    }
                });
            }else{
                res.status(400).send({error : "The category you are trying to update does not exists."});
            }
        });
    }else{
        res.status(400).send({error: 'Invalid category. Please check category name'});
    }
});

app.get('/api/admin/category/:id', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    var categoryId = parseInt(req.params.id);
    if(categoryId && !isNaN(categoryId)){
        categoryModel.findOne({
            where: {
                category_id: categoryId
            }
        }).then(function(category){
            if(category){
                res.send(category);
            }else{
                res.status(400).send({error: "Category does not exists"});
            }
        });
    }else{
        res.status(400).send({error: "Invalid category"});
    }

});

app.get('/api/admin/category', function(req, res){
    var token = req.headers['x-token'];
    var email = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    categoryModel.findAll().then(function(categories){
        res.send(categories);
    });
});


app.post('/api/admin/department', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }
    var department = {
        name: req.body.name,
        username : req.body.username,
        password: req.body.password,
        location: req.body.location,
        phone: req.body.phone,
        email : req.body.email
    };
    if(department.name && department.username && department.password){
        departmentModel.create(department).then(function(department){
            if(department){
                res.send({message: 'Department created'});
            }else{
                res.status(400).send({error: 'Could not create department'});
            }
        });
    }else{
        res.status(400).send({error: "Department name, username and password are required fields. Please check the inputs."});
    }

});

app.get('/api/admin/department/:id', function (req, res) {
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    var departmentId = parseInt(req.params.id);

    if(departmentId && !isNaN(departmentId)){
        departmentModel.findOne({
            where: {
                department_id: departmentId
            }
        }).then(function(department){
            if(department){
                var deptObj = {
                    department_id: department.department_id,
                    department_name: department.name,
                    department_phone : department.phone,
                    department_location: department.location,
                    department_username : department.username
                };
                res.status(200).send(deptObj);
            }else{
                res.status(400).send({error: "Department not found"});
            }
        });
    }else{
        res.status(400).send({error: "Invalid department id"});
    }

});

app.put('/api/admin/department/:id', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    var departmentId = parseInt(req.params['id']);
    if(departmentId && !isNaN(departmentId)){
        departmentModel.findOne({
            where: {
                department_id: departmentId
            }
        }).then(function(department){
            if(department){
                department.updateAttributes(req.body).then(function(department){
                    if(department){
                        res.status(200).send({message: "Departmen updated"});
                    }else{
                        res.status(200).send({message: "Could not update department. Please check fields"});
                    }
                });
                res.status(200).send({message: "Department updated"});
            }else{
                res.status(400).send({error: "Department not found"});
            }
        });
    }else{
        res.status(400).send({error: "Department not found"});
    }

});

app.get('/api/admin/department', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    departmentModel.findAll({
        attributes: ['name', 'department_id', 'manager', 'phone', 'username']

    }).then(function(departments){
        res.status(200).send(departments);
    }).catch(function(exception){
        console.log(exception);
        res.end();
    });
});

app.post('/api/admin/item', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }
    console.log(req.body);
    var departmentId = req.body.department_id;
    var categoryId = req.body.category_id;
    
    departmentModel.findOne({
        where: {
            department_id: departmentId
        }
    }).then(function(department){
        if(department){
            return department;
        }else{
            res.status(400).send({error : "Could not find the department you requested"});
        }
    }).then(function(department){
        categoryModel.findOne({
            where:{
                category_id: categoryId
            }
        }).then(function(category){
            if(category){
                return category;
            }else{
                res.status(400).send({error: "Could not find the category you requested"});
            }
        }).then(function(category){
            console.log(req.body.unit_cost);
            if(req.body.tag_id!== null && req.body.name !== null && req.body.quantity!== null && req.body.unit_cost !== null){
                itemModel.findOne({
                    where: {
                        tag_id: req.body.tag_id
                    }
                }).then(function(item){
                    if(item){
                        res.status(400).send({error : "Item with the tag id " + req.body.tag_id +" already exists!"})
                    }else{
                        var itemObj = {
                            tag_id: req.body.tag_id,
                            name: req.body.name,
                            description : req.body.description,
                            quantity: req.body.quantity,
                            purchase_date: req.body.purchase_date,
                            unit_cost: req.body.unit_cost,
                            disposed: req.body.disposed,
                            disposal_date: req.body.disposal_date
                        };

                        itemModel.create(itemObj).then(function(item){
                            if(item){
                                res.status(200).send({message: "Item created"});
                            }else{
                                res.status(400).send({error: "Some problem"});
                            }
                        });
                    }
                });
            }else{
                res.status(400).send({error: "tag id, quantity, unit cost and name are required"});
            }
        });
    });
});


app.delete('/api/admin/department/:id', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    var departmentId = req.params.id;
    console.log(departmentId);
    if(departmentId == 1){
        res.status(400).send({error : "Cannot delete default department"});
    }else{
        departmentModel.findOne({
            where: {
                department_id: departmentId
            }
        }).then(function(department){
            if(department){
                department.destroy();
                itemModel.findAll({
                    where: {
                        department_id: departmentId
                    }
                }).then(function(items){

                    var counter = 0;
                    items.forEach(function(item, index){
                        item.updateAttributes({
                            department_id: 1
                        });
                        counter++;
                        if(counter === items.length){
                            res.status(200).send({message: 'department deleted '});
                        }
                    });

                });
            }else{
                res.status(400).send({error : "Could not find department"});
            }
        });
    }




});

app.get('/api/admin/item/:id', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    var itemId = parseInt(req.params.id);
    if(itemId && !isNaN(itemId)){
        itemModel.findByPrimary(itemId, {include: [
            { model: departmentModel, attributes: [ "department_id","name"] },
            { model: categoryModel, attributes: ["category_name"]}
        ]}).then(function(item){
            if(item){
                res.send(item);
            }else{
                res.status(400).send({error: "Could not find the item"});
            }
        });
    }else{
        res.status(400).send({error: "Invalid item id"});
    }

});


app.get('/api/admin/item', function(req, res){
    var token = req.headers['x-token'];
    var decodedToken = jwtService.validateAdmin(token);
    if(!decodedToken){
        res.status(401).send({error: 'Invalid login'});
    }

    itemModel.findAll({
        include: [
            { model: departmentModel, attributes: [ "department_id","name"] },
            { model: categoryModel, attributes: ["category_name"]}
        ]
    }).then(function(items){
        if(items){
            res.send(items);
        }else{
            res.status(400).send({error: "Some problem getting all items"});
        }
    });

});

app.listen(port, function(){
    console.log('Server started on port ' + port);
});