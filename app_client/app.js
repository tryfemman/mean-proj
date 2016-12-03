(function () {
    angular.module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

    var config = function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationid', {
                templateUrl: '/locationDetails/locationDetails.view.html',
                controller: 'locationDetailsCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: '/auth/register/register.view.html',
                controller: 'registerCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: '/auth/login/login.view.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);
    };

    angular.module('loc8rApp').config(['$routeProvider', '$locationProvider', config]);
})();