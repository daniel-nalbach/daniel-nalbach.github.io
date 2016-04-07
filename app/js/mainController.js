'use strict';

angular.module('challenge.controllers', [
  'challenge.services'
])
  .controller('MainController', ['$scope', 'MainService', function ($scope, MainService) {

    $scope.syntaxTree = null;
    $scope.errors = null;
    $scope.functions = null;
    $scope.sharedItems = [];
    $scope.blacklist = [];
    $scope.blacklistMessages = [];
    $scope.whitelist = [];
    $scope.whitelistMessages = [];
    $scope.checkedWhitelistStructures = [];

    // When the user's code changes, reparse it
    $scope.$watch('userCode', function (newValue) {
      // console.log('userCode', newValue);
      updateParsing(newValue);
    });

    // When the blacklist has been updated, reparse the user's code
    $scope.$on('blacklistUpdated', function () {
      // console.log('black updated event received');
      updateParsing($scope.userCode);
    });
    // When the whitelist has been updated, reparse the user's code
    $scope.$on('whitelistUpdated', function () {
      // console.log('white updated event received');
      updateParsing($scope.userCode);
    });

    $scope.$watch('blacklistedItems', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.blacklist = [];
        $scope.sharedItems = [];
        if (newValue) {
          if (newValue.indexOf(',') < 0) {
            $scope.blacklist.push(_.trim(newValue));
          } else {
            $scope.blacklist = MainService.removeArrayWhitespace(_.split(newValue, ','));
          }
          // console.log('blacklist', $scope.blacklist);
          $scope.sharedItems = MainService.getSharedItems($scope.blacklist, $scope.whitelist);
        }
        $scope.$emit('blacklistUpdated');
      }
    });

    $scope.$watch('whitelistedItems', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        $scope.whitelist = [];
        $scope.sharedItems = [];
        if (newValue) {
          if (newValue.indexOf(',') < 0) {
            $scope.whitelist.push(newValue);
          } else {
            $scope.whitelist = MainService.removeArrayWhitespace(_.split(newValue, ','));
          }
          // console.log('whitelist', $scope.whitelist);
          $scope.structuredWhitelist = MainService.getStructuredStatementList($scope.whitelist);
          $scope.sharedItems = MainService.getSharedItems($scope.whitelist, $scope.blacklist);
          // console.log('sharedItems', $scope.sharedItems);
        }
        $scope.$emit('whitelistUpdated');
      }
    });

    // This is the process of updating the scope with the
    // parsing and appropriate messages.
    function updateParsing(newValue) {
      $scope.errors = null;
      $scope.checkedWhitelistStructures = [];
      if ($scope.sharedItems.length < 1) {
        var response = MainService.tryParsing(newValue);
        if (response.type === "success") {
          $scope.syntaxTree = response.tree;
          if ($scope.syntaxTree) {
            $scope.blacklistMessages = MainService.checkForDisallowed($scope.syntaxTree, $scope.blacklist, $scope.blacklistMessages);
            $scope.whitelistMessages = MainService.checkForRequired($scope.syntaxTree, $scope.whitelist, $scope.whitelistMessages);
            // console.log('$scope.whitelistMessages', $scope.whitelistMessages);
            var validatedStructures = [];
            _.each($scope.structuredWhitelist, function (statement) {
              var parsed = MainService.parseStructure(statement);
              var result = MainService.checkForNested(response.tree, parsed.parent, parsed.child);
              console.log('updateParsing - result', result);
              if (result) { $scope.checkedWhitelistStructures.push(result); }
            });
            // console.log('validatedStructures', validatedStructures);
          }
        } else if (response.type === "error") {
          $scope.errors = response.error;
        }
      }
    };
  }]);
