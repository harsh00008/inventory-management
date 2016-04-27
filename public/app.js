var app = angular.module('inventory', ['ui.router', 'angular-md5', 'angular-jwt','datatables', 'ui.bootstrap']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider){
    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('TokenInterceptor');
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'partials/home/home.html',
            controller: 'homeCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'partials/home/about.html'
        })
        .state('login', {
            url: '/login',
            template : 'Please login to continue',

        })
        .state('logout',{
            url: '/logout',
            controller: 'logoutCtrl'
        })
        .state('admin',{
            url: '/dashboard',
            templateUrl: 'partials/dashboard/admin/dashboard.html',
            controller: 'adminDashboardCtrl',
            private: true,
            admin: true
        })
        .state('category',{
            url: '/category',
            templateUrl : 'partials/dashboard/admin/category/all.category.html',
            controller: 'allCategoryCtrl',
            private: true,
            admin: true
        })
        .state('category.add',{
            url: '/add',
            templateUrl: 'partials/dashboard/admin/category/add.category.html',
            controller: 'addCategoryCtrl',
            private: true,
            admin: true
        })
        .state('category.edit', {
            url: '/edit/:id',
            templateUrl: 'partials/dashboard/admin/category/edit.category.html',
            controller: 'editCategoryCtrl',
            private: true,
            admin: true
        })
        .state('department', {
            url: '/department',
            templateUrl: 'partials/dashboard/admin/department/all.dept.html',
            controller: 'allDeptCtrl',
            private : true,
            admin: true
        })
        .state('department.add',{
            url: '/add',
            templateUrl: 'partials/dashboard/admin/department/add.dept.html',
            controller: 'addDeptCtrl',
            private : true,
            admin: true
        })
        .state('item',{
            url: '/item',
            templateUrl: 'partials/dashboard/admin/item/all.item.html',
            controller: 'allItemCtrl',
            private : true,
            admin: true
        })
        .state('item.add', {
            url: '/add',
            templateUrl: 'partials/dashboard/admin/item/add.item.html',
            controller: 'addItemCtrl',
            private: true,
            admin: true
        })
    ;
});

app.run(function ($rootScope, $window, $location, AuthenticationFactory) {

    $rootScope.$on('$stateChangeStart', function (event, nextRoute) {
        if(nextRoute.private && nextRoute.admin){
            AuthenticationFactory.check();
            if(!AuthenticationFactory.isLogged){
                event.preventDefault();
                $rootScope.$evalAsync(function () {
                    $location.url('/login');
                });

            }
        }else if(nextRoute.private && !nextRoute.admin){
            AuthenticationFactory.check();
            if(!AuthenticationFactory.isLogged){
                event.preventDefault();
                $rootScope.$evalAsync(function () {
                    $location.url('/login');
                });
            }
        }
    });


});
