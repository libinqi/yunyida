/**
 * Created by libinqi on 2015/6/5.
 */

'use strict';

angular.module('opCenterApp').directive("staffRemoteCheck", ['$timeout', '$http', 'systemSettingService',
  function ($timeout, $http, systemSettingService) {
    return {
      require: "ngModel",
      link: function (scope, elem, attrs, ngModel) {
        var doValidate = function () {
          if (!scope.staff.userid) {
            systemSettingService.checkStaffName(ngModel.$modelValue).then(function (response) {
              if (response && response.status == "200") {
                ngModel.$setValidity('username', (response.data.code == "200"));
              }
              else {
                ngModel.$setValidity('username', false);
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
            ngModel.$setValidity('username', true);
          });
        });
      }
    };
  }
]);
