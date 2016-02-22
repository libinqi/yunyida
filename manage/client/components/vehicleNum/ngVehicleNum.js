(function(){
  'use strict';
	angular.module('ngVehicleNum', [])
    // 省份数据，以区域名称作键
	.constant('provinceCode', [
        {
            "name":"华北",
                        //[省份代码，简称，名称]
            "provinces":[["11","京","北京"],
                        ["12","津","天津"],
                        ["13","冀","河北"],
                        ["14","晋","山西"],
                        ["15","蒙","内蒙古"]]
        },
        {
            "name":"东北",
            "provinces":[["21","辽","辽宁"],
                        ["22","吉","吉林"],
                        ["23","黑","黑龙江"]]
        },
        {
            "name":"华东",
            "provinces":[["31","沪","上海"],
                        ["32","苏","江苏"],
                        ["33","浙","浙江"],
                        ["34","皖","安徽"],
                        ["35","闽","福建"],
                        ["36","赣","江西"],
                        ["37","鲁","山东"]]
        },
        {
            "name":"华中",
            "provinces":[["41","豫","河南"],
                        ["42","鄂","湖北"],
                        ["43","湘","湖南"]]
        },
        {
            "name":"华南",
            "provinces":[["44","粤","广东"],
                        ["45","桂","广西"],
                        ["46","琼","海南"]]
        },
        {
            "name":"西南",
            "provinces":[["50","渝","重庆"],
                        ["51","川","四川"],
                        ["52","黔","贵州"],
                        ["53","滇","云南"],
                        ["54","藏","西藏"]]
        },
        {
            "name":"西北",
            "provinces":[["61","陕","陕西"],
                        ["62","陇","甘肃"],
                        ["63","青","青海"],
                        ["64","宁","宁夏"],
                        ["65","新","新疆"]]
        },
        {
            "name":"港澳台",
            "provinces":[["71","台","台湾"],
                        ["81","港","香港"],
                        ["82","澳","澳门"]]
        }
    ])
    // 城市数据，以省份代码作键
	.constant('cityCode',{
        "11":[["1101","A"],["1102","B"],["1103","C"],["1104","D"],["1105","E"],["1106","F"],["1107","G"],["1108","H"],["1109","I"],["1110","J"],["1111","K"],["1112","L"],["1113","M"],["1114","N"],["1115","O"],["1116","P"],["1117","Q"],["1118","R"],["1119","S"],["1120","T"],["1121","U"],["1122","V"],["1123","W"],["1124","X"],["1125","Y"],["1126","Z"]],
        "12":[["1201","A"],["1202","B"],["1203","C"],["1204","D"],["1205","E"],["1206","F"],["1207","G"],["1208","H"],["1209","I"],["1210","J"],["1211","K"],["1212","L"],["1213","M"],["1214","N"],["1215","O"],["1216","P"],["1217","Q"],["1218","R"],["1219","S"],["1220","T"],["1221","U"],["1222","V"],["1223","W"],["1224","X"],["1225","Y"],["1226","Z"]],
        "13":[["1301","A"],["1302","B"],["1303","C"],["1304","D"],["1305","E"],["1306","F"],["1307","G"],["1308","H"],["1309","I"],["1310","J"],["1311","K"],["1312","L"],["1313","M"],["1314","N"],["1315","O"],["1316","P"],["1317","Q"],["1318","R"],["1319","S"],["1320","T"],["1321","U"],["1322","V"],["1323","W"],["1324","X"],["1325","Y"],["1326","Z"]],
        "14":[["1401","A"],["1402","B"],["1403","C"],["1404","D"],["1405","E"],["1406","F"],["1407","G"],["1408","H"],["1409","I"],["1410","J"],["1411","K"],["1412","L"],["1413","M"],["1414","N"],["1415","O"],["1416","P"],["1417","Q"],["1418","R"],["1419","S"],["1420","T"],["1421","U"],["1422","V"],["1423","W"],["1424","X"],["1425","Y"],["1426","Z"]],
        "15":[["1501","A"],["1502","B"],["1503","C"],["1504","D"],["1505","E"],["1506","F"],["1507","G"],["1508","H"],["1509","I"],["1510","J"],["1511","K"],["1512","L"],["1513","M"],["1514","N"],["1515","O"],["1516","P"],["1517","Q"],["1518","R"],["1519","S"],["1520","T"],["1521","U"],["1522","V"],["1523","W"],["1524","X"],["1525","Y"],["1526","Z"]],
        "21":[["2101","A"],["2102","B"],["2103","C"],["2104","D"],["2105","E"],["2106","F"],["2107","G"],["2108","H"],["2109","I"],["2110","J"],["2111","K"],["2112","L"],["2113","M"],["2114","N"],["2115","O"],["2116","P"],["2117","Q"],["2118","R"],["2119","S"],["2120","T"],["2121","U"],["2122","V"],["2123","W"],["2124","X"],["2125","Y"],["2126","Z"]],
        "22":[["2201","A"],["2202","B"],["2203","C"],["2204","D"],["2205","E"],["2206","F"],["2207","G"],["2208","H"],["2209","I"],["2210","J"],["2211","K"],["2212","L"],["2213","M"],["2214","N"],["2215","O"],["2216","P"],["2217","Q"],["2218","R"],["2219","S"],["2220","T"],["2221","U"],["2222","V"],["2223","W"],["2224","X"],["2225","Y"],["2226","Z"]],
        "23":[["2301","A"],["2302","B"],["2303","C"],["2304","D"],["2305","E"],["2306","F"],["2307","G"],["2308","H"],["2309","I"],["2310","J"],["2311","K"],["2312","L"],["2313","M"],["2314","N"],["2315","O"],["2316","P"],["2317","Q"],["2318","R"],["2319","S"],["2320","T"],["2321","U"],["2322","V"],["2323","W"],["2324","X"],["2325","Y"],["2326","Z"]],
        "31":[["3101","A"],["3102","B"],["3103","C"],["3104","D"],["3105","E"],["3106","F"],["3107","G"],["3108","H"],["3109","I"],["3110","J"],["3111","K"],["3112","L"],["3113","M"],["3114","N"],["3115","O"],["3116","P"],["3117","Q"],["3118","R"],["3119","S"],["3120","T"],["3121","U"],["3122","V"],["3123","W"],["3124","X"],["3125","Y"],["3126","Z"]],
        "32":[["3201","A"],["3202","B"],["3203","C"],["3204","D"],["3205","E"],["3206","F"],["3207","G"],["3208","H"],["3209","I"],["3210","J"],["3211","K"],["3212","L"],["3213","M"],["3214","N"],["3215","O"],["3216","P"],["3217","Q"],["3218","R"],["3219","S"],["3220","T"],["3221","U"],["3222","V"],["3223","W"],["3224","X"],["3225","Y"],["3226","Z"]],
        "33":[["3301","A"],["3302","B"],["3303","C"],["3304","D"],["3305","E"],["3306","F"],["3307","G"],["3308","H"],["3309","I"],["3310","J"],["3311","K"],["3312","L"],["3313","M"],["3314","N"],["3315","O"],["3316","P"],["3317","Q"],["3318","R"],["3319","S"],["3320","T"],["3321","U"],["3322","V"],["3323","W"],["3324","X"],["3325","Y"],["3326","Z"]],
        "34":[["3401","A"],["3402","B"],["3403","C"],["3404","D"],["3405","E"],["3406","F"],["3407","G"],["3408","H"],["3409","I"],["3410","J"],["3411","K"],["3412","L"],["3413","M"],["3414","N"],["3415","O"],["3416","P"],["3417","Q"],["3418","R"],["3419","S"],["3420","T"],["3421","U"],["3422","V"],["3423","W"],["3424","X"],["3425","Y"],["3426","Z"]],
        "35":[["3501","A"],["3502","B"],["3503","C"],["3504","D"],["3505","E"],["3506","F"],["3507","G"],["3508","H"],["3509","I"],["3510","J"],["3511","K"],["3512","L"],["3513","M"],["3514","N"],["3515","O"],["3516","P"],["3517","Q"],["3518","R"],["3519","S"],["3520","T"],["3521","U"],["3522","V"],["3523","W"],["3524","X"],["3525","Y"],["3526","Z"]],
        "36":[["3601","A"],["3602","B"],["3603","C"],["3604","D"],["3605","E"],["3606","F"],["3607","G"],["3608","H"],["3609","I"],["3610","J"],["3611","K"],["3612","L"],["3613","M"],["3614","N"],["3615","O"],["3616","P"],["3617","Q"],["3618","R"],["3619","S"],["3620","T"],["3621","U"],["3622","V"],["3623","W"],["3624","X"],["3625","Y"],["3626","Z"]],
        "37":[["3701","A"],["3702","B"],["3703","C"],["3704","D"],["3705","E"],["3706","F"],["3707","G"],["3708","H"],["3709","I"],["3710","J"],["3711","K"],["3712","L"],["3713","M"],["3714","N"],["3715","O"],["3716","P"],["3717","Q"],["3718","R"],["3719","S"],["3720","T"],["3721","U"],["3722","V"],["3723","W"],["3724","X"],["3725","Y"],["3726","Z"]],
        "41":[["4101","A"],["4102","B"],["4103","C"],["4104","D"],["4105","E"],["4106","F"],["4107","G"],["4108","H"],["4109","I"],["4110","J"],["4111","K"],["4112","L"],["4113","M"],["4114","N"],["4115","O"],["4116","P"],["4117","Q"],["4118","R"],["4119","S"],["4120","T"],["4121","U"],["4122","V"],["4123","W"],["4124","X"],["4125","Y"],["4126","Z"]],
        "42":[["4201","A"],["4202","B"],["4203","C"],["4204","D"],["4205","E"],["4206","F"],["4207","G"],["4208","H"],["4209","I"],["4210","J"],["4211","K"],["4212","L"],["4213","M"],["4214","N"],["4215","O"],["4216","P"],["4217","Q"],["4218","R"],["4219","S"],["4220","T"],["4221","U"],["4222","V"],["4223","W"],["4224","X"],["4225","Y"],["4226","Z"]],
        "43":[["4301","A"],["4302","B"],["4303","C"],["4304","D"],["4305","E"],["4306","F"],["4307","G"],["4308","H"],["4309","I"],["4310","J"],["4311","K"],["4312","L"],["4313","M"],["4314","N"],["4315","O"],["4316","P"],["4317","Q"],["4318","R"],["4319","S"],["4320","T"],["4321","U"],["4322","V"],["4323","W"],["4324","X"],["4325","Y"],["4326","Z"]],
        "44":[["4401","A"],["4402","B"],["4403","C"],["4404","D"],["4405","E"],["4406","F"],["4407","G"],["4408","H"],["4409","I"],["4410","J"],["4411","K"],["4412","L"],["4413","M"],["4414","N"],["4415","O"],["4416","P"],["4417","Q"],["4418","R"],["4419","S"],["4420","T"],["4421","U"],["4422","V"],["4423","W"],["4424","X"],["4425","Y"],["4426","Z"]],
        "45":[["4501","A"],["4502","B"],["4503","C"],["4504","D"],["4505","E"],["4506","F"],["4507","G"],["4508","H"],["4509","I"],["4510","J"],["4511","K"],["4512","L"],["4513","M"],["4514","N"],["4515","O"],["4516","P"],["4517","Q"],["4518","R"],["4519","S"],["4520","T"],["4521","U"],["4522","V"],["4523","W"],["4524","X"],["4525","Y"],["4526","Z"]],
        "46":[["4601","A"],["4602","B"],["4603","C"],["4604","D"],["4605","E"],["4606","F"],["4607","G"],["4608","H"],["4609","I"],["4610","J"],["4611","K"],["4612","L"],["4613","M"],["4614","N"],["4615","O"],["4616","P"],["4617","Q"],["4618","R"],["4619","S"],["4620","T"],["4621","U"],["4622","V"],["4623","W"],["4624","X"],["4625","Y"],["4626","Z"]],
        "50":[["5001","A"],["5002","B"],["5003","C"],["5004","D"],["5005","E"],["5006","F"],["5007","G"],["5008","H"],["5009","I"],["5010","J"],["5011","K"],["5012","L"],["5013","M"],["5014","N"],["5015","O"],["5016","P"],["5017","Q"],["5018","R"],["5019","S"],["5020","T"],["5021","U"],["5022","V"],["5023","W"],["5024","X"],["5025","Y"],["5026","Z"]],
        "51":[["5101","A"],["5102","B"],["5103","C"],["5104","D"],["5105","E"],["5106","F"],["5107","G"],["5108","H"],["5109","I"],["5110","J"],["5111","K"],["5112","L"],["5113","M"],["5114","N"],["5115","O"],["5116","P"],["5117","Q"],["5118","R"],["5119","S"],["5120","T"],["5121","U"],["5122","V"],["5123","W"],["5124","X"],["5125","Y"],["5126","Z"]],
        "52":[["5201","A"],["5202","B"],["5203","C"],["5204","D"],["5205","E"],["5206","F"],["5207","G"],["5208","H"],["5209","I"],["5210","J"],["5211","K"],["5212","L"],["5213","M"],["5214","N"],["5215","O"],["5216","P"],["5217","Q"],["5218","R"],["5219","S"],["5220","T"],["5221","U"],["5222","V"],["5223","W"],["5224","X"],["5225","Y"],["5226","Z"]],
        "53":[["5301","A"],["5302","B"],["5303","C"],["5304","D"],["5305","E"],["5306","F"],["5307","G"],["5308","H"],["5309","I"],["5310","J"],["5311","K"],["5312","L"],["5313","M"],["5314","N"],["5315","O"],["5316","P"],["5317","Q"],["5318","R"],["5319","S"],["5320","T"],["5321","U"],["5322","V"],["5323","W"],["5324","X"],["5325","Y"],["5326","Z"]],
        "54":[["5401","A"],["5402","B"],["5403","C"],["5404","D"],["5405","E"],["5406","F"],["5407","G"],["5408","H"],["5409","I"],["5410","J"],["5411","K"],["5412","L"],["5413","M"],["5414","N"],["5415","O"],["5416","P"],["5417","Q"],["5418","R"],["5419","S"],["5420","T"],["5421","U"],["5422","V"],["5423","W"],["5424","X"],["5425","Y"],["5426","Z"]],
        "61":[["6101","A"],["6102","B"],["6103","C"],["6104","D"],["6105","E"],["6106","F"],["6107","G"],["6108","H"],["6109","I"],["6110","J"],["6111","K"],["6112","L"],["6113","M"],["6114","N"],["6115","O"],["6116","P"],["6117","Q"],["6118","R"],["6119","S"],["6120","T"],["6121","U"],["6122","V"],["6123","W"],["6124","X"],["6125","Y"],["6126","Z"]],
        "62":[["6201","A"],["6202","B"],["6203","C"],["6204","D"],["6205","E"],["6206","F"],["6207","G"],["6208","H"],["6209","I"],["6210","J"],["6211","K"],["6212","L"],["6213","M"],["6214","N"],["6215","O"],["6216","P"],["6217","Q"],["6218","R"],["6219","S"],["6220","T"],["6221","U"],["6222","V"],["6223","W"],["6224","X"],["6225","Y"],["6226","Z"]],
        "63":[["6301","A"],["6302","B"],["6303","C"],["6304","D"],["6305","E"],["6306","F"],["6307","G"],["6308","H"],["6309","I"],["6310","J"],["6311","K"],["6312","L"],["6313","M"],["6314","N"],["6315","O"],["6316","P"],["6317","Q"],["6318","R"],["6319","S"],["6320","T"],["6321","U"],["6322","V"],["6323","W"],["6324","X"],["6325","Y"],["6326","Z"]],
        "64":[["6401","A"],["6402","B"],["6403","C"],["6404","D"],["6405","E"],["6406","F"],["6407","G"],["6408","H"],["6409","I"],["6410","J"],["6411","K"],["6412","L"],["6413","M"],["6414","N"],["6415","O"],["6416","P"],["6417","Q"],["6418","R"],["6419","S"],["6420","T"],["6421","U"],["6422","V"],["6423","W"],["6424","X"],["6425","Y"],["6426","Z"]],
        "65":[["6501","A"],["6502","B"],["6503","C"],["6504","D"],["6505","E"],["6506","F"],["6507","G"],["6508","H"],["6509","I"],["6510","J"],["6511","K"],["6512","L"],["6513","M"],["6514","N"],["6515","O"],["6516","P"],["6517","Q"],["6518","R"],["6519","S"],["6520","T"],["6521","U"],["6522","V"],["6523","W"],["6524","X"],["6525","Y"],["6526","Z"]],
        "71":[["7101","A"],["7102","B"],["7103","C"],["7104","D"],["7105","E"],["7106","F"],["7107","G"],["7108","H"],["7109","I"],["7110","J"],["7111","K"],["7112","L"],["7113","M"],["7114","N"],["7115","O"],["7116","P"],["7117","Q"],["7118","R"],["7119","S"],["7120","T"],["7121","U"],["7122","V"],["7123","W"],["7124","X"],["7125","Y"],["7126","Z"]],
        "81":[["8101","A"],["8102","B"],["8103","C"],["8104","D"],["8105","E"],["8106","F"],["8107","G"],["8108","H"],["8109","I"],["8110","J"],["8111","K"],["8112","L"],["8113","M"],["8114","N"],["8115","O"],["8116","P"],["8117","Q"],["8118","R"],["8119","S"],["8120","T"],["8121","U"],["8122","V"],["8123","W"],["8124","X"],["8125","Y"],["8126","Z"]],
        "82":[["8201","A"],["8202","B"],["8203","C"],["8204","D"],["8205","E"],["8206","F"],["8207","G"],["8208","H"],["8209","I"],["8210","J"],["8211","K"],["8212","L"],["8213","M"],["8214","N"],["8215","O"],["8216","P"],["8217","Q"],["8218","R"],["8219","S"],["8220","T"],["8221","U"],["8222","V"],["8223","W"],["8224","X"],["8225","Y"],["8226","Z"]],
	})
    // 县区数据，以城市代码作键
    .constant('districtCode',{
        "1101":[["110101","东城"],
                ["110102","西城"],
                ["110105","朝阳"],
                ["110106","丰台"],
                ["110107","石景山"],
                ["110108","海淀"],
                ["110109","门头沟"],
                ["110111","房山"],
                ["110112","通州"],
                ["110113","顺义"],
                ["110114","昌平"],
                ["110115","大兴"],
                ["110116","怀柔"],
                ["110117","平谷"]],
        "1102":[["110228","密云"],
                ["110229","延庆"]]
    })
    // 全局配置
	.constant('vcConfig', {
    tabs: [{"name":"简称","url":"abbreviationPanel.html"},
            {"name":"编码","url":"cityNoPanel.html"}],
    placeholder: "请选择车牌",
    format:"$0-$1"
	})
    // 初始化模板
    .run(function($templateCache){
        var templateVl =  '<div class="vc-main" ng-class="{opened:vctrl.isOpen}">' +
                            '<button type="button" class="vc-selector" ng-class="{opened:vctrl.isOpen}"' + 
                            'ng-bind="vctrl.print(vctrl.format)" ' + 
                            'ng-click="vctrl.toggle()">' + 
                            '</button><input type="text"  class="vc-sel-input" id="vcinput" ng-value="vctrl.vcnul" ng-change="vctrl.change()" maxlength="5"  ng-model="vctrl.vcnul" >' + 
                            '<div class="vc-drop" ng-show="vctrl.isOpen">' + 
                                '<div class="vc-tab">' +
                                    '<dl>' +
                                        '<dd ' +
                                        'ng-repeat="tab in vctrl.vcConfig.tabs" ' +
                                        'ng-class="{active:vctrl.isActive(tab.url)}" ' +
                                        'ng-bind="tab.name" ' +
                                        'ng-click="vctrl.selectTab(tab)" ' +
                                        '</dd>' +
                                    '</dl>' +
                                '</div>' + 
                                '<div class="vc-panel" ng-include="vctrl.currentPanel"><div>' +
                            '</div>' +
                        '</div>';

        var abbreviationPanel = '<dl ng-repeat="area in vctrl.provinceCode">' +
                                '<div class="vc-col-title">' + 
                                    '<dt ng-bind="area.name"></dt>' + 
                                '</div>' + 
                                '<div class="vc-col-content">' + 
                                    '<dd>' +
                                        '<a ' +
                                        'ng-repeat="province in area.provinces" ' +
                                        'ng-bind="province[1]" ' +
                                        'ng-click="vctrl.selectItem(province)"' + 
                                        'ng-class="{active:vctrl.activeItem(province)}"' + 
                                        'title="{{province[1]}}">' + 
                                        '</a>' + 
                                    '</dd>' +
                                '</div>' + 
                            '</dl>';

        var cityNoPanel = '<dl>' +
                            '<div>' + 
                                '<dd>' + 
                                    '<a ' + 
                                    'ng-repeat="city in vctrl.cityCode[vctrl.selected.province[0]]" ' + 
                                    'ng-bind="city[1]" ' + 
                                    'ng-click="vctrl.selectItem(city)"' + 
                                    'ng-class="{active:vctrl.activeItem(city)}">' + 
                                    '</a>'
                                '</dd>' + 
                            '</div>' + 
                        '</dl>';

        var nothingPanel = '<dl>' + 
                                '<div>' + 
                                    '<dd>' + 
                                        // '<a ' + 
                                        // 'ng-repeat="district in vctrl.districtCode[vctrl.selected.city[0]]" ' + 
                                        // 'ng-bind="district[1]" ' + 
                                        // 'ng-click="vctrl.selectItem(district)"' + 
                                        // 'ng-class="{active:vctrl.activeItem(district)}">' + 
                                        // '</a>'
                                    '</dd>' + 
                                '</div>' + 
                            '</dl>';

        $templateCache.put('templateVl.html',templateVl);
        $templateCache.put('abbreviationPanel.html',abbreviationPanel);
        $templateCache.put('cityNoPanel.html',cityNoPanel);
        // $templateCache.put('nothingPanel.html',nothingPanel);
    })
    // 指令
    .directive('mkVehicleNum',['$document', function($document){
        return {
            restrict:'EA',
            templateUrl:'templateVl.html',
            replace:true,
            require:'ngModel',
            scope:{
                model:'=ngModel',
                open:'=',
                vq:'=',
                format:'@',
                placeholder:'@'
            },
            controller:'vehicleNumCtrl',
            link:function(scope,iElement,iAttrs,ngModelCtrl){
                var cpvCtrl = scope.vctrl;

                iElement.bind('click', function(e) {
                    // this part keeps it from firing the click on the document.
                    e.stopPropagation();
                });

                function onDocumentClick(){
                    scope.$apply(function(){
                        if(cpvCtrl.isOpen){
                            cpvCtrl.close();
                        }
                    });
                };

                $document.on("click", onDocumentClick);

                scope.$on('$destroy', function() {
                    $document.off('click', onDocumentClick);
                });
            }
        }
    }])
    // 控制器
    .controller('vehicleNumCtrl', ['$scope','vcConfig','provinceCode','cityCode','districtCode',
        function($scope,vcConfig,provinceCode,cityCode,districtCode){

            var vctrl = $scope.vctrl = this;

            vctrl.vcConfig = vcConfig;
            vctrl.provinceCode = provinceCode;
            vctrl.cityCode = cityCode;
            vctrl.districtCode = districtCode;

            vctrl.placeholder = $scope.placeholder || vcConfig.placeholder;
            vctrl.format = $scope.format || vcConfig.format;
            vctrl.vq = $scope.vq || null;

            //提取provinceCode中的数据，方便其他函数使用
            vctrl.simpleprovinceCode = [];
            (function initData(){
                for (var i = 0; i < this.provinceCode.length; i++) {
                    var obj = this.provinceCode[i];
                    for (var j = 0; j < obj.provinces.length; j++) {
                        var data = obj.provinces[j];
                        vctrl.simpleprovinceCode.push(data);
                    };
                }
            }).call(this);

            // panel的开关状态
            vctrl.isOpen = $scope.open || false;

            // 当前显示的子panel url
            vctrl.currentPanel = vcConfig.tabs[0].url;

            // 选中的省、市、县（区）
            vctrl.selected = $scope.model = {
                "province":null,
                "city":null,
                "district":null,
                "vcnul":null
            };

            // 切换子panel
            vctrl.selectTab = function(tab){
                this.currentPanel = tab.url;
            };

            // 选中item后将对象存储到selected，并切换tab
            vctrl.selectItem = function(item){
                var id = item[0];
                var selected = this.selected;

                switch(id.length){
                    //省份
                    case 2:
                        selected.province = item;

                        /**
                         * Skip city
                         * 当cityCode里某省的城市只有一个时，直接跳到县区选择框
                         * 目前包括四个直辖市：北京、天津、上海、重庆
                         */
                        if(this.cityCode[id].length <= 1){
                            selected.city = this.cityCode[id][0];
                            this.selectTab(vcConfig.tabs[2]);
                        }else{
                            selected.city = null;
                            this.selectTab(vcConfig.tabs[1]);
                        }
                        selected.district = null;
                    break;

                    //城市
                    case 4:
                        selected.city = item;

                        /**
                         * Skip district
                         * 当districtCode不存在该市的id时，选择结束，直接关闭选择框
                         * 目前包括四个不设市辖区的地级市：广东中山、广东东莞、甘肃嘉峪关、海南三亚
                         */
                        if(!this.districtCode[id]){
                           document.all.vcinput.focus();
                            this.clear(2);
                            this.close();
                        }else{
                            document.all.vcinput.focus();
                            // this.selectTab(vcConfig.tabs[2]);
                            // selected.district = null;
                            this.close();
                        }
                    break;

                    //县区
                    // case 6:
                    //     selected.district = item;
                    //     this.close();
                    // break;
                }
            };

            // 将当前选项设置为激活状态
            vctrl.activeItem = function(item){
                var id = item[0];
                var selected = this.selected;

                switch(id.length){
                    //省份
                    case 2:
                        return selected.province == item;

                    //城市
                    case 4:
                        return selected.city == item;

                    //县区
                    case 6:
                        return selected.district == item;
                }
            };

            // 根据id或name查找对应的省份、城市或县区对象
            vctrl.findItem = function(isID,val,dataset){
                if(dataset){
                    for (var i = 0; i < dataset.length; i++) {
                        var item = dataset[i];
                        if((isID ? item[0] : item[item.length-1]) == val)
                            return item;
                    };
                }
                return null;
            };
         // 根据简称查找对应的省份、城市或县区对象
            vctrl.findItemByJName= function(isID,val,dataset){
                if(dataset){
                    for (var i = 0; i < dataset.length; i++) {
                        var item = dataset[i];
                       if (val.match(/^[A-Za-z]+$/)!=null) {
                             if((isID ? item[0] : item[item.length-1]) == val)
                               return item;
                        }else{ 
                            if((isID ? item[0] : item[item.length-2]) == val)
                            return item;
                        }
                       
                    };
                }
                return null;
            };
            /**
             * 传入的q对象必须为字符串或数组，否则抛出异常
             * 格式1：'代码'
             * 格式2：['省份名称','城市名称','县区名称']
             * Chaos Magic code 1...
             */
            vctrl.query = function(vq){
                if(!vq){
                    this.clear();
                    return;
                }

                if(angular.isString(vq)){
                    var fullID = vq;
                    var idLength = fullID.length;
                    var dataset;
                    switch(idLength){
                        // 省份
                        case 2:
                            dataset = this.simpleprovinceCode;
                        break;

                        // 城市
                        case 4:
                            var pID = fullID.substring(0,2);
                            this.query(pID);
                            dataset = this.cityCode[pID];
                        break;

                        // 县区
                        case 6:
                            var cID = fullID.substring(0,4);
                            this.query(cID);
                            dataset = this.districtCode[cID];
                            if(!dataset){
                                this.clear();
                                return;
                            }
                        break;

                        default:
                            this.clear();
                            return;
                    }

                    if(dataset){
                        var item = this.findItemByJName(true,fullID,dataset);
                        if(item){
                            this.selectItem(item);
                            this.activeItem(item);
                        }else{
                            this.clear();
                            return;
                        }
                    }
                }else if(angular.isArray(vq)){
                    var pName = vq[0];
                    var cName = vq[1];
                    var dName = vq[2];
                    if (dName!=null) {
                      vctrl.vcnul=dName;
                    };
                    // 省份为NULL或[省份,NULL,县区]，均为不合法输入
                    if(!pName || (pName && !cName && dName)){
                        this.clear();
                        return;
                    }

                    var result = this.selected;

                    var dataList = [this.simpleprovinceCode,this.cityCode,this.districtCode];
                    var itemList = [];
                    var x=vq.length>2?vq.length-1:vq.length;
                    for (var i = 0,item; i < x; i++) {
                        var name = vq[i];
                        var dataset;

                        if(i == 0){
                            dataset = dataList[i];
                        }else if(item){
                            dataset = dataList[i][item[0]];
                        }
                        // var rex="^[A-Za-z]+$";
                     
                        item = this.findItemByJName(false,name,dataset);
             
                        itemList[i] = {
                            "name": name,
                            "item": item || null
                        };
                    }

                    for (var i = 0; i < itemList.length; i++) {
                        var obj = itemList[i];
                        if(obj.name){
                            if(obj.item){
                                this.selectItem(obj.item);
                                // this.activeItem(obj.item);
                            }else{
                                this.clear();
                            }
                        }
                    };
                }else{
                    throw new Error("传入的q对象必须为字符串或数组，" + 
                        "格式1：'城市代码'，" + 
                        "格式2：['省份名称','城市名称','县区名称']");
                }
            };

            // 清空selected
            vctrl.clear = function(type){
                if(type){
                    switch(type){
                        case 0:
                            this.selected.province = null;
                        break;

                        case 1:
                            this.selected.city = null;
                        break;

                        case 2:
                            this.selected.district = null;
                        break;
                    }
                }else{
                    for(var key in this.selected){
                        this.selected[key] = null;
                    }
                }
            };

            // 格式化输出selected
            vctrl.print = function(formatTmpl){
                var selected = this.selected;
                 vctrl.vcnul=selected.vcnul;
                if(!selected.province){
                    return vctrl.placeholder;
                }else{
                    var result = formatTmpl.replace('$0',selected.province[1]);
                    if(selected.city){
                        result = result.replace('$1',selected.city[1]);
                    }
                    // if(selected.district){
                    //     result = result.replace('$2',selected.district[1]);
                    // }
                    result = result.replace('$1',"");//.replace('$2',"");
                    return result;
                }
            };

            // 打开、关闭panel
            vctrl.toggle = function(){
                this.isOpen = !this.isOpen;
            };
             // 打开、关闭panel
            vctrl.change = function(){
               var selected = this.selected;
                // var re=/^[a-zA-Z0-9_]+$/;//^.{5}
                // var str=vctrl.vcnul;
                  selected.vcnul=vctrl.vcnul;
            };


            // 关闭panel
            vctrl.close = function(){
                this.isOpen = false;
            };

            // 判断当前panel是否激活
            vctrl.isActive = function(tabUrl){
                return tabUrl == this.currentPanel;
            };

            /**
             * 当q对象发生变化时，根据q对象改变selected
             */
            if(vctrl.vq){
                $scope.$watch('vq',function(newVal){
                    vctrl.vq = newVal;// need
                    vctrl.query(vctrl.vq);
                },true);
            }
             
            $scope.$watch('vctrl.isOpen',function(newVal){
                $scope.open = newVal;
            });

            /**
             * 当selected对象发生变化时，回传至q对象
             * Chaos Magic Code 2...
             */
            if(vctrl.vq){
                $scope.$watch('vctrl.selected',function(newVal){
                    var selected = newVal;

                    // ngModal
                    $scope.model = sel






                    ected;

                    // q
                    if(angular.isString(vctrl.vq)){
                        if(selected.district){
                            $scope.vq = selected.district[0];
                        }else if(selected.city){
                            $scope.vq = selected.city[0];
                        }else if(selected.province){
                            $scope.vq = selected.province[0];
                        }else{
                            $scope.vq = null;
                        }
                    }else{
                        $scope.vq = [];
                        $scope.vq[0] = selected.province ? selected.province[1] : null;
                        $scope.vq[1] = selected.city ? selected.city[1] : null;
                        $scope.vq[2] = selected.district ? selected.district[1] : null;
                    }
                },true);
            }
        }
    ])
})();