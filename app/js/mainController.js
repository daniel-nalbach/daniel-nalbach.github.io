'use strict';

angular.module('challenge.controllers', [
  'challenge.services'
])
  .controller('MainController', ['$scope', 'MainService', function ($scope, MainService) {

    $scope.syntaxTree = null;
    $scope.errors = null;
    $scope.functions = null;
    $scope.ifStatements = null;
    $scope.blacklist = [];
    $scope.blacklistMessages = [];

    $scope.$watch('userCode', function (newValue) {
      // console.log('userCode', newValue);
      $scope.errors = null;
      var response = MainService.tryParsing(newValue);
      if (response.type === "success") {
        $scope.syntaxTree = response.tree;
        if ($scope.syntaxTree) {
          $scope.blacklistMessages = MainService.checkForDisallowed($scope.syntaxTree, $scope.blacklist, $scope.blacklistMessages);
        }
      } else if (response.type === "error") {
        $scope.errors = response.error;
      }
    });

    $scope.$watch('ifNotAllowed', function (newValue) {
      if (newValue) {
        $scope.blacklist.push('IfStatement');
      } else if (!newValue && $scope.blacklist.length > 0){
        $scope.blacklist = _.remove($scope.blacklist, "IfStatement");
      }
    });
  }]);
