'use strict';


angular.module('challenge.services', [

])
  .service('MainService', function () {
    var MainService = this;

    this.checkForDisallowed = function (syntaxTree, blacklist, messages) {
      var flatTree = _.flatMapDeep(syntaxTree);
      if (blacklist.length && blacklist.length > 0) {
        _.each(blacklist, function (disallowed) {
          disallowed = MainService.getDisallowedTranslation(disallowed);
          var results = _.filter(flatTree, { type: disallowed });
          var alreadyHasMessage = _.filter(messages, { type: disallowed }).length > 0;
          if (results.length > 0 && !alreadyHasMessage) {
            messages.push({ type: disallowed, text: "This exercise requires that you do not use " + disallowed });
          } else if  (!results.length && alreadyHasMessage) {
            messages = _.reject(messages, { type: disallowed });
          }
        });
      } else {
        messages = [];
      }
      return messages;
    };

    this.dictionary = {
      "expression" : "ExpressionStatement",
      "for" : "ForStatement",
      "forin" : "ForInStatement",
      "function" : "FunctionStatement",
      "if" : "IfStatement",
      "var" : "VariableDeclaration",
      "while" : "WhileStatement"
    };

    this.getDisallowedTranslation = function (statement) {
      statement = _.trim(statement);
      var matches = _.filter(this.dictionary, function (value, key) {
        console.log('key, statement', key, statement);
        if (key == statement) {
          console.log('key matched statement');
          return true;
        }
      });
      console.log('matches', matches);
      return matches ? matches[0] : statement;
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
