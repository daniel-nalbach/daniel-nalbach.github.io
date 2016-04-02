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
    $scope.blacklist = [];
    $scope.blacklistMessages = [];

    function checkForDisallowed (syntaxTree, blacklist, messages) {
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
      if ($scope.syntaxTree) {
        $scope.blacklistMessages = checkForDisallowed($scope.syntaxTree, $scope.blacklist, $scope.blacklistMessages);
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
