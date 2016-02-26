'use strict';

var app = angular.module('opCenterApp');
app.controller('infoAuditParkListCtrl', ['$scope', '$http', 'dialog','$sails', function ($scope, $http, dialog,$sails) {
    var vm = this;

    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        //以下实际应用中可注释
        totalItems: 0
    };

    vm.queryData = {
        page: 1,
        rows: 10,
        enterpriseName: "",
        realName: "",
        phoneNumber: "",
        status: ""
    };

    $scope.enterpriseList=[];

    //企业查询
    $scope.getEnterpriseList = function () {
        vm.queryData.page = $scope.paginationConf.currentPage;
        if (vm.queryData.page <= 0) {
            vm.queryData.page = 1;
        }

        $sails.get("/user/list",vm.queryData)
            .success(function (data, status, headers, jwr) {
                $scope.enterpriseList = data.body;
                // 变更分页的总数
                $scope.paginationConf.totalItems = data.count;
            })
            .error(function (data, status, headers, jwr) {
            });
    }

    $scope.query = function () {
        if($scope.paginationConf.currentPage!=1){
            $scope.paginationConf.currentPage = 1;
        }
        else{
            $scope.getEnterpriseList();
        }
    }

    $scope.resetQuery = function () {
        vm.queryData.enterpriseName = "";
        vm.queryData.realName = "";
        vm.queryData.phoneNumber = "";
        vm.queryData.status = "";
        $scope.paginationConf.currentPage = 1;
        $scope.query();
    }

    $scope.disableClick = function (item, status) {
        item.status = status;
        io.socket.put('/user/' + item.userId, item, function serverResponded(data, JWR) {
            if (JWR.statusCode == 200) {
                dialog.notify((status ? '启用' : '停用') + '成功！', 'success');
                $scope.getEnterpriseList();
            }
            else {
                item.status = !status;
                dialog.notify((status ? '启用' : '停用') + '异常！', 'error');
            }
        });
    }
    $scope.detail = function () {

    }

    //查看企业明细
    $scope.viewParkClick = function (pid) {
        $scope.pid = pid;
        $scope.isView = true;
        dialog.open({
            template: 'app/operationCenter/views/infoAudit/park/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
            }
        });
    }

    //编辑企业信息
    $scope.editParkClick = function (pid) {
        $scope.pid = pid;
        $scope.isView = false;
        dialog.open({
            template: 'app/operationCenter/views/infoAudit/park/info.html',
            className: 'ngdialog-theme-default custom-box',
            scope: $scope,
            preCloseCallback: function (data) {
                if (data != null) {
                    if (data.code == "200") {
                        vm.getParkList();
                        dialog.notify('编辑成功！', 'success');
                    }
                    else {
                        dialog.notify(data.msg, 'error');
                    }
                }
            }
        });
    }

    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage', $scope.getEnterpriseList);
}]);