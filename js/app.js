'use strict';

var app = angular.module('app',['ui.router','ngCookies','app.controllers','app.services','app.directives'])

.run(
    [           '$rootScope','$state','$stateParams','$log',
        function($rootScope, $state, $stateParams,$log){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            //debug
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                $log.debug('successfully changed states') ;
                
                $log.debug('event', event);
                $log.debug('toState', toState);
                $log.debug('toParams', toParams);
                $log.debug('fromState', fromState);
                $log.debug('fromParams', fromParams);
                
                // 监听路由，改变title
                $rootScope.pageTitle = toState.data.pageTitle;
            });


            $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){
               $log.error('The request state was not found: ' + unfoundState);
            });
                   
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
               $log.error('An error occurred while changing states: ' + error);
               
               $log.debug('event', event);
               $log.debug('toState', toState);
               $log.debug('toParams', toParams);
               $log.debug('fromState', fromState);
               $log.debug('fromParams', fromParams);
            });
            //
        }
    ]
)

.config(
    [           '$stateProvider', '$urlRouterProvider','$httpProvider',
        function($stateProvider, $urlRouterProvider,$httpProvider){

            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            $urlRouterProvider.otherwise('/home');

            $stateProvider  
                .state('home', {
                    url: '/home',
                    templateUrl: 'tpl/home.html',
                    data:{pageTitle:'望天树'}
                })
                .state('launch_merchants',{
                    url: '/launch_merchants',
                    templateUrl: 'tpl/launch_merchants.html',
                    data:{pageTitle:'发起招商任务'},
                    params: {'cityList': null}
                })
                .state('login',{
                    url:'/login',
                    templateUrl:'tpl/login.html',
                    data:{pageTitle:'登入'}
                })
                .state('signup',{
                    url:'/signup',
                    templateUrl:'tpl/signup.html',
                    data:{pageTitle:'注册'}
                })
                .state('citySelect',{
                    url:'/citySelect',
                    templateUrl:'tpl/citySelect.html',
                    data:{pageTitle:'任务发布区域'}
                })
                .state('user',{
                    url:'/user',
                    template:"<div ui-view></div>",
                    abstract:true
                })
                .state('user.info',{
                    url:"/info",
                    templateUrl:'tpl/user_info.html',
                    data:{pageTitle:'我的'},
                    params: {
                        'referer': 'some default', 
                        'param2': 'some default', 
                        'etc': 'some default'
                    }
                })
                .state('user.basic',{
                    url:"/basic",
                    templateUrl:'tpl/user_basic_info.html',
                    data:{pageTitle:'基本信息'}
                })
                .state('user.founderCertify',{
                    url:"/founderCertify",
                    templateUrl:"tpl/certify/founderCertify.html",
                    data:{pageTitle:'分社群创始人认证'}
                })
                .state('user.memberCertify',{
                    url:'/memberCertify',
                    templateUrl:'tpl/certify/memberCertify.html',
                    data:{pageTitle:'企业会员认证'}
                })
                .state('user.basic.name',{
                    url:'/name',
                    templateUrl:'tpl/user_basic_name.html',
                    data:{pageTitle:'修改姓名'}
                })
                .state('user.basic.all',{
                    url:'/all',
                    templateUrl:'tpl/user_basic_all.html',
                    data:{pageTitle:'个人信息'}
                })
                .state('merchants',{
                    url:'/merchants',
                    templateUrl:'tpl/merchants.html',
                    data:{pageTitle:'招商外包'}
                })
                .state('recruit',{
                    url:'/recruit',
                    templateUrl:'tpl/recruit.html',
                    data:{pageTitle:'招人外包'}
                })
                .state('search',{
                    url:'/search',
                    templateUrl:'tpl/search.html',
                    data:{pageTitle:'搜索'}
                })
                .state('publish',{
                    url:'/publish',
                    templateUrl:'tpl/publish.html',
                    data:{pageTitle:'...'}
                });
        }
    ]
)
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});