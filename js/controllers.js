'use strict';

angular.module('app.controllers',[])
	.controller('appController',['$scope','$state','cookieUtil','setTitle','$rootScope',function($scope,$state,cookieUtil,setTitle,$rootScope){

	}])
	.controller('headerController', ['$scope', function($scope){
		
	}])
	.controller('loginController', ['$scope','httpService','apiUrl','$log','$state',function($scope,httpService,apiUrl,$log,$state){
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
  			console.log(fromState.name);
  			$scope.preState = fromState.name;
        });
		$scope.user = {};
		$scope.ismask = false;
		$scope.ishow = false;
		$scope.user1 = {};
		$scope.user2 = {};
		$scope.userArr = [];
		$scope.login = function(user){
			var res = {
				LoginName:user.name,
				PassWord:user.password
			};
			httpService.noUserApi(apiUrl.UserLogin,res)
				.then(function(data){
					$log.debug(data)
					if(data.data.listuserResultSimp){
						$scope.ismask = true;
						$scope.ishow = true;
						$scope.userArr = data.data.listuserResultSimp;
						return;
					}
                    $state.go('user.info');
				}, function(data){
					alert("服务器错误")
				})
		};
		$scope.user_login = function(obj){
			var res = {
				UserId:obj.userId,
				UserSign:obj.userSign,
				PassWord:$scope.user.password
			};
			httpService.noUserApi(apiUrl.UserLogin,res)
				.then(function(data){
					$log.debug(data)
                    $state.go($scope.preState);
				}, function(data){
					alert("服务器错误")
				})
		};
	
		$scope.dismiss = function(){
			$scope.ismask = false;
			$scope.ishow = false;
		};
	}])
	.controller('SignupController', ['$scope','$state','httpService','validate','$log','apiUrl','cookieUtil', function($scope,$state,httpService,validate,$log,apiUrl,cookieUtil){
		$scope.user = {};
		$scope.ismask = false;
		$scope.ishow = false;
		$scope.errorMsg = null;
		$scope.user.codeBtn = "获取验证码";
		// $scope.userArr = [{nickName:"habe"},{nickName:"cheng"}]
		$scope.dismiss = function(){
			$scope.ismask = false;
			$scope.ishow = false;
		};

		$scope.getCode = function(user){
			$scope.errorMsg = null;
			if(!validate.isPhone(user.phone)){
				$scope.errorMsg = "手机格式不正确";
				return;
			}
			var res = {Phone:user.phone};
			httpService.noUserApi(apiUrl.UserSendCode,res)
				.then(function(data){
					alert("发送成功");
					$(".signup_check_btn").addClass('codeBtn').attr('disabled','true');
					$scope.user.codeBtn = 60;
					var setTime = setInterval(function(){
						$scope.$apply(function(){
							$scope.user.codeBtn--;
							if($scope.user.codeBtn == 0){
								$scope.user.codeBtn = "获取验证码";
								$(".signup_check_btn").removeClass('codeBtn').removeAttr('disabled');
								clearTimeout(setTime);
							}
						});
					}, 1000)
				}, function(data){
					alert("服务器错误")
				});
		};
		$scope.user_login = function(obj){
			var res = {
				UserId:obj.userId,
				UserSign:obj.userSign,
				PassWord:$scope.user.password
			};
			httpService.noUserApi(apiUrl.UserLogin,res)
				.then(function(data){
					$log.debug(data)
                    $state.go('user.info');
				}, function(data){
					alert("服务器错误")
				})
		};	
		$scope.user_register = function(user){
			var res = {
				Phone:user.phone,
				PassWord:user.password,
				Captcha:user.code,
				NickName:user.name,
				RegisterAnyway:true
			};
			httpService.noUserApi(apiUrl.UserRegister,res)
				.then(function(data){
                    $state.go('user.info');
				}, function(data){
					alert("服务器错误")
				});
		};	

		$scope.register = function(user){
			$scope.errorMsg = null;
			user.password = user.password + "";
			if(!validate.isPhone(user.phone)){
				$scope.errorMsg = "手机格式不正确";
				return;
			}
			if(user.password.length<6){
				$scope.errorMsg = "密码不得少于6位";
				return;
			}
			var res = {
				Phone:user.phone,
				PassWord:user.password,
				Captcha:user.code,
				NickName:user.name,
				RegisterAnyway:false
			};
			httpService.noUserApi(apiUrl.UserRegister,res)
				.then(function(data){
					if(data.data.multiple){
						$scope.userArr = data.data.list;
						console.log($scope.userArr)
						$scope.ismask = true;
						$scope.ishow = true;
					}else{
						$state.go('user.info');
					}
				}, function(data){
					alert("服务器错误")
				});
		};		
	}])
	.controller('userController', ['$scope','$log','$state','apiUrl','httpService','arrayUtil','cookieUtil', function($scope,$log,$state,apiUrl,httpService,arrayUtil,cookieUtil){
		$scope.ishow = false;
		$scope.ismask = false;
		$scope.confirm = function(){
			if(arrayUtil.isInArray(["认证中","已认证","认证驳回"],$scope.user.certState)){
				$state.go("home");
			}else{
				$scope.ishow = true;
				$scope.ismask = true;
			}			
		};
		$scope.dismiss = function(){
			$scope.ishow = false;
			$scope.ismask = false;
		};
		$scope.logout = function(){
			cookieUtil.deleteCookie(".ASPXAUTHH5");
			$state.go('login');
		};
		// $scope.user = {};
		// //渲染页面
		httpService.getUserApi()
			.then(function(data){
				$scope.user = {
					nickName:data.data.nickName,
					userTypeName:data.data.userTypeName,
					certStateName:data.data.certStateName
				};
			}, function(data){
				// alert(5)
			});

		
	}])
	.controller('userBasicController', ['$scope','arrayUtil','httpService','apiUrl','$log', function($scope,arrayUtil,httpService,apiUrl,$log){
		$scope.ishow = false;
		$scope.ismask = false;
		$scope.user = {};
		$scope.confirm = function(){
			if(arrayUtil.isInArray(["认证中","已认证","认证驳回"],$scope.user.certState)){
				$state.go("home");
			}else{
				$scope.ishow = true;
				$scope.ismask = true;
			}			
		};
		$scope.dismiss = function(){
			$scope.ishow = false;
			$scope.ismask = false;
		};
		httpService.postApi(apiUrl.UserGet,{})
			.then(function(data){
				$log.debug(data);
				$scope.user = {
					nickName:data.data.nickName,
					userTypeName:data.data.userTypeName,
					name:data.data.name,
					sexName:data.data.sexName,
					birthday:data.data.birthday,
					mobile:data.data.mobile,
					wechat:data.data.wechat,
					qq:data.data.qq,
					email:data.data.email,
					reqService:data.data.reqService,
					trade:data.data.trade,
					company:data.data.company,
					job:data.data.job,
					workLocation:data.data.workLocation,
					skillTag:data.data.skillTag,
					advantage:data.data.advantage,
					workExperience:data.data.workExperience,
					educationExperience:data.data.educationExperience,
					diploma:data.data.diploma,
					workYears:data.data.workYears,
					expectSalary:data.data.expectSalary,
					expectWorkLocation:data.data.expectWorkLocation
				};
				$log.debug(data.data.certState);
				switch(data.data.certState) {
					case 1:
						$scope.user.certState = "未认证";
						break;
					case 2:
						$scope.user.certState = "认证中";
						break;
					case 3:
						$scope.user.certState = "已认证";
						break;
					case 4:
						$scope.user.certState = "认证驳回";
						break;
					case 5:
						$scope.user.certState = "未认证";
						break;
				};
			}, function(data){
			});
	}])
	.controller('founderController', ['$scope', function($scope){
		$scope.user = {};
		$scope.save = function(user){
			var res = {
				Name:user.name,
				WechatGroup:user.groupName,
				Identity:user.id,
				Phone:user.phone,
				Email:user.email,
				Company:user.email,
				Job:user.email,
				Location:user.email,
				Commit:user.email
			}
		};
		$scope.authen = function(){};
	}])
	.controller('memberCertify', ['$scope', 'apiUrl', 'httpService', '$stateParams','cookieUtil', "$log", function($scope, apiUrl, httpService, $stateParams,cookieUtil, $log) {
		httpService.postApi(apiUrl.UserGet, {}).then(function(data) {$log.debug(data);}, function(data) {});
		$scope.user = {}
		$scope.member = {}
		$scope.user.bank = '请选择您的开户行';
		//$scope.banks = ['请选择您的开户行', '招商银行', '中国农业银行', '中国建设银行'];
		httpService.postApi(apiUrl.ValuesBanks,{})
				.then(function(data) {
					$scope.banks = data.data;
					//$log.debug(data);
				}, function(data) {
					$log.debug(data);
				})
		httpService.postApi(apiUrl.UserGetOriginatorInfo,{}/*,{"UserId":9}*/)
				.then(function(data) {
					$scope.memOriginatorInfo = data;
					//$log.debug(data);
				}, function(data) {
					$log.debug(data);
				})
		
		$scope.saveEnterInfo = function(member,bol) {
			var params = {
				Name: member.Name,
				Phone: member.Phone,
				Bank: member.Bank,
				BankSite: member.bankSite,
				BankAccount: member.bankAccount,
				BusinessLisence: "",
				ContactPerson: member.contactPerson,
				ContactMobile: member.contactMobile,
				ContactWechat: member.contactWechat,
				ContactEmail: member.contactEmail,
				Commit: bol,
			};
			if(params.Commit){
				
				
			}else{
				$(".little_btn").addClass("poiEventsNone");
			}
			/*$log.debug(params);
			return;*/
			httpService.postApi(apiUrl.UserSaveCompanyInfo, params)
				.then(function(data) {
					$(".little_btn").removeClass("poiEventsNone");
					$log.debug(data);
				}, function(data) {
					$(".little_btn").removeClass("poiEventsNone");
					$log.debug(data);
				})

		}
	}])
	.controller('userAllController', ['$scope', function($scope){
		//选择日期弹窗js 
		var _date = document.getElementById("datepicker");
	    var datePicker = new DatePicker({
	    confirmCbk: function(data) {
	        _date.value = data.year + '-' + data.month + '-' + data.day;
	    }
	    });
        _date.onfocus = function(e) {
            _date.blur();
        	datePicker.open();
        };
        // $scope
        $scope.ishow = false;
		$scope.ismask = false;
		$scope.user  = {};
        $scope.user.skillTag = "ps,add,dsfs,dsf";
        $scope.stagArr = $scope.user.skillTag.split(",");
        $scope.addTag = function(){
        	$scope.ishow = true;
			$scope.ismask = true;
        };
        $scope.dismiss = function(){
			$scope.ishow = false;
			$scope.ismask = false;
		};
		$scope.cancel = function(){
			$scope.ishow = false;
			$scope.ismask = false;
		};
		$scope.sure = function(){
			$scope.stagArr.push($scope.user.addInputTag);
			$scope.ishow = false;
			$scope.ismask = false;
		};
	}])
	.controller('userNameController', ['$scope','httpService','apiUrl', function($scope,httpService,apiUrl){
		$scope.delete = function(){
			$scope.user.nickName = "";
		};
		$scope.save = function(){
			httpService.postApi(apiUrl.UserSaveSelective,{Field:"NickName",Value:$scope.user.nickName})
				.then(function(data){
					alert("保存成功");
				}, function(data){

				})
		}
	}])
	.controller('footerController', ['$scope','passValues','$state','$log', function($scope,passValues,$state,$log){
		$scope.currentState = $state.current.name;
		$scope.isUser = /user*/.exec($scope.currentState);
	}])
	.controller('homeController', ['$scope','$http','httpService','$state','apiUrl', function($scope,$http,httpService,$state,apiUrl){
		//公告轮播
		$scope.announceArr = [];
		httpService.noUserApi(apiUrl.NoticeInfoGetList,{})
			.then(function(data){
				console.log(data.data);
				$scope.announceArr = data.data;
			}, function(data){});
		setTimeout(function(){
		var Mar = document.getElementById("Marquee");
		var child_div=Mar.getElementsByTagName("div");
		var picH = 20;//移动高度
		var scrollstep=3;//移动步幅,越大越快
		var scrolltime=20;//移动频度(毫秒)越大越慢
		var stoptime=3000;//间断时间(毫秒)
		var tmpH = 0;
		function start(){
			if(tmpH < picH){
				tmpH += scrollstep;
				if(tmpH > picH )tmpH = picH ;
				Mar.scrollTop = tmpH;
				setTimeout(start,scrolltime);
			}else{
				tmpH = 0;
				Mar.appendChild(child_div[0]);
				Mar.scrollTop = 0;
				setTimeout(start,stoptime);
			}
		}
		setTimeout(start,stoptime);
		}, 500);
		// 公告轮播-->
		
		// kv轮播
		$scope.kvArr = [];
		httpService.noUserApi(apiUrl.NoticeInfoGetCarouselList,{})
			.then(function(data){
				console.log("kv:"+data.data);
			}, function(data){});
		// kv轮播-->

		// 发起任务
		$scope.ismask = false;
		$scope.pop1 = false;
		$scope.pop2 = false;
		$scope.dismiss = function(){
			$scope.ismask = false;
			$scope.pop1 = false;
			$scope.pop2 = false;
		};
		if(!(document.cookie.indexOf(".ASPXAUTHH5")==-1)){			
			httpService.getUserApi().then(function(data){
					$scope.user_info = data.data;
				}, function(data){});
			$scope.postTask = function(){	
				switch ($scope.user_info.userType) {
					case 1:
						$scope.ismask = true;
						$scope.pop1 = true;
						break;
					case 2:
						$scope.ismask = true;
						$scope.pop1 = true;
						break;
					default :
						break;
				}		
			};
		}else{
			$scope.allduty = function(){
				$state.go('login');
			}
		}
		
		TouchSlide({ 
		  slideCell:"#leftTabBox",
		  autoPlay:true,
		  delayTime:500
		});
	}])
	.controller('sourceController', ['$scope', function($scope){
		$scope.Bsources = [{
			src:"../img/source.jpg",
			title:'韩国纸尿裤第一品牌-可帝宝纸尿裤',
			time:"2016-5-23",
			price:"首单回款10%",
			detail:"可帝宝纸尿裤是由C&Bzhiye可帝宝纸尿裤是裤是由C&Bzhiye可帝宝纸尿裤是由可帝...."
		},{
			src:"../img/source.jpg",
			title:'韩国纸尿裤第一品牌-可帝宝纸尿裤',
			time:"2016-5-23",
			price:"首单回款10%",
			detail:"可帝宝纸尿裤是由C&Bzhiye可帝宝纸尿裤是裤是由C&Bzhiye可帝宝纸尿裤是由可帝...."
		}];
		$scope.Psources = [{
			src:"../img/source.jpg",
			title:'韩国纸尿裤第一品牌-可帝宝纸尿裤',
			time:"2016-5-23",
			price:"￥3000/人",
			detail:"可帝宝纸尿裤是由C&Bzhiye可帝宝纸尿裤是裤是由C&Bzhiye可帝宝纸尿裤是由可帝...."
		},{
			src:"../img/source.jpg",
			title:'韩国纸尿裤第一品牌-可帝宝纸尿裤',
			time:"2016-5-23",
			price:"￥3000/人",
			detail:"可帝宝纸尿裤是由C&Bzhiye可帝宝纸尿裤是裤是由C&Bzhiye可帝宝纸尿裤是由可帝...."
		}];
	}])
	.controller('launchMmerchantController', ['$scope','apiUrl','httpService','$stateParams','passValues','$state', function($scope,apiUrl,httpService,$stateParams,passValues,$state){
		var u = passValues.get();
		console.log(u);
		$scope.user={
			trade:u.trade,
			title:u.title,
			description:u.description,
			date:u.date,
			reward:u.reward,
			divReward:u.divReward,
			proName:u.proName,
			proBrand:u.proBrand,
			proLocation:u.proLocation,
			proSize:u.proSize,
			proPrice:u.proPrice
		};
		if(u.trade){
			angular.forEach(u.trades,function(value,key){
				if(value.industryId == u.trade){
					$scope.user.trade = value.industryName;
				}
			})
		}
		//选择日期弹窗js end
		var _date = document.getElementById("datepicker");
	    var datePicker = new DatePicker({
	    confirmCbk: function(data) {
	        _date.value = data.year + '-' + data.month + '-' + data.day;
	    }
	    });
        _date.onfocus = function(e) {
            _date.blur();
        	datePicker.open();
        };
        $scope.ishow = false;
		$scope.ismask = false;
		$scope.dismiss = function(){
			$scope.ishow = false;
			$scope.ismask = false;
		};
		$scope.cancel = function(){
			$scope.ishow = false;
			$scope.ismask = false;
		};
		$scope.cityList = $stateParams.cityList;
		console.log("$scope.cityList:"+$scope.cityList)
		if($scope.cityList != null && $scope.cityList != ""){
			$scope.user.city = "已设置";
		};
		$scope.changePrice = function(){
			$scope.ishow = true;
			$scope.ismask = true;
		};
		$scope.sure = function(){
			$scope.user.reward = $(".launch_pop_price_active").attr('value');
			$scope.user.divReward = (0.8*$scope.user.reward).toFixed(2);
			$scope.ishow = false;
			$scope.ismask = false;
		};
		$scope.submit = function(){
			var res = {
				IndustryId:$(".userTrade").val(),
				Title:$scope.user.title,
				Description:$scope.user.description,
				Deadline:$("#datepicker").val(),
				Reward:$scope.user.reward,
				DistReward:$scope.user.divReward,
				ProductName:$scope.user.proName,
				ProductBrand:$scope.user.proBrand,
				ProductOrigin:$scope.user.proLocation,
				ProductSpec:$scope.user.proSize,
				SugRetailPrice:$scope.user.proPrice,
				AreaIds:$scope.cityList,
				CompanyIntroUrls:"",
				ProductUrls:"",
				ProductDetailUrls:"",
				PolicyUrls:"",
				Commit:true
			}
			console.log(res);
			// httpService.postApi(apiUrl.TaskSaveCanvass,res)
			// 	then(function(data){

			// 	}, function(data){})
		};
		$scope.goCity = function(){
			var user = {
				trades:$scope.trades,
				trade:$scope.user.trade,
				title:$scope.user.title,
				description:$scope.user.description,
				date:$("#datepicker").val(),
				reward:$scope.user.reward,
				divReward:$scope.user.divReward,
				proName:$scope.user.proName,
				proBrand:$scope.user.proBrand,
				proLocation:$scope.user.proLocation,
				proSize:$scope.user.proSize,
				proPrice:$scope.user.proPrice
			};
			passValues.set(user);
			$state.go('citySelect',{cityList:$scope.user.city})
		};
		$(".launch_pop_price").click(function(event) {
			$(this).addClass('launch_pop_price_active').siblings().removeClass('launch_pop_price_active');
		});
		httpService.postApi(apiUrl.ValuesIndustry,{})
			.then(function(data){
				$scope.trades = data.data;
				console.log($scope.trades);
			}, function(data){});
	}])
	.controller('citySelectController', ['$scope','apiUrl','httpService','$state','$stateParams', function($scope,apiUrl,httpService,$state,$stateParams){		
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
  			$scope.preState = fromState.name;
  			//选择城市回传	
  			if(fromParams.cityList){			
  				$scope.huiCityList = fromParams.cityList;
  			}else{
  				$scope.huiCityList = [];
  			}
  			//选择城市回传end
        });
		$scope.data = [];
		$scope.country = false;
		httpService.postApi(apiUrl.ValuesAreas,{})
		.then(function(data){
			if(data.data.nations[1].name == "中国"){
				$scope.provinces = data.data.nations[1].provinces; 
			}else{
				$scope.provinces = data.data.nations[0].provinces; 
			}
			
			angular.forEach($scope.provinces, function(value,key){
				value.isOpen = false;
				value.active = false;
				if($scope.huiCityList.indexOf(value.id) != -1){
					value.active = true;
				}
				angular.forEach(value.cities,function(v,k){
					v.active = false;
					v.provinceId = angular.copy(value.id);
					v.arrayId = key;
					if($scope.huiCityList.indexOf(v.id) != -1){
						v.active = true;
					}
				})
			});
		}, function(data){});
		$scope.clickProvince = function(province){
			province.isOpen = !province.isOpen;
		};
		$scope.selePro = function(province){
			province.active = !province.active;
			var isfull = true;
			angular.forEach(province.cities,function(value,key){
				if(province.active)
					province.cities[key].active = true;
				else{
					province.cities[key].active = false;
					$scope.country = false;
				}
			});
			angular.forEach($scope.provinces,function(value,key){
				if(!value.active){
					isfull = false;
				}
			})
			if(isfull){
				$scope.country = true;
			}
		};
		$scope.seleCity = function(city){
			city.active = !city.active;
			var isfull = true;
			angular.forEach($scope.provinces[city.arrayId].cities,function(value,key){
				if(!value.active){
					isfull = false;
					$scope.provinces[city.arrayId].active = false;
					$scope.country = false;
				} 
			});
			if(isfull){
				$scope.provinces[city.arrayId].active = true;
			}
		};
		$scope.allCountry = function(){
			$scope.country = !$scope.country;
			if($scope.country){
				angular.forEach($scope.provinces,function(value,key){
					value.active = true;
					angular.forEach(value.cities,function(v,k){
						v.active = true;
					})
				})
			}else{
				angular.forEach($scope.provinces,function(value,key){
					value.active = false;
					angular.forEach(value.cities,function(v,k){
						v.active = false;
					})
				})
			}
		};
		$scope.sure = function(){
			angular.forEach($scope.provinces,function(value,key){
				if(value.active){
					$scope.data.push(value.id);
				}else{
					angular.forEach(value.cities,function(v,k){
						if(v.active){
							$scope.data.push(v.id);
						}
					})
				}
			})
			$state.go('launch_merchants',{cityList:$scope.data});
		};		
	}])
	.controller('searchController', ['$scope','$http', function($scope,$http){
		$scope.user = {
			message:"first time"
		};
		setTimeout(function(){
			$scope.$apply(function(){
				$scope.user.message = "second time";
			});
		}, 2000);
		$scope.flag = true;
		$scope.handle = function(){
			alert();
		};
	}]);