app.factory('sharedData', function(AuditLog, $rootScope, $location, $q, $http) {
    var orderType = null;
    var ordrSmryClkdSts = false;
    var portalLog = {};
    var portalData = {};
    var scannedInvListObj = {};
    var hitCount = 0;
   // var sitAuth='Basic ' + btoa("soap@yahsat3.test" + ":" + "oracle@123");
    //var uatAuth='Basic ' + btoa("soap@yahsat1.test" + ":" + "oracle@2017");
    //var prodAuth='Basic ' + btoa("soap@yahsat" + ":" + "oracle@2017");
    
    var sitAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat3.test" + ":" + "98e301c27154e9c13938936424360a5dc469e4b086eecbdc012b4d0dce7664f4");
    var uatAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat1.test" + ":" + "eb8b55ebefe188ee223086cb91380739302bed3b426246d05b0633cf5faa88d8");
    var prodAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat" + ":" + "70acc2a9317b78c5545b3d313f67183f4c5234c021d4db728d2e4cfad8e085e5");
    var pTAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat4.test" + ":" + "8b05a550d608fc21461ddd5ab8c11e56c5451241588e6a94337ec9b9178b52af");
    
    var authKey = prodAuth;
    
     //upload log if internet is available
    return {
        setToaData: function(data) {
            localStorage.setItem("TOAData", decodeURIComponent(data));
        },
        getToaData: function() {
            return window.localStorage.getItem('TOAData');
        },
        setPnpData: function(data) {
            localStorage.setItem("PNPData", decodeURIComponent(data));
        },
        getPnpData: function(data) {
            return localStorage.getItem("PNPData");
        },
        setPortalData: function(aptNum, data) {
            if (localStorage.getItem("portalData")) {
                portalData = JSON.parse(localStorage.getItem("portalData"));
            }
            portalData[aptNum] = data;
            localStorage.setItem("portalData", JSON.stringify(portalData));
        },
        getPortalData: function(aptNum) {
            var logArr = [];
            if (localStorage.getItem("portalData")) {
                if (Object.keys(JSON.parse(localStorage.getItem("portalData"))).length > 0) {
                    logArr = JSON.parse(localStorage.getItem("portalData"))[aptNum];
                }
            }
            return logArr;
        },
        clearPortalData: function(aptNum) {
            if (localStorage.getItem('portalData')) {
                portalData = JSON.parse(localStorage.getItem('portalData'));
                if (Object.keys(portalData).length > 0) {
                    delete portalData[aptNum];
                    if (Object.keys(portalData).length > 0) {
                        localStorage.setItem('portalData', JSON.stringify(portalData));
                    } else {
                        localStorage.removeItem('portalData');
                    }
                }
            }
        },
        setPortalLog: function(aptNum, log) {
            var logArray = [];
            if (localStorage.getItem('portalLog')) {
                if (Object.keys(JSON.parse(localStorage.getItem('portalLog'))).length > 0) {
                    portalLog = JSON.parse(localStorage.getItem('portalLog'));
                    logArray = portalLog[aptNum] || [];
                    logArray.push(log);
                } else {
                    logArray.push(log);
                }

            } else {
                logArray.push(log);
            }
            portalLog[aptNum] = logArray;
            localStorage.setItem('portalLog', JSON.stringify(portalLog));
        },
        getPortalLog: function(aptNum) {
            var log = [];
            if (localStorage.getItem('portalLog')) {
                if (Object.keys(JSON.parse(localStorage.getItem('portalLog'))).length > 0) {
                    portalLog = JSON.parse(localStorage.getItem('portalLog'));
                    log = portalLog[aptNum];
                }
            }
            return log;
        },
        navgateToTS: function() {
            var currentPage = localStorage.getItem('currentPage');
            if (currentPage == 'login') {
                var orderType = this.getUrlParameter("activity_type", this.getToaData());
                if (orderType.toUpperCase() == "AT") {
                    var subtype = this.getUrlParameter("subtype", this.getToaData());
                }
                if (orderType) {
                    if (orderType.toUpperCase() == 'IT' || orderType.toUpperCase() == 'MAV' || orderType.toUpperCase() == 'REP' || orderType.toUpperCase() == 'MI') {
                        $location.path('/equipment');
                    } else if (orderType.toUpperCase() == 'AT') {
                        if (subtype.toLowerCase() == "equipmentexchange") {
                            $location.path('/equipment_at');
                        } else if (subtype.toLowerCase() == "antennapointing") {
                            $location.path('/antenna');
                        }
                    } else if (orderType.toUpperCase() == 'MA') {
                        $location.path('/antenna');
                    } else if (orderType.toUpperCase() == 'RE' || orderType.toUpperCase() == 'MR') {
                        $location.path('/equipment_re');
                    } else if (orderType.toUpperCase() == 'RA') {
                        $location.path('/equipment_ra');
                    }
                    this.setOrderType(orderType);
                } else {
                    $location.path('/login');
                }

            } else {
                $location.path('/' + currentPage);
            }
            this.setOrdrSmryClkdSts(false);
        },
        setInventory: function(inventory) {
            localStorage.setItem('inventory', inventory);
        },
        getInventory: function() {
            return JSON.parse(localStorage.getItem('inventory'));
        },
        setScannedInventory: function(actId, inventory) {
            var inv = [];
            if (localStorage.getItem('scannedInventory')) {
                if (Object.keys(JSON.parse(localStorage.getItem('scannedInventory'))).length > 0) {
                    scannedInvListObj = JSON.parse(localStorage.getItem('scannedInventory'));
                    inv = scannedInvListObj[actId] || [];
                    inv = inv.concat(inventory);
                } else {
                    inv = inv.concat(inventory);
                }
            } else {
                inv = inv.concat(inventory);
            }
            scannedInvListObj[actId] = inv;
            localStorage.setItem('scannedInventory', JSON.stringify(scannedInvListObj));
        },
        getScannedInventory: function() {
            return JSON.parse(localStorage.getItem('scannedInventory'));
        },
        setCurrentInventory: function(inv) {
            localStorage.setItem('currentInventory', JSON.stringify(inv));
        },
        getCurrentInventory: function() {
            return JSON.parse(localStorage.getItem('currentInventory'));
        },
		/* Implemented by Vijay to save old inventory (13th-July-2018) */
		setOldScannedInventory: function(actId, inventory) {
            var inv = [];
            if (localStorage.getItem('oldScannedInventory')) {
                if (Object.keys(JSON.parse(localStorage.getItem('oldScannedInventory'))).length > 0) {
                    scannedInvListObj = JSON.parse(localStorage.getItem('oldScannedInventory'));
                    inv = scannedInvListObj[actId] || [];
                    inv = inv.concat(inventory);
                } else {
                    inv = inv.concat(inventory);
                }
            } else {
                inv = inv.concat(inventory);
            }
            scannedInvListObj[actId] = inv;
            localStorage.setItem('oldScannedInventory', JSON.stringify(scannedInvListObj));
        },
        getOldScannedInventory: function() {
            return JSON.parse(localStorage.getItem('oldScannedInventory'));
        },
		setOldInventory: function(inv) {
            localStorage.setItem('oldInventory', JSON.stringify(inv));
        },
        getOldInventory: function() {
            return JSON.parse(localStorage.getItem('oldInventory'));
        },/* Over */
        clearPortalLog: function(aptNum) {
            if (localStorage.getItem('portalLog')) {
                portalLog = JSON.parse(localStorage.getItem('portalLog'));
                if (Object.keys(portalLog).length > 0) {
                    delete portalLog[aptNum];
                    if (Object.keys(portalLog).length > 0) {
                        localStorage.setItem('portalLog', JSON.stringify(portalLog));
                    } else {
                        localStorage.removeItem('portalLog');
                    }
                }
            }

        },
        setOrderType: function(type) {
            orderType = type;
        },
        getOrderType: function() {
            if (!orderType) {
                return null;
            } else {
                return orderType;
            }
        },
        setOrdrSmryClkdSts: function(status) {
            ordrSmryClkdSts = status;
        },
        getOrdrSmryClkdSts: function(status) {
            return ordrSmryClkdSts;
        },
        removeKey: function(arr, key) {
            if (arr == null || arr == undefined) return;
            var dummy = arr;
            dummy.forEach(function(v) {
                delete v[key]
            });
            return dummy;
        },
        clearStorage: function() {
           /* localStorage.removeItem('TOAData');
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
            localStorage.removeItem('COMMISSIONING_STATUS');*/	
        },
        replaceString: function(url) {
            var toaData = this.getToaData();
            var itemsList = url.split('//toa?')[1];
            itemsList = itemsList.split("&");
            for (var i = 0; i < itemsList.length; i++) {
                if (this.getToaData().indexOf(itemsList[i].split("=")[0]) > -1) {
                    toaData = toaData.replace(itemsList[i].split("=")[0] + "=" + this.getUrlParameter(itemsList[i].split("=")[0], toaData), itemsList[i])
                } else {
                    toaData = toaData + "&" + itemsList[i];
                }
            }
            return toaData;
        },
        getUrlParameter: function(param, dummyPath) {
            var sPageURL = dummyPath || window.location.search.substring(1),
                sURLVariables = sPageURL.split(/[&||?]/),
                res;
            for (var i = 0; i < sURLVariables.length; i += 1) {
                var paramName = sURLVariables[i],
                    sParameterName = (paramName || '').split('=');

                if (sParameterName[0] === param) {
                    res = sParameterName[1];
                }
            }
            return res;
        },
        deleteInv: function(actId, invId) {
            var scnInvList = this.getScannedInventory();
            var invList = scnInvList[actId];
            for (var i = 0; i < invList.length; i++) {
                if (invList[i].inventorydetail == invId) {
                    invList.splice(i, 1);
                    i = 0;
                }
            }
            if (invList.length > 0) {
                scnInvList[actId] = invList;
            } else {
                delete scnInvList[actId];
            }
            this.setScannedInventory(actId, scnInvList);
        },
        getModemDetails: function(fnName) {
        	alert("Parameter Name "+fnName);
            $rootScope.AILoading = true;
            var deferred = $q.defer();
            $http({
                method: 'GET',
                async:false,
                url: 'http://192.168.1.1/cgi-bin/cgiclient?request={"FunctionName":"' + fnName + '"}',
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function(data) {
            	alert("New Modem API Success"+JSON.stringify(data));
                deferred.resolve(data);                
                $rootScope.AILoading = false;
            }, function(error) {
            	alert("New Modem API Error"+JSON.stringify(error));
            	$scope.dialogmsg = "Please verify that device is connected to Newtec Modem";
            	$scope.dialogimg = "img/done_icon.png";
				$scope.footerbtn = false;
				$scope.modalin = true;
        		
                deferred.reject(error);
                $rootScope.AILoading = false;
            });
            return deferred.promise;
        },
        uploadInventory: function() {
            var _this = this;
            var promises = [];
            var scannedInventoryObj = this.getScannedInventory();
           
            for (var key in scannedInventoryObj) {
                var activityid = key;
                var scannedInventoryList = scannedInventoryObj[key];
                scannedInventoryList.forEach(function(item, index) {
                    var user = item.user;
                    var inventoryId = item.inventorydetail;
                    var newInventory = item.equipmentserialno;
                    var deffered = $q.defer();
                    if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                    	alert('Install url: https://api.etadirect.com/rest/ofscCore/v1/resources/' + user + '/inventories/' + inventoryId + '/custom-actions/install');
            		}
                   /* if(localStorage.getItem('newOduInventory')){
                    	var newInventory = localStorage.getItem('newOduInventory');
                    	localStorage.removeItem('newOduInventory');
                    }*/
                    var _idata = {
                            "activityId": parseInt(activityid),
                            "inventoryId": parseInt(newInventory)
                        };
                    	localStorage.setItem("install_inventory_request_parameter", _idata);
                        $http({
                            method: 'POST',
                            url: 'https://api.etadirect.com/rest/ofscCore/v1/resources/' + user + '/inventories/' + inventoryId + '/custom-actions/install',
                            crossDomain: true,
                            data: JSON.stringify(_idata),
                            headers: {
                            	'Access-Control-Allow-Origin' : '*',
                				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
                				'Content-Type': 'application/json; charset=utf-8',
                				'Accept': 'application/json',
                                'Authorization': authKey
                            }
                        }).then(function(data) {
                        	localStorage.setItem("install_inventory_response_parameter", JSON.stringify(data));
                            deffered.resolve(data);
                            _this.deleteInv(activityid, inventoryId);
                            if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {                                
                                alert( 'Install Inventories Success Response : '+ JSON.stringify(data) );
                            }
                        }, function(error) {
                        	localStorage.setItem("install_inventory_response_parameter", JSON.stringify(error));
                            if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                            	alert( 'Install Inventories Failure Response: '+ JSON.stringify(error) );
                            }
                            console.log('Inventory could not be installed');
                            console.log(error);
                            $rootScope.AILoading = false;
                        });
                   
                    promises.push(deffered.promise);
                })
            }
            return $q.all(promises);
        },
		uploadAllLog: function() {
			 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
              	alert('Entered uploadAllLog Function');
      		}
            var _this = this;
            // Log array for commisisoning
            var logs;
            if (localStorage.getItem('portalLog')) {
                logs = JSON.parse(localStorage.getItem('portalLog'));
            }
            if (logs) {
                if (Object.keys(logs).length > 0) {
                    hitCount++;
                    $rootScope.AILoading = true;
                    // auditlog is a factory
                    AuditLog(logs).then(function(response) {
                        $rootScope.AILoading = false;
                        if (response[0].results[0]['operationsPerformed']) {
                            _this.clearPortalLog(response[0].woid);
                            _this.clearPortalData(response[0].woid);
                            hitCount = 0;
                            if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                             	alert('Log Uploaded Successfully');
                     		}
                        } else {
                        	_this.uplodLog();
                        	 if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                             	alert('Log could not be uploaded');
                     		}
                            console.log('Log could not be uploaded');
                        }
                    }, function(error) {
                        $rootScope.AILoading = false;
                        _this.uplodLog();
                        /*if (hitCount < 3) {
                            _this.uplodLog();
						}*/
                    })
                }
            }
        },
		uplodLog: function() {
            var _this = this;
            _this.uploadInventory().then(function(res) {
                console.log(res)
            }, function(error) {
                console.log(error);
            })

            _this.uploadAllLog();
        },
		uninstallInventory: function() {
            var _this = this;
            var promises = [];
            var scannedInventoryObj = (this.getOldScannedInventory()) ? this.getOldScannedInventory() : this.getScannedInventory();
            for (var key in scannedInventoryObj) {
                var activityid = key;
                var scannedInventoryList = scannedInventoryObj[key];
                scannedInventoryList.forEach(function(item, index) {
                    var user = item.user;
                    var inventoryId = item.inventorydetail;
                    var oldInventory = item.equipmentserialno;
                    var deffered = $q.defer();
                    if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                    	alert('DeInstall url: https://api.etadirect.com/rest/ofscCore/v1/inventories/' + inventoryId + '/custom-actions/deinstall');
            		}
                    /*if(localStorage.getItem('oldOduInventory')){
                    	var oldInventory = localStorage.getItem('oldOduInventory');
                    	localStorage.removeItem('oldOduInventory');
                    }*/
                    var _deinstalldata = {
                            "activityId": parseInt(activityid),
                            "inventoryId": parseInt(oldInventory)
                        };
                    	localStorage.setItem("deinstall_inventory_request_parameter", _deinstalldata);
                    $http({
                        method: 'POST',
                        url: 'https://api.etadirect.com/rest/ofscCore/v1/inventories/' + inventoryId + '/custom-actions/deinstall',
                        crossDomain: true,
                        data: JSON.stringify(_deinstalldata),
                        headers: {
                        	'Access-Control-Allow-Origin' : '*',
            				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            				'Content-Type': 'application/json; charset=utf-8',
            				'Accept': 'application/json',
                            'Authorization': authKey
                        }
                    }).then(function(data) {
                    	localStorage.setItem("deinstall_inventory_response", JSON.stringify(data));
                        deffered.resolve(data);
                        _this.deleteInv(activityid, inventoryId);
                        if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {                        	
                			alert( "Deinstall Inventories Success Response: "+JSON.stringify(data) );
                		}
                    }, function(error) {
                    	localStorage.setItem("deinstall_inventory_response", JSON.stringify(error));
                    	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
                    		alert( "Deinstall Inventories Failure Response: "+JSON.stringify(error) );
                    	}
                        console.log('Inventory could not be installed');
                        console.log(error);
                        $rootScope.AILoading = false;
                    });
                    promises.push(deffered.promise);
                })
            }
            return $q.all(promises);
        },
		uploadUninstallLog: function() {
            var _this = this;
            // log array for commisisoning
            var logs;
            if (localStorage.getItem('portalLog')) {
                logs = JSON.parse(localStorage.getItem('portalLog'));
            }
            if (logs) {
                if (Object.keys(logs).length > 0) {
                    hitCount++;
                    $rootScope.AILoading = true;
                    // auditlog is a factory
                    AuditLog(logs).then(function(response) {
                        $rootScope.AILoading = false;
                        if (response[0].results[0]['operationsPerformed'] != undefined) {
                            _this.clearPortalLog(response[0].woid);
                            _this.clearPortalData(response[0].woid);
                            hitCount = 0;
                        } else {
                            console.log('Log could not be uploaded');
                        }
                    }, function(error) {
                        $rootScope.AILoading = false;
                        if (hitCount < 3) {
                            _this.uninstall();
						}
                    })
                }
            }
        },
		uninstall: function() {
            var _this = this;
            _this.uninstallInventory().then(function(res) {
                console.log(res)
            }, function(error) {
                console.log(error);
            })

            _this.uploadUninstallLog();
        }
		/* Over */
    }
})

