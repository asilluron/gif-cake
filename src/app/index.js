import './resources';
import './search';
import './style.scss';

var app = angular.module('pi', ['pi.search', 'pi.resources']);

app.directive('drFocus', function ($timeout) {
  return {
    scope: {
      trigger: '@browsing'
    },
    link: function (scope, element) {
      scope.$watch('trigger', function (value) {
        if (value === 'false') {
          $timeout(function () {
            element[0].focus();
          });
        }
      });
    }
  };
});

export default app;
