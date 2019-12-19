'use strict';
app.controller('materialCtrl', function($scope, $location, $timeout, sharedData, AuditLog, $rootScope) {
   // document.addEventListener("resume", appResume, false);


    var toaData = sharedData.getToaData();
    var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();

    function showModal() {
        $rootScope.AILoading = false;
        $scope.rworder = false;
        $rootScope.worder = false;
        $timeout(function() {
            $scope.dialogmsg = 'Materials Use Record is Done Successfully';
            $scope.dialogimg = "img/done_icon.png";
            $scope.footerbtn = false;
            //$scope.nextPageUrl = '/login';
            $scope.modalin = true;
            var logobj = {
                "materialsUseRecord": "success"
            };
            sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()), logobj);
        }, 1000);
    }

    function appResume() {
        
       /* if (localStorage.getItem('currentPage') === localStorage.getItem('toacliked')) {
            showModal();
        } else {
            $rootScope.AILoading = false;
            $scope.dialogmsg = '';
            $scope.dialogimg = "";
            $scope.footerbtn = false;
            $scope.nextPageUrl = '';
            $scope.modalin = false;
        }*/
    }

    localStorage.setItem('currentPage', 'material');
    var curv1, curv2, curv3, curv1Txt, curv2Txt;

    if (ordertype) {
        if (ordertype == 'it' || ordertype == 'at' || ordertype == 'mav') {
            curv1 = "2";
            curv2 = "3";
            curv3 = "4";
            curv1Txt = 'ANTENNA_POINTING';
            curv2Txt = 'COMMISSIONING_ACTIVATION';
            $scope.twodigit = false;
        } else if (ordertype === 'ma') {
            curv1 = "1";
            curv2 = "2";
            curv3 = "3";
            curv1Txt = 'LOGIN_VIEW_ACTIVITY';
            curv2Txt = 'ANTENNA_POINTING';
            $scope.twodigit = false;
        }
    }

    $scope.headerObj = {
        title: "MATERIAL_USE_RECORD",
        subTitle: "MATERIAL_USE_RECORD_BUTTON",
        curv1: curv1,
        curv1Txt: curv1Txt,
        curv2: curv2,
        curv2Txt: curv2Txt,
        curv3: curv3,
        curv3Txt: "MATERIAL_USE_RECORD_BUTTON",
        active: true,
        curv1Active: false,
        curv2Active: false,
        curv3Active: true,
        expandedStep: false
    };
    $scope.imgSrc = "img/materials_use_record_icon.png";
    $scope.disabledStat = {
        disabled1: true,
        disabled2: false,
        disabled3: true
    };
    $scope.stepsObj = [
        'PERFORM_SPEED_TEST',
        'CONFIGURE_CLIENT_WIFI_PASSWORD',
        'INSTRUCT_CLIENT_HOW_TO_CHANGE_NETWORK_NAME_PASSWORD',
        'CHECK_IF_ALL_PHOTOS_WERE_CAPTURES'
    ];

    $scope.barObj = {
        leftbar: true,
        rightbar: true
    };
    $scope.workorder = false;
    $scope.footerdisable = false;

    $scope.redirect = function() {
        localStorage.setItem('toacliked', 'material');
        sharedData.uplodLog();
        window.location.href = TOA_URL;
        $timeout(function() {
        	localStorage.clear();
            /*localStorage.removeItem('TOAData');
            localStorage.removeItem('PNPData');
            localStorage.removeItem('toacliked');
            localStorage.removeItem('currentInventory');
            localStorage.removeItem('isPointed');
            localStorage.removeItem('certification');
            localStorage.removeItem('errorId');
            localStorage.removeItem('MODEMAPI');
            localStorage.removeItem('ODUAPI');
            localStorage.removeItem('OldModem');
            localStorage.removeItem('OldOdu');	
            localStorage.removeItem('COMMISSIONING_STATUS');
            
            localStorage.removeItem('CustomerInventory');	
            localStorage.removeItem('inventory');
            localStorage.removeItem('newInventoryModem');	
            localStorage.removeItem('oldInventory');
            localStorage.removeItem('oldScannedInventory');
            localStorage.removeItem('portalLog');	
            localStorage.removeItem('reAttemptNumber');
            localStorage.removeItem('portalData');	
            localStorage.removeItem('scannedInventory');
            localStorage.removeItem('mmaVersion');*/
            $location.path('/login');
        }, 1000);
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


    $scope.suceesWorder = function() {
    	sharedData.uplodLog();
        $rootScope.worder = true;
        window.location.href = TOA_URL;
        $scope.modalin = false;
        localStorage.clear();
        /*localStorage.removeItem('TOAData');
        localStorage.removeItem('PNPData');
        localStorage.removeItem('toacliked');
        localStorage.removeItem('currentInventory');
        localStorage.removeItem('isPointed');
        localStorage.removeItem('certification');
        localStorage.removeItem('errorId');
        localStorage.removeItem('MODEMAPI');
        localStorage.removeItem('ODUAPI');
        localStorage.removeItem('OldModem');
        localStorage.removeItem('OldOdu');	
        localStorage.removeItem('COMMISSIONING_STATUS');
        
        localStorage.removeItem('CustomerInventory');	
        localStorage.removeItem('inventory');
        localStorage.removeItem('newInventoryModem');	
        localStorage.removeItem('oldInventory');
        localStorage.removeItem('oldScannedInventory');
        localStorage.removeItem('portalLog');	
        localStorage.removeItem('reAttemptNumber');
        localStorage.removeItem('portalData');	
        localStorage.removeItem('scannedInventory');
        localStorage.removeItem('mmaVersion');*/
        //after returning workorder navigate to login page
        if ($scope.dialogmsg = 'Do you want to Return the work order ?') {
            $timeout(function() {
                $location.path('/login');
            }, 1000);
        }
        sharedData.clearPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()));
        sharedData.clearStorage()
    };

});