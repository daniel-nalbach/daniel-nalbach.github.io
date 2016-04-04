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
    $scope.whitelist = [];
    $scope.whitelistMessages = [];

    // When the user's code changes, reparse it
    $scope.$watch('userCode', function (newValue) {
      // console.log('userCode', newValue);
      updateParsing(newValue);
    });

    // When the blacklist has been updated, reparse the user's code
    $scope.$on('blacklistUpdated', function () {
      console.log('black updated event received');
      updateParsing($scope.userCode);
    });
    // When the whitelist has been updated, reparse the user's code
    $scope.$on('whitelistUpdated', function () {
      console.log('white updated event received');
      updateParsing($scope.userCode);
    });

    $scope.$watch('blacklistedItems', function (newValue) {
      if (newValue) {
        if (newValue.indexOf(',') < 0) {
          $scope.blacklist.push(newValue);
        } else {
          $scope.blacklist = _.split(newValue, ',');
        }
        // console.log('statements', statements);
      } else {
        $scope.blacklist = [];
      }
      $scope.$emit('blacklistUpdated');
    });

    $scope.$watch('whitelistedItems', function (newValue) {
      if (newValue) {
        if (newValue.indexOf(',') < 0) {
          $scope.whitelist.push(newValue);
        } else {
          $scope.whitelist = _.split(newValue, ',');
        }
        // console.log('statements', statements);
      } else {
        $scope.whitelist = [];
      }
      $scope.$emit('whitelistUpdated');
    });

    // This is the process of updating the scope with the
    // parsing and appropriate messages.
    function updateParsing(newValue) {
      $scope.errors = null;
      var response = MainService.tryParsing(newValue);
      console.log('response', response);
      if (response.type === "success") {
        $scope.syntaxTree = response.tree;
        if ($scope.syntaxTree) {
          $scope.blacklistMessages = MainService.checkForDisallowed($scope.syntaxTree, $scope.blacklist, $scope.blacklistMessages);
          $scope.whitelistMessages = MainService.checkForRequired($scope.syntaxTree, $scope.whitelist, $scope.whitelistMessages);
        }
      } else if (response.type === "error") {
        $scope.errors = response.error;
      }
      console.log('$scope.blacklistMessages', $scope.blacklistMessages);
      console.log('$scope.whitelistMessages', $scope.whitelistMessages);
    };
  }]);
