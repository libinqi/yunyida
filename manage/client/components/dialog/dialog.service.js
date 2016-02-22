/**
 * Created by libinqi on 2015/6/9.
 */
'use strict';

angular.module('yydApp')
    .factory('dialog', function ($rootScope, ngDialog, ngNotify) {
        ngNotify.config({
            type: 'info',
            position: 'top',
            duration: 2000,
            theme: 'pure',
            html: true
        });

        return {
            confirmDialog: function (infoText) {
                return ngDialog.openConfirm({
                    template: '\
                <div class="light-box-title"><span class="text-white">操作提醒</span></div>\
                <p class="tips-text">' + infoText + '</p>\
                <div class="ngdialog-buttons btn-align-center">\
                    <button type="button" class="btn btn-default" ng-click="confirm(true)">是</button>\
                    <button type="button" class="btn btn-primary" ng-click="closeThisDialog(0)">否</button>\
                </div>',
                    plain: true
                });
            },
            open: ngDialog.open,
            notify: function (infoText, type) {
                ngNotify.set(infoText, type);
            }
        }
    });