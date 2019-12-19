'use strict';
app.controller('aboutCtrl', function($scope, $location) {
	$scope.versions = localStorage.getItem('mmaVersion');
    var currentPage=localStorage.getItem('currentPage');
    $scope.closeAbout=function(){
        $location.path(currentPage);
    }
});