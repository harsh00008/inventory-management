var jwt = require('jsonwebtoken');
var secret = require('./secret').secret;
var db = require('../models/index');
var adminModel = db.getAdminModel();

module.exports = {
    validateJWT: function(token){
        var decoded;
        try{
            decoded = jwt.verify(token, secret);
        }catch(err){
            decoded = null;
        }
        return decoded;
    },
    validateAdmin: function(token){
        var decoded;
        var email;
        var username;
        try{
            decoded = jwt.verify(token, secret);
            email = decoded['email'];
            username = decoded['username'];
            if(email && username){
                adminModel.findOne({
                    where: {
                        email: email,
                        username: username
                    }
                }).then(function(admin){

                    if(!admin) {
                        decoded = null;
                    }
                });
            }else{
                decoded = null;
            }
        }catch(err){
            return null;
        }
        return decoded;

    }
};