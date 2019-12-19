 'use strict';

app.directive('appContent',function($location){
	return {
		restrict:'E',
		scope:{
			navigateToTs: '&',
			redirect: '&'
		},
		link: function(scope, elm,attr){
			scope.headerObj = scope.$parent.headerObj;
			scope.steps = scope.$parent.stepsObj;
			scope.leftbar = scope.$parent.barObj.leftbar;
			scope.rightbar = scope.$parent.barObj.rightbar;
			scope.imgsrc = scope.$parent.imgSrc;
			scope.versions = localStorage.getItem('mmaVersion');
		},
		controller: function($scope){

		},
		templateUrl:'views/common/appContent.html' 
	}
});