(function () {
    angular.module('loc8rApp').filter('addHtmlLineBreaks', addHtmlLineBreaks);

    function addHtmlLineBreaks() {
        return function (text) {
            return text.replace(/\n/g, '<br />');
        };
    }
})();