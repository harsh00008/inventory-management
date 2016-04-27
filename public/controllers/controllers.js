app.controller('homeCtrl', function($scope, AdminAuthFactory, $window, $state){
    $scope.message = "Hello world";
    $scope.error = null;
    $scope.loginAdmin = function(admin){
        if(admin.username && admin.password){
            AdminAuthFactory.login(admin).then(function(response){
                console.log(response);
                $window.localStorage.user = response.data.user;
                $window.localStorage.token= response.data.token;
                $window.localStorage.user_role = response.data.user_role;
                $state.go('admin');
            }, function(error){
                $scope.error = error.data.error;
            });
        }else{
            $scope.error = "Please enter username and password";
        }
    };
});




app.controller('adminDashboardCtrl', function($scope, $state){
    $scope.message = 'Dashboard admin';
});


app.controller('allCategoryCtrl', function($scope, CategoryFactory){
    $scope.error = null;
    $scope.categories = [];

    CategoryFactory.getAll().then(function(response){
        $scope.categories = response.data;
    }, function(error){
        $scope.error = error.data.error;
    });
    
    $scope.remove = function(categoryId){
        console.log(categoryId);
    };
});

app.controller('editCategoryCtrl', function($scope, CategoryFactory, $state, $stateParams){
    $scope.message = null;
    $scope.error = null;
    $scope.category = {};
    var categoryId = $stateParams.id;
    CategoryFactory.getCategory(categoryId).then(function(response){
        $scope.category = response.data;
    },function(error){
        $scope.error = error.data.error;
    });

    $scope.updateCategory = function(){
        var category = $scope.category;
        CategoryFactory.updateCategory(category).then(function(response){
            $scope.message = response.data.message;
        },function(error){
            $scope.error = error.data.error;
        });
    };
});

app.controller('addCategoryCtrl', function($scope, $location, CategoryFactory){
    $scope.error = null;
    $scope.category = {};
    $scope.addCategory = function(){
        var category = $scope.category;
        console.log(category.category_name);
        if(category.category_name){
            CategoryFactory.createCategory(category).then(function(response){
                var categoryId = response.data.id;
                $location.path('/category/edit/' + categoryId);
            }, function(error){
                console.log(error);
                $scope.error = error.data.error;
            });
        }else{
            $scope.error = "Please enter category name";
        }
    };

});


app.controller('allDeptCtrl', function($scope, DepartmentFactory){
    $scope.error = null;
    $scope.departments = [];

    $scope.remove = function(departmentId){
        DepartmentFactory.deleteDepartment(departmentId).then(function(response){
            DepartmentFactory.getAll().then(function(response){
                $scope.departments = response.data;
            },function(error){
                $scope.error = error.data.error;
            });
        }, function(error){
            console.log(error);
            $scope.error = error.data.error
        });
    };

    $scope.refreshDepartments = function(){
        DepartmentFactory.getAll().then(function(response){
            $scope.departments = response.data;
        },function(error){
            $scope.error = error.data.error;
        });
    };

    $scope.refreshDepartments();
});

app.controller('addDeptCtrl', function($scope, DepartmentFactory){
    $scope.error = null;
    $scope.department = {};
    $scope.addDepartment = function(){
        var department = $scope.department;
        if(department.password !== department.repassword){
            $scope.error = "Passwords do not match";
        }else{
            delete department.repassword;
            DepartmentFactory.createDepartment(department).then(function(response){
                console.log(response);
            }, function(error){
                console.log(error);
                $scope.error = error.data.error;
            });
        }
    };
});


app.controller('logoutCtrl', function($state, $window){
    delete $window.localStorage.user;
    delete $window.localStorage.token;
    delete $window.localStorage.user_role;
    $state.go('login');
});

app.controller('allItemCtrl', function($scope, ItemFactory, DTOptionsBuilder, DTColumnBuilder){
    $scope.error = null;
    $scope.items = [];
    ItemFactory.getAll().then(function(response){
        console.log(response);
        $scope.items = response.data;
    });
});

app.controller('addItemCtrl', function($scope, ItemFactory, CategoryFactory, DepartmentFactory){
    $scope.item = {
        tag_id: 0,
        unit_cost: 0.0,
        purchase_date: null,
        disposed: 0,
        disposal_date: null,
        quantity: 0,
        department_id : 1,
        category_id : 1
    };
    $scope.format = 'dd.MM.yyyy';

    $scope.popup2 = {
        opened: false
    };

    $scope.popup1 = {
        opened: false
    };
    $scope.categories = [];
    $scope.departments = [];

    $scope.addItem = function(){
        console.log('adding items...');
        var item = $scope.item;
        item.category_id = item.category.category_id;
        delete item.category;
        item.department_id = item.department.department_id;
        delete item.department;
        ItemFactory.addItem(item).then(function(response){
            console.log(response);
        }, function(error){
            console.log(error);
            $scope.error = error.data.error;
        });
    };



    CategoryFactory.getAll().then(function(response){
        $scope.categories = response.data;
        $scope.item.category = response.data[0];
    }, function(error){
        console.log(error);
    });

    DepartmentFactory.getAll().then(function(response){
       $scope.departments = response.data;
        $scope.item.department = response.data[0];
    }, function(error){
        console.log(error);
    });



    $scope.clear = function() {
        $scope.item.purchase_date = null;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        startingDay: 1
    };


    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.item.purchase_date = new Date(year, month, day);
    };

});