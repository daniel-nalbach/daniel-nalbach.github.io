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

    $scope.$watch(function () { return MainService.checkedBlacklistStructures; }, function (newValue) {
      $scope.checkedBlacklistStructures = newValue;
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

    $scope.$watch('blacklistedItems', function (newValue, oldValue) {
      MainService.updateBlacklist(newValue);
      MainService.updateParsing($scope.userCode);
    });

    $scope.$watch('whitelistedItems', function (newValue, oldValue) {
      MainService.updateWhitelist(newValue);
      MainService.updateParsing($scope.userCode);
    });

  }]);
