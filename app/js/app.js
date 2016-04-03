'use strict';

// Declare app level module which depends on views, and components
angular.module('challenge', [
  'challenge.controllers',
  'challenge.services',
  // 'challenge.config',
  // 'challenge.directives'
]);

angular.module('challenge').constant('_', window._);

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

angular.module('challenge.services', [

])
  .service('MainService', function () {
    this.checkForDisallowed = function (syntaxTree, blacklist, messages) {
      var flatTree = _.flatMapDeep(syntaxTree);
      _.each(blacklist, function (disallowed) {
        var results = _.filter(flatTree, { type: disallowed });
        var alreadyHasMessage = _.filter(messages, { type: disallowed }).length > 0;
        if (results.length > 0 && !alreadyHasMessage) {
          messages.push({ type: disallowed, text: "This exercise requires that you do not use " + disallowed });
        } else if  (!results.length && alreadyHasMessage) {
          messages = _.reject(messages, { type: disallowed });
        }
      });
      return messages;
    };

    this.tryParsing = function (text) {
      var response = {};
      try {
        response.type = "success";
        response.tree = esprima.parse(text, { tolerant: true });
      } catch (e) {
        response.type = "error";
        response.error = e.description;
        // console.log(e);
      }
      return response;
    };
  });
