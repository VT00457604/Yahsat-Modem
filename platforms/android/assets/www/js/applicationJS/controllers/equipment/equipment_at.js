'use strict';
app.controller('equipmentAtCtrl', function($scope, $location, $timeout, sharedData, AuditLog, $rootScope, $http, cmsngService, $route) {
	localStorage.setItem('currentPage', 'equipment_at');
	document.addEventListener("deviceready", onDeviceReady, false);
	$scope.showotp = false;
	$scope.loaderImg = false;
	var ordertype;
	$scope.isCertified = false;
	$scope.equipmentCheckButton = "Validate";
	var scannedInventory = [];
	$scope.timer = '';
	var _url = sharedData.getToaData();
	var errorId = '';

	var curv1 = 1,
		curv2 = 2,
		curv3 = 3;
	var toaData = sharedData.getToaData();
	var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();
	
	var sitAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat3.test" + ":" + "98e301c27154e9c13938936424360a5dc469e4b086eecbdc012b4d0dce7664f4");
    var uatAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat1.test" + ":" + "eb8b55ebefe188ee223086cb91380739302bed3b426246d05b0633cf5faa88d8");
    var prodAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat" + ":" + "70acc2a9317b78c5545b3d313f67183f4c5234c021d4db728d2e4cfad8e085e5");
    
    var authKey = prodAuth;
	
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
	
	$scope.headerObj = {
		title: "EQUIPMENT_CHECK",
		subTitle: "EQUIPMENT_CHECK",
		curv1: curv1,
		curv1Txt: 'LOGIN_VIEW_ACTIVITY',
		curv2: curv2,
		curv2Txt: 'EQUIPMENT_CHECK',
		curv3: curv3,
		curv3Txt: '',
		active: true,
		curv1Active: false,
		curv2Active: true,
		curv3Active: false,
		expandedStep: false
	};
	
	/* Vijay's code start */
	if ( !localStorage.getItem('reAttemptNumber') ) { // First search attempt
		$scope.zmsg = {subTitle: "Scan Installed Inventory"};
	} else { // Second search attempt
		$scope.zmsg = {subTitle: "Scan New Inventory"};
	}
	/* Vijay's code end */
	
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
		rightbar: false
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
	$scope.modemChkBox = false;
	$scope.oduChkBox = false;
	$scope.antennaChkBox = false;
	// check if certification is done
	if (localStorage.getItem('certification')) {
		$scope.isCertified = true;
		var obj = JSON.parse(localStorage.getItem('certification'));
		$scope.modemChkBox=obj.modem[0];
		$scope.oduChkBox=obj.odu[0];
		$scope.antennaChkBox=obj.antenna[0];
		$scope.inventory={
			modem: obj.modem[1],
			odu: obj.odu[1],
			antenna: obj.antenna[1]
		}
	}


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
		$scope.isSkipCer = false;
	};
	
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
			if (url !== "" && url !==null) {
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
				
				/* Vijay */
				if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
					alert('Status from PnP: ' + $scope.data);
				}
				/*Over*/
				
				/*$scope.data = localStorage.getItem('PNPData');*/
				var status = sharedData.getUrlParameter("status", $scope.data.toLowerCase());
				if (status.split(":")[0] == "success" || status.split(":")[0] == "ok") {
					//for hiding otp field in model
					$rootScope.OTP = 1;
					localStorage.setItem('certification', JSON.stringify({
						'modem':[$scope.modemChkBox, $scope.inventory.modem],
						'odu':[$scope.oduChkBox, $scope.inventory.odu],
						'antenna':[$scope.antennaChkBox, $scope.inventory.antenna]
					}));
					//end
					$scope.dialogmsg = 'POINTING_DONE';
					$scope.dialogimg = "img/done_icon.png";
					$scope.footerbtn = false;
					var logobj = {
						"antennaPointing": "success"
					};
					sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
					ordertype = sharedData.getUrlParameter("activity_type", sharedData.getToaData()).toLowerCase();					
					$timeout(function() {
						redirect(); // Start Commissioning & Activation process
					}, 4000);
				} else {
					localStorage.setItem('isPointed','true')
					$scope.dialogmsg = 'CERTIFICATION_FAILED';
					$scope.dialogimg = "img/error_icon.png";
					$scope.footerbtn = true;
					$scope.successbtn = 'RE_POINTING';
					$scope.errorbtn = 'CANCEL';
					var logobj = {
						"antennaPointing": "failed"
					};
					sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", toaData), logobj);
					$scope.errbtnshow = true;
				}
				$scope.modalin = true;
			}, 0);
		}
	};
	
	// upload log to the server
	function uploadInventoryDetails() {
		var logobj = {
			"Modem Exchange": ($scope.modemChkBox == true) ? 'Modem ('+$scope.inventory.modem+') is swapped' : 'Modem is not swapped',
			"ODU Exchange": ($scope.oduChkBox == true) ? 'Odu ('+$scope.inventory.odu+') is swapped' : 'ODU is not swapped',
			"Antenna Exchange": ($scope.antennaChkBox == true) ? 'Antenna ('+$scope.inventory.antenna+') is swapped' : 'Antenna is not swapped'
		};
		sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
		sharedData.uplodLog();
		$scope.nextPageUrl = '/login';
		$timeout(function() {
			window.location.href = TOA_URL
		}, 3000)
	}
	
	$scope.modem;
	$scope.odu;
	$scope.antenna;
	$scope.scanner = function(item) {
		cordova.plugins.barcodeScanner.scan(
			// success callback function
			function(result) {
				// wrapping in a timeout so the dialog doesn't free the app
				setTimeout(function() {
					switch (item) {
						case 'modem':
							$scope.inventory.modem = result.text;
							$scope.modemNotValid = false;
							break;
						case 'odu':
							$scope.inventory.odu = result.text;
							$scope.oduNotValid = false;
							break;
						case 'antenna':
							$scope.inventory.antenna = result.text;
							$scope.antennaNotValid = false;
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

	$scope.modemNotValid = false;
	$scope.oduNotValid = false;
	$scope.antennaNotValid = false;
	
	
	
	$scope.invValidations = function() {
		var logobj={};
		$scope.dialogimg = "img/error_icon.png";
        $scope.footerbtn = true;
        var erMes = '';
        $scope.modalin = true;
		sharedData.setOldInventory(scannedInventory);
		sharedData.setOldScannedInventory(sharedData.getUrlParameter("activityid", _url), sharedData.getOldInventory());
		
		if ($scope.isCertified){
			if ($scope.modemChkBox==true){
				if (localStorage.getItem('errorId')){
					errorId=localStorage.getItem('errorId');
				} else {
					errorId='validation';
				}
				$scope.errorAction();
				return;
			}
		}
		
		if ($scope.modemChkBox == true) {
			$scope.modem = checkAvailablityOld($scope.inventory.modem, 'MDM');
			$scope.loaderImg = false;
			if ($scope.modem == false) {
				$scope.modemNotValid = true;
				logobj["ModemOld"]= "missing";
				$scope.dialogmsg = 'INSTALLED_INVENTORY_MODEM';
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
				return;			}
		}
		if ($scope.oduChkBox == true) {
			$scope.odu = checkAvailablityOld($scope.inventory.odu, 'RE');
			$scope.loaderImg = false;
			if ($scope.odu == false) {	
				$scope.oduNotValid = true;
				logobj["OduOld"]= "missing";
				$scope.dialogmsg = 'INSTALLED_INVENTORY_ODU';
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
				return;				
			}
		}
		if ($scope.antennaChkBox == true) {
			$scope.antenna = checkAvailablityOld($scope.inventory.antenna, 'ANT');
			$scope.loaderImg = false;
			if ($scope.antenna == false) {	
				$scope.antennaNotValid = true;
				logobj["AntennaOld"]= "missing";
				$scope.dialogmsg = 'INSTALLED_INVENTORY_ANTENNA';
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
				return;			}
		}
		if ($scope.modem == true || $scope.odu == true || $scope.antenna == true) {
			$scope.modalin = false;
			localStorage.setItem('reAttemptNumber', "2");
			$scope.loadermsg = 'Validate';
			$scope.loaderImg = true;
			$timeout(function() {	
				$scope.inventory.modem = '';
				$scope.inventory.odu = '';
				$scope.inventory.antenna = '';
				document.getElementById('eqmodem').value = '';
				document.getElementById('eqodu').value = '';
				document.getElementById('eqantenna').value = '';
				$scope.equipmentCheckButton = "Equipment Exchange";
				$scope.loaderImg = false;
			}, 3000)
		}
	}
	
	$scope.invValidation = function() {
		var logobj={};
		$scope.dialogimg = "img/error_icon.png";
        $scope.footerbtn = true;
        var erMes = '';
        $scope.modalin = true;
		if ($scope.isCertified){
			if ($scope.modemChkBox==true){
				if (localStorage.getItem('errorId')){
					errorId=localStorage.getItem('errorId');
				} else {
					errorId='validation';
				}
				$scope.errorAction();
				return;
			}
		}
		
		if ($scope.modemChkBox == true) {
			localStorage.setItem('newInventoryModem', $scope.inventory.modem);
			$scope.modem = checkAvailablityNew($scope.inventory.modem, 'MDM');
			if ($scope.modem == false) {
				$scope.modemNotValid = true;
				logobj["ModemNew"]= "missing";
				$scope.dialogmsg = 'SCANNED_NEW_INVENTORY_MODEM';
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
				return;
			}
		}
		if ($scope.oduChkBox == true) {
			localStorage.setItem('newInventoryOdu', $scope.inventory.odu);
			$scope.odu = checkAvailablityNew($scope.inventory.odu, 'RE');
			if ($scope.odu == false) {
				$scope.oduNotValid = true;
				logobj["OduNew"]= "missing";
				$scope.dialogmsg = 'SCANNED_NEW_INVENTORY_ODU';
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
				return;
			}
		}
		if ($scope.antennaChkBox == true) {
			localStorage.setItem('newInventoryAntenna', $scope.inventory.antenna);
			$scope.antenna = checkAvailablityNew($scope.inventory.antenna, 'ANT');
			if ($scope.antenna == false) {
				$scope.antennaNotValid = true;
				logobj["AntennaNew"]= "missing";
				$scope.dialogmsg = 'SCANNED_NEW_INVENTORY_ANTENNA';
				$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
				return;
			}
		}
		if ($scope.modem == true || $scope.odu == true || $scope.antenna == true) {
			$scope.modalin = false;
			// If first page (old inventory) has been scanned then save data in other variable else not. Implemented by Vijay on 13th-jul-2018
			if (localStorage.getItem('reAttemptNumber') && localStorage.getItem('reAttemptNumber') == "2") {
				sharedData.setCurrentInventory(scannedInventory);
			} else {
				sharedData.setOldInventory(scannedInventory); // Save old equipment details. Deinstall API would be called using this data only
				// Initialize scannedInventory to a blank array now to save new inventory details properly
				scannedInventory = [];
			}
			
			if (localStorage.getItem('reAttemptNumber') && localStorage.getItem('reAttemptNumber') == "2") { // if condition implemented by Vijay on 13th-jul-2018
				if ($scope.antennaChkBox == true || $scope.modemChkBox == true) {
					var toaData = sharedData.getToaData();
					$scope.getAllDetails(toaData);
					var localdata = "ntc-pnp://yahsat?BeamId=" + $scope.BeamID + "&ODUTypeId=" + $scope.ODUTypeId + "&OrbitalDegrees=" + $scope.orbitalDeg + "&Hemisphere=" + $scope.hemisphere + "&SkipCertification=" + $scope.isSkipCer + "&DisableCertificationSkipping=true&Lang=en_US&ReturnApp=Yahsat-Master&ReturnAppURL=ntc-master://pointandplay";
					
					if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
						alert(localdata);
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
						$location.path('/antenna');
						// window.open(localdata, "_system");
						/*window.plugins.webintent.startActivity({
								action: window.plugins.webintent.ACTION_VIEW,
								url: localdata,
							},
							function() {
								console.log("Point and Play successfully launched")
							},
							function() {
								console.log("Point and Play could not be launched");
							}
						);*/
					
					}
				} else {
					/* Set inventory (for fixing ODU case uploadInventory service not called error) - Vijay 05-July-2018 */
					sharedData.setScannedInventory(sharedData.getUrlParameter("activityid", _url), sharedData.getCurrentInventory());
					redirect(); // Start Commissioning & Activation process
				}
			} else {
				/* Set old inventory - Vijay 13th-July-2018 */
				sharedData.setOldScannedInventory(sharedData.getUrlParameter("activityid", _url), sharedData.getOldInventory());
				localStorage.setItem('reAttemptNumber', "2");
				$route.reload(); // Reload the page
			}
		}
	}

	$scope.woid = (sharedData.getUrlParameter('appt_number', _url)).trim();
	$scope.activityid = sharedData.getUrlParameter("activityid", _url);
	$scope.latitude = sharedData.getUrlParameter('lat', _url);
	$scope.longitude = sharedData.getUrlParameter('lang', _url);
	$scope.user = sharedData.getUrlParameter('ulogin', _url);
	$scope.servicepartnerid = sharedData.getUrlParameter('servicepartnerid', _url);
	$scope.language = "en";
	$scope.orderType = sharedData.getUrlParameter("activity_type", _url);
	
	if (scannedInventory == undefined || !scannedInventory) {
		var scannedInventory = sharedData.removeKey(sharedData.getCurrentInventory(), 'inventorydetail');
		var scannedInventory = sharedData.removeKey(scannedInventory, 'equipmentsalemode');
		var scannedInventory = sharedData.removeKey(scannedInventory, 'user');
	}
	
	var cmsngValidateObj = {
		"woid": $scope.woid,
		"fsotype": $scope.orderType,
		"user": $scope.user,
		"servicepartnerid": $scope.servicepartnerid,
		"distributorid": "",
		"modemchange": $scope.modemChkBox,
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

	/*-----Commissioning & Activation------*/
	function redirect() {		
		sharedData.getModemDetails('GetDeviceInformation');
		sharedData.getModemDetails('GetODUInformation');
		//show validation loader and call validate api
		$scope.loaderImg = true;
		$scope.loadermsg = 'VALIDATION_PROGRESS';
		delete cmsngValidateObj.equipment[0]['invpool'];
		cmsngService.validate(cmsngValidateObj)
			.then(function(response) {
				console.log('validation success');
				// now close validation loader
				//show activation loader
				//call activation api
				if (response.data.status != "VALID") {
					$scope.loaderImg = false;
					$scope.modalin = true;
					errorId = 'validation';
					localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
					localStorage.setItem('errorId', errorId);
					showError('VALIDATION_ERROR');
					return;
				}
				$scope.loadermsg = 'ACTIVATION_PROGRESS';
				cmsngService.comission(commissioningReq)
					.then(function(res) {
						//close activation loader
						// now  call status
						console.log('activation success');
						var statusCount = 1;
						//call status api after 1.5 minutes
						if (res.data.ResponseDescription == "Success") {
							localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
							getComStatus();
							countdown(6, 0);
						} else {
							errorId = 'activation';
							localStorage.setItem('errorId', errorId);
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
							$scope.loadermsg = 'TIMER';// + statusCount;
							console.log('checking status--- attempt= ' + statusCount);
							$timeout(function() {
								cmsngService.status(commissioningReq)
									.then(function(res) {
										$timeout(function() {
											if (res.data.status == 'COMMISSIONED') {
												$scope.loaderImg = false;
												var currentInv = sharedData.getCurrentInventory();
												sharedData.setScannedInventory($scope.activityid, currentInv);
												sharedData.setInventory(JSON.stringify(filterInventory(sharedData.getInventory(), currentInv)));
												$scope.dialogmsg = 'COMMISSIONING_DONE';
												$scope.dialogimg = "img/done_icon.png";
												$scope.footerbtn = false;
												$scope.modalin = true;
												var logobj = {
													"Modem Exchange": ($scope.modemChkBox == true) ? 'true' : 'false',
													"ODU Exchange": ($scope.oduChkBox == true) ? 'true' : 'false',
													"Antenna Exchange": ($scope.antennaChkBox == true) ? 'true' : 'false'
												};
												sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
												sharedData.uplodLog(); // Install API call
												
												/* Deinstall API call and flag values implemented by Vijay (13th-Jul-2018) */
												localStorage.setItem("XA_MODEM_EXCHANGED", ($scope.modemChkBox == true) ? "1" : "");
												localStorage.setItem("XA_ODU_EXCHANGED", ($scope.oduChkBox == true) ? "1" : "");
												localStorage.setItem("XA_ANTENNA_EXCHANGED", ($scope.antennaChkBox == true) ? "1" : "");
												
												// Call uninstall API
												sharedData.uninstall();
												
												// Remove key items
												localStorage.removeItem('XA_MODEM_EXCHANGED');
												localStorage.removeItem('XA_ODU_EXCHANGED');
												localStorage.removeItem('XA_ANTENNA_EXCHANGED');
												/* Over */
												localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
												$scope.nextPageUrl = '/login';
												$timeout(function() {
													window.location.href = TOA_URL
												}, 3000)
											} else if (res.data.status == 'COMMISSION_IN_PROGRESS') {
												statusCount++
												if (statusCount <= 4) {
													getComStatus();
													countdown(6, 0);
												} else {
													errorId = 'status';
													localStorage.setItem('errorId', errorId);
													$scope.loaderImg = false;
													showError('STATUS_ERROR');
													$scope.modalin = true;
												}
												localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
											} else {
												errorId = 'status';
												localStorage.setItem('errorId', errorId);
												$scope.loaderImg = false;
												showError('STATUS_ERROR');
												$scope.modalin = true;
												localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
											}
										}, 0);

									}, function(error) {
										errorId = 'status';
										localStorage.setItem('errorId', errorId);
										localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
										console.log('status error');
										var logobj = {
											"commissioning": "status error"
										};
										sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
										$scope.loaderImg = false;
										showError('STATUS_ERROR');
										$scope.modalin = true;
									})
							}, 90000)
						}

					}, function(error) {
						errorId = 'activation';
						localStorage.setItem('errorId', errorId);
						console.log('activation error')
						var logobj = {
							"commissioning": "activation error"
						};
						sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
						$scope.loaderImg = false;
						$scope.modalin = true;
						localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
						showError('COMMISSIONING_ERROR');
					})
			}, function(error) {
				errorId = 'validation';
				localStorage.setItem('errorId', errorId);
				console.log('validation error');
				var logobj = {
					"commissioning": "validation error"
				};
				sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
				$scope.loaderImg = false;
				$scope.modalin = true;
				localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
				showError('VALIDATION_ERROR');
			});

		// upload log
		//old--- http://mma2ip:mma2ip@119.151.20.69:7003/InstallerPortal/rest/json/log/
		$http({
			method: 'GET',
			url: 'http://172.30.34.2:7004/InstallerPortal/rest/json/log/' + $scope.woid,
			crossDomain: true,
			headers: {
				'Access-Control-Allow-Origin' : '*',
				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
				'Content-Type': 'application/json; charset=utf-8',
				'Accept': 'application/json',
                'Authorization': authKey
			}
		}).then(function(response) {
			sharedData.setPortalData($scope.woid, response.data);
		});

	};
	/*end here*/

	//action on retry
	$scope.errorAction = function() {
		if ($scope.errorbtn == 'NO') {
			$scope.hotline = false;
			$scope.modalin = false;
			return;
		}
		var statusCount = 1;
		if (errorId == 'validation' || errorId == 'activation') {
			$timeout(function() {
				redirect();
			}, 4100)
		} else if (errorId == 'status') {
			//get status
			retryToGetStatus();
			countdown(6, 0);

			function retryToGetStatus() {
				$scope.loaderImg = true;
				$scope.loadermsg = 'TIMER';// + statusCount;
				console.log('checking status--- attempt= ' + statusCount);
				$timeout(function() {
					cmsngService.status(commissioningReq)
						.then(function(res) {
							$timeout(function() {
								if (res.data.status == 'COMMISSIONED') {
									$scope.loaderImg = false;
									var currentInv = sharedData.getCurrentInventory();
									sharedData.setScannedInventory($scope.activityid, currentInv);
									sharedData.setInventory(JSON.stringify(filterInventory(sharedData.getInventory(), currentInv)));
									sharedData.uplodLog(); // Install API call
									
									/* Deinstall API call and flag values implemented by Vijay (13th-Jul-2018) */
									localStorage.setItem("XA_MODEM_EXCHANGED", ($scope.modemChkBox == true) ? "1" : "");
									localStorage.setItem("XA_ODU_EXCHANGED", ($scope.oduChkBox == true) ? "1" : "");
									localStorage.setItem("XA_ANTENNA_EXCHANGED", ($scope.antennaChkBox == true) ? "1" : "");
									
									// Call uninstall API
									sharedData.uninstall();
									
									// Remove key items
									localStorage.removeItem('XA_MODEM_EXCHANGED');
									localStorage.removeItem('XA_ODU_EXCHANGED');
									localStorage.removeItem('XA_ANTENNA_EXCHANGED');
									/* Over */
									
									$scope.dialogmsg = 'COMMISSIONING_DONE';
									$scope.dialogimg = "img/done_icon.png";
									$scope.footerbtn = false;
									$scope.modalin = true;
									$scope.nextPageUrl = '/material';
									localStorage.setItem("COMMISSIONING_STATUS", "TRUE");
								} else if (res.data.status == 'COMMISSION_IN_PROGRESS') {
									statusCount++
									if (statusCount <= 4) {
										retryToGetStatus();
										countdown(6, 0);
									} else {
										errorId = 'status';
										$scope.loaderImg = false;
										showError('STATUS_ERROR');
										$scope.modalin = true;
									}
									localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
								} else {
									errorId = 'status';
									$scope.loaderImg = false;
									showError('COMMISSIONING_ERROR');
									$scope.modalin = true;
									localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
								}
							}, 0);

						}, function(error) {
							errorId = 'status';
							console.log('status error');
							var logobj = {
								"commissioning": "status error"
							};
							sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", _url), logobj);
							$scope.loaderImg = false;
							showError('STATUS_ERROR');
							$scope.modalin = true;
							localStorage.setItem("COMMISSIONING_STATUS", "FALSE");
						})
				}, 90000);
			}
		}
	}

	function checkAvailablityOld(code, type) {
		var _url = sharedData.getToaData();
		var inventory = sharedData.getInventory();
		var inInvList = false;
		var inScnList = false;
		var isValid = false;
		var user = sharedData.getUrlParameter("ulogin", _url);
		var eqItem;
		inInvList = inventory.some(function(item, index) {
			if (item.equipmentserialno == code && item.equipmenttype == type && item.invpool == 'customer') eqItem = item;
			return (item.equipmentserialno == code && item.equipmenttype == type && item.invpool == 'customer');
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
	
	function checkAvailablityNew(code, type) {
		var _url = sharedData.getToaData();
		var inventory = sharedData.getInventory();
		var inInvList = false;
		var inScnList = false;
		var isValid = false;
		var user = sharedData.getUrlParameter("ulogin", _url);
		var eqItem;
		inInvList = inventory.some(function(item, index) {
			if (item.equipmentserialno == code && item.equipmenttype == type && item.invpool == 'Technician') eqItem = item;
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
		if(localStorage.getItem("newInventoryModem") || localStorage.getItem("newInventoryOdu") || localStorage.getItem("newInventoryAntenna")){
			if (inInvList == true && inScnList == false) {
				eqItem.user = user;
				scannedInventory.push(eqItem);
				isValid = true;
			}
		}
		return isValid;
	}

	/*---------------------------------------------*/
	$scope.orderDiscontinue = function() {
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

	$scope.otperrshow = false;
	var hashids = new Hashids("this is my salt", 8, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
	$scope.successaction = function(otpval) {
		var toaData = sharedData.getToaData();
		var apptNum = sharedData.getUrlParameter("appt_number", toaData);
		var SIC = sharedData.getUrlParameter("SIC", toaData).substr(0, 5);
		var promise;
		if ($scope.successbtn == "SUBMIT") {
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
		} else {
			if ($scope.hotline) {
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
					//window.location.href = TOA_URL
					$timeout(function() {
						$location.path('/antenna');
					}, 500)
				}, 3000);
			}
		}
	};
	$scope.returnOrder = function() {
		/*$scope.rworder = true;
		$scope.dialogmsg = 'RETURN_WO';
		$scope.dialogimg = "img/question_icon.png";
		$scope.footerbtn = true;
		$scope.errorbtn = "NO";
		$scope.successbtn = "YES";
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

	function countdown(minutes, seconds) {
		var time = minutes * 60 + seconds;
		var interval = setInterval(function() {
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