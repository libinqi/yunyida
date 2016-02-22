/**
 * Created by libinqi on 2015/6/5.
 */

'use strict';

angular.module('opCenterApp').directive("multipleEmail", [function () {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, element, attr, ctrl) {
            if (ctrl) {
                var isEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                var emailValidator = function (value) {
                    var validity = ctrl.$isEmpty(value) || isEmail.test(value);
                    ctrl.$setValidity("email", validity);
                    return validity ? value : undefined;
                };
                ctrl.$formatters.push(emailValidator);
                ctrl.$parsers.push(emailValidator);
            }
        }
    };
}]);
