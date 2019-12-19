'use strict';
app.directive('modalDialog', function ($location, $timeout, sharedData, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            dialogmsg: "=?",
            dialogimg: "=?",
            modalin: "=?",
            footerbtn: "=?",
            errorbtn: "=?",
            successbtn: "=?",
            errbtnshow: "=?",
            otperrshow: "=?",
            otperrmes: "=?",
            hotline: "=?",
            nextpage: "=?",
            showotp: "=?",
            successaction: '&',
            erroraction:'&'
        },
        link: function (scope, elm, attr) {
            var promise;
            //scope.showotp = false;
            scope.closeModal = function () {
                scope.showotp = false;
                scope.modalin = false;
                scope.otperrshow = false;
                scope.otpinpt = "";
                //$rootScope.rworder = false;
                $timeout.cancel(promise);
                elm.modal('hide');
                if (scope.dialogmsg !== 'RETURN_WO' && scope.erroraction() == undefined)
                    $rootScope.AILoading = true;


                //scope.loading = true;
                $timeout(function () {
                    if (scope.nextpage) {
                        $rootScope.AILoading = false;
                        $location.path(scope.nextpage);
                    }
                    var toaData = sharedData.getToaData();
                    var ordertype = sharedData.getUrlParameter("activity_type", toaData).toLowerCase();
                    if (scope.errorbtn === 'SKIP') {
                        scope.dialogmsg = 'PLEASE_ENTER_OTP';
                        scope.dialogimg = "img/otp_icon.png";
                        scope.footerbtn = true;
                        scope.successbtn = 'SUBMIT';
                        if (ordertype === 'it'){
                        	scope.errorbtn = 'CANCELEQUIPMENT';
   	                   	}else {
   	                   		scope.errorbtn = 'CANCEL';
   	                   }
                        scope.errbtnshow = true;
                        scope.showotp = true;
                        scope.otpinpt = "";
                        elm.modal('show');
                    } else if(scope.errorbtn === 'CANCEL'){
                    	localStorage.setItem("restrict_antena_location", "false");
                    	var subtype = sharedData.getUrlParameter("subtype", sharedData.getToaData());
                    	//alert(subtype.toLowerCase());
                    	if (subtype.toLowerCase() == "equipmentexchange") {
                            $location.path('/equipment_at');
                        } else if (subtype.toLowerCase() == "antennapointing") {
                        	window.location.href = TOA_URL;
                            $location.path('/antenna');
                        }
                    } else if(scope.errorbtn === 'CANCELEQUIPMENT'){
                    	$location.path('/equipment');
                    } else if(scope.errorbtn === 'CANCELANTENNA'){                    	
                    	$location.path('/antenna');
                    } else if(scope.errorbtn === 'MODEM_CANCEL'){
                    	$location.path('/equipment');
                    }  else {
                        scope.showotp = false;
                    }
                    $rootScope.AILoading = false;

                }, 4000);

            };
            scope.$watch('modalin', function () {
                try{
                    if ($rootScope.OTP==1)
                        scope.showotp = false;
                    $("nav#menu").mmenu({});
                    var API = $("nav#menu").data("mmenu");
                    API.close();
                }catch(e){
                    //nothing
                }
                
                if (scope.modalin === true) {
                    elm.modal('show');
                    if (!scope.footerbtn) {
                        promise = $timeout(function () {
                            scope.closeModal();
                        }, 4000);

                    } else {
                        if (scope.otperrshow) {
                            //scope.errmsg = 'Please enter a valid otp';
                        }

                        if (scope.errorbtn == '') {
                            scope.errbtnshow = false;
                        }

                        if (!scope.errorbtn) {
                            scope.fullrghtbtn = true;
                        } else {
                            scope.fullrghtbtn = false;
                        }
                    }
                    if (scope.otpinpt) {
                        scope.$watch('otpinpt', function () {
                            scope.otperrshow = false;
                        })
                    }
                    //var modelElm = angular.element(elm);
                } else {
                    $('.modal-backdrop').remove();
                    elm.modal('hide');
                }
            });
            scope.errorAction = function(){
                if(scope.erroraction()==undefined){
                    scope.closeModal();
                }else{
                    scope.closeModal();
                    scope.erroraction();
                }
            }

        },
        controller: function ($scope) {

        },
        templateUrl: 'views/modal/modalDialog.html'
    }
});