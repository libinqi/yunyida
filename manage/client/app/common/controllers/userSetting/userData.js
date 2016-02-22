'use strict';

var kapp=angular.module('commonApp');

kapp.controller('userDataCtrl',['$scope','$http','dialog','userSettingService','Upload',function ($scope, $http, dialog, userSettingService, Upload) {
  var vm = this;

  vm.roomVisble = false;

  vm.jsondata = {
    userid:"",      //用户ID（必填）
    username:"",    //工号
    realname:"",    //姓名
    password:"",    //密码
    sex:"",         //性别
    age:"",         //年龄
    duties:"",      //职务
    entrydate:"",   //入职时间
    useridsn:"",    //身份证
    useridsnurl:"", //身份证URL
    phone:"",       //联系电话
    email:"",       // Email电子邮箱
    image:"",       //头像 
    deptid:"",      //所属部门ID
    deptname:"",    //所属部门名称
    usertype:"",    //用户类型(3:企业用户  2:货主用户   1:司机用户   0:普通用户)
    usertypename:"",   //用户类型名
    status:"",      //用户状态(2:未审核   1:审核通过   0: 审核不通过)
    statusname:"",  //状态名称
    createsuer:"",  //创建人
    createtime:"",  //创建时间
    updateuser:"",  //修改人
    updatetime:"",  //修改时间
    description:"", //备注
    islocked:"",    //用户是否被锁，1:正常  0:锁住
    datasource:"",  //数据来源
    oldpassword:"", // 旧密码
    newpassword:"", // 新密码
    enterpriseid:"",  // 企业ID
    roleid:"",      // 岗位（角色）ID
    rolename:"",    // 岗位（角色）名称
    hasUser:""      // 是否有此用户权限
  };

  //获取当前用户信息
  vm.getUserById = function(){
      userSettingService.getUserById(user.userid).then(function (response) {
          if(response.data.code == "200"){
              vm.jsondata = response.data.body;
          }
      });
  }

  vm.activeBtn = function(){
    vm.activeTab = 1;
  }

  //新增OR修改
  vm.save = function(){
    if($scope.myForm.$valid){
      userSettingService.updateUser(vm.jsondata).then(function (response) {
        if(response.data.code == "200"){
          // $scope.closeThisDialog(response.data);
          dialog.notify("用户信息保存成功!", 'success');
        }
        else{
          dialog.notify(response.data.msg, 'error');
        }
      });
    }
    $scope.myForm.submitted = true;
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

  vm.reset = function(){
    vm.jsondata.oldpassword = "";
    vm.jsondata.newpassword = "";
    $scope.rpassword = "";
  }

  vm.getUserById();
}]);