'use strict';

angular.module('challenge.controllers', [
  'challenge.services'
])
  .controller('MainController', ['$scope', 'MainService', function ($scope, MainService) {

    $scope.$watch(function () { return MainService.blacklist; }, function (newValue) {
      $scope.blacklist = newValue;
    });

    $scope.$watch(function () { return MainService.blacklistMessages; }, function (newValue) {
      $scope.blacklistMessages = newValue;
    });

    $scope.$watch(function () { return MainService.checkedWhitelistStructures; }, function (newValue) {
      $scope.checkedWhitelistStructures = newValue;
    });

    $scope.$watch(function () { return MainService.errors; }, function (newValue) {
      $scope.errors = newValue;
    });

    $scope.$watch(function () { return MainService.sharedItems; }, function (newValue) {
      $scope.sharedItems = newValue;
    });

    $scope.$watch(function () { return MainService.sharedItems; }, function (newValue) {
      $scope.sharedItems = newValue;
    });

    $scope.$watch(function () { return MainService.syntaxTree; }, function (newValue) {
      $scope.syntaxTree = newValue;
    });

    $scope.$watch(function () { return MainService.whitelist; }, function (newValue) {
      $scope.whitelist = newValue;
    });

    $scope.$watch(function () { return MainService.whitelist; }, function (newValue) {
      $scope.whitelist = newValue;
    });

    $scope.$watch(function () { return MainService.whitelistMessages; }, function (newValue) {
      $scope.whitelistMessages = newValue;
    });

    // When the user's code changes, reparse it
    $scope.$watch('userCode', function (newValue) {
      MainService.updateParsing(newValue);
    });

    // When the blacklist has been updated, reparse the user's code
    $scope.$on('blacklistUpdated', function () {
      MainService.updateParsing($scope.userCode);
    });
    // When the whitelist has been updated, reparse the user's code
    $scope.$on('whitelistUpdated', function () {
      MainService.updateParsing($scope.userCode);
    });

    $scope.$watch('blacklistedItems', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        MainService.updateBlacklist(newValue);
        $scope.$emit('blacklistUpdated');
      }
    });

    $scope.$watch('whitelistedItems', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        MainService.updateWhitelist(newValue);
        $scope.$emit('whitelistUpdated');
      }
    });

  }]);
