app.factory('AuthenticationFactory', function($window, jwtHelper){
    var auth = {
        isLogged: false,
        check: function () {
            var token = $window.localStorage.token;
            try{
                if(!jwtHelper.isTokenExpired(token)){
                    var decodedToken = jwtHelper.decodeToken(token);
                    console.log(decodedToken);
                    if (decodedToken.email === $window.localStorage.user && decodedToken.user_role === $window.localStorage.user_role) {
                        this.isLogged = true;
                    } else {
                        this.isLogged = false;
                    }
                }else{
                    this.isLogged = false;
                }
            }catch(err){
                this.isLogged= false;
            }
        }
    };

    return auth;
});


app.factory('AdminAuthFactory', function($http, $window, $location, AuthenticationFactory, md5){
    var admin = {
        login : function(admin){
            var adminObj = admin;
            adminObj.password = md5.createHash(admin.password);
            return $http.post('/api/admin/login', adminObj);
        },
        logout: function(){
            AuthenticationFactory.isLogged = false;
            $location.path('/');
        }

    };
    return admin;
});

app.factory('TokenInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.localStorage.token) {
                config.headers['x-token'] = $window.localStorage.token;
                config.headers['x-key'] = $window.localStorage.user;
                config.headers['x-role'] = $window.localStorage.user_role;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },

        response: function (response) {
            return response || $q.when(response);
        }
    };
});

