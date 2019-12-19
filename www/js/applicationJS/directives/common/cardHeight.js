app.directive('cardHeight', function ($window) {
    return{
        restrict:'EA',
        link: function (scope, element, attrs) {
            angular.element(window).resize(function () {
                scope.winHeight();
            });
            setTimeout(function () {
                scope.winHeight();
            }, 150);
            scope.winHeight = function () {
                //element.css('height', angular.element(window).height()+20-angular.element('#header').height());
            }
        }
    }
})