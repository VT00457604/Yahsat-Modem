'use strict';
app.controller('equipmentCtrl', function($scope, $location, $timeout, sharedData, AuditLog, $rootScope, $http, $route, $window) {
	localStorage.setItem('currentPage', 'equipment');
	
	$scope.showotp = false;
	var scannedInventory = [];
	var curv1 = 1,
		curv2 = 2,
		curv3 = 3;
	var toaData = sharedData.getToaData();
	var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();
	$scope.historygo = function() {
		$location.path('/login');
		//$window.history.back();
	}
	$scope.headerObj = {
		title: "EQUIPMENT_CHECK",
		subTitle: "EQUIPMENT_CHECK",
		curv1: curv1,
		curv1Txt: 'LOGIN_VIEW_ACTIVITY',
		curv2: curv2,
		curv2Txt: 'EQUIPMENT_CHECK',
		curv3: curv3,
		curv3Txt: 'ANTENNA_POINTING',
		active: true,
		curv1Active: false,
		curv2Active: true,
		curv3Active: false,
		expandedStep: true
	};
	
	/* Zameer's code start */
	/*if ( !localStorage.getItem('attemptNumber') ) { // First search attempt
		$scope.headerObj['subTitle'] = "Scan Installed Inventory";
	} else { // Second search attempt
		$scope.headerObj['subTitle'] = "Scan New Inventory";
	}*/
	/* Zameer's code end */
	
	$rootScope.AILoading = false;
	$rootScope.worder = false;
	$scope.rworder = false;
	$scope.imgSrc = "img/execution_icon.png";
	$scope.disabledStat = {
		disabled1: true,
		disabled2: false,
		disabled3: true
	};
	$scope.stepsObj = [
		'SCAN_MODEM_ODU_ANTENNA'
	];

	$scope.barObj = {
		leftbar: true,
		rightbar: true
	};
	$scope.workorder = false;
	$scope.modalin = false;
	//$scope.dialogmsg = 'Unsuccessfull feasiblity test. There was a change of Beam or the antenna size. Please retry with the another inventory.';
	$scope.dialogimg = "img/error_icon.png";
	$scope.footerbtn = false;
	$scope.footerdisable = false;
	$scope.inventory = {
		modem: "",
		odu: "",
		antenna: ""
	}

	$scope.modemNotValid=false;
	$scope.oduNotValid=false;
	$scope.antennaNotValid=false;
	$scope.modem;
	$scope.odu;
	$scope.antenna;
	$scope.scanner = function(item) {
		cordova.plugins.barcodeScanner.scan(
			// success callback function
			function(result) {
				// wrapping in a timeout so the dialog doesn't free the app
				setTimeout(function() {
					/* confirm("We got a barcode\n" +
						   "Result: " + result.text + "\n" +
						   "Format: " + result.format + "\n" +
						   "Cancelled: " + result.cancelled);*/
					switch (item) {
						case 'modem':
							$scope.inventory.modem = result.text;
							$scope.modemNotValid=false;
							break;
						case 'odu':
							$scope.inventory.odu = result.text;
							$scope.oduNotValid=false;
							break;
						case 'antenna':
							$scope.inventory.antenna = result.text;
							$scope.antennaNotValid=false;
							break;
					}
					$scope.$digest();
				}, 200);
			},
			// error callback function
			function(error) {
				alert("Scanning failed: " + error);
			},
			// options object
			{
				"preferFrontCamera": false,
				"showFlipCameraButton": false,
				"showTorchButton": true,
				"orientation": "portrait"
			}
		)
	}

	$scope.loadPage = function(modem, odu, antenna) {
		$scope.modemNotValid=!modem;
		$scope.oduNotValid=!odu;
		$scope.antennaNotValid=!antenna;
		$timeout(function() {            
			if (modem == true && odu == true && antenna == true) {				
				var _url = sharedData.getToaData();
				var activityid = sharedData.getUrlParameter("activityid", _url)
				sharedData.setCurrentInventory(scannedInventory);
				$scope.dialogmsg = 'EQUIPMENT_CHECK_DONE';
				$scope.dialogimg = "img/done_icon.png";
				$scope.footerbtn = false;
				var logobj = {
					"equipmentChek": "success"
				};
				
				sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()), logobj);
				
				/* Zameer's code start */
				/*if (localStorage.getItem('attemptNumber') && localStorage.getItem('attemptNumber') == "2") {
					localStorage.removeItem('attemptNumber');*/
					$scope.nextPageUrl = '/antenna';
				/*} else {
					localStorage.setItem('attemptNumber', "2");
					$route.reload(); // Reload the page
				}*/
				/* Zameer's code end */
				
			} else {                
				if (modem == false) {
					$scope.dialogmsg = 'MODEM_NOT_VALID'                    
				} else if (odu == false) {
					$scope.dialogmsg = 'ODU_NOT_VALID'                    
				} else if (antenna == false) {
					$scope.dialogmsg = 'ANTENNA_NOT_VALID'                    
				}
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				//$scope.nextPageUrl = '/wifi';
				/* var logobj = {
					 "equipmentChek": "failed"
				 };
				 sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()),logobj);*/
			}
			$scope.modalin = true;

		}, 0);
	};

	$scope.invValidation = function() {
		scannedInventory = [];
		$scope.modem = checkAvailablity($scope.inventory.modem,'MDM');
		$scope.odu = checkAvailablity($scope.inventory.odu,'RE');
		$scope.antenna = checkAvailablity($scope.inventory.antenna,'ANT');
		localStorage.setItem("OldModem", $scope.inventory.modem);
		localStorage.setItem("OldOdu", $scope.inventory.odu);
		$scope.loadPage($scope.modem, $scope.odu, $scope.antenna);
	}

	function checkAvailablity(code, type) {
		var _url = sharedData.getToaData();
		var inventory = sharedData.getInventory();
		var inInvList = false;
		var inScnList = false;
		var isValid = false;
		var user = sharedData.getUrlParameter("ulogin", _url);
		var eqItem;
		
		inInvList = inventory.some(function(item, index) {
			if (item.equipmentserialno == code && item.equipmenttype == type) eqItem = item;
			return (item.equipmentserialno == code && item.equipmenttype == type);
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
			scannedInventory.push(eqItem);
			isValid = true;
		}

		return isValid;
	}

	/*---------------------------------------------*/
	$scope.orderDiscontinue=function(){  
		/*$rootScope.OTP = 0;
		$scope.dialogmsg = 'PLEASE_ENTER_OTP';
		$scope.dialogimg = "img/otp_icon.png";
		$scope.footerbtn = true;
		$scope.successbtn = 'SUBMIT';
		$scope.errorbtn = 'CANCEL';
		$scope.errbtnshow = true;
		$scope.showotp = true;
		$scope.otpinpt = "";       
		$scope.errbtnshow = true;              
		$scope.modalin = true;*/
		var toaData = sharedData.getToaData();
		var apptNum = sharedData.getUrlParameter("appt_number", toaData);
		var logobj = {
			"Equipment_Check": "Order cancelled"
		};
		sharedData.setPortalLog(apptNum, logobj);
		$timeout(function() {
			$location.path('/login');
		}, 1000);
		window.location.href = TOA_URL;
		return;
	}
	$scope.getAllDetails = function(toaData) {
		$scope.orbital = sharedData.getUrlParameter("orbital", toaData);
		$scope.ODUTypeId = sharedData.getUrlParameter("ODU_Type_ID", toaData);
		$scope.orbitalDeg = $scope.orbital.split(' ')[0];
		$scope.hemisphere = $scope.orbital.split(' ')[1];
		$scope.isSkipCer = false;
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

	$scope.otperrshow=false;
	var hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
	$scope.successaction = function(otpval) {
		var toaData = sharedData.getToaData();
		var apptNum=sharedData.getUrlParameter("appt_number", toaData);
		var SIC = sharedData.getUrlParameter("SIC", toaData).substr(0, 5);
		//to be deleted after testing
		if (otpval == "0001") { 
			$rootScope.OTP = 1;           
			var logobj = {
				"Equipment_Check": "Order cancelled"
			};
			sharedData.setPortalLog(apptNum, logobj);
			$timeout(function() {
				$location.path('/login');
			}, 1000);
			window.location.href = TOA_URL;
			return;
		}

		/*----------------------------*/
		if (otpval) {            
			var localTime = moment.utc(new Date()).toDate();
			var usrPassword = hashids.decode(otpval);
			var timestamp = moment.utc(new Date(usrPassword[1])).toDate(); 

			if (getNumSic(SIC) == usrPassword[0]) {
				if (timestamp > localTime) {                    
					//for hiding otp field in model
					$rootScope.OTP = 1;                
					var logobj = {
						"Equipment_Check": "Order cancelled"
					};
					sharedData.setPortalLog(apptNum, logobj);
					$timeout(function() {
						$location.path('/login');
					}, 1000);
					window.location.href = TOA_URL;
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
		}
	};
	$scope.returnOrder = function() {
		/*$scope.rworder = true;
		$scope.dialogmsg = 'Do you want to Return the work order ?';
		$scope.dialogimg = "img/question_icon.png";
		$scope.footerbtn = true;
		$scope.errorbtn = "No";
		$scope.successbtn = "Yes";
		$scope.errbtnshow = "true"
		$scope.modalin = true;*/
	};

	$scope.suceesWorder = function() {
		/*$rootScope.worder = true;
		window.location.href = TOA_URL;
		$scope.modalin = false;
		sharedData.uplodLog();
		//after returning workorder navigate to login page
		$timeout(function() {
			$location.path('/login');
		}, 1000);
		sharedData.clearPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()));
		sharedData.clearStorage()*/
	};

});