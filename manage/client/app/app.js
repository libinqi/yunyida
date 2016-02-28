'use strict';

angular.module('yydApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngAnimate',
        'ngDialog',
        'ngNotify',
        'ui.router',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'flow',
        'w5c.validator',
        'ngSails',
        'commonApp',
        'opCenterApp'
    ])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $tooltipProvider, $sailsProvider, ngDialogProvider) {
        //        $urlRouterProvider
        //            .otherwise('/opCenter');

        //$sailsProvider.url ='http://120.27.146.62:1337';
        $sailsProvider.url = 'http://localhost:1337';

        $locationProvider.html5Mode(true);

        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: false,
            closeByEscape: true
        });

        $tooltipProvider.options({
            placement: 'right',
            animation: true,
            popupDelay: 0,
            appendToBody: false
        });

        $httpProvider.interceptors.push(function () {
            return {
                request: function (config) {
                    if (config.url.indexOf(lmp_host) >= 0) {
                        if (config.method == "GET") {
                            if (user && user.permissions.parkid) {
                                if (!config.params)
                                    config.params = {};
                                if (config.params.datasource == undefined) {
                                    config.params.datasource = user.permissions.parkid;
                                }
                            }
                        }
                        if (config.method == "POST") {
                            if (config.data && config.data.datasource == undefined && user && user.permissions.parkid) {
                                config.data.datasource = user.permissions.parkid;
                            }
                        }
                    }
                    return config;
                }
            };
        });
    })
    .directive('whenScrolled', function () {
        return function (scope, elm, attr) {
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    });
