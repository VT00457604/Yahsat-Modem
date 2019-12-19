'use strict';
app.controller('orderCtrl', ['$scope', 'sharedData', '$location', '$rootScope', function($scope, sharedData, $location, $rootScope) {
    $scope.headerObj = {
        title: "Order Summary"
    };
    $scope.data = sharedData.getToaData();
    $scope.rworder = false;
   
    $scope.beamId = sharedData.getUrlParameter("BeamID", $scope.data);
    $scope.orderId = sharedData.getUrlParameter("appt_number", $scope.data);
    $scope.sic = sharedData.getUrlParameter("SIC", $scope.data);
    $scope.latitude = sharedData.getUrlParameter("lat", $scope.data);
    $scope.longitude = sharedData.getUrlParameter("lang", $scope.data);
    $scope.orbital = sharedData.getUrlParameter("orbital", $scope.data);
    $scope.uLogin = sharedData.getUrlParameter("ulogin", $scope.data);
    $scope.orderType=sharedData.getUrlParameter("activity_type",$scope.data);
    var paremeters = [
        ["ilnb_radioequipmentmodelno", "ilnb_radioequipmentserialno"],
        ["trx_radioequipmentmodelno", "trx_radioequipmentserialno"],
        ["lnb_radioequipmentmodelno", "lnb_radioequipmentserialno"],
        ["buc_radioequipmentmodelno", "buc_radioequipmentserialno"]
    ];
    var EquipmentType = "";
    var modemDetails = "";
    var AntennaDetails = "";
    if(sharedData.getInventory()){
        $rootScope.inventoryData=sharedData.getInventory();
    }else{
        $rootScope.inventoryData = "";
    }

    //will use later
    $scope.inventoryForPortal = {
        "woid": $scope.orderId,
        "fsotype": $scope.orderType,
        "user": "300000003434151",//$scope.uLogin,
        "servicepartnerid": "",
        "distributorid": "",
        "equipment": []
    }
    try {
        $scope.inventory = sharedData.getUrlParameter('inventory', $scope.data).split('},').join('}_&').split('_&');
        $scope.inventory =$scope.inventory.map(function(ele){
            return JSON.parse(ele);
        })
        $scope.inventoryForPortal.equipment = $scope.inventory.map(function(elem) {
            var ele = elem;
            return {
                "equipmenttype": (ele.invtype.toUpperCase() == "iLNB" || ele.invtype.toUpperCase() == "LNB" || ele.invtype.toUpperCase() == "BUC") ? "RE" : (ele.invtype.toUpperCase() == "MODEM") ? "MDM" : (ele.invtype.toUpperCase() == "ANTENNA") ? "ANT" : "NA",
                "radioequipmenttype": (ele.invtype == "iLNB" || ele.invtype == "LNB" || ele.invtype == "BUC") ? "RE" : "NA",
                "equipmentserialno": ele.invsn,
                "equipmentmodelno": ele.Model
            }
        });

        sharedData.setInventory($scope.inventoryForPortal);
        $rootScope.inventoryData=$scope.inventoryForPortal;

        /*$scope.inventory = $scope.inventory.map(function(ele) {
            var item = JSON.parse(ele);
            for (var i = 0; i < paremeters.length; i++) {
                if (paremeters[i][0].split("_")[0] == item['invtype'].toLowerCase() || paremeters[i][1].split("_")[0] == item['invtype'].toLowerCase()) {
                    EquipmentType = EquipmentType + item['invtype'] + "_";
                    var model = paremeters[i][0] + "=" + item['Model']
                    var serial = paremeters[i][1] + "=" + item['invsn']
                    $rootScope.inventoryUrl = $rootScope.inventoryUrl + model + "&" + serial + "&";
                    console.log($rootScope.inventoryUrl);
                }
                if (item['invtype'].toLowerCase() == "modem") {
                    modemDetails = "modemmodelno=" + item['Model'] + "&modemserialno=" + item['invsn'];
                }
                if (item['invtype'].toLowerCase() == "antenna") {
                    AntennaDetails = "antennamodelno=" + item['Model'] + "&antennaserialno=" + item['invsn'];
                }
            }
            return item;
        })*/
    } catch (e) {
        console.log('Inventory records not found');
    };

    $scope.navgateToTS = function() {
        var currentPage = localStorage.getItem('currentPage');
        if (currentPage == 'login') {
            var orderType = sharedData.getUrlParameter("activity_type", $scope.data).toLowerCase();
            if (orderType) {
                if (orderType === 'install' || orderType === 'installation' || orderType === 'it') {
                    $location.path('/assesssite');
                } else if (orderType.toLowerCase() == 'technical assistance') {
                    $location.path('/troubleshoot');
                } else if (orderType.toLowerCase() == 'eqpmntrmvd') {
                    $location.path('/eqpmntrmvd');
                }else if(orderType.toLowerCase() == 'roomchange'){
                    $location.path('/material');
                }else if(orderType.toLowerCase() == 'antennachange'){
                    $location.path('/assesssite');
                }else if(orderType.toLowerCase() == 'migration'){
                    $location.path('/migration');
                }
                sharedData.setOrderType(orderType);
            } else {
                $location.path('/login'); // if is not in localstorage 
               //commenting to show dynamic data
               // sharedData.setOrderType(null);
            }

        } else if (currentPage == 'assesssite') {
            if (sharedData.getOrdrSmryClkdSts() == false) {
                $location.path('/physinstall');
                sharedData.setOrderType('Install');
            } else {
                $location.path('/assesssite');
            }
        } else {
            $location.path('/' + currentPage);
        }
        sharedData.setOrdrSmryClkdSts(false);
    };
}]);




