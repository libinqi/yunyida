'use strict';

var app = angular.module('opCenterApp');
app.controller('addEnterpriseCtrl', ['$scope', '$http', 'dialog', 'customersManageService','Upload', function ($scope, $http, dialog, customersManageService,Upload) {
    var vm = this;

    vm.jsondata = {
        image:"",                   // 头像
        username:"",                //用户名
        realname:"",                //真实姓名
        phone:"",                   // 电话号码
        usertype:"",                //用户类型(3:企业用户  2:货主用户   1:司机用户   0:普通用户)
        status:"",             //用户状态(2:审核不通过   1:审核通过   0: 未审核)
        useridsn:"",                //身份证
        useridsnurl:"",             // 身份证URL
        enterprisename:"",          //企业名称（必填）
        organizationcode:"",        //组织机构代码
        legalrepresentative:"",     //企业法人
        location:"",                //经营地址
        contactname:"",             //联系人名称
        telephonenumber:"",         //电话号码
        logourl:"",                 //企业LOGO URL    
        bizlicurl:"",               // 营业证URL
        taxlicurl:"",               // 税务登记URL
        orgcodelicurl:""            // 企业组织代码证URL
    }

    //新增OR修改
    vm.add = function(){
        vm.jsondata.status = "0";
        vm.jsondata.usertype = "3";
       //  $scope.upload($scope.files,function(data){
       //       vm.jsondata.image=data;
       // });
       // vm.jsondata.logourl=$scope.upload($scope.fileslog);
       // vm.jsondata.bizlicurl=$scope.upload($scope.filesbiz);
       // vm.jsondata.taxlicurl=$scope.upload($scope.filestax);
       // vm.jsondata.orgcodelicurl=$scope.upload($scope.filesorg);
        if($scope.myForm.$valid){
            customersManageService.addEnterpriseInfo(vm.jsondata).then(function (response) {
                if(response.data.code == "200"){
                    $scope.closeThisDialog(response.data);
                }
            });
        }
        $scope.myForm.submitted = true;
    }

    vm.cancel = function(){
        $scope.closeThisDialog(null);
    }
     $scope.upload = function (files,callback) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: loc_host + '/ws/system/fastdfs/upload',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  //  console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    if (status==200) {
                        if(callback)
                        {
                            callback(data.body);
                        }
                        // return data.body;
                    };
                   console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                });
            }
        }
    };
   $scope.$watch('files', function () {
       $scope.upload($scope.files,function(data){
             vm.jsondata.image=data;
       });
    });
     $scope.$watch('fileslog', function () {
       $scope.upload($scope.fileslog,function(data){
             vm.jsondata.logourl=data;
       });
    });
       $scope.$watch('filesbiz', function () {
       $scope.upload($scope.filesbiz,function(data){
             vm.jsondata.bizlicurl=data;
       });
    });
         $scope.$watch('filestax', function () {
       $scope.upload($scope.filestax,function(data){
             vm.jsondata.taxlicurl=data;
       });
    });
    $scope.$watch('filesorg', function () {
       $scope.upload($scope.filesorg,function(data){
             vm.jsondata.orgcodelicurl=data;
       });
    });
}]);