(function () {
    angular.module('loc8rApp', ['ngRoute']);

    var config = function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: '/home/home.view.html',
            controller: 'homeCtrl',
            controllerAs: 'vm'
        }).otherwise({redirectTo: '/'});
    };

    angular.module('loc8rApp').config(['$routeProvider', config]);
})();