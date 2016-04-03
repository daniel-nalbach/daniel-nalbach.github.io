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

    // When the user's code changes, reparse it
    $scope.$watch('userCode', function (newValue) {
      // console.log('userCode', newValue);
      updateParsing(newValue);
    });

    // When the blacklist has been updated, reparse the user's code
    $scope.$on('blacklistUpdated', function () {
      updateParsing($scope.userCode);
    });

    $scope.$watch('ifNotAllowed', function (newValue) {
      if (newValue) {
        $scope.blacklist.push('IfStatement');
      } else if (!newValue && $scope.blacklist.length > 0){
        $scope.blacklist = _.remove($scope.blacklist, "IfStatement");
      }
      // Send an event so that the user's code can be reparsed with the
      // updated blacklist.
      $scope.$emit('blacklistUpdated');
    });

    // This is the process of updating the scope with the
    // parsing and appropriate messages.
    function updateParsing(newValue) {
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
    };
  }]);
