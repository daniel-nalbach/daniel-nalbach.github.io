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
    $scope.errors = null;
    $scope.functions = null;
    $scope.ifStatements = null;

    function tryParsing (text) {
      $scope.errors = null;
      try {
        return esprima.parse(text, { tolerant: true });
      } catch (e) {
        $scope.errors = e.description;
        // console.log(e);
      }
    };

    $scope.$watch('userCode', function (newValue) {
      // console.log('userCode', newValue);
      $scope.syntaxTree = tryParsing(newValue);
    });

    $scope.$watch('syntaxTree', function (newValue) {
      if (newValue) {
        var flatTree = _.flatMapDeep($scope.syntaxTree.body);
        $scope.functions = _.filter(flatTree, { type: "FunctionDeclaration" });
        $scope.ifStatements = _.filter(flatTree, { type: "IfStatement" });
      } else {
        $scope.functions = null;
        $scope.ifStatements = null;
      }
    });
  }]);
