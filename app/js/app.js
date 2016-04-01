'use strict';

// Declare app level module which depends on views, and components
angular.module('challenge', [
  'challenge.controllers',
  // 'challenge.services',
  // 'challenge.config',
  // 'challenge.directives'
]);

angular.module('challenge.controllers', [

])
  .controller('MainController', ['$scope', function ($scope) {
    console.log('$scope.$id', $scope.$id);
    $scope.userCode = "Test";

    $scope.$watch('userCode', function (newValue) {
      console.log('userCode', newValue);
    });
  }]);