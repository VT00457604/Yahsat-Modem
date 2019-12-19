'use strict';
app.controller('antennaCtrl', function($scope, $location, $timeout, sharedData, AuditLog, $rootScope, $window) {
    localStorage.setItem('currentPage', 'antenna');
    document.addEventListener("deviceready", onDeviceReady, false);
    $rootScope.AILoading = false;
    $rootScope.worder = false;
    $scope.rworder = false;

    var toaData = sharedData.getToaData();
    var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();
    var curv1, curv2, curv3, curv1Txt, curv3Txt;
    if (ordertype === 'it' || ordertype == 'mav') {
        curv1 = "2";
        curv2 = "3";
        curv3 = "4";
        curv1Txt = 'EQUIPMENT_CHECK';
        curv3Txt = 'COMMISSIONING_ACTIVATION';
    }else if(ordertype == 'at'  || ordertype == 'ma'){
        curv1 = "1";
        curv2 = "2";
        curv3 = "3";
        curv1Txt = 'LOGIN_VIEW_ACTIVITY';
        curv3Txt = '';
    }
	
    $scope.historygo = function() {
    	if (ordertype == 'it'){
		$location.path('/equipment');
		//$window.history.back();
    	} else {
    		$location.path('/equipment_at');
    		//$window.history.back();
    	}
	}
    $scope.headerObj = {
        title: "ANTENNA_POINTING",
        subTitle: "ANTENNA_POINTING",
        curv1: curv1,
        curv1Txt: curv1Txt,
        curv2: curv2,
        curv2Txt: 'ANTENNA_POINTING',
        curv3: curv3,
        curv3Txt: curv3Txt,
        active: true,
        curv1Active: false,
        curv2Active: true,
        curv3Active: false,
        expandedStep: true
    };
    $scope.imgSrc = "img/antenna_pointing_icon.png";
    $scope.disabledStat = {
        disabled1: true,
        disabled2: false,
        disabled3: true
    };
    $scope.stepsObj = [
        'OPENPNP',
        'ADJUST_ANTENNA',
        'CHECK_QUANTITY',
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
    $scope.showotp = false;
    $scope.otperrshow = false;
	
	/* Get Beam ID */
	if (sharedData.getUrlParameter("BeamID", toaData) != "") {
		$scope.BeamID = EditBeamId(sharedData.getUrlParameter("BeamID", toaData), 0);
		switch(Number($scope.BeamID)) {
			case 31: $scope.BeamID = 1; break;
			case 32: $scope.BeamID = 2; break;
			case 33: $scope.BeamID = 3; break;
			case 34: $scope.BeamID = 4; break;
			case 35: $scope.BeamID = 5; break;
			case 36: $scope.BeamID = 6; break;
			case 37: $scope.BeamID = 7; break;
			case 38: $scope.BeamID = 8; break;
			case 39: $scope.BeamID = 9; break;
			case 40: $scope.BeamID = 10; break;
			case 41: $scope.BeamID = 11; break;
			case 42: $scope.BeamID = 12; break;
			case 43: $scope.BeamID = 13; break;
			case 44: $scope.BeamID = 14; break;
			case 45: $scope.BeamID = 15; break;
			case 46: $scope.BeamID = 16; break;
			case 47: $scope.BeamID = 17; break;
			case 48: $scope.BeamID = 18; break;

			case 49:
				if (sharedData.getUrlParameter("BeamID", toaData).indexOf('49a') > -1) {
					$scope.BeamID = 19;
				} else if (sharedData.getUrlParameter("BeamID", toaData).indexOf('49b') > -1) {
				   $scope.BeamID = 20;
				}
				break;

			case 50: $scope.BeamID = 21; break;
			case 51: $scope.BeamID = 22; break;

			case 52:
				if (sharedData.getUrlParameter("BeamID", toaData).indexOf('52a') > -1) {
					$scope.BeamID = 23;
				} else if (sharedData.getUrlParameter("BeamID", toaData).indexOf('52b') > -1) {
				   $scope.BeamID = 24;
				}
				break;
			case 53: $scope.BeamID = 25; break;
			case 54: $scope.BeamID = 26; break;
			case 55: $scope.BeamID = 27; break;
			case 56: $scope.BeamID = 28; break;
			case 57: $scope.BeamID = 29; break;
		}
	} else {
		$scope.BeamID = "";
	}
	/**/
	
    function onDeviceReady() {
        CDV.WEBINTENT.onNewIntent(function(url) {
            console.log(url);
            if (url !== "" && url !==null) {
                if (decodeURIComponent(url).indexOf("ntc-master://pointandplay") >= 0) {
                    sharedData.setPnpData(url);
                    $scope.loadPage();
                }
            }
        });

         CDV.WEBINTENT.getUri(function(url) {
            if(url !== "" && url !==null) {
                if (decodeURIComponent(url).indexOf("ntc-master://pointandplay") >= 0) {
                    sharedData.setPnpData(url);
                    $scope.loadPage();
                }
            }
        });
    };

    window.addEventListener('pointandplay', IOSgoOnNextScreen);

    function IOSgoOnNextScreen(e) {
        $scope.loadPage();
    }
    
    $scope.loadPage = function() {
        var pnpData = sharedData.getPnpData();
        if (pnpData) {
            $timeout(function() {
                $scope.data = pnpData;
                /*$scope.data = localStorage.getItem('PNPData');*/
                var status = sharedData.getUrlParameter("status", $scope.data.toLowerCase());
                if (status.split(":")[0] == "success" || status.split(":")[0] == "ok") {
                    //for hiding otp field in model
                    $rootScope.OTP = 1;
                    //end
                    $scope.dialogmsg = 'POINTING_DONE';
                    $scope.dialogimg = "img/done_icon.png";
                    $scope.footerbtn = false;
                    var logobj = {
                        "antennaPointing": "success"
                    };
                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
                    ordertype = sharedData.getUrlParameter("activity_type", sharedData.getToaData()).toLowerCase();
                    if (ordertype === 'it' || ordertype === 'mav' || ordertype === 'at' || ordertype === 'mi') {
                        $scope.nextPageUrl = '/commissioning';
                    }else if(ordertype === 'ma'){
                        $scope.nextPageUrl = '/login';
                        $timeout(function() {
                            window.location.href = TOA_URL;
                        }, 4000);                        
                    }

                } else {
                	if (ordertype === 'it' || ordertype == 'mi' || ordertype == 'ma'){
	                    localStorage.setItem('isPointed','true')
	                    $scope.dialogmsg = 'CERTIFICATION_FAILED';
	                    $scope.dialogimg = "img/error_icon.png";
	                    $scope.footerbtn = true;
	                    $scope.successbtn = 'RE_POINTING';
	                    $scope.errorbtn = 'SKIP';
	                    var logobj = {
	                        "antennaPointing": "failed"
	                    };
	                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
	                    $scope.errbtnshow = true;
                	} else {
                		 localStorage.setItem('isPointed','true')
 	                    $scope.dialogmsg = 'CERTIFICATION_FAILED';
 	                    $scope.dialogimg = "img/error_icon.png";
 	                    $scope.footerbtn = true;
 	                    $scope.successbtn = 'RE_POINTING';
 	                   if (ordertype === 'ma' || ordertype === 'ra'){
 	                	  $scope.errorbtn = 'CANCELANTENNA';
 	                   } else if (ordertype === 'it'){
 	                	  $scope.errorbtn = 'CANCELEQUIPMENT';
 	                   }else {
 	                	   $scope.errorbtn = 'CANCEL';
 	                   }
 	                    var logobj = {
 	                        "antennaPointing": "failed"
 	                    };
 	                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
 	                    $scope.errbtnshow = true;
                	}
                }
                $scope.modalin = true;

            }, 0);

        }
    };

    //remove first letter of beam id if exist, only integer should pass to Point&Play
    function EditBeamId(inputtxt, index) {
        var letters =  /\d+/g;
        return inputtxt.match(letters)[index]
    }

    $scope.getAllDetails = function(toaData) {
        
		/*$scope.BeamID = EditBeamId(sharedData.getUrlParameter("BeamID", toaData), 0);
        switch(Number($scope.BeamID)) {
            case 31: $scope.BeamID = 1; break;
            case 32: $scope.BeamID = 2; break;
            case 33: $scope.BeamID = 3; break;
            case 34: $scope.BeamID = 4; break;
            case 35: $scope.BeamID = 5; break;
            case 36: $scope.BeamID = 6; break;
            case 37: $scope.BeamID = 7; break;
            case 38: $scope.BeamID = 8; break;
            case 39: $scope.BeamID = 9; break;
            case 40: $scope.BeamID = 10; break;
            case 41: $scope.BeamID = 11; break;
            case 42: $scope.BeamID = 12; break;
            case 43: $scope.BeamID = 13; break;
            case 44: $scope.BeamID = 14; break;
            case 45: $scope.BeamID = 15; break;
            case 46: $scope.BeamID = 16; break;
            case 47: $scope.BeamID = 17; break;
            case 48: $scope.BeamID = 18; break;

            case 49:
                if (sharedData.getUrlParameter("BeamID", toaData).indexOf('49a') > -1) {
                    $scope.BeamID = 19;
                } else if (sharedData.getUrlParameter("BeamID", toaData).indexOf('49b') > -1) {
                   $scope.BeamID = 20;
                }
                break;

            case 50: $scope.BeamID = 21; break;
            case 51: $scope.BeamID = 22; break;

            case 52:
                if (sharedData.getUrlParameter("BeamID", toaData).indexOf('52a') > -1) {
                    $scope.BeamID = 23;
                } else if (sharedData.getUrlParameter("BeamID", toaData).indexOf('52b') > -1) {
                   $scope.BeamID = 24;
                }
                break;
            case 53: $scope.BeamID = 25; break;
            case 54: $scope.BeamID = 26; break;
            case 55: $scope.BeamID = 27; break;
            case 56: $scope.BeamID = 28; break;
            case 57: $scope.BeamID = 29; break;
        }*/

        $scope.orbital = sharedData.getUrlParameter("orbital", toaData);
        $scope.ODUTypeId = sharedData.getUrlParameter("ODU_Type_ID", toaData);
        $scope.orbitalDeg = $scope.orbital.split(' ')[0];
        $scope.hemisphere = $scope.orbital.split(' ')[1];
        if(ordertype == 'at' || ordertype == 'it'){
        	$scope.isSkipCer = false;
        } else {
        	$scope.isSkipCer = true;
        }
        
    };

    $scope.redirect = function() {        
        var toaData = sharedData.getToaData();
        /*if(localStorage.getItem('isPointed')){
            if(localStorage.getItem('isPointed')==='true'){
                $scope.dialogmsg = 'CERTIFICATION_FAILED';
                $scope.dialogimg = "img/error_icon.png";
                $scope.footerbtn = true;
                $scope.successbtn = 'RE_POINTING';
                $scope.errorbtn = 'SKIP';            
                $scope.errbtnshow = true;              
                $scope.modalin = true;
                return;
            }
        }*/
        if (toaData) {
            $scope.getAllDetails(toaData);
            var localdata = "ntc-pnp://yahsat?BeamId=" + $scope.BeamID + "&ODUTypeId=" + $scope.ODUTypeId + "&OrbitalDegrees=" + $scope.orbitalDeg + "&Hemisphere=" + $scope.hemisphere + "&SkipCertification=" + $scope.isSkipCer + "&DisableCertificationSkipping=true&Lang=en_US&ReturnApp=Yahsat-Master&ReturnAppURL=ntc-master://pointandplay";
            
			if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
				alert(localdata);
				//alert("Beam Id: "+$scope.BeamID+"\n"+"Orbital Degree: "+$scope.orbitalDeg+"\n"+"ODUType Id: "+$scope.ODUTypeId+"\n"+"Hemisphere: "+$scope.hemisphere+"\n"+"SkipCertification: "+$scope.isSkipCer);
			}
			
            var missing = "";
			if ($scope.BeamID == "" || $scope.BeamID == undefined) {
				missing = "Beam ID";
			}
			if ($scope.ODUTypeId == "" || $scope.ODUTypeId == undefined) {
				missing += " ODU Type ID";
			}
			if ($scope.orbitalDeg == "" || $scope.orbitalDeg == undefined) {
				missing += " Orbital Degree";
			}
			if ($scope.hemisphere == "" || $scope.hemisphere == undefined) {
				missing += " Hemisphere";
			}
			
			if (missing != "") {
				alert("Mandatory parameter(s) as follows are missing: " + missing);
			} else {
				// window.open(localdata, "_system");
				window.plugins.webintent.startActivity({
						action: window.plugins.webintent.ACTION_VIEW,
						url: localdata,
					},
					function() {
						console.log("Point and Play successfully launched")
					},
					function() {
						console.log("Point and Play could not be launched");
					}
				);
			}
        }
    };

    function getNumSic(sic) {
        var _sic = sic.split("");
        for (var i = 0; i < _sic.length; i++) {
            if (isNaN(_sic[i]) === true) {
                _sic[i] = _sic[i].charCodeAt(0);
            } else {
                _sic[i] = Number(_sic[i])
            }
        }
        return _sic.join("");
    }


    var hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
    $scope.successaction = function(otpval) {
        var toaData = sharedData.getToaData(toaData);

        //to be deleted after testing
        if (otpval == "0001") {
            $scope.getAllDetails(toaData);
            $scope.isSkipCer = true;
            
            var logobj = {
                "antennaPointing": "success with skip certification"
            };
            sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
            if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
              	alert("Ordertype: "+ordertype);
      		}
            if(ordertype == 'at'){
                window.location.href = TOA_URL;
                $location.path('/login');
            } else if(ordertype == 'ma'){ 
            	sharedData.uploadAllLog();
            	window.location.href = TOA_URL;
                $location.path('/login');
            }else{
                $location.path('/commissioning');
            }
            
            return;
        }

        /*----------------------------*/
        if (otpval) {
            var SIC = sharedData.getUrlParameter("SIC", toaData).substr(0, 5);
            var localTime = moment.utc(new Date()).toDate();
            //var ourPassword=hashids.encode(getNumSic(SIC), localTime);
            var usrPassword = hashids.decode(otpval);
            var timestamp = moment.utc(new Date(usrPassword[1])).toDate(); 

            if (getNumSic(SIC) == usrPassword[0]) {
                if ((timestamp > localTime) || (localTime > timestamp)) {
                    $scope.getAllDetails(toaData);
                    if(ordertype == 'at'){
                    	$scope.isSkipCert = false;
                    } else {
                    	$scope.isSkipCert = true;
                    }
                    //for hiding otp field in model
                    $rootScope.OTP = 1;                
                    var logobj = {
                        "antennaPointing": "success with skip certification"
                    };
                    sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
                    if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                      	alert("Ordertype: "+ordertype);
              		}
                    if(ordertype == 'at'){
                    	$scope.isSkipCert = false;
                        window.location.href = TOA_URL;
                        $location.path('/login');
                    } else if(ordertype == 'ma'){
                    	$scope.isSkipCert = false;
                    	sharedData.uploadAllLog();
                        window.location.href = TOA_URL;
                        $location.path('/login');                    	
                    } else{  
                    	$scope.isSkipCert = true;
                    	 if (toaData) {
                             $scope.getAllDetails(toaData);
                             var localdata = "ntc-pnp://yahsat?BeamId=" + $scope.BeamID + "&ODUTypeId=" + $scope.ODUTypeId + "&OrbitalDegrees=" + $scope.orbitalDeg + "&Hemisphere=" + $scope.hemisphere + "&SkipCertification=" + $scope.isSkipCert + "&DisableCertificationSkipping=true&Lang=en_US&ReturnApp=Yahsat-Master&ReturnAppURL=ntc-master://pointandplay";
                             
                 			if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                 				alert(localdata);
                 				//alert("Beam Id: "+$scope.BeamID+"\n"+"Orbital Degree: "+$scope.orbitalDeg+"\n"+"ODUType Id: "+$scope.ODUTypeId+"\n"+"Hemisphere: "+$scope.hemisphere+"\n"+"SkipCertification: "+$scope.isSkipCer);
                 			}
                 			
                             var missing = "";
                 			if ($scope.BeamID == "" || $scope.BeamID == undefined) {
                 				missing = "Beam ID";
                 			}
                 			if ($scope.ODUTypeId == "" || $scope.ODUTypeId == undefined) {
                 				missing += " ODU Type ID";
                 			}
                 			if ($scope.orbitalDeg == "" || $scope.orbitalDeg == undefined) {
                 				missing += " Orbital Degree";
                 			}
                 			if ($scope.hemisphere == "" || $scope.hemisphere == undefined) {
                 				missing += " Hemisphere";
                 			}
                 			
                 			if (missing != "") {
                 				alert("Mandatory parameter(s) as follows are missing: " + missing);
                 			} else {
                 				// window.open(localdata, "_system");
                 				window.plugins.webintent.startActivity({
                 						action: window.plugins.webintent.ACTION_VIEW,
                 						url: localdata,
                 					},
                 					function() {
                 						console.log("Point and Play successfully launched")
                 					},
                 					function() {
                 						console.log("Point and Play could not be launched");
                 					}
                 				);
                 			}
                         }
                        $location.path('/commissioning');
                    }
                    //window.localStorage.setItem('PNPData', localdata);
                } else {
                    //for showing otp field in model
                    $rootScope.OTP = 0;
                    //end
                    $scope.otpMes = "OTP_EXPIRED"
                    $scope.otperrshow = true;
                    $scope.modalin = true;
                }

            } else {
                //for showing otp field in model
                $rootScope.OTP = 0;
                //end
                $scope.otpMes = "ENTER_VALID_OTP"
                $scope.otperrshow = true;
                $scope.modalin = true;
            }
        }else {
            if ($scope.dialogmsg == 'Do you want to Return the work order ?') {
                window.location.href = TOA_URL;
                $rootScope.worder = true;
                $scope.modalin = false;
                $scope.uplodLog();
                //after returning workorder navigate to login page
                $timeout(function() {
                    $location.path('/login');
                }, 1000);
                sharedData.clearPortalLog();
                window.localStorage.clear(); 
                
            } else {
                if (toaData) {
                    $scope.getAllDetails(toaData);
                    var localdata = "ntc-pnp://yahsat?BeamId=" + $scope.BeamID + "&ODUTypeId=" + $scope.ODUTypeId + "&OrbitalDegrees=" + $scope.orbitalDeg + "&Hemisphere=" + $scope.hemisphere + "&SkipCertification=" + $scope.isSkipCer + "&DisableCertificationSkipping=true&Lang=en_US&ReturnApp=Yahsat-Master&ReturnAppURL=ntc-master://pointandplay";
                    
					if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
						alert(localdata);
						//alert("Beam Id: "+$scope.BeamID+"\n"+"Orbital Degree: "+$scope.orbitalDeg+"\n"+"ODUType Id: "+$scope.ODUTypeId+"\n"+"Hemisphere: "+$scope.hemisphere+"\n"+"SkipCertification: "+$scope.isSkipCer);
					}
					
					var missing = "";
					if ($scope.BeamID == "" || $scope.BeamID == undefined) {
						missing = "Beam ID";
					}
					if ($scope.ODUTypeId == "" || $scope.ODUTypeId == undefined) {
						missing += " ODU Type ID";
					}
					if ($scope.orbitalDeg == "" || $scope.orbitalDeg == undefined) {
						missing += " Orbital Degree";
					}
					if ($scope.hemisphere == "" || $scope.hemisphere == undefined) {
						missing += " Hemisphere";
					}
					
					if (missing != "") {
						alert("Mandatory parameter(s) as follows missing: " + missing);
					} else {
						// window.open(localdata, "_system");
						window.plugins.webintent.startActivity({
								action: window.plugins.webintent.ACTION_VIEW,
								url: localdata,
							},
							function() {
								console.log("Point and Play successfully launched")
							},
							function() {
								console.log("Point and Play could not be launched");
							}
						);
					}
                    $scope.modalin = false;
                }
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
    }




});