/*
------------------------------------------------------------------------------------------------------------------------------
*/

app.factory('AuditLog', function($q, $http, $rootScope) {
	 // var sitAuth='Basic ' + btoa("soap@yahsat3.test" + ":" + "oracle@123");
    //var uatAuth='Basic ' + btoa("soap@yahsat1.test" + ":" + "oracle@2017");
    //var prodAuth='Basic ' + btoa("soap@yahsat" + ":" + "oracle@2017");
    
    var sitAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat3.test" + ":" + "98e301c27154e9c13938936424360a5dc469e4b086eecbdc012b4d0dce7664f4");
    var uatAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat1.test" + ":" + "eb8b55ebefe188ee223086cb91380739302bed3b426246d05b0633cf5faa88d8");
    var prodAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936@yahsat" + ":" + "70acc2a9317b78c5545b3d313f67183f4c5234c021d4db728d2e4cfad8e085e5");
    var pTAuth='Basic ' + btoa("8a3ec2b3641593a3925e6490bc284dae68f09936" + ":" + "8b05a550d608fc21461ddd5ab8c11e56c5451241588e6a94337ec9b9178b52af");
    
    var authKey = prodAuth;

    function getPortalData(aptNum) {
        var logArr = [];
        if (localStorage.getItem("portalData")) {
            if (Object.keys(JSON.parse(localStorage.getItem("portalData"))).length > 0) {
                logArr = JSON.parse(localStorage.getItem("portalData"))[aptNum];
            }
        }
        return logArr;
    }

    return function(dataObj) {
        var promises = [];
        var _url = "https://api.etadirect.com/rest/ofscCore/v1/activities/custom-actions/bulkUpdate";
        localStorage.setItem("bulk_update", _url);
        if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
			alert("BULK UPDATE API: "+JSON.stringify(_url));
		}
        for (key in dataObj) {
            var deffered = $q.defer();
            var completeLog = dataObj[key].concat(getPortalData(key));
            
            var _data = {
                "updateParameters": {
                    "identifyActivityBy": "apptNumber",
                    "ifInFinalStatusThen": "doNothing"
                },
                "activities": [{
                	"apptNumber": key,
                	"XA_COMMISSION_STATUS": "true",
                	"restrict_site_validation" : "true",
					"restrict_removal_plugin": "true",
					"restrict_antena_location": localStorage.getItem("restrict_antena_location") ? false : true,                  
                    "XA_AUDIT_LOG": JSON.stringify(completeLog).replace(/"/g, "'"),
                    //"XA_COMMISSION_STATUS": localStorage.getItem("COMMISSIONING_STATUS"),                    
					"XA_MODEM_EXCHANGED": localStorage.getItem("XA_MODEM_EXCHANGED") ? 1 : 0,
					"XA_ODU_EXCHANGED": localStorage.getItem("XA_ODU_EXCHANGED") ? 1 : 0,
					"XA_ANTENNA_EXCHANGED": localStorage.getItem("XA_ANTENNA_EXCHANGED") ? 1 : 0,
					"XA_EQUIP_INCONSISTENT": localStorage.getItem("XA_EQUIP_INCONSISTENT"),
					
                }]
            }
            localStorage.setItem("bulk_update_request_parameter", _data);
            if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
    			alert("BULK UPDATE API RESPONSE: "+JSON.stringify(_data));
    		}
            
            $http({
                method: 'POST',
                url: _url,
                crossDomain: true,
                data: JSON.stringify(_data),
                headers: {
                	'Access-Control-Allow-Origin' : '*',
    				'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
    				'Content-Type': 'application/json; charset=utf-8',
    				'Accept': 'application/json',
                    'Authorization': authKey
                }
            }).then(function(res) {
            	localStorage.setItem("bulk_update_response", res);
            	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
            		alert( "Bulk Update API Success Response: "+JSON.stringify(res) );
            	}
                var data = res.data;
                data.woid = key;
                deffered.resolve(data);
            }, function(error) {
            	localStorage.setItem("bulk_update_response", error);
            	if (localStorage.getItem("dbg") && localStorage.getItem("dbg") == "on") {
            		alert( "Bulk Update API Error Response: "+JSON.stringify(error) );
            	}
                $rootScope.AILoading = false;
            });
            promises.push(deffered.promise);
        }
        return $q.all(promises);
    }
});