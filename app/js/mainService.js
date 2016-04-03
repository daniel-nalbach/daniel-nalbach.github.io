'use strict';


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
