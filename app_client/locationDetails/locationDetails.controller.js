(function () {
    angular.module('loc8rApp').controller('locationDetailsCtrl', locationDetailsCtrl);

    locationDetailsCtrl.$inject = ['$routeParams', 'loc8rData'];
    function locationDetailsCtrl($routeParams, loc8rData) {
        var vm = this;
        vm.locationid = $routeParams.locationid;

        loc8rData.locationById(vm.locationid)
            .success(function (data) {
                vm.data = {
                    location: data
                };
                vm.pageHeader = {
                    title: vm.data.location.name
                }
            })
            .error(function (e) {
                console.log(e);
            });
    }
})();