'use strict';
app.controller('equipmentRaCtrl', function($scope, $location, $timeout, sharedData, AuditLog, $rootScope, $http, cmsngService) {
    localStorage.setItem('currentPage', 'equipment_ra');
    var toaData = sharedData.getToaData();
    var activityid = sharedData.getUrlParameter("activityid", toaData);
    var apptNumber = sharedData.getUrlParameter("appt_number", toaData);
    var currentInventory = sharedData.getInventory();

    $scope.showotp = false;
    var scannedInventory = [];
    var curv1 = 1,
        curv2 = 2,
        curv3 = 3;
    var toaData = sharedData.getToaData();
    var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();

    $scope.headerObj = {
        title: "ANTENNA_REMOVAL",
        subTitle: "ANTENNA_REMOVAL",
        curv1: curv1,
        curv1Txt: 'LOGIN_VIEW_ACTIVITY',
        curv2: curv2,
        curv2Txt: 'ANTENNA_REMOVAL',
        curv3: curv3,
        curv3Txt: '',
        active: true,
        curv1Active: false,
        curv2Active: true,
        curv3Active: false,
        expandedStep: false
    };
	
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

    $scope.invValidation = function() {
        //scannedInventory = [];
        $scope.dialogimg = "img/error_icon.png";
        $scope.footerbtn = true;

        var showError = function(mes, sucBtnText) {
            $scope.dialogmsg = mes;
            $scope.dialogimg = "img/error_icon.png";
            $scope.footerbtn = true;
            $scope.successbtn = sucBtnText;
            $scope.errorbtn = 'REDO_SCANNINGG';
            $scope.nextPageUrl = '';
            $scope.errbtnshow = true;
        }

        if ($scope.inventory.antenna != '') {
            $scope.antenna = checkAvailablity($scope.inventory.antenna, 'ANT');
            if ($scope.antenna == false) {
                $scope.antennaNotValid = true;
                var logobj = {
                    "Antenna": "not found in the inventory list"
                };
                sharedData.setPortalLog(apptNumber, logobj);
            } else {
            	localStorage.setItem("XA_ANTENNA_EXCHANGED", "1");
                $scope.antennaNotValid = false;
            }
			
			/* Set current inventory - Vijay (12-Jul-2018) */
			sharedData.setCurrentInventory(scannedInventory);
			
            if ($scope.antenna == true) {
                $scope.dialogmsg = 'EQUIPMENT_CHECK_DONE';
                $scope.dialogimg = "img/done_icon.png";
                $scope.footerbtn = false;
                $scope.nextPageUrl = '/login';
                
				/*
				 * Upload Inventory call commented on 12th-July-2108 by Vijay as per new requirement 
				 * Uninstall API call implemented instead of it
				 */
				sharedData.setScannedInventory(activityid, sharedData.getCurrentInventory());
				sharedData.uninstall(); // Deinstall API call implemented by Vijay (12th-Jul-2018)
				
				//sharedData.setScannedInventory(activityid, currentInventory);
				//sharedData.uplodLog();
				/**/
                
				$timeout(function() {
                    window.location.href = TOA_URL;
                }, 4000);
            } else {
                showError('EQUIPMENT_ERROR', 'CONFIRM');
            }
            $scope.modalin = true;

        } else {
            var erMes = ''
            $scope.modalin = true;
            if ($scope.inventory.antenna == '') {
                $scope.antennaNotValid = true;
                var logobj = {
                    "Antenna": "missing"
                };
                sharedData.setPortalLog(apptNumber, logobj);
            } else {
                $scope.antennaNotValid = false;
            }
            if ($scope.inventory.antenna == '') {
                showError('SCAN_EQUIPMENT', 'CONFIRM');
            }
        }
    }

    /*-----calling update Inventory api------*/
    $scope.updateInventory = function(val) {
        $scope.modalin = false;
        
		/*
		 * Upload Inventory call commented on 12th-July-2108 by Vijay as per new requirement 
		 * Uninstall API call implemented instead of it
		 */
		sharedData.setScannedInventory(activityid, sharedData.getCurrentInventory());
		sharedData.uninstall(); // Deinstall API call implemented by Vijay (12th-Jul-2018)
		
		//sharedData.setScannedInventory(activityid, currentInventory);
		//sharedData.uplodLog();
		/**/
		
        $rootScope.AILoading = true;
        $timeout(function() {
            $rootScope.AILoading = false;
            window.location.href = TOA_URL;
            $location.path('/login');
        }, 4000);
    };
    /*end here*/

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