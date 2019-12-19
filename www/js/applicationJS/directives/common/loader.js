'use strict';
app.directive('appLoader',function(){
	return {
        restrict: 'E',
        replace:true,
        template: '<div class="loading"><img src="img/loader.gif"/></div>',
        link: function (scope, element, attr) {
              scope.$watch('loading', function (val) {
                  if (val)
                      $(element).show();
                  else
                      $(element).hide();
              });
        }
      }
});