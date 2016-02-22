'use strict';

angular.module('yydApp')
  .controller('navbarCtrl', function($rootScope, $scope, $location, $filter, $timeout, systemAppService) {
    $scope.isActive = function(route) {
      var routes = $location.path().split('/').slice(1);
      if (routes.length > 1) {
        for (var i = 0; i < routes.length - 1; i++) {
          if (('/' + routes[i]).indexOf(route) >= 0) {
            return true;
          }
        }
      } else {
        if (('/' + routes[0]).indexOf(route) >= 0) {
          return true;
        }
      }
      return false;
    };

    $scope.getIcon = function(route, icon) {
      var routes = $location.path().split('/').slice(1);
      var result = 'assets/images/' + icon + '.png';
      if (routes.length > 1) {
        for (var i = 0; i < routes.length - 1; i++) {
          if (('/' + routes[i]).indexOf(route) >= 0) {
            result = 'assets/images/' + icon + 'ed.png';
            return result;
          }
        }
      } else {
        if (('/' + routes[0]).indexOf(route) >= 0) {
          result = 'assets/images/' + icon + 'ed.png';
        }
        return result;
      }
      return result;
    }

    $scope.getAppMenus = function() {
      if (systemAppService.appService.apps && systemAppService.appService.apps.length > 0) {
        for (var n in systemAppService.appService.apps) {
          var app = systemAppService.appService.apps[n];
          $rootScope.menus.push({
            'title': app.applicationname,
            'link': app.appurl,
            'icon': app.appicon
          });
        }
      }
    }

    $rootScope.menus = [];
    $timeout(function() {
      if ($rootScope.menus.length <= 0) {
        $scope.getAppMenus();
      }
    }, 1000);

    $scope.$on('appService.apps.load', function(event) {
      $scope.getAppMenus();
    });

    function winResize() {
      var windowHeight = $(window).height();
      var clientHeight = window.document.body.clientHeight;
      var clientWidth = window.document.body.clientWidth;

      var headerHeight = $('#client-header').height() || 0;
      var navbarHeight = $('#client-navbar').height() || 0;
      var navGoHome = $('#nav-goHome').height() || 0;

      var mainContent = $('#main-content');
      var rightContent = $('#right-content');
      var rightContentOP = $('#right-content');

      var pageslide = $('pageslide');

      if (mainContent) {
        mainContent.height(windowHeight - (headerHeight + navbarHeight));
      }
      if (rightContent) {
        rightContent.height(windowHeight - (headerHeight + navbarHeight) + 35);
        // rightContent.width(clientWidth - 155);
      }
      if (rightContentOP) {
        rightContentOP.height(windowHeight - (headerHeight + navGoHome + navbarHeight));
        // rightContentOP.width(clientWidth - 155);
      }

      // if(pageslide){
      //   pageslide.height(windowHeight - (headerHeight + navGoHome + navbarHeight));
      //   pageslide.width(clientWidth - 155);
      // }

      $rootScope.headerHeight = headerHeight;
      $rootScope.navbarHeight = navbarHeight;
      $rootScope.mainContentHeight = rightContent.height();
      $rootScope.mainContentWidth = rightContent.width();

      
      var gridSearch = 0;
      if($('#grid-search').height()){
        gridSearch = $('#grid-search').height();
      }

      var gridNavbar = 0;
      if($('#grid-navbar').height()){
        gridNavbar = $('#grid-navbar').height();
      }

      var gridpagination = 35;
      if($('#grid-pagination').height()){
        gridpagination = $('#grid-pagination').height();
      }

      var gridContent = $('#grid-content');
      if (gridContent) {
        gridContent.height(clientHeight - gridSearch - gridNavbar - gridpagination - 155);
      }

      var gridpagination2 = 35;
      if($('#grid-pagination2').height()){
        gridpagination2 = $('#grid-pagination2').height();
      }

      var gridContent2 = $('#grid-content2');
      if (gridContent2) {
        gridContent2.height(clientHeight - gridSearch - gridNavbar - gridpagination - 155);
      }

      var gridLoad = $('#grid-load');
      if (gridLoad) {
        gridLoad.height(clientHeight - gridSearch - gridNavbar - 185);
      }
    }

    winResize();

    $scope.$on('$locationChangeSuccess', function() {
      $timeout(function() {
        winResize();
      }, 800);
    });

    window.onresize = winResize;
  });
