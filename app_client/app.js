(function () {
    angular.module('loc8rApp', ['ngRoute', 'ngSanitize']);

    var config = function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            }).otherwise({redirectTo: '/'})
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationid', {
                templateUrl: '/locationDetails/locationDetails.view.html',
                controller: 'locationDetailsCtrl',
                controllerAs: 'vm'
            });

        $locationProvider.html5Mode(true);
    };

    angular.module('loc8rApp').config(['$routeProvider', '$locationProvider', config]);
})();