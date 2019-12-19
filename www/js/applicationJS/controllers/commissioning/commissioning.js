'use strict';
app.controller('commissioningCtrl', function($scope, $location, $timeout, sharedData, AuditLog, cmsngService, $http, $rootScope, $window) {
    localStorage.setItem('currentPage', 'commissioning');
    $rootScope.AILoading = false;
    $scope.rworder = false;
    $rootScope.worder = false;
    $scope.loaderImg = false;
    $scope.timer = '';
    var statusCount = 1;
    var statusInterval;
    var hitRetry=false;
    var errorId = '';
    var interval;
    var toaData = sharedData.getToaData();
    var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();
    var curv1, curv2, curv3, curv1Txt, curv2Txt, curv3Txt, subTitle;
    var connected_modem="true";
    var renameInventory= {
    		oldValue:'',
    		newValue:''
    }
    curv1 = "2";
    curv2 = "3";
    curv3 = "4";
    subTitle = 'COMMISSIONING_ACTIVATION';
    curv1Txt = 'ANTENNA_POINTING'
    curv2Txt = 'COMMISSIONING_ACTIVATION';
    curv3Txt = 'MATERIAL_USE_RECORD';
    
    $scope.historygo = function() {
		$location.path('/antenna');
		//$window.history.back();
	}
    
    $scope.headerObj = {
        title: curv2Txt,
        subTitle: subTitle,
        curv1: curv1,
        curv1Txt: curv1Txt,
        curv2: curv2,
        curv2Txt: curv2Txt,
        curv3: curv3,
        curv3Txt: curv3Txt,
        active: true,
        curv1Active: false,
        curv2Active: true,
        curv3Active: false,
        expandedStep: false
    };
    $scope.imgSrc = "img/commissioning_activation_icon.png";
    $scope.disabledStat = {
        disabled1: true,
        disabled2: false,
        disabled3: true
    };
    $scope.stepsObj = [
        'ACTIVATE_DEVICE'
    ];

    $scope.barObj = {
        leftbar: true,
        rightbar: true
    };
    $scope.workorder = false;
    $scope.modalin = false;
    $scope.dialogmsg = 'Unsuccessfull feasiblity test. There was a change of Beam or the antenna size. Please return to work order.';
    $scope.dialogimg = "img/error_icon.png";
    $scope.footerbtn = false;
    $scope.footerdisable = false;


    var _url = sharedData.getToaData();
    $scope.woid = (sharedData.getUrlParameter('appt_number', _url)).trim();
    $scope.activityid = sharedData.getUrlParameter("activityid", _url)
    $scope.latitude = sharedData.getUrlParameter('lat', _url);
    $scope.longitude = sharedData.getUrlParameter('lang', _url);
    $scope.user = sharedData.getUrlParameter('ulogin', _url);
    $scope.servicepartnerid = sharedData.getUrlParameter('servicepartnerid', _url);
    $scope.language = "en";
    $scope.orderType = sharedData.getUrlParameter("activity_type", _url);

    var scannedInventory = sharedData.removeKey(sharedData.getCurrentInventory(), 'inventorydetail');
    var scannedInventory = sharedData.removeKey(scannedInventory, 'equipmentsalemode');
    var scannedInventory = sharedData.removeKey(scannedInventory, 'user');
    

    var cmsngValidateObj = {
        "woid": $scope.woid,
        "fsotype ": $scope.orderType,
        "user": $scope.user,
        "servicepartnerid": $scope.servicepartnerid,
        "distributorid": "",
        "equipment": scannedInventory
    }

    var commissioningReq = {
        "woid": $scope.woid,
        "fsotype": $scope.orderType,
        "user": $scope.user,
        "servicepartnerid": $scope.servicepartnerid,
        "distributorid": ""
    }

    var showError = function(message) {
        $scope.dialogmsg = message;
        $scope.dialogimg = "img/error_icon.png";
        $scope.footerbtn = true;
        $scope.successbtn = 'OK';
        $scope.errorbtn = 'RETRY';
        $scope.nextPageUrl = '';
        $scope.errbtnshow = true;
    }
    
    var showErrors = function(message) {
        $scope.dialogmsg = message;
        $scope.dialogimg = "img/error_icon.png";
        $scope.footerbtn = true;
        $scope.successbtn = 'OK';
        //$scope.errorbtn = 'RETRY';
        $scope.nextPageUrl = '';
        $scope.errbtnshow = true;
    }
    
    function getModemDetails(fnName) {
    	//alert("Parameter Name "+fnName);
    	
        $rootScope.AILoading = true;
       // var deferred = $q.defer();
        localStorage.setItem("GetModemDetails",'http://192.168.1.1/cgi-bin/cgiclient?request={"FunctionName":"' + fnName + '"}');
        $http({
            method: 'GET',
            async:false,
            url: 'http://192.168.1.1/cgi-bin/cgiclient?request={"FunctionName":"' + fnName + '"}',
            crossDomain: true,
            timeout: 2000,
            headers: {
            	'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,OPTIONS',
				'Access-Control-Allow-Headers' : 'Content-Type, Authorization, Content-Length, X-Requested-With',
				'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(function(data) {
        	if(data.data.RequestData){
        		localStorage.setItem("GetModemDetailsSuccess",JSON.stringify(data));
        		localStorage.setItem("GetModemDetailsSuccessStatusCode",JSON.stringify(data.status));
	        	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
	        		 alert("New Modem API Success"+JSON.stringify(data));
	        	 }
	        	 if(data.data.RequestData.Hardware.SerialNumber){
		        	 var fields = JSON.stringify(data.data.RequestData.Hardware.SerialNumber);
		    		 var fields1 = JSON.parse(fields).split('-');
		        	$scope.modem = checkAvailablity(fields1[0], 'MDM', 8);
					//$scope.loaderImg = false;
					if ($scope.modem == false) {
						$scope.oduNotValid = true;					
						$scope.dialogmsg = 'MODEM_CONNECTED_NOT_VALID';
						$scope.dialogimg = "img/error_icon.png";
						$scope.footerbtn = true;
						$scope.modalin = true;
						$scope.successbtn = 'MODEM_ODU_CONNECTED_OK';	
						$rootScope.AILoading = false;
					} else {
						var _length = localStorage.getItem("OldModem").length;
						var srNo = localStorage.getItem("OldModem").substr(_length-8, 8);
						if(fields1[0] == srNo){					
							localStorage.setItem('MODEMAPI', 'FALSE');
							//$scope.redirect();
							getOduDetails('GetODUInformation');
						} else {
							$scope.dialogmsg = 'MODEM_MISMATCH';
				        	$scope.dialogimg = "img/error_icon.png";
							$scope.footerbtn = true;
							$scope.modalin = true;
							$scope.successbtn = 'MODEM_OK';
							$scope.errorbtn = 'MODEM_CANCEL';
							$scope.errbtnshow = true;
						}
					} 
	        	 } else {
	        		 localStorage.setItem("GetModemDetailsError",JSON.stringify(data));
	        		 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
	               		 alert("New Modem API Error 1"+JSON.stringify(data));
	               	 }
	        		 $scope.dialogmsg = 'NEWTEC_MODEM';
	            	$scope.dialogimg = "img/error_icon.png";
	    			$scope.footerbtn = true;
	    			$scope.modalin = true;
	    			$scope.successbtn = 'MODEM_SOA_OK';
	    			$scope.errorbtn = '';
					$scope.errbtnshow = false;
	                //deferred.reject(error);
	                $rootScope.AILoading = false;
	        	 }
        	} else {
        		localStorage.setItem("GetModemDetailsError",JSON.stringify(data));
        		if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
           		 alert("New Modem API Error 2"+JSON.stringify(data));
           	 	}
        		$scope.dialogmsg = 'NEWTEC_MODEM';
            	$scope.dialogimg = "img/error_icon.png";
    			$scope.footerbtn = true;
    			$scope.modalin = true;
    			$scope.successbtn = 'MODEM_SOA_OK';
                //deferred.reject(error);
                $rootScope.AILoading = false;
        	}
            //deferred.resolve(data);                
            $rootScope.AILoading = false;
        }, function(error) {
        	localStorage.setItem("GetModemDetailsError",JSON.stringify(error));
        	localStorage.setItem("GetModemDetailsErrorStatusCode",JSON.stringify(error.status));
        	
        	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
        		 alert("New Modem API Error"+JSON.stringify(error));
        	 }
        	$scope.dialogmsg = 'NEWTEC_MODEM';
        	$scope.dialogimg = "img/error_icon.png";
			$scope.footerbtn = true;
			$scope.modalin = true;
			$scope.successbtn = 'MODEM_SOA_OK';
            //deferred.reject(error);
            $rootScope.AILoading = false;
        });
        return deferred.promise;
    }
    
    function checkAvailablity(code, type, limit) {
		var _url = sharedData.getToaData();
		var inventory = sharedData.getInventory();
		var inInvList = false;
		var inScnList = false;
		var isValid = false;
		var user = sharedData.getUrlParameter("ulogin", _url);
		var eqItem;
		inInvList = inventory.some(function(item, index) {			
			if(limit==0){
				if (item.equipmentserialno == code && item.equipmenttype == type) eqItem = item;
				return (item.equipmentserialno == code && item.equipmenttype == type);
			}else{				
				let _length = item.equipmentserialno.length;				
				 if(item.equipmentserialno.substr(_length-limit, limit) == code && item.equipmenttype == type){
					 eqItem = item;
					 renameInventory={
							 oldValue:localStorage.getItem("OldModem"),
							 newValue:item.equipmentserialno
					 }
					 return true;
				 }
			}			
		})
		var scanObj = sharedData.getScannedInventory();
		for (var key in scanObj) {
			var scanInv = sharedData.getScannedInventory()[key];
			inScnList = scanInv.some(function(inv, index) {
				return (inv.equipmentserialno == code)
			})
			if (inScnList === true) break;
		}
		
		if (inInvList == true && inScnList == false) {
			eqItem.user = user;
			//scannedInventory.push(eqItem);
			isValid = true;
		}
		return isValid;
	}
    function changeValue(key, oldVal, newVal){
       // var arr = JSON.parse(localStorage.getItem(storageName));
    	var arr = sharedData.removeKey(sharedData.getCurrentInventory(), 'inventorydetail');
        var arr = sharedData.removeKey(scannedInventory, 'equipmentsalemode');
        var arr = sharedData.removeKey(scannedInventory, 'user');

        for(var i=0; i<arr.length; i++){
        	if(arr[i][key]==oldVal){
        		arr[i][key]=newVal;
        	}
        }
        scannedInventory = arr;
        localStorage.setItem("currentInventory",JSON.stringify(arr));
    }
    
    function getOduDetails(fnName) {
    	//alert("Parameter Name "+fnName);
    	
        $rootScope.AILoading = true;
       // var deferred = $q.defer();
        	localStorage.setItem("GetODUDetails",'http://192.168.1.1/cgi-bin/cgiclient?request={"FunctionName":"' + fnName + '"}');
        	//$http.get('http://192.168.1.1/cgi-bin/cgiclient?request={"FunctionName":"' + fnName + '"}')
        $http({
            method: 'GET',
            async:false,
            url: 'http://192.168.1.1/cgi-bin/cgiclient?request={"FunctionName":"' + fnName + '"}',
            crossDomain: true,
            timeout: 2000,
            headers: {
            	'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,OPTIONS',
				'Access-Control-Allow-Headers' : 'Content-Type, Authorization, Content-Length, X-Requested-With',
				'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(function(data) {
        	if(data.data.RequestData){
        		localStorage.setItem("GetODUDetailsSuccess",JSON.stringify(data));
        		localStorage.setItem("GetODUDetailsSuccessStatusCode",JSON.stringify(data.status));
	        	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
	        		 alert("New ODU API Success"+JSON.stringify(data));
	        	 }
	        	if(data.data.RequestData.ODUInformation.SerialNumber){
		        	var odufields = JSON.stringify(data.data.RequestData.ODUInformation.SerialNumber);
		        	var odufields1 = JSON.parse(odufields);
		        	$scope.odu = OducheckAvailablity(odufields1, 'RE');
					//$scope.loaderImg = false;
					if ($scope.odu == false) {
						$scope.oduNotValid = true;					
						$scope.dialogmsg = 'ODU_CONNECTED_NOT_VALID';
						$scope.dialogimg = "img/error_icon.png";
						$scope.footerbtn = true;
						$scope.modalin = true;
						$scope.successbtn = 'MODEM_ODU_CONNECTED_OK';
						$scope.errorbtn = '';
						 $scope.errbtnshow = false;
						$rootScope.AILoading = false;
					} else {
						if(odufields1 == localStorage.getItem("OldOdu")){					
							localStorage.setItem('ODUAPI', 'FALSE');
							 $scope.redirect();
						} else {
							$scope.dialogmsg = 'ODU_MISMATCH';
				        	$scope.dialogimg = "img/error_icon.png";
							$scope.footerbtn = true;
							$scope.modalin = true;
							$scope.successbtn = 'ODU_OK';
							$scope.errorbtn = 'MODEM_CANCEL';
							 $scope.errbtnshow = true;
						}
					} 
	        	} else {
	        		localStorage.setItem("GetODUDetailsError",JSON.stringify(data));
	            	
	            	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
	            		 alert("New ODU API Error1"+JSON.stringify(data));
	            	 }
	        		$scope.dialogmsg = 'NEWTEC_ODU';
	            	$scope.dialogimg = "img/error_icon.png";
	    			$scope.footerbtn = true;
	    			$scope.modalin = true;
	    			$scope.successbtn = 'MODEM_SOA_OK';
	    			$scope.errorbtn = '';
					 $scope.errbtnshow = false;
	                //deferred.reject(error);
	                $rootScope.AILoading = false;
	        	}
        	} else {
        		localStorage.setItem("GetODUDetailsError",JSON.stringify(data));
            	
            	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
            		 alert("New ODU API Error2"+JSON.stringify(data));
            	 }
        		$scope.dialogmsg = 'NEWTEC_MODEM';
            	$scope.dialogimg = "img/error_icon.png";
    			$scope.footerbtn = true;
    			$scope.modalin = true;
    			$scope.successbtn = 'MODEM_SOA_OK';
                //deferred.reject(error);
                $rootScope.AILoading = false;
        	}
            //deferred.resolve(data);                
            $rootScope.AILoading = false;
        }, function(error) {
        	localStorage.setItem("GetODUDetailsError",JSON.stringify(error));
        	localStorage.setItem("GetODUDetailsErrorStatusCode",JSON.stringify(error.status));
        	
        	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
        		 alert("New ODU API Error"+JSON.stringify(error));
        	 }
        	$scope.dialogmsg = 'NEWTEC_MODEM';
        	$scope.dialogimg = "img/error_icon.png";
			$scope.footerbtn = true;
			$scope.modalin = true;
			$scope.successbtn = 'MODEM_SOA_OK';
            //deferred.reject(error);
            $rootScope.AILoading = false;
        	
        });
        return deferred.promise;
    }
    
    function OducheckAvailablity(code, type) {
    	var _url = sharedData.getToaData();
		var inventory = sharedData.getInventory();
		var inInvList = false;
		var inScnList = false;
		var isValid = false;
		var user = sharedData.getUrlParameter("ulogin", _url);
		var eqItem;
		
		inInvList = inventory.some(function(item, index) {
			if (item.equipmentserialno == code && item.equipmenttype == type) {
				eqItem = item;
				renameInventory={
							 oldValue:localStorage.getItem("OldOdu"),
							 newValue:item.equipmentserialno
					 }
				return true;
			}			
		})
		
		var scanObj = sharedData.getScannedInventory();
		
		for (var key in scanObj) {
			var scanInv = sharedData.getScannedInventory()[key];
			inScnList = scanInv.some(function(inv, index) {
				return (inv.equipmentserialno == code)
			})
			if (inScnList === true) break;
		}
		
		if (inInvList == true && inScnList == false) {
			eqItem.user = user;
			//scannedInventory.push(eqItem);
			isValid = true;
		}

		return isValid;
	}
    
    /*-----Commissioning & Activation------*/
    $scope.redirect = function() {
    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    		alert("Connection Type : "+navigator.connection.type+"\n Status : "+navigator.onLine);
    	}
    	//Get Modem & ODU Device Information
		if (localStorage.getItem("MODEMAPI") == "TRUE") {
			 var orderType = sharedData.getUrlParameter("activity_type", sharedData.getToaData());
             if (orderType.toUpperCase() == "IT") {
				getModemDetails('GetDeviceInformation');
             }
		} else if (localStorage.getItem("ODUAPI") == "TRUE") {
			 var orderType = sharedData.getUrlParameter("activity_type", sharedData.getToaData());
             if (orderType.toUpperCase() == "IT") {
				getOduDetails('GetODUInformation');
             }
		}
        //show validation loader and call validate api
        $scope.loaderImg = true;
        $scope.loadermsg = 'VALIDATION_PROGRESS';       
        delete cmsngValidateObj.equipment[0]['invpool'];
        cmsngService.validate(cmsngValidateObj)
            .then(function(response) {
            	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
            		//alert("Validation Response Status: "+JSON.stringify(response.data.status));
					alert("SOA VALIDATION SUCCESS: "+JSON.stringify(response));
				}
                console.log('validation success');
                // now close validation loader
                //show activation loader
                //call activation api
                if (response.data.status == "INVALID" || response == "" || response == null) {
                    $scope.loaderImg = false;
                    $scope.modalin = true;
                    errorId = 'validation';
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    showError('VALIDATION_ERROR');
                    return;
                } else if (response.data.status != "VALID") {
                	$scope.loaderImg = false;
                    $scope.modalin = true;
                    errorId = 'validation';
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    showError('STATUS_ERROR');
                    return;
                } 
                $scope.loadermsg = 'ACTIVATION_PROGRESS';
                cmsngService.comission(commissioningReq)
                    .then(function(res) {
                    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
        					alert("COMMISSIONING SUCCESS: "+JSON.stringify(res));
        				}
                        //close activation loader
                        // now  call status
                        console.log('activation success');
                        statusCount = 1;
                        //call status api after 1.5 minutes
                        if (res.data.ResponseDescription == "Success") {
                        	localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
                            getComStatus();
                            countdown(6, 0, true);
                        } else {
                            errorId = 'activation';
                            console.log('activation error')
                            var logobj = {
                                "commissioning": "activation error"
                            };
                            sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
                            $scope.loaderImg = false;
                            $scope.modalin = true;
                            localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                            showError('COMMISSIONING_ERROR');
                        }

                        function getComStatus() {
                        	if(statusInterval)$timeout.cancel(statusInterval);
                        	        $scope.loaderImg = true;
		                            $scope.loadermsg = 'TIMER';// + statusCount;
		                            console.log('checking status--- attempt= ' + statusCount);
		                            statusInterval= $timeout(function() {
	                                cmsngService.status(commissioningReq)
	                                    .then(function(res) {
	                                    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
						    					alert("COMMISSIONING STATUS SUCCESS: "+JSON.stringify(res));
						    				}
	                                        $timeout(function() {
	                                            if (res.data.status == 'COMMISSIONED') {
	                                                localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
	                                                $scope.loaderImg = false;
	                                                var currentInv = sharedData.getCurrentInventory();
	                                                sharedData.setScannedInventory($scope.activityid, currentInv);
	                                                sharedData.setInventory(JSON.stringify(filterInventory(sharedData.getInventory(), currentInv)));
	                                                sharedData.uplodLog();

                                                     var orderType = sharedData.getUrlParameter("activity_type", sharedData.getToaData());
                                                     if (orderType.toUpperCase() == "AT") {
                                                        if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                                                            alert("ORDER TYPE : "+JSON.stringify(orderType));
                                                        }
                                                        sharedData.uninstall();
                                                     }
	                                                $scope.dialogmsg = 'COMMISSIONING_DONE';
	                                                $scope.dialogimg = "img/done_icon.png";
	                                                $scope.footerbtn = false;
	                                                $scope.modalin = true;
	                                                $scope.nextPageUrl = '/material';
	                                            } else if (res.data.status == 'COMMISSION_IN_PROGRESS') {
	                                                statusCount++
	                                                if (statusCount <= 4) {
	                                                    getComStatus();
	                                                   // countdown(6, 0, false);
	                                                } else {
	                                                	hitRetry=false;
	                                                    errorId = 'status';
	                                                    $scope.loaderImg = false;
	                                                    //showError('COMMISSIONING_ERROR');
	                                                    showErrors('TIMEOUT_ERROR');
	                                                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
	                                                    $scope.modalin = true;
	                                                }
	                                                localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
	                                            } else {
	                                            	hitRetry = false;
	                                            	 errorId = 'status';
	                                                 $scope.loaderImg = false;
	                                                 showError('COMMISSIONING_ERROR');
	                                                 localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
	                                                 $scope.modalin = true;
	                                            }
	                                        }, 0);

	                                    }, function(error) {
	                                    	hitRetry = false;
	                                    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
	                        					alert("COMMISSIONING STATUS ERROR : "+JSON.stringify(error));
	                        				}
	                                       if (error.status == "-1") {
						                		errorId = 'status';
						                        console.log('status error');
						                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
						                        var logobj = {
						                            "commissioning": "status error"
						                        };
						                        sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
						                        $scope.loaderImg = false;
						                       showError('STATUS_ERROR');
						                       $scope.modalin = true;
						                    }  else {
							                    errorId = 'status';
							                    console.log('status error');
							                    var logobj = {
							                        "commissioning": "status error"
							                    };
							                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
							                    $scope.loaderImg = false;
							                    showError('COMMISSIONING_ERROR');
							                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
							                    $scope.modalin = true;
						                    }
	                                    })
	                            }, 90000);
	                        }

                    }, function(error) {
                    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
        					alert("COMMISSIONING ERROR : "+JSON.stringify(error));
        				}
                        errorId = 'activation';
                        console.log('activation error')
                        var logobj = {
                            "commissioning": "activation error"
                        };
                        sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
                       // $scope.loaderImg = false;
                       // $scope.modalin = true;
                       // localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                       // showError('COMMISSIONING_ERROR');
                        if (error.status == "-1") {
                            $scope.loaderImg = false;
                            $scope.modalin = true;
                            errorId = 'activation';
                            localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                            showError('STATUS_ERROR');
                            return;
                        } else if (error.data.status != 'COMMISSIONED' && error.data.errorNumber != '412-9') {
                            $scope.loaderImg = false;
                            $scope.modalin = true;
                            errorId = 'activation';
                            localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                            showError('COMMISSIONING_ERROR');
                            return;
                        } else {
                        	$scope.loaderImg = false;
                            $scope.modalin = true;
                            localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                            showError('COMMISSIONING_ERROR');
                        }
                    })
            }, function(error) {
                errorId = 'validation';
                if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
					alert("SOA VALIDATION ERROR: "+JSON.stringify(error));
				}
                console.log('validation error');
                var logobj = {
                    "commissioning": "validation error"
                };
                sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
               // $scope.loaderImg = false;
               // $scope.modalin = true;
              //  localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
               // showError('STATUS_ERROR');
                if (error.status == "-1") {
                    $scope.loaderImg = false;
                    $scope.modalin = true;
                    errorId = 'validation';
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    showError('STATUS_ERROR');
                    return;
                } else if (error.data.errorNumber == "500-11"  && error.data.errorCode == "INVALID") {
                	$scope.loaderImg = false;
                	$scope.dialogmsg = 'FSOID_ERROR';
                	$scope.dialogimg = "img/error_icon.png";
                	errorId = 'validation';
                	$scope.footerbtn = true;
                	$scope.modalin = true;
                	$scope.successbtn = 'MODEM_SOA_OK';
                	$scope.errorbtn = '';
					$scope.errbtnshow = false;
                	$rootScope.AILoading = false;                	
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    return;
                } else if (error.data.errorCode == "INVALID" || error == "" || error == null ) {
                    $scope.loaderImg = false;
                    $scope.modalin = true;
                    errorId = 'validation';
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    showError('VALIDATION_ERROR');
                    return;
                } else if (error.data.errorNumber == "412-9" && error.data.errorCode == "INVALID_STATUS" ) {
                	statusCount = 1;
                    if (statusCount <= 4) {
                        retryToGetStatus();
                        countdown(6, 0, true);
                    } else {
                        errorId = 'status';
                        $scope.loaderImg = false;
                        showError('COMMISSIONING_ERROR');
                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        $scope.modalin = true;
                    }
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    return;
                } else {
                	$scope.loaderImg = false;
                    $scope.modalin = true;
                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                    showError('STATUS_ERROR');
                }
            });
        // upload log
        //old--- http://mma2ip:mma2ip@119.151.20.69:7003/InstallerPortal/rest/json/log/
        $http({
            method: 'GET',
            url: 'http://172.30.34.2:7004/InstallerPortal/rest/json/log/' + $scope.woid,
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': 'Basic bW1hMmlwOm1tYTJpcA=='
            }
        }).then(function(response) {
            sharedData.setPortalData($scope.woid, response.data);
        });

    };


    //action on retry
    $scope.errorAction = function() {
        if ($scope.errorbtn == 'NO') {
            $scope.hotline = false;
            $scope.modalin = false;
            return;
        }
       statusCount = 1;
        if (errorId == 'validation') {
            $timeout(function() {
                $scope.redirect();
            }, 4100)
        } else if (errorId == 'activation') {
        	$scope.loadermsg = 'ACTIVATION_PROGRESS';
            cmsngService.comission(commissioningReq)
                .then(function(res) {
                	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    					alert("RETRY COMMISSIONING SUCCESS: "+JSON.stringify(res));
    				}
                    //close activation loader
                    // now  call status
                    console.log('activation success');
                    
                    //call status api after 1.5 minutes
                    if (res.data.ResponseDescription == "Success") {
                    	statusCount = 1;
                    	localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
                    	retryToGetStatus();
                        countdown(6, 0, true);
                    } else {
                        errorId = 'activation';
                        console.log('activation error')
                        var logobj = {
                            "commissioning": "activation error"
                        };
                        sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
                        $scope.loaderImg = false;
                        $scope.modalin = true;
                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        showError('COMMISSIONING_ERROR');
                    }

                }, function(error) {
                	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    					alert("RETRY COMMISSIONING ERROR: "+JSON.stringify(error));
    				}
                    errorId = 'activation';
                    console.log('activation error')
                    var logobj = {
                        "commissioning": "activation error"
                    };
                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
                   // $scope.loaderImg = false;
                   // $scope.modalin = true;
                   // localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                   // showError('COMMISSIONING_ERROR');
                    if (error.status == "-1") {
                        $scope.loaderImg = false;
                        $scope.modalin = true;
                        errorId = 'activation';
                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        showError('STATUS_ERROR');
                        return;
                    } else if (error.data.status != 'COMMISSIONED' && error.data.errorNumber != '412-9') {
                        $scope.loaderImg = false;
                        $scope.modalin = true;
                        errorId = 'activation';
                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        showError('COMMISSIONING_ERROR');
                        return;
                    } else {
                    	$scope.loaderImg = false;
                        $scope.modalin = true;
                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        showError('COMMISSIONING_ERROR');
                    }
                })
        }else if (errorId == 'status') {
            //get status
        	if(hitRetry==false){
        		hitRetry = true;
        		statusCount = 1;
                retryToGetStatus();
                countdown(6, 0, true);
        	}
        	
        }
    }

    function filterInventory(arr2, arr1) {
        var newA = arr2.filter(function(el, i) {
            var ele = arr1.some(function(elem, index) {
                return (el.equipmentserialno == elem.equipmentserialno);
            })
            if (ele !== true) {
                return el
            };
        })
        return newA;
    }
    
    function retryToGetStatus() {  
    	if(statusInterval)$timeout.cancel(statusInterval);
        $scope.loaderImg = true;
        $scope.loadermsg = 'TIMER';// + statusCount;
        console.log('checking status--- attempt= ' + statusCount);
        statusInterval= $timeout(function() {
            cmsngService.status(commissioningReq)
                .then(function(res) {
                	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    					alert("RETRY COMMISSIONING STATUS: "+JSON.stringify(res));
    				}
                    $timeout(function() {
                        if (res.data.status == 'COMMISSIONED') {
                        	localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
                            $scope.loaderImg = false;
                            var currentInv = sharedData.getCurrentInventory();
                            sharedData.setScannedInventory($scope.activityid, currentInv);
                            sharedData.setInventory(JSON.stringify(filterInventory(sharedData.getInventory(), currentInv)));
                            sharedData.uplodLog();
                            var orderType = sharedData.getUrlParameter("activity_type", sharedData.getToaData());
                             if (orderType.toUpperCase() == "AT") {
                                if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                                    alert("ORDER TYPE : "+JSON.stringify(orderType));
                                }
                                sharedData.uninstall();
                             }                        
                            $scope.dialogmsg = 'COMMISSIONING_DONE';
                            $scope.dialogimg = "img/done_icon.png";
                            $scope.footerbtn = false;
                            $scope.modalin = true;                            
                            $scope.nextPageUrl = '/material';
                        } else if (res.data.status == 'COMMISSION_IN_PROGRESS') {
                            statusCount++
                            if (statusCount <= 4) {                            	
                                retryToGetStatus();
                                //countdown(6, 0, false);
                            } else {
                            	hitRetry=false;
                                errorId = 'status';
                                $scope.loaderImg = false;
                                //showError('COMMISSIONING_ERROR');
                                showErrors('TIMEOUT_ERROR');
                                localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                                $scope.modalin = true;
                            }
                            localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        } else {
                        	hitRetry = false;
                            errorId = 'status';
                            $scope.loaderImg = false;
                            showError('COMMISSIONING_ERROR');
                            localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                            $scope.modalin = true;
                        }
                    }, 0);

                }, function(error) {
                	hitRetry = false;
                	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    					alert("RETRY COMMISSIONING STATUS ERROR: "+JSON.stringify(error));
    				}
                	
                	if (error.status == "-1") {
                		errorId = 'status';
                        console.log('status error');
                        localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
                        var logobj = {
                            "commissioning": "status error"
                        };
                        sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
                        $scope.loaderImg = false;
                       showError('STATUS_ERROR');
                       $scope.modalin = true;
                    }  else {
	                    errorId = 'status';
	                    console.log('status error');
	                    var logobj = {
	                        "commissioning": "status error"
	                    };
	                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
	                    $scope.loaderImg = false;
	                    showError('COMMISSIONING_ERROR');
	                    localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
	                    $scope.modalin = true;
                    }
                })
        }, 90000);
    }

    $scope.successaction = function() {
        var promise;
        if ($scope.dialogmsg == 'RETURN_WO') {
        	localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
            $rootScope.worder = true;
            window.location.href = TOA_URL;
            $scope.modalin = false;
            sharedData.uplodLog();
            //after returning workorder navigate to login page
            $timeout(function() {
                $location.path('/material');
            }, 1000);
            sharedData.clearPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()));
            sharedData.clearStorage()
        } else if($scope.successbtn == 'MODEM_OK'){
        	$scope.modalin = false;
        	changeValue("equipmentserialno",renameInventory.oldValue,renameInventory.newValue);
        	localStorage.setItem('MODEMAPI', 'FALSE');
        	//$scope.redirect();
        	getOduDetails('GetODUInformation');
        } else if($scope.successbtn == 'ODU_OK'){
        	$scope.modalin = false;
        	changeValue("equipmentserialno",renameInventory.oldValue,renameInventory.newValue);
        	localStorage.setItem('ODUAPI', 'FALSE');
        	$scope.redirect();
        }else if($scope.successbtn == 'MODEM_SOA_OK'){
        	$scope.modalin = false;
        } else if($scope.successbtn == 'MODEM_ODU_CONNECTED_OK'){
        	$scope.modalin = false;
        	$timeout(function() {
                $location.path('/equipment');
            }, 1000);
        } else {
            if (!$scope.hotline) {
                $rootScope.AILoading = true;
                promise = $timeout(function() {
                    $scope.dialogmsg = 'CONTACT_HOTLINE';
                    $scope.dialogimg = "img/question_icon.png";
                    $scope.footerbtn = true;
                    $scope.successbtn = 'YES';
                    $scope.errorbtn = 'NO';
                    $scope.errbtnshow = true;
                    $scope.hotline = true;
                    $scope.modalin = true;
                    $rootScope.AILoading = false;
                }, 3000);
            } else {
                $rootScope.AILoading = true;
                $timeout.cancel(promise);
                $scope.hotline = false;
                $scope.modalin = false;
                $timeout(function() {
                    $rootScope.AILoading = false;
                    $location.path('/material');
                }, 3000);
            }
        }

    };

    $scope.returnOrder = function() {
        $scope.rworder = true;
        $scope.dialogmsg = 'RETURN_WO';
        $scope.dialogimg = "img/question_icon.png";
        $scope.footerbtn = true;
        $scope.errorbtn = "NO";
        $scope.successbtn = "YES";
        $scope.errbtnshow = true;
        $scope.modalin = true;
    };

    function countdown(minutes, seconds, reset) {
        // set time for the particular countdown
    	if(interval && reset == true){
    		clearInterval(interval);
    	}
        var time = minutes * 60 + seconds;
        interval = setInterval(function() {
            // if the time is 0 then end the counter
            if (time <= 0) {
                clearInterval(interval);
                return;
            }
            var minutes = Math.floor(time / 60);
            if (minutes < 10) minutes = "0" + minutes;
            var seconds = time % 60;
            if (seconds < 10) seconds = "0" + seconds;
            var text = minutes + ':' + seconds;
            $scope.timer = text;
            $scope.$digest();
            time--;
        }, 1000);
    }
});