'use strict';
app.directive('appHeader', function($location, $rootScope, sharedData, $translate) {
    return {
        restrict: 'E',
        scope: {
            twodigit: "=",
            twodigit2: "=",
            skipshow: "@",
            wifishow: "=",
            wifienable: "=",
            skip: "&"
        },
        link: function(scope, elm, attr) {
            console.log($rootScope.worder);
            scope.headObj = scope.$parent.headerObj;
            scope.$watch(function() {
                return scope.$parent.headerObj;
            }, function(newV, oldV) {
                scope.headObj = newV;
            })
            scope.currentdsbld1 = scope.$parent.disabledStat.disabled1;
            scope.currentdsbld2 = scope.$parent.disabledStat.disabled2;
            scope.currentdsbld3 = scope.$parent.disabledStat.disabled3;
        },
        controller: function($scope, $timeout, $rootScope) {
            $scope.loaderImg = false;
            $rootScope.worder = true;
            $scope.showMenu = function($event) {
                $("nav#menu").mmenu({});
                var API = $("nav#menu").data("mmenu");
                $event.preventDefault();
                API.open();
                $scope.rworders = $rootScope.worder;
            };

            $scope.redirectTo = function(flow) {
                sharedData.setOrdrSmryClkdSts(true);
                $scope.openPage(flow);
            }
            $scope.exportErrorLogs = function() {
            	
            	/*var error_logs = "<b>MMA Error Logs - "+localStorage.getItem("mmaVersion")+"<br/>"+new Date()+"</b><br/><br/>";
            	for ( var i = 0, len = localStorage.length; i < len; ++i ) {
            		console.log( localStorage.key( i ) + ": " + localStorage.getItem( localStorage.key( i ) ) );            		
                	error_logs+="<b>"+localStorage.key( i ) + ":</b> " + localStorage.getItem( localStorage.key( i ) )+"<br/><br/>";                	
            	}
            	window.open('mailto:VT00457604@techmahindra.com?subject=MMA Error Logs -'+localStorage.getItem('mmaVersion')+' '+new Date()+'&body='+error_logs);
            	 */
            	var xmlhttp;
                 if (window.XMLHttpRequest) {
                     xmlhttp = new XMLHttpRequest();               
                 }           
                 else {               
                     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");               
                 }
                 xmlhttp.onreadystatechange = function () {               
                     if (xmlhttp.readyState == 4) {
                    	var error_logs = "<b>MMA Error Logs - "+localStorage.getItem("mmaVersion")+"<br/>"+new Date()+"</b>";
                    	error_logs+="<br/><br/><b>COMMISSIONING_STATUS:</b> "	+ localStorage.getItem("COMMISSIONING_STATUS")+"<br/><br/>";
                    	error_logs+="<b>currentPage:</b> "						+ localStorage.getItem("currentPage")+"<br/><br/>";
                    	error_logs+="<b>lang:</b> "								+ localStorage.getItem("lang")+"<br/><br/>";
                    	error_logs+="<b>isPointed:</b> "						+ localStorage.getItem("isPointed")+"<br/><br/>";
                    	error_logs+="<b>GetModemDetails:</b> "					+ localStorage.getItem("GetModemDetails")+"<br/><br/>"; 
                    	error_logs+="<b>GetModemDetailsSuccess:</b> "			+ localStorage.getItem("GetModemDetailsSuccess")+"<br/><br/>"; 
                    	error_logs+="<b>GetModemDetailsSuccessStatusCode:</b> "	+ localStorage.getItem("GetModemDetailsSuccessStatusCode")+"<br/><br/>"; 
                    	error_logs+="<b>GetModemDetailsError:</b> "				+ localStorage.getItem("GetModemDetailsError")+"<br/><br/>";
                    	error_logs+="<b>GetModemDetailsErrorStatusCode:</b> "	+ localStorage.getItem("GetModemDetailsErrorStatusCode")+"<br/><br/>"; 
                    	error_logs+="<b>GetODUDetails:</b> "					+ localStorage.getItem("GetODUDetails")+"<br/><br/>"; 
                    	error_logs+="<b>GetODUDetailsSuccess:</b> "				+ localStorage.getItem("GetODUDetailsSuccess")+"<br/><br/>";
                    	error_logs+="<b>GetODUDetailsSuccessStatusCode:</b> "	+ localStorage.getItem("GetODUDetailsSuccessStatusCode")+"<br/><br/>"; 
                    	error_logs+="<b>GetODUDetailsError:</b> "				+ localStorage.getItem("GetODUDetailsError")+"<br/><br/>"; 
                    	error_logs+="<b>GetODUDetailsErrorStatusCode:</b> "		+ localStorage.getItem("GetODUDetailsErrorStatusCode")+"<br/><br/>"; 
                    	error_logs+="<b>OldOdu:</b> "							+ localStorage.getItem("OldOdu")+"<br/><br/>";
                    	error_logs+="<b>OldModem:</b> "							+ localStorage.getItem("OldModem")+"<br/><br/>";   
                    	error_logs+="<b>restrict_removal_plugin:</b> "			+ localStorage.getItem("restrict_removal_plugin")+"<br/><br/>"; 
                    	error_logs+="<b>restrict_antena_location:</b> "			+ localStorage.getItem("restrict_antena_location")+"<br/><br/>"; 
                    	error_logs+="<b>XA_MODEM_EXCHANGED:</b> "				+ localStorage.getItem("XA_MODEM_EXCHANGED")+"<br/><br/>"; 
                    	error_logs+="<b>XA_ODU_EXCHANGED:</b> "					+ localStorage.getItem("XA_ODU_EXCHANGED")+"<br/><br/>"; 
                    	error_logs+="<b>XA_ANTENNA_EXCHANGED:</b> "				+ localStorage.getItem("XA_ANTENNA_EXCHANGED")+"<br/><br/>"; 
                    	error_logs+="<b>XA_EQUIP_INCONSISTENT:</b> "			+ localStorage.getItem("XA_EQUIP_INCONSISTENT")+"<br/><br/>";   
                    	error_logs+="<b>XA_AUDIT_LOG:</b> "						+ localStorage.getItem("XA_AUDIT_LOG")+"<br/><br/>";  
                    	error_logs+="<b>InstallInventoryRequestParameters:</b> "+ localStorage.getItem("install_inventory_request_parameter")+"<br/><br/>";
                    	error_logs+="<b>InstallInventoryResponse:</b> "			+ localStorage.getItem("install_inventory_response")+"<br/><br/>";
                    	error_logs+="<b>DeInstallInventoryRequestParameters:</b>"+ localStorage.getItem("deinstall_inventory_request_parameter")+"<br/><br/>";
                    	error_logs+="<b>DeInstallInventoryResponse:</b> "		+ localStorage.getItem("deinstall_inventory_response")+"<br/><br/>";
                    	error_logs+="<b>BulkUpdateParameters:</b> "				+ localStorage.getItem("bulk_update_request_parameter")+"<br/><br/>";
                    	error_logs+="<b>BulkUpdateResponse:</b> "				+ localStorage.getItem("bulk_update_response")+"<br/><br/>";
                    	error_logs+="<b>CustomerInventory:</b> "				+ localStorage.getItem("CustomerInventory")+"<br/><br/>";
                    	error_logs+="<b>portalData:</b> "						+ localStorage.getItem("portalData")+"<br/><br/>";                   	                   	
                    	error_logs+="<b>PNPData:</b> "							+ localStorage.getItem("PNPData")+"<br/><br/>";          
                    	error_logs+="<b>portalLog:</b> "						+ localStorage.getItem("portalLog")+"<br/><br/>";                    	          	
                    	error_logs+="<b>inventory:</b> "						+ localStorage.getItem("inventory")+"<br/><br/>";                    	
                    	error_logs+="<b>currentInventory:</b> "					+ localStorage.getItem("currentInventory")+"<br/><br/>";
                    	error_logs+="<b>scannedInventory:</b> "					+ localStorage.getItem("scannedInventory")+"<br/><br/>";
                    	error_logs+="<b>TOAData:</b> "							+ localStorage.getItem("TOAData")+"<br/><br/>";
                    	
                    	document.write(error_logs); 
                    	window.open('mailto:VT00457604@techmahindra.com?subject=MMA Error Logs -'+localStorage.getItem('mmaVersion')+' '+new Date()+'&body='+error_logs);
                     }               
                 }
                 
                 xmlhttp.open("GET", "error_logs.txt", true);
                 xmlhttp.send();
            }
            $scope.clearData = function() {
            	 $scope.loadermsg = 'RemovingData';
                 $scope.loaderImg = true;
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
                 
                 $timeout(function() {
                     $scope.loaderImg = false;
                     $location.path('/login');
                 },2000)
            	 /* 
               
                localStorage.removeItem('scannedInventory');
                localStorage.removeItem('PNPData');
                localStorage.removeItem('toacliked');
                localStorage.removeItem('isPointed');
                $scope.dialogmsg = 'CLEAR_CACHE';
	        	$scope.dialogimg = "img/error_icon.png";
				$scope.footerbtn = true;
				$scope.modalin = true;
				$scope.successbtn = 'CLEAR_CACHE_OK';
				$scope.errorbtn = 'CLEAR_CACHE_CANCEL';
				$scope.errbtnshow = true;*/
				var API = $("nav#menu").data("mmenu");
                API.close();
            }
            
            $scope.successaction = function() {
                if($scope.successbtn == 'CLEAR_CACHE_OK'){
                	 $scope.loaderImg = true;
                	sharedData.clearStorage();
                	 $timeout(function() {
                         $scope.loaderImg = false;
                         $location.path('/login');
                     },2000)
                }
            }
            /*Language Selection*/
           $scope.$watch(function(){
           	return $rootScope.lang;
           },function(newV){
           		$scope.lang = ($rootScope.lang=='en')? true : false;
           		$translate.use($rootScope.lang);
           })
            
           

            $scope.changeLan = function(lang) {
                if (lang == true) {
                    //console.log('english');
                    $rootScope.lang = 'en';                    
                } else {
                    //console.log('portuguese');
                    $rootScope.lang = 'pt';
                }
                localStorage.setItem("lang",$rootScope.lang);
                $translate.use($rootScope.lang);
            }
			
			/* Debug Mode Implementation (25-Jun-2018 by Zameer) */
			$scope.debug = function(dbg) {
                if (dbg == true) { console.log('On');
                    $rootScope.dbg = 'on';                    
                } else {console.log('Off');
                    $rootScope.dbg = 'off';
                }
                localStorage.setItem("dbg", $rootScope.dbg);
            }
			/* Over */
           

            $rootScope.$on('$translateChangeSuccess', function(event, data) {
                var language = data.language;                
                $rootScope.lang = language;
            });

            /*End here*/


            $scope.openPage = function(flow) {
                $rootScope.worder = true;
                var curv3Active = $scope.headObj.curv3Active;
                var worder = $rootScope.worder;

                if (flow == 'login') {
                    if (curv3Active || worder) {
                        flow = 'login';
                    } else {
                        flow = localStorage.getItem('currentPage');
                    }
                    window.localStorage.clear();

                }

                var page = '/' + flow;
                $location.path(page);
                var API = $("nav#menu").data("mmenu");
                API.close();
            };
        },
        templateUrl: 'views/common/appHeader.html'

    }
});