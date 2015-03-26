var ReportView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ReportView = (function(superClass) {
  extend(ReportView, superClass);

  function ReportView() {
    this.spreadsheet = bind(this.spreadsheet, this);
    this.render = bind(this.render, this);
    this.update = bind(this.update, this);
    return ReportView.__super__.constructor.apply(this, arguments);
  }

  ReportView.prototype.initialize = function() {
    return $("html").append("<link href='js-libraries/Leaflet/leaflet.css' type='text/css' rel='stylesheet' /> <script type='text/javascript' src='js-libraries/Leaflet/leaflet.js'></script> <style> .dissaggregatedResults{ display: none; } </style>");
  };

  ReportView.prototype.el = '#content';

  ReportView.prototype.events = {
    "change #reportOptions": "update",
    "change #summaryField": "summarize",
    "click #toggleDisaggregation": "toggleDisaggregation"
  };

  ReportView.prototype.update = function() {
    var reportOptions, url;
    reportOptions = {
      startDate: $('#start').val(),
      endDate: $('#end').val(),
      reportType: $('#report-type :selected').text()
    };
    _.each(this.locationTypes, function(location) {
      return reportOptions[location] = $("#" + location + " :selected").text();
    });
    url = "reports/" + _.map(reportOptions, function(value, key) {
      return key + "/" + (escape(value));
    }).join("/");
    return Coconut.router.navigate(url, true);
  };

  ReportView.prototype.render = function(options) {
    this.reportType = options.reportType || "results";
    this.startDate = options.startDate || moment(new Date).subtract('days', 30).format("YYYY-MM-DD");
    this.endDate = options.endDate || moment(new Date).format("YYYY-MM-DD");
    return Coconut.questions.fetch({
      success: (function(_this) {
        return function() {};
      })(this)
    }, this.$el.html("<style> table.results th.header, table.results td{ font-size:150%; } </style> <table id='reportOptions'></table>"), $("#reportOptions").append(this.formFilterTemplate({
      id: "question",
      label: "Question",
      form: "<select id='selected-question'> " + (Coconut.questions.map(function(question) {
        return "<option>" + (question.label()) + "</option>";
      }).join("")) + " </select>"
    })), $("#reportOptions").append(this.formFilterTemplate({
      id: "start",
      label: "Start Date",
      form: "<input id='start' type='date' value='" + this.startDate + "'/>"
    })), $("#reportOptions").append(this.formFilterTemplate({
      id: "end",
      label: "End Date",
      form: "<input id='end' type='date' value='" + this.endDate + "'/>"
    })), $("#reportOptions").append(this.formFilterTemplate({
      id: "report-type",
      label: "Report Type",
      form: "<select id='report-type'> " + (_.map(["spreadsheet", "results", "summarytables"], (function(_this) {
        return function(type) {
          return "<option " + (type === _this.reportType ? "selected='true'" : void 0) + ">" + type + "</option>";
        };
      })(this)).join("")) + " </select>"
    })), this[this.reportType](), $('div[data-role=fieldcontain]').fieldcontain(), $('select').selectmenu(), $('input[type=date]').datebox({
      mode: "calbox"
    }));
  };

  ReportView.prototype.hierarchyOptions = function(locationType, location) {
    if (locationType === "region") {
      return _.keys(WardHierarchy.hierarchy);
    }
    return _.chain(WardHierarchy.hierarchy).map(function(value, key) {
      if (locationType === "district" && location === key) {
        return _.keys(value);
      }
      return _.map(value, function(value, key) {
        if (locationType === "constituan" && location === key) {
          return _.keys(value);
        }
        return _.map(value, function(value, key) {
          if (locationType === "shehia" && location === key) {
            return value;
          }
        });
      });
    }).flatten().compact().value();
  };

  ReportView.prototype.mostSpecificLocationSelected = function() {
    var mostSpecificLocationType, mostSpecificLocationValue;
    mostSpecificLocationType = "region";
    mostSpecificLocationValue = "ALL";
    _.each(this.locationTypes, function(locationType) {
      if (this[locationType] !== "ALL") {
        mostSpecificLocationType = locationType;
        return mostSpecificLocationValue = this[locationType];
      }
    });
    return {
      type: mostSpecificLocationType,
      name: mostSpecificLocationValue
    };
  };

  ReportView.prototype.formFilterTemplate = function(options) {
    return "<tr> <td> <label style='display:inline' for='" + options.id + "'>" + options.label + "</label> </td> <td style='width:150%'> " + options.form + " </select> </td> </tr>";
  };

  ReportView.prototype.viewQuery = function(options) {
    var results;
    results = new ResultCollection();
    return results.fetch({
      question: $('#selected-question').val(),
      isComplete: true,
      include_docs: true,
      success: function() {
        results.fields = {};
        results.each(function(result) {
          return _.each(_.keys(result.attributes), function(key) {
            if (!_.contains(["_id", "_rev", "question"], key)) {
              return results.fields[key] = true;
            }
          });
        });
        results.fields = _.keys(results.fields);
        return options.success(results);
      }
    });
  };

  ReportView.prototype.spreadsheet = function() {
    return this.viewQuery({
      success: (function(_this) {
        return function(results) {
          var csvData;
          csvData = results.map(function(result) {
            return _.map(results.fields, function(field) {
              return result.get(field);
            }).join(",");
          }).join("\n");
          _this.$el.append("<a id='csv' href='data:text/octet-stream;base64," + (Base64.encode(results.fields.join(",") + "\n" + csvData)) + "' download='" + (_this.startDate + "-" + _this.endDate) + ".csv'>Download spreadsheet</a>");
          return $("a#csv").button();
        };
      })(this)
    });
  };

  ReportView.prototype.results = function() {
    this.$el.append("<table id='results' class='tablesorter'> <thead> <tr> </tr> </thead> <tbody> </tbody> </table>");
    return this.viewQuery({
      success: (function(_this) {
        return function(results) {
          var tableData;
          tableData = results.map(function(result) {
            return _.map(results.fields, function(field) {
              return result.get(field);
            });
          });
          $("table#results thead tr").append("" + (_.map(results.fields, function(field) {
            return "<th>" + field + "</th>";
          }).join("")));
          $("table#results tbody").append("" + (_.map(tableData, function(row) {
            return "<tr>" + (_.map(row, function(element, index) {
              return "<td>" + element + "</td>";
            }).join("")) + "</tr>";
          }).join("")));
          return _.each($('table tr'), function(row, index) {
            if (index % 2 === 1) {
              return $(row).addClass("odd");
            }
          });
        };
      })(this)
    });
  };

  ReportView.prototype.summarytables = function() {
    return Coconut.resultCollection.fetch({
      includeData: true,
      success: (function(_this) {
        return function() {
          var fields;
          fields = _.chain(Coconut.resultCollection.toJSON()).map(function(result) {
            return _.keys(result);
          }).flatten().uniq().sort().value();
          fields = _.without(fields, "_id", "_rev");
          _this.$el.append("<br/> Choose a field to summarize:<br/> <select id='summaryField'> " + (_.map(fields, function(field) {
            return "<option id='" + field + "'>" + field + "</option>";
          }).join("")) + " </select>");
          return $('select').selectmenu();
        };
      })(this)
    });
  };

  ReportView.prototype.summarize = function() {
    var field;
    field = $('#summaryField option:selected').text();
    return this.viewQuery({
      success: (function(_this) {
        return function(resultCollection) {
          var results;
          results = {};
          resultCollection.each(function(result) {
            return _.each(result.toJSON(), function(value, key) {
              if (key === field) {
                if (results[value] != null) {
                  results[value]["sums"] += 1;
                  return results[value]["resultIDs"].push(result.get("_id"));
                } else {
                  results[value] = {};
                  results[value]["sums"] = 1;
                  results[value]["resultIDs"] = [];
                  return results[value]["resultIDs"].push(result.get("_id"));
                }
              }
            });
          });
          console.log(results);
          _this.$el.append("<h2>" + field + "</h2> <table id='summaryTable' class='tablesorter'> <thead> <tr> <th>Value</th> <th>Total</th> </tr> </thead> <tbody> " + (_.map(results, function(aggregates, value) {
            return "<tr> <td>" + value + "</td> <td> <button id='toggleDisaggregation'>" + aggregates["sums"] + "</button> </td> <td class='dissaggregatedResults'> " + (_.map(aggregates["resultIDs"], function(resultID) {
              return resultID;
            }).join(", ")) + " </td> </tr>";
          }).join("")) + " </tbody> </table>");
          $("button").button();
          $("a").button();
          return _.each($('table tr'), function(row, index) {
            if (index % 2 === 1) {
              return $(row).addClass("odd");
            }
          });
        };
      })(this)
    });
  };

  ReportView.prototype.toggleDisaggregation = function() {
    return $(".dissaggregatedResults").toggle();
  };

  return ReportView;

})(Backbone.View);
