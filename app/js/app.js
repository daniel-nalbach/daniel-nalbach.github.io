'use strict';

// Declare app level module which depends on views, and components
angular.module('challenge', [
  'challenge.controllers',
  // 'challenge.services',
  // 'challenge.config',
  // 'challenge.directives'
]);

angular.module('challenge').constant('_', window._);

angular.module('challenge.controllers', [

])
  .controller('MainController', ['$scope', function ($scope) {

    $scope.syntaxTree = null;

    $scope.$watch('userCode', function (newValue) {
      // console.log('userCode', newValue);
      $scope.syntaxTree = esprima.parse(newValue, { tolerant: true });
    });

    $scope.$watch('syntaxTree', function (newValue) {
      if (newValue) {
        var flatTree = _.flatMapDeep($scope.syntaxTree.body);
        $scope.functions = _.filter(flatTree, { type: "FunctionDeclaration" });
      }
    });
  }]);
