angular.module('commonApp')
    .filter('fromNow', function () {
        return function (input) {
            return moment(input).fromNow();
        };
    });

angular.module('commonApp')
    .filter('formatDate', function () {
        return function (input, format) {
            return moment(input).format(format || "YYYY-MM-DD HH:mm:ss");
        };
    })
    .filter('tuifangDate', function () {
        return function (input) {
            return moment(input).format("YYYY-MM-DD")+' 13:00:00';
        };
    });
