'use strict';
app.controller('loginCtrl', function($scope, $location, $timeout, sharedData, $rootScope) {
	//localStorage.clear();
    sharedData.setOrderType(null);
    sharedData.clearStorage();
    localStorage.setItem('currentPage', 'login');
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    $rootScope.AILoading = false;
    $scope.rworder = false;
    $rootScope.worder = false;
    //dynamic header based on ordertype
    var orderType = sharedData.getOrderType();
    var curv2Txt, curv3Txt;
    function setHeader(orderType){
        if (orderType) {
            orderType = orderType.toLowerCase();
            if (orderType == 'it' || orderType == 'at' || orderType == 'mav' || orderType == 'mi') {
                curv2Txt = 'EQUIPMENT_CHECK';
                curv3Txt = 'ANTENNA_POINTING';
            }else if(orderType == 'ma'){
                curv2Txt = 'ANTENNA_POINTING';
                curv3Txt = '';
            }else if(orderType == 're' || orderType == 'mc' || orderType == 'mr'){
                curv2Txt = '';
                curv3Txt = '';
            }
        }else{
            curv2Txt = 'EQUIPMENT_CHECK';
            curv3Txt = 'ANTENNA_POINTING';
        }

        
        $scope.headerObj = {
            title: "LOGIN_VIEW_ACTIVITY",
            subTitle:"LOGIN_VIEW_ACTIVITY",
            curv1: "1",
            curv1Txt: 'LOGIN_VIEW_ACTIVITY',
            curv2: "2",
            curv2Txt: curv2Txt,
            curv3: "3",
            curv3Txt: curv3Txt,
            active: true,
            curv1Active: true,
            curv2Active: false,
            curv3Active: false,
            expandedStep: false
        };
    }
    setHeader(orderType);
    $scope.imgSrc = "img/login_view_activity.png";
    $scope.disabledStat = {
        disabled1: false,
        disabled2: true,
        disabled3: true
    }
    $scope.stepsObj = [
        'LOGIN_TOA',
        'VIEW_ACTIVITY_DETAILS',
         'GO_TO_ACTIVITY',
         'START_ACTIVITY',
         'CHECK_FEASIBILITY',
         'PERFORM_PHYSICAL_INSTALLATION'
    ];

    $scope.barObj = {
        leftbar: false,
        rightbar: true
    };
    $scope.dialogimg = "";
    $scope.footerdisable = true;

    $scope.loadPage = function() {
        //localStorage.setItem('currentPage','login');
        var toaData = sharedData.getToaData();
        if (toaData) {
            $timeout(function() {
                sharedData.navgateToTS();
            }, 0);
        }
    }
       
    function onDeviceReady() {
        CDV.WEBINTENT.onNewIntent(function(url) {
            if (url !== "" && url !== null) {
                saveData(url);
            }
        });

        CDV.WEBINTENT.getUri(function(url) {
            if(url !== "" && url !==null) {
                // url is the url the intent was launched with
                saveData(url);
            }
        });


        //upload log if internet is available
        document.addEventListener("online", onOnline, false);
    };

   function saveData(url){
        if (decodeURIComponent(url).indexOf("ntc-master://toa") >= 0) {
            var _url=decodeURIComponent(url);
            var apptNum = (sharedData.getUrlParameter("appt_number", _url)).trim();
            var oType=(sharedData.getUrlParameter("aworktype", _url)).trim();
            var lng=sharedData.getUrlParameter("XA_ACTUAL_LONG", _url);
            var lat=sharedData.getUrlParameter("XA_ACTUAL_LAT", _url);
            var beamId=(sharedData.getUrlParameter("XA_BEAM", _url)).trim();
            var orbital=sharedData.getUrlParameter("XA_ORBITAL", _url);// || "28.2 east";
            var sic=(sharedData.getUrlParameter("XA_SIC", _url)).trim();
            var odu=sharedData.getUrlParameter("XI_ODU_TYPE", _url) || "2";
            var user=sharedData.getUrlParameter("external_id", _url);
            var servicepartnerid=sharedData.getUrlParameter("servicepartnerid",_url);
            var activityid = sharedData.getUrlParameter("activityid",_url);
            var inv=sharedData.getUrlParameter("Inventory", _url);
			/* Implemented by Zameer */
			/**/var custInv = sharedData.getUrlParameter("CustomerInventory", _url);
			/**/inv.concat(custInv); // Merge 'CustomerInventory' with 'Inventory'            
			var inventory = JSON.stringify(JSON.parse(inv)["inventory"]);
			/**/localStorage.setItem('CustomerInventory', sharedData.getUrlParameter("CustomerInventory", _url));
			/* over */
            sharedData.setInventory(inventory);
            if(oType.toLowerCase()=='at' || oType.toLowerCase()=='ma'){
                var subOrder = sharedData.getUrlParameter("aworksubtype", _url);
                var data = 'ntc-master://toa?subtype='+subOrder+'&activityid='+activityid+'&appt_number='+apptNum+'&servicepartnerid='+servicepartnerid+'&lang='+lng+'&lat='+lat+'&BeamID='+beamId+'&orbital='+orbital+'&SIC='+sic+'&ODU_Type_ID='+odu+'&inventory='+inventory+'&ulogin='+user+'&activity_type='+oType+'&status=EquipmentRemoval'
            }else{
                var data = 'ntc-master://toa?activityid='+activityid+'&appt_number='+apptNum+'&servicepartnerid='+servicepartnerid+'&lang='+lng+'&lat='+lat+'&BeamID='+beamId+'&orbital='+orbital+'&SIC='+sic+'&ODU_Type_ID='+odu+'&inventory='+inventory+'&ulogin='+user+'&activity_type='+oType+'&status=EquipmentRemoval'
            }            
            
            //var data='ntc-master://toa?appt_number=TIM55933450&lang=-9.2630979&lat=-61.8321289&BeamID=B2&orbital=28.2 east&SIC=RT23635&ODU_Type_ID=2&inventory={"invtype":"BUC","invsn":"BUC-9988","Model":"null","quantity":"1"},{"invtype":"Modem","invsn":"Modem-222","Model":"null","quantity":"1"}&ulogin=Telecom Italia_Technician2&activity_type=IT&status=EquipmentRemoval';
            sharedData.setToaData(data);
            setHeader(oType);
            $scope.loadPage();
            //window.dispatchEvent(new Event('toa'));
        }
   }

   function onOnline() {
        //sharedData.uplodLog();
    }

    function onBackKeyDown(e) {
        e.preventDefault();
    }

    $scope.redirect = function() {
    	/*-----UAT Environment-------*/
        //window.location.href = TOA_URL;

        /*-----SIT Environment-------*/
        window.location.href = TOA_URL;

       /* var _url = TOA_URL;
        var win = cordova.InAppBrowser.open(_url, "_blank", "location=yes,zoom=no,hardwareback=no,clearsessioncache=no,clearcache=no,toolbar=no,transitionstyle=crossdissolve");
        win.addEventListener("loadstart", function(e, event) {
            var currentAppURL = e.url;
        });*/
    }

    window.addEventListener('toa', showOrderSummaryFromIos);
    function showOrderSummaryFromIos() {
        $timeout(function(){
                 var oType=(sharedData.getUrlParameter("activity_type", sharedData.getToaData()));
                 setHeader(oType);
                 sharedData.navgateToTS();
        },200)
    }
});