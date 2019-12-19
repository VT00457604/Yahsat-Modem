'use strict';
app.directive('appFooter',function(sharedData){
    return {
		        restrict:'EA',        
		        scope:{
		                action:'&',
		                isDisable:'='
		        },
		        link: function(scope, elm,attr){
					var ordertype = sharedData.getOrderType();
					if(ordertype == 'eqpmntrmvd'){
						scope.hidefooter = true;
					}else{
						scope.hidefooter = true;
					}
				},                            
		        controller:function($scope) {
		        	$scope.footerdisable = $scope.isDisable;
			        $scope.returnWorkOrder = function(){
			        	$("nav#menu").mmenu({});
						var API = $("nav#menu").data("mmenu");
						API.close();
			                if(!$scope.isDisable)
			                $scope.action();
			        }
           		},
            	templateUrl:'views/common/appFooter.html' 
   			}
});
