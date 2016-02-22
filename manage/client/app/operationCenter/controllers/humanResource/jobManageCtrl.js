'use strict';

var humanManageApp = angular.module('opCenterApp');
humanManageApp.controller('jobmanageCtrl', ['$scope', 'humanServices', 'dialog', function ($scope, humanServices, dialog) {
    var vm = this;
    vm.jsondata = {id: "", name: "", url: ""};
    vm.jobmanageList = function () {
        humanServices.getjobList({page: "1", rows: "999"}).then(function (data) {
            if (data.status == 200 && data.data.code == 200) {
                vm.joblist = data.data.body.data;
            }
            ;
        });
    };
    vm.clickToDeletemodel = function (id) {
        humanServices.deleteJob(id).then(function (data) {
            if (data.status == 200 && data.data.code == 200) {
                dialog.notify("删除成功！", 'success');
                vm.jobmanageList();
            }
            ;
        });
    };
    vm.clickToUpdatemodel = function (job) {
        vm.jsondata.id = job.id;
        vm.jsondata.name = job.name;
        vm.jsondata.url = job.url;
    };
    vm.cancel = function () {
        vm.jsondata.id = "";
        vm.jsondata.name = "";
        vm.jsondata.url = "";
    };
    vm.clickToAdd = function () {
        if ($scope.myForm.$valid) {
            if (vm.jsondata.url == "") vm.jsondata.id = "";
            humanServices.saveOrupdateJob(vm.jsondata).then(function (data) {
                if (data.status == 200 && data.data.code == 200) {
                    dialog.notify("保存成功", 'success');
                    ;
                    vm.jobmanageList();
                } else {
                    dialog.notify(data.data.msg, 'error');
                }
            })
        } else {
            $scope.myForm.submitted = true;
        }
    };

    vm.openUrl=function(url){
        openBrowser(url);
    };

    vm.jobmanageList();
}]);