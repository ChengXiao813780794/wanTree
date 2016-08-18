'use strict'

angular.module('app.services', [])
	.factory('apiUrl',function(){
		return {
			UserRegister:'User/Register',
			UserSendCode:'User/SendCode',
			UserLogin:'User/Login',
			UserGet:'User/Get',
			UserSaveSelective:'User/SaveSelective',
			ValuesIndustry:"Values/Industry",
			ValuesAreas:'Values/Areas',
			NoticeInfoGetList:'NoticeInfo/GetList',
			NoticeInfoGetCarouselList:'NoticeInfo/GetCarouselList',
			TaskSaveCanvass:'Task/SaveCanvass',
			UserSaveOriginatorInfo:'User/SaveOriginatorInfo',
			UserSaveCompanyInfo:'User/SaveCompanyInfo',//企业会员信息认证
			UserGetOriginatorInfo:'User/GetOriginatorInfo',//获取企业会员信息列表
			ValuesBanks:'Values/Banks'//获取银行列表
		};
	})
	.factory('validate', function(){
		return {
			isPhone:function(input){
				return (/0?(13|14|15|18)[0-9]{9}/).exec(input) ? true : false;	
			}
		};
	})
	.factory('arrayUtil',function(){
		return {
			isInArray:function(array,value){
				var len = array.length;
				for(var i = 0;i<len;i++){
					if(array[i] == value)
						return true;
				}
				return false;
			}
		};
	})
	.factory('cookieUtil',['$cookieStore', function($cookieStore){
		return {
			getCookies:function(key){
				return $cookieStore.get(key);
			},
			setCookies:function(key,value){
				$cookieStore.put(key,value);
			},
			deleteCookie:function(key){
				$cookieStore.remove(key);
			}
		};
	}])
	.factory('passValues',['$http', function($http){
		var u = {};
		return {
			get:function(){
				return u;
			},
			set:function(user){
				u = user;
			}
		}
	
	}])
	.factory('httpService', ['$http','$q','cookieUtil','$state','apiUrl', function($http,$q,cookieUtil,$state,apiUrl){
		var preUrl = "/Api"; 
		return {
			postApi:function(url,res){
				var d = $q.defer();
				var msg = {
					_ajax: true,
					method:url,
					json: JSON.stringify(res)
				};
				if(document.cookie.indexOf(".ASPXAUTHH5")==-1){
						$state.go('login');
						d.reject();		
				}else{
					$http.post( preUrl, msg )
					.success(function( data, status, headers, config ){
						if(data.isBizSuccess){
							d.resolve(data);
						}else{
							alert(data.bizErrorMsg);
							d.reject();
						}						
					})
					.error(function( data, status, headers, config ){
						d.reject(data);
					});
				};	
				return d.promise;
			},
			noUserApi:function(url,res){
				var d = $q.defer();
				var msg = {
					_ajax: true,
					method:url,
					json: JSON.stringify(res)
				};
				$http.post( preUrl, msg )
					.success(function( data, status, headers, config ){
						if(data.isBizSuccess){
							d.resolve(data);
						}else{
							alert(data.bizErrorMsg);
						}						
					})
					.error(function( data, status, headers, config ){
						d.reject(data);
					});
				return d.promise;
			},
			getUserApi:function(){
				var d = $q.defer();
				var msg = {
					_ajax: true,
					method:apiUrl.UserGet,
					json: JSON.stringify({})
				};
				if(document.cookie.indexOf(".ASPXAUTHH5")==-1){
						$state.go('login');
						d.reject();		
				}else{
					$http.post( preUrl, msg )
					.success(function( data, status, headers, config ){
						if(data.isBizSuccess){
							d.resolve(data);
						}else{
							alert(data.bizErrorMsg);
							d.reject();
						}						
					})
					.error(function( data, status, headers, config ){
						d.reject(data);
					});
				};				
				return d.promise;
			}
		};
	}])
	.factory('setTitle',[ '$rootScope' ,function($rootScope){
		return {
			a:function(title){
				var $body = $('body');
				document.title = title;
				var $iframe = $("<iframe style='display:none;'></iframe>");
				$iframe.on('load',function() {
				setTimeout(function() {
				  $iframe.off('load').remove();
				}, 0);
				}).appendTo($body);
			}			
		};
	}])




	;
	// .factory('AuthService', function ($http, Session) {
	// 	var authService = {};

	// 	authService.login = function (credentials) {
	// 		return $http
	// 			.post('/login', credentials)
	// 			.then(function (res) {
	// 				Session.create(res.data.id, res.data.user.id,res.data.user.role);
	// 				return res.data.user;
	// 			});
	// 	};

	// 	authService.isAuthenticated = function () {
	// 		return !!Session.userId;
	// 	};

	// 	authService.isAuthorized = function (authorizedRoles) {
	// 		if (!angular.isArray(authorizedRoles)) {
	// 			authorizedRoles = [authorizedRoles];
	// 		}
	// 		return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	// 	};
	// 	return authService;
	// })
	// .service('Session', function () {
	//   	this.create = function (sessionId, userId, userRole) {
	// 	    this.id = sessionId;
	// 	    this.userId = userId;
	// 	    this.userRole = userRole;
	//   	};
	//   	this.destroy = function () {
	// 	    this.id = null;
	// 	    this.userId = null;
	// 	    this.userRole = null;
	//   	};
 // 	 	return this;
	// });

