"use strict";
var app = angular.module('ionic-dictpicker', ['ionic']);
app.directive('ionicDictPicker', ['$ionicPopup', '$timeout','$ionicScrollDelegate','$ionicModal','dictService', function ($ionicPopup, $timeout, $ionicScrollDelegate,$ionicModal,dictService) {
  return {
    restrict: 'AE',
    // scope: true,
    template:  '<input type="text" placeholder={{vm.placeholder}} ng-model="dictmodel"  class={{vm.cssClass}} readonly>',
    scope: {
      dictmodel: '=',
      backdrop:'@',
      backdropClickToClose:'@',
      buttonClicked: '&'
    },
    link: function (scope, element, attrs) {
        var vm=scope.vm={},dictpickerModel=null;
        vm.dictHandle="dictHandle"+attrs.dictmodel;
        vm.dictdata = dictService[attrs.dictData];
        vm.placeholder=attrs.placeholder;
        vm.okText=attrs.okText || "确定";
        vm.cssClass=attrs.cssClass;
        vm.barCssClass=attrs.barCssClass || "bar-custom";;
        vm.backdrop=scope.$eval(scope.backdrop) || false;
        vm.backdropClickToClose=scope.$eval(scope.backdropClickToClose) || false;
        vm.length=vm.dictdata.length;
        // vm.dictdata=dictService.cityList;
        // vm.tag=attrs.tag || "-";
        vm.returnok=function(){
          dictpickerModel && dictpickerModel.hide();
          scope.buttonClicked && scope.buttonClicked();
        }
        vm.ClickToClose=function(){
          vm.backdropClickToClose && dictpickerModel && dictpickerModel.hide();
        }
        vm.getData=function(){
          $timeout.cancel(vm.scrolling);//取消之前的scrollTo.让位置一次性过渡到最新
          $timeout.cancel(vm.dataing);//取消之前的数据绑定.让数据一次性过渡到最新
          var top= $ionicScrollDelegate.$getByHandle(vm.dictHandle).getScrollPosition().top;//当前滚动位置
          var index = Math.round(top / 36);
          if (index < 0 ) index =0;//iOS bouncing超出头
          if (index >vm.length-1 ) index =vm.length-1;//iOS bouncing超出尾
          if (top===index*36 ) {
            vm.dataing=$timeout(function () {
                //数据同步
                scope.dictmodel=vm.dictdata[index].name;
            },150)
          }
          else{
            vm.scrolling=$timeout(function () {
             $ionicScrollDelegate.$getByHandle(vm.dictHandle).scrollTo(0,index*36,true);
            },150)
          }

        }
        element.on("click", function () {
            //零时处理 点击过之后直接显示不再创建
            //$ionicBackdrop.retain();
            if (!attrs.checked) {
              dictpickerModel && dictpickerModel.remove();
            }else{
              dictpickerModel && dictpickerModel.show();
              return
            }
            attrs.checked=true;
            $ionicModal.fromTemplateUrl('templates/public/dict-picker-model.html', {
              scope: scope,
              animation: 'slide-in-up',
              backdropClickToClose:vm.backdropClickToClose
            }).then(function(modal) {
              dictpickerModel = modal;
              //初始化 先获取数据后展示
              $timeout(function () {
                vm.getData();
                dictpickerModel.show();
              },100)
            })
        })
        //销毁模型
        scope.$on('$destroy', function() {
          dictpickerModel && dictpickerModel.remove();
        });
    }
  }
}]);
