'use strict';
app.directive('appOrder',function(){
	return {
		restrict:'E',
		scope:{},
		link: function(scope, elm,attr){
			scope.headerObj = scope.$parent.headerObj;
		},
		controller: function($scope){
		
		},
		templateUrl:'views/common/appOrder.html' 
		
	}
});