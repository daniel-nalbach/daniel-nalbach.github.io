'use strict';


angular.module('challenge.services', [

])
  .service('MainService', function () {
    var MainService = this;

    this.blacklist = [];
    this.blacklistMessages = [];
    this.checkedBlacklistStructures = [];
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
      return matchingResult;
    };

    this.checkForRequired = function (syntaxTree, whitelist, messages) {
      var flatTree = _.flatMapDeep(syntaxTree);
      if (whitelist.length && whitelist.length > 0) {
        _.each(whitelist, function (required) {
          required = MainService.getStatementTranslation(required);
          var results = _.filter(flatTree, { type: required });
          var alreadyHasMessage = _.filter(messages, { type: required }).length > 0;
          if (results.length > 0 && !alreadyHasMessage) {
            messages.push({ type: required, text: "You have met the exercise requirement to use " + required });
          }
        });
      } else {
        messages = [];
      }
      return messages;
    };

    this.checkForStructure = function (listToCheck, syntaxTree, listToPush) {
      if (listToCheck.length > 0) {
        _.each(listToCheck, function (statement) {
          var parsed = MainService.parseStructure(statement);
          var result = MainService.checkForNested(syntaxTree, parsed.parent, parsed.child);
          if (result) { listToPush.push(result); }
        });
      }
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
      var sharedItems = [];
      _.each(list1, function (firstListItem) {
        var result = _.filter(list2, function (secondListItem) {
          if (firstListItem === secondListItem) { return true; }
        });
        if (result.length > 0) {
          sharedItems.push(firstListItem);
        }
      });
      return sharedItems;
    };

    this.getStatementTranslation = function (statement) {
      statement = _.trim(statement);
      var matches = _.filter(this.dictionary, function (value, key) {
        if (key == statement) {
          return true;
        }
      });
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
      this.blacklistMessages = [];
      this.checkedBlacklistStructures = [];
      this.checkedWhitelistStructures = [];
      this.errors = null;
      this.whitelistMessages = [];

      if (this.sharedItems.length < 1) {
        var response = this.tryParsing(newValue);
        if (response.type === "success") {
          this.syntaxTree = response.tree;
          if (this.syntaxTree) {
            this.blacklistMessages = this.checkForDisallowed(this.syntaxTree, this.blacklist, this.blacklistMessages);
            this.whitelistMessages = this.checkForRequired(this.syntaxTree, this.whitelist, this.whitelistMessages);

            this.checkForStructure(this.structuredBlacklist, this.syntaxTree, this.checkedBlacklistStructures);
            this.checkForStructure(this.structuredWhitelist, this.syntaxTree, this.checkedWhitelistStructures);
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
