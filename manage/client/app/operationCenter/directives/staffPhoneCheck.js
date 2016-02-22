/**
 * Created by libinqi on 2015/6/5.
 */

'use strict';

angular.module('opCenterApp').directive("staffPhoneCheck", ['$timeout', '$http', 'systemSettingService',
    function ($timeout, $http, systemSettingService) {
        return {
            require: "ngModel",
            link: function (scope, elem, attrs, ngModel) {
                var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
                var isMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                var validity = false;
                var phoneValidator = function (value) {
                    validity = ngModel.$isEmpty(value) || isMobile.test(value) || isPhone.test(value);
                    ngModel.$setValidity("phoneEx", validity);
                    return validity ? value : undefined;
                };
                ngModel.$formatters.push(phoneValidator);
                ngModel.$parsers.push(phoneValidator);

                var doValidate = function () {
                    if (!scope.staff.userid && validity) {
                        systemSettingService.checkStaffPhone(ngModel.$modelValue).then(function (response) {
                            if (response && response.status == "200") {
                                ngModel.$setValidity('phone', (response.data.code == "200"));
                            }
                            else {
                                ngModel.$setValidity('phone', false);
                            }
                        });
                    }
                };

                scope.$watch(attrs.ngModel, function (newValue) {
                    if (_.isEmpty(newValue)) {
                    } else if (!scope[elem[0].form.name][elem[0].name].$dirty) {
                        doValidate();
                    }
                });

                elem.bind("blur", function () {
                    $timeout(function () {
                        if (scope[elem[0].form.name][elem[0].name].$invalid) {
                            return;
                        }
                        doValidate();
                    });
                });
                elem.bind("focus", function () {
                    $timeout(function () {
                        ngModel.$setValidity('phone', true);
                    });
                });
            }
        };
    }
]);
