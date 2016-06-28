(function () {
    angular.module('loc8rApp').directive('genericFooter', genericFooter);

    function genericFooter() {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/genericFooter/genericFooter.template.html'
        };
    }
})();