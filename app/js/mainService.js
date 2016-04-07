'use strict';


angular.module('challenge.services', [

])
  .service('MainService', function () {
    var MainService = this;

    this.blacklist = [];
    this.blacklistMessages = [];
    this.checkedWhitelistStructures = [];
    this.errors = [];
    this.sharedItems = [];
    this.structuredBlacklist = [];
    this.structuredWhitelist = [];
    this.syntaxTree = null;
    this.whitelist = [];
    this.whitelistMessages = [];

    this.checkForDisallowed = function (syntaxTree, blacklist, messages) {
      var flatTree = _.flatMapDeep(syntaxTree);
      if (blacklist.length && blacklist.length > 0) {
        _.each(blacklist, function (disallowed) {
          disallowed = MainService.getStatementTranslation(disallowed);
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

    this.checkForNested = function (syntaxTree, parent, child) {
      if (!parent || !child) { return null; }
      parent = this.getStatementTranslation(parent);
      child = this.getStatementTranslation(child);
      console.log('checkForNested - parent, child', parent, child);
      var matchingParents = _.filter(syntaxTree.body, {type: parent});
      var matchingChildren = null;
      var structureFound = false;
      var matchingResult = null;

      _.each(matchingParents, function (matchingParent) {
        var result = MainService.findFirstChildInParents(matchingParent, child);
        if (result.structureFound) {
          result.parent = parent;
          matchingResult = result;
        }
      });
      console.log('matchingResult', matchingResult);
      return matchingResult;
    };

    this.checkForRequired = function (syntaxTree, whitelist, messages) {
      // console.log('whitelist, messages', whitelist, messages);
      var flatTree = _.flatMapDeep(syntaxTree);
      if (whitelist.length && whitelist.length > 0) {
        _.each(whitelist, function (required) {
          required = MainService.getStatementTranslation(required);
          var results = _.filter(flatTree, { type: required });
          var alreadyHasMessage = _.filter(messages, { type: required }).length > 0;
          if (results.length > 0 && !alreadyHasMessage) {
            messages.push({ type: required, text: "You have met the exercise requirement to use " + required });
          } else if  (!results.length && alreadyHasMessage) {
            messages = _.reject(messages, { type: required });
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
      "function" : "FunctionDeclaration",
      "if" : "IfStatement",
      "var" : "VariableDeclaration",
      "while" : "WhileStatement"
    };

    this.findFirstChildInParents = function (parent, child) {
      var found = false;
      // Functions have a body/body structure
      if (parent && parent.body && parent.body.body) {
        if (_.filter(parent.body.body, {type: child})) {
          found = true;
        }
        return { child: child, structureFound: found };
      // IfStatements have a consequent/body
    } else if (parent && parent.consequent && parent.consequent.body) {
        if (_.filter(parent.consequent.body, {type: child})) {
          found = true;
        }
        return { child: child, structureFound: found };
      }
    }

    this.getSharedItems = function (list1, list2) {
      // console.log('list1', list1, ' | list2', list2);
      var sharedItems = [];
      _.each(list1, function (firstListItem) {
        // console.log('firstListItem', firstListItem);
        var result = _.filter(list2, function (secondListItem) {
          if (firstListItem === secondListItem) { return true; }
        });
        // console.log('result', result);
        // console.log(result.length > 0);
        if (result.length > 0) {
          sharedItems.push(firstListItem);
        }
      });
      // console.log('sharedItems', sharedItems);
      return sharedItems;
    };

    this.getStatementTranslation = function (statement) {
      statement = _.trim(statement);
      var matches = _.filter(this.dictionary, function (value, key) {
        // console.log('key, statement', key, statement);
        if (key == statement) {
          // console.log('key matched statement');
          return true;
        }
      });
      // console.log('matches', matches);
      return matches ? matches[0] : statement;
    };

    this.getStructuredStatementList = function (inputArray) {
      return _.filter(inputArray, function (statement) {
        if (statement.indexOf('->') > -1) { return true; }
      });
    };

    this.parseStructure = function (statement) {
      var pieces = _.split(statement, '->');
      return { parent: pieces[0], child: pieces[1] };
    };

    this.removeArrayWhitespace = function (arr) {
      var newArray = [];
      _.each(arr, function(item) {
        newArray.push(_.trim(item));
      });
      return newArray;
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

    this.updateBlacklist = function (newValue) {
      this.blacklist = [];
      this.sharedItems = [];
      if (newValue) {
        if (newValue.indexOf(',') < 0) {
          this.blacklist.push(newValue);
        } else {
          this.blacklist = this.removeArrayWhitespace(_.split(newValue, ','));
        }
        this.structuredBlacklist = this.getStructuredStatementList(this.blacklist);
        this.sharedItems = this.getSharedItems(this.blacklist, this.whitelist);
      }
    };

    this.updateParsing = function (newValue) {
      this.errors = null;
      this.checkedWhitelistStructures = [];
      if (this.sharedItems.length < 1) {
        var response = this.tryParsing(newValue);
        if (response.type === "success") {
          this.syntaxTree = response.tree;
          if (this.syntaxTree) {
            this.blacklistMessages = this.checkForDisallowed(this.syntaxTree, this.blacklist, this.blacklistMessages);
            this.whitelistMessages = this.checkForRequired(this.syntaxTree, this.whitelist, this.whitelistMessages);
            var validatedStructures = [];
            _.each(this.structuredWhitelist, function (statement) {
              var parsed = this.parseStructure(statement);
              var result = this.checkForNested(this.tree, parsed.parent, parsed.child);
              console.log('updateParsing - result', result);
              if (result) { this.checkedWhitelistStructures.push(result); }
            });
          }
        } else if (response.type === "error") {
          this.errors = response.error;
        }
      }
    };

    this.updateWhitelist = function (newValue) {
      this.whitelist = [];
      this.sharedItems = [];
      if (newValue) {
        if (newValue.indexOf(',') < 0) {
          this.whitelist.push(newValue);
        } else {
          this.whitelist = this.removeArrayWhitespace(_.split(newValue, ','));
        }
        this.structuredWhitelist = this.getStructuredStatementList(this.whitelist);
        this.sharedItems = this.getSharedItems(this.whitelist, this.blacklist);
      }
    };
  });
