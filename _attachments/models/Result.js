var Result,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Result = (function(superClass) {
  extend(Result, superClass);

  function Result() {
    return Result.__super__.constructor.apply(this, arguments);
  }

  Result.prototype.initialize = function() {
    if (!this.attributes.createdAt) {
      this.set({
        collection: 'result',
        createdAt: moment(new Date()).format(Coconut.config.get("datetime_format"))
      });
    }
    if (!this.attributes.lastModifiedAt) {
      return this.set({
        lastModifiedAt: moment(new Date()).format(Coconut.config.get("datetime_format"))
      });
    }
  };

  Result.prototype.url = "/result";

  Result.prototype.question = function() {
    return this.get("question");
  };

  Result.prototype.tags = function() {
    var tags;
    tags = this.get("Tags");
    if (tags != null) {
      return tags.split(/, */);
    }
    return [];
  };

  Result.prototype.complete = function() {
    var complete;
    if (_.include(this.tags(), "complete")) {
      return true;
    }
    complete = this.get("complete");
    if (typeof complete === "undefined") {
      complete = this.get("Complete");
    }
    if (complete === null || typeof complete === "undefined") {
      return false;
    }
    if (complete === true || complete.match(/true|yes/)) {
      return true;
    }
  };

  Result.prototype.shortString = function() {
    var result;
    result = this.string;
    if (result.length > 40) {
      return result.substring(0, 40) + "...";
    } else {
      return result;
    }
  };

  Result.prototype.summaryKeys = function(question) {
    var relevantKeys;
    relevantKeys = question.summaryFieldKeys();
    if (relevantKeys.length === 0) {
      relevantKeys = _.difference(_.keys(this.toJSON()), ["_id", "_rev", "complete", "question", "collection"]);
    }
    return relevantKeys;
  };

  Result.prototype.summaryValues = function(question) {
    return _.map(this.summaryKeys(question), (function(_this) {
      return function(key) {
        var returnVal;
        returnVal = _this.get(key) || "";
        if (typeof returnVal === "object") {
          returnVal = JSON.stringify(returnVal);
        }
        return returnVal;
      };
    })(this));
  };

  Result.prototype.get = function(attribute) {
    var identifyingAttributes, original;
    original = Result.__super__.get.call(this, attribute);
    if ((original != null) && Coconut.config.local.get("mode") === "cloud") {
      identifyingAttributes = Coconut.config.get("identifying_attributes");
      if ((identifyingAttributes != null) && _.contains(identifyingAttributes, attribute)) {
        return b64_sha1(original);
      }
    }
    return original;
  };

  Result.prototype.toJSON = function() {
    var json;
    json = Result.__super__.toJSON.call(this);
    if (Coconut.config.local.get("mode") === "cloud") {
      _.each(json, (function(_this) {
        return function(value, key) {
          if ((value != null) && _.contains(_this.identifyingAttributes, key)) {
            return json[key] = b64_sha1(value);
          }
        };
      })(this));
    }
    return json;
  };

  Result.prototype.save = function(key, value, options) {
    this.set({
      user: $.cookie('current_user'),
      lastModifiedAt: moment(new Date()).format(Coconut.config.get("date_format"))
    });
    return Result.__super__.save.call(this, key, value, options);
  };

  return Result;

})(Backbone.Model);
