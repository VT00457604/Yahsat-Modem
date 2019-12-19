'use strict';
app.controller('equipmentReCtrl', function($scope, $location, $timeout, sharedData, AuditLog, $rootScope, $http, cmsngService) {
    localStorage.setItem('currentPage', 'equipment_re');
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
        title: "EQUIPMENT_READING",
        subTitle: "EQUIPMENT_READING",
        curv1: curv1,
        curv1Txt: 'LOGIN_VIEW_ACTIVITY',
        curv2: curv2,
        curv2Txt: 'EQUIPMENT_READING',
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
    	//localStorage.removeItem('scannedInventory');
        //scannedInventory = [];
        var logobj={};
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
       
        
        var erMes = ''
        $scope.modalin = true; 
	     
        if ($scope.inventory.antenna == '') {
    	 	showError('ANTENNA_NOT_SCANNED','CONFIRM');
    	 	$scope.antennaNotValid = true;
    	 	logobj["Antenna"]= "missing";
        } else {
        	$scope.antennaNotValid = false;
        	$scope.antenna = ($scope.inventory.antenna!='')?checkAvailablity($scope.inventory.antenna, 'ANT'):null;
            if ($scope.antenna == false) {
                $scope.antennaNotValid = true;
                logobj["Antenna"]= "not found in the inventory list";
                localStorage.setItem("XA_EQUIP_INCONSISTENT", "1");
                showError('EQUIPMENT_REMOVAL_ANTENNA','CONFIRM');
            } else {
            	localStorage.setItem("XA_EQUIP_INCONSISTENT", "0");
            	localStorage.setItem("XA_ANTENNA_EXCHANGED", "1");
            	logobj["Antenna"]= $scope.inventory.antenna+" removed successfully";
                 $scope.antennaNotValid = false;
            }
        }
        
        if ($scope.inventory.odu == '') {
        	showError('ODU_NOT_SCANNED','CONFIRM');
            $scope.oduNotValid = true;
            logobj["ODU"]= "missing";
        } else {        	
            $scope.oduNotValid = false;
            $scope.odu = checkAvailablity($scope.inventory.odu, 'RE');
            if ($scope.odu == false) {
            	localStorage.setItem("XA_ODU_EXCHANGED", "1");
            	localStorage.setItem("XA_EQUIP_INCONSISTENT", "1");
                $scope.oduNotValid = true;
                logobj["ODU"]= "not found in the inventory list";
                showError('EQUIPMENT_REMOVAL_ODU','CONFIRM');
            } else {
            	localStorage.setItem("XA_ODU_EXCHANGED", "1");
            	//localStorage.setItem("XA_EQUIP_INCONSISTENT", "0");
            	 logobj["ODU"]= $scope.inventory.odu+" removed successfully";
                 $scope.oduNotValid = false;
            }
	     } 
        
        if ($scope.inventory.modem == '') {
        	showError('MODEM_NOT_SCANNED','CONFIRM');
            $scope.modemNotValid = true;
            logobj["Modem"]= "missing";
        } else {         	
            $scope.modemNotValid = false;
            $scope.modem = checkAvailablity($scope.inventory.modem, 'MDM');
            if ($scope.modem == false) {
            	localStorage.setItem("XA_MODEM_EXCHANGED", "1");
            	localStorage.setItem("XA_EQUIP_INCONSISTENT", "1");
                $scope.modemNotValid = true;
                logobj["Modem"]= "not found in the inventory list";
                showError('EQUIPMENT_REMOVAL_MODEM','CONFIRM');
            } else {
            	localStorage.setItem("XA_MODEM_EXCHANGED", "1");
            	//localStorage.setItem("XA_EQUIP_INCONSISTENT", "0");
            	logobj["Modem"]= $scope.inventory.modem+" removed successfully";
                $scope.modemNotValid = false;
            }
        }
        
        if ($scope.inventory.modem != '' && $scope.inventory.odu != '') {
    	 	localStorage.setItem("XA_EQUIP_INCONSISTENT", "1");
        }
        
      /* Set current inventory - Vijay */
        $scope.updateInventory = function(val) {
        	//localStorage.setItem("XA_EQUIP_INCONSISTENT", "0");
			sharedData.setCurrentInventory(scannedInventory);
            sharedData.setPortalLog(apptNumber, logobj);
        	$rootScope.AILoading = true;
        	$scope.modalin = true; 
       	 	$scope.dialogmsg = 'EQUIPMENT_CHECK_DONE';
             $scope.dialogimg = "img/done_icon.png";
             $scope.footerbtn = false;
             $scope.nextPageUrl = '/login';
             sharedData.setScannedInventory(activityid, sharedData.getCurrentInventory());
   		  	 sharedData.uninstall(); // Deinstall API call implemented by Vijay (12th-Jul-2018)
   		  	 localStorage.clear();
   		  	 $timeout(function() {
                 $rootScope.AILoading = false;
                 window.location.href = TOA_URL;
                 $location.path('/login');
             }, 4000);
        } 
    
    if ($scope.modem == true && $scope.odu == true && $scope.antenna == true) {
    	localStorage.setItem("XA_EQUIP_INCONSISTENT", "1");
    	sharedData.setCurrentInventory(scannedInventory);
        sharedData.setPortalLog(apptNumber, logobj);
    	$rootScope.AILoading = true;
    	$scope.modalin = true; 
   	 	$scope.dialogmsg = 'EQUIPMENT_CHECK_DONE';
        $scope.dialogimg = "img/done_icon.png";
        $scope.footerbtn = false;
        $scope.nextPageUrl = '/login';
        sharedData.setScannedInventory(activityid, sharedData.getCurrentInventory());
		sharedData.uninstall(); // Deinstall API call implemented by Vijay (12th-Jul-2018)
		localStorage.clear();
		$timeout(function() {
             $rootScope.AILoading = false;
             window.location.href = TOA_URL;
             $location.path('/login');
         }, 4000);
    } 
}; 
   
    function checkAvailablity(code, type) {
    	//localStorage.removeItem('scannedInventory');
        var _url = sharedData.getToaData();
        var inventory = sharedData.getInventory();
        var inInvList = false;
        var inScnList = false;
        var isValid = false;
        var user = sharedData.getUrlParameter("ulogin", _url);
        var eqItem;
        inInvList = inventory.some(function(item, index) {
            if (item.equipmentserialno == code && item.equipmenttype == type  && item.invpool == 'customer') eqItem = item;
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
        } else {
        	isValid = false;
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
