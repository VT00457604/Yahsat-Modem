/*----DEV---*/
//var TOA_URL = 'https://login.etadirect.com/yahsat2.test/m';

/*----SIT---*/
//var TOA_URL = 'https://login.etadirect.com/yahsat3.test/m/saml'; //With SSO
//var TOA_URL = 'https://login.etadirect.com/yahsat3.test/mobility'; //Without SSO

/*----UAT---*/
//var TOA_URL = 'https://login.etadirect.com/yahsat1.test/mobility/saml'; //With SSO
//var TOA_URL = 'https://login.etadirect.com/yahsat3.test/mobility'; //Without SSO

/*----PROD---*/
var TOA_URL = 'https://login.etadirect.com/yahsat/m/saml'; //With SSO
//var TOA_URL = 'https://login.etadirect.com/yahsat/mobility'; //Without SSO

/*----PERFORMANCE TESTING---*/
//var TOA_URL = 'https://login.etadirect.com/yahsat4.test/mobility/saml'; //With SSO

var app = angular.module('yahsatApp', ['ngRoute', 'pascalprecht.translate']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'loginCtrl'
    }).when('/order', {
        templateUrl: 'views/order/order.html',
        controller: 'orderCtrl'
    }).when('/assesssite', {
        templateUrl: 'views/assesssite/assesssite.html',
        controller: 'assesssiteCtrl'
    }).when('/troubleshoot', {
        templateUrl: 'views/troubleshoot/troubleshoot.html',
        controller: 'troubleshootCtrl'
    }).when('/physinstall', {
        templateUrl: 'views/installation/physinstall.html',
        controller: 'physinstallCtrl'
    }).when('/wifi', {
        templateUrl: 'views/wifi/wifi.html',
        controller: 'wifiCtrl'
    }).when('/equipment', {
        templateUrl: 'views/equipment/equipment.html',
        controller: 'equipmentCtrl'
    }).when('/equipment_at', {
        templateUrl: 'views/equipment/equipment_at.html',
        controller: 'equipmentAtCtrl'
    }).when('/equipment_re', {
        templateUrl: 'views/equipment/equipment_re.html',
        controller: 'equipmentReCtrl'
    }).when('/equipment_ra', {
        templateUrl: 'views/equipment/equipment_ra.html',
        controller: 'equipmentRaCtrl'
    }).when('/antenna', {
        templateUrl: 'views/antenna/antenna.html',
        controller: 'antennaCtrl'
    }).when('/inspection', {
        templateUrl: 'views/inspection/inspection.html',
        controller: 'inspectionCtrl'
    }).when('/commissioning', {
        templateUrl: 'views/commissioning/commissioning.html',
        controller: 'commissioningCtrl'
    }).when('/material', {
        templateUrl: 'views/material/material.html',
        controller: 'materialCtrl'
    }).when('/wificonfig', {
        templateUrl: 'views/wificonfig/wificonfig.html',
        controller: 'wificonfigCtrl'
    }).when('/speed', {
        templateUrl: 'views/speed/speed.html',
        controller: 'speedCtrl'
    }).when('/documentation', {
        templateUrl: 'views/documentation/documentation.html',
        controller: 'documentationCtrl'
    }).when('/preventive', {
        templateUrl: 'views/preventive/preventive.html',
        controller: 'preventiveCtrl'
    }).when('/tsmaterial', {
        templateUrl: 'views/material/tsmaterial.html',
        controller: 'tsmaterialCtrl'
    }).when('/eqpmntrmvd', {
        templateUrl: 'views/equipment/eqpmntRemoved.html',
        controller: 'eqpmntrmvdCtrl'
    }).when('/migration', {
        templateUrl: 'views/migration/migration.html',
        controller: 'migrationCtrl'
    }).when('/about', {
        templateUrl: 'views/about/about.html',
        controller: 'aboutCtrl'
    }).otherwise({
        templateURL: 'views/login/login.html',
        controller: 'loginCtrl'
    });
}]);

app.config(['$translateProvider',
    function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'translations/',
            suffix: '.json'
        }).preferredLanguage('en').useMissingTranslationHandlerLog();
    }
]);

app.run(['$location', '$rootScope','$translate', function($location, $rootScope, $translate) {
	
	//localStorage.setItem('mmaVersion', 'V 1.2.41(SIT on VPN With SSO)');
	//localStorage.setItem('mmaVersion', 'V 1.2.58 (UAT on VPN With SSO)');
	//localStorage.setItem('mmaVersion', 'V 1.0.30(PROD on VPN With SSO)');
	localStorage.setItem('mmaVersion', 'V 1.0.31(PROD on MODEM With SSO)');
    //localStorage.setItem('mmaVersion', 'V 1.0.1(PERFORMANCE TESTING on VPN With SSO)');
	//localStorage.clear();
    var stage;
    if (localStorage.getItem('currentPage')) {
        stage = '/' + localStorage.getItem('currentPage');
    } else {
        localStorage.setItem('currentPage', 'login');
        stage = '/login';
    }
    //console.log(stage);
    $location.path(stage);

    var clickCount = 0;
    document.addEventListener('deviceready', function() {
        document.addEventListener("backbutton", backKeyDown, true);
        document.addEventListener("resume", appResume, false);
        navigator.globalization.getPreferredLanguage(
            function(language) {
                if (language.value.indexOf('pt') > -1) {
                    $rootScope.lang = (localStorage.getItem("lang")) ? localStorage.getItem("lang") : 'pt';
                } else {
                    $rootScope.lang = (localStorage.getItem("lang")) ? localStorage.getItem("lang") : 'en';
                }
                localStorage.setItem("lang",$rootScope.lang);
                $translate.use($rootScope.lang);
            },
            function() {
                console.log('Error getting language\n');
            }
        );
    })
    function appResume(){
    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    		alert("Connection Type : "+navigator.connection.type+"\n Status : "+navigator.onLine);
    	}
    }
    
    

    function backKeyDown(e) {
        setTimeout(function() {
            $('.exitMes').removeClass('FadeIn-FadeOut');
            clickCount = 0;
        }, 4000)
        //if ($location.path().indexOf('login') >= 0) {
            clickCount++;
            $('.exitMes').addClass('FadeIn-FadeOut');
            if (clickCount >= 2) {
                navigator.app.exitApp();
            }
            return;
        //}
        e.preventDefault();
        //window.history.back();
    }
}]);