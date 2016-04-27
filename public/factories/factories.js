app.factory('CategoryFactory', function($http){
    var category = {
        getAll: function(){
            return $http.get('/api/admin/category');
        },
        getCategory: function(categoryId){
            return $http.get('/api/admin/category/' + categoryId);
        },
        createCategory: function(category){
            console.log(JSON.stringify(category));
            return $http.post('/api/admin/category', category);
        },
        updateCategory: function(category){
            return $http.put('/api/admin/category/' + category.category_id, category);
        }
    };
    return category;
});

app.factory('DepartmentFactory', function($http){
    var department = {
        getAll : function(){
            return $http.get('/api/admin/department');
        },
        getDepartment: function(departmentId){
            return $http.get('/api/admin/department/' + departmentId);
        },
        createDepartment : function(department){
            return $http.post('/api/admin/department', department);
        },
        updateDepartment: function(department){
            return $http.put('/api/admin/department/' + department.department_id, department);
        },
        deleteDepartment: function(departmentId){
            return $http.delete('/api/admin/department/' + departmentId);
        }
    };

    return department;
});

app.factory('ItemFactory', function($http){
    var item = {
        getAll: function(){
            return $http.get('/api/admin/item');
        },
        getItem: function(itemId){
            return $http.get('/api/admin/item/' + itemId);
        },
        addItem: function(item){
            return $http.post('/api/admin/item', item);
        },
        updateItem: function(item) {
            return $http.put('/api/admin/item/' + item.item_id);
        },
        deleteItem: function(itemId){
            return $http.delete('/api/admin/item/' + itemId);
        }
    };
    return item;
});