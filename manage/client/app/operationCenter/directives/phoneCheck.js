/**
 * Created by libinqi on 2015/6/5.
 */

'use strict';

angular.module('opCenterApp').directive("phoneCheck", ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        require: "ngModel",
        link: function (scope, elem, attrs, ctrl) {
            if (ctrl) {
                var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
                var isMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                var validity = false;
                var phoneValidator = function (value) {
                    validity = ctrl.$isEmpty(value) || isMobile.test(value) || isPhone.test(value);
                    ctrl.$setValidity("phoneEx", validity);
                    return validity ? value : undefined;
                };
                ctrl.$formatters.push(phoneValidator);
                ctrl.$parsers.push(phoneValidator);

//                scope.$watch(attrs.ngModel, function (newValue) {
//                    if (_.isEmpty(newValue)) {
//                    } else if (!scope[elem[0].form.name][elem[0].name].$dirty) {
//                        phoneValidator();
//                    }
//                });
//
//                elem.bind("blur", function () {
//                    if (scope[elem[0].form.name][elem[0].name].$invalid) {
//                        return;
//                    }
//                    phoneValidator();
//                });
//                elem.bind("focus", function () {
//                    $timeout(function () {
//                        ctrl.$setValidity('phoneEx', true);
//                    });
//                });
            }
        }
    };
}
]);
