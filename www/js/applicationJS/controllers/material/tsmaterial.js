'use strict';
app.controller('tsmaterialCtrl', function($scope, $location, $timeout, sharedData, $rootScope) {
    document.addEventListener("resume", appResume, false);

    function showModal() {
        $rootScope.AILoading = true;
        $scope.rworder = false;
        $rootScope.worder = false;
        $timeout(function() {
            $scope.dialogmsg = 'Materials Use Record is Done Successfully';
            $scope.dialogimg = "img/done_icon.png";
            $scope.footerbtn = false;
            $scope.nextPageUrl = '/speed';
            $scope.modalin = true;
            $rootScope.AILoading = false;
            var logobj = {
                "materialsUseRecord": "success"
            };
            sharedData.setPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()), logobj);
        }, 3000);
    }
    //need to ask to arpit whwther neede or not
    function appResume() {
        if (localStorage.getItem('currentPage') === localStorage.getItem('toacliked')) {
            showModal();
        } else {
            $rootScope.AILoading = false;
            $scope.dialogmsg = '';
            $scope.dialogimg = "";
            $scope.footerbtn = false;
            $scope.nextPageUrl = '';
            $scope.modalin = false;
        }
    }

    localStorage.setItem('currentPage', 'tsmaterial');

    $scope.headerObj = {
        title: "MATERIAL_USE_RECORD",
        subTitle:"MATERIAL_USE_RECORD_BUTTON",
        curv1: "3",
        curv1Txt: 'Commissioning & Activation',
        curv2: "4",
        curv2Txt: 'MATERIAL_USE_RECORD_BUTTON',
        curv3: "5",
        curv3Txt: 'Speed Test',
        active: true,
        curv1Active: false,
        curv2Active: true,
        curv3Active: false,
        expandedStep: false
    };
    $scope.imgSrc = "img/materials_use_record_icon.png";
    $scope.twodigit = true;
    $scope.disabledStat = {
        disabled1: true,
        disabled2: false,
        disabled3: true
    };
    $scope.stepsObj = [
    	'PERFORM_SPEED_TEST',
        'CONFIGURE_CLIENT_WIFI_PASSWORD',
        'INSTRUCT_CLIENT_HOW_TO_CHANGE_NETWORK_NAME_PASSWORD',
        'CHECK_IF_ALL_PHOTOS_WERE_CAPTURES',
        'MATERIAL_USE_RECORD'
    ];

    $scope.barObj = {
        leftbar: true,
        rightbar: true
    };
    $scope.workorder = false;
    $scope.footerdisable = false;



    $scope.redirect = function() {
        localStorage.setItem('toacliked', 'tsmaterial');
        window.location.href = TOA_URL;
    };

    $scope.returnOrder = function() {
        $scope.rworder = true;
        $scope.dialogmsg = 'Do you want to Return the work order ?';
        $scope.dialogimg = "img/question_icon.png";
        $scope.footerbtn = true;
        $scope.errorbtn = "NO";
        $scope.successbtn = "YES";
        $scope.errbtnshow = true;
        $scope.modalin = true;
    };


    $scope.suceesWorder = function() {
        $rootScope.worder = true;
        window.location.href = TOA_URL;
        $scope.modalin = false;
        //after returning workorder navigate to login page
        $timeout(function() {
            $location.path('/login');
        }, 1000);
        sharedData.uplodLog();
        sharedData.clearPortalLog(sharedData.getUrlParameter("appt_number", sharedData.getToaData()));
        sharedData.clearStorage()
    };

});