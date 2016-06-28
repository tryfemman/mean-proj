(function () {
    angular.module('loc8rApp').controller('locationDetailsCtrl', locationDetailsCtrl);

    locationDetailsCtrl.$inject = ['$routeParams', '$uibModal', 'loc8rData'];
    function locationDetailsCtrl($routeParams, $uibModal, loc8rData) {
        var vm = this;
        vm.locationid = $routeParams.locationid;

        vm.popupReviewForm = function () {
            var modalInstance = $uibModal.open(
                {
                    templateUrl: '/reviewModal/reviewModal.view.html',
                    controller: 'reviewModalCtrl as vm',
                    resolve: {
                        locationData: function () {
                            return {
                                locationid: vm.locationid,
                                locationName: vm.data.location.name
                            };
                        }
                    }
                }
            );

            modalInstance.result.then(function(data) {
                vm.data.location.reviews.push(data);
            });
        };

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