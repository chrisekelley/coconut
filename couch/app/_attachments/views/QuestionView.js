var QuestionView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

window.SkipTheseWhen = function(argQuestions, result) {
  var disabledClass, i, j, len, len1, question, questions, results;
  questions = [];
  argQuestions = argQuestions.split(/\s*,\s*/);
  for (i = 0, len = argQuestions.length; i < len; i++) {
    question = argQuestions[i];
    questions.push(window.questionCache[question]);
  }
  disabledClass = "disabled_skipped";
  results = [];
  for (j = 0, len1 = questions.length; j < len1; j++) {
    question = questions[j];
    if (result) {
      results.push(question.addClass(disabledClass));
    } else {
      results.push(question.removeClass(disabledClass));
    }
  }
  return results;
};

window.ResultOfQuestion = function(name) {
  var base;
  return (typeof (base = window.getValueCache)[name] === "function" ? base[name]() : void 0) || null;
};

QuestionView = (function(superClass) {
  extend(QuestionView, superClass);

  function QuestionView() {
    this.render = bind(this.render, this);
    return QuestionView.__super__.constructor.apply(this, arguments);
  }

  QuestionView.prototype.initialize = function() {
    if (Coconut.resultCollection == null) {
      Coconut.resultCollection = new ResultCollection();
    }
    return this.autoscrollTimer = 0;
  };

  QuestionView.prototype.el = '#content';

  QuestionView.prototype.triggerChangeIn = function(names, type) {
    var elements, i, len, name, results;
    results = [];
    for (i = 0, len = names.length; i < len; i++) {
      name = names[i];
      elements = [];
      elements.push(window.questionCache[name].find("input, select, textarea, img"));
      results.push($(elements).each((function(_this) {
        return function(index, element) {
          var event;
          event = {
            target: element
          };
          return _this.actionOnChange(event, type);
        };
      })(this)));
    }
    return results;
  };

  QuestionView.prototype.render = function() {
    var autocompleteElements, formNameText, i18nFormNameText, maximumAge, onChangeList, onCurrentPositionError, onCurrentPositionSuccess, skipperList;
    formNameText = this.model.safeLabel();
    i18nFormNameText = polyglot.t(formNameText);
    if (i18nFormNameText) {
      formNameText = i18nFormNameText;
    }
    this.$el.html("<style> .message { color: grey; font-weight: bold; padding: 10px; border: 1px yellow dotted; background: yellow; display: none; } label.radio { border-radius:20px; display:block; padding:4px 11px; border: 1px solid black; cursor: pointer; text-decoration: none; } input[type='radio']:checked + label { background-color:#ddd; background: #5393c5; background-image: -webkit-gradient(linear,left top,left bottom,from(#5393c5),to(#6facd5)); background-image: -webkit-linear-gradient(#5393c5,#6facd5); background-image: -moz-linear-gradient(#5393c5,#6facd5); background-image: -ms-linear-gradient(#5393c5,#6facd5); background-image: -o-linear-gradient(#5393c5,#6facd5); background-image: linear-gradient(#5393c5,#6facd5); } input[type='radio']{ height: 0px; } div.question.radio{ padding-top: 8px; padding-bottom: 8px; } .tt-hint{ display:none } .tt-dropdown-menu{ width: 100%; background-color: lightgray; } .tt-suggestion{ background-color: white; border-radius:20px; display:block; padding:4px 11px; border: 1px solid black; cursor: pointer; text-decoration: none; } .tt-suggestion .{ } </style> <!-- <div style='position:fixed; right:5px; color:white; padding:20px; z-index:5' id='messageText'> <a href='#help/" + this.model.id + "'>Help</a> </div> --> <div style='position:fixed; right:5px; color:white; background-color: #333; padding:20px; display:none; z-index:10' id='messageText'> Saving... </div> <h1>" + formNameText + "</h1> <div id='question-view'> <form onsubmit=\"return false;\"> " + (this.toHTMLForm(this.model)) + " <p>&nbsp;</p> <div data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\" data-icon=\"null\" data-iconpos=\"null\" data-theme=\"c\" class=\"ui-btn ui-shadow ui-btn-corner-all ui-submit ui-btn-up-b\" aria-disabled=\"false\"> <span class=\"ui-btn-inner ui-btn-corner-all\"> <span class=\"ui-btn-text\">Submit</span></span> <button type=\"submit\" data-theme=\"c\" id=\"submitButton\" name=\"submit\" value=\"true\" class=\"ui-btn-hidden\" aria-disabled=\"false\">Submit</button> <input type=\"hidden\" id=\"complete\" name=\"complete\"/> </div> </form> </div>");
    this.updateCache();
    this.updateSkipLogic();
    skipperList = [];
    onChangeList = [];
    $(this.model.get("questions")).each((function(_this) {
      return function(index, question) {
        if (question.actionOnChange().match(/skip/i)) {
          skipperList.push(question.safeLabel());
        }
        if (question.eventOnChange() !== "") {
          onChangeList.push(question.safeLabel());
        }
        if ((question.get("action_on_questions_loaded") != null) && question.get("action_on_questions_loaded") !== "") {
          return CoffeeScript["eval"](question.get("action_on_questions_loaded"));
        }
      };
    })(this));
    this.triggerChangeIn(skipperList);
    this.triggerChangeIn(onChangeList, "eventOnChange");
    autocompleteElements = [];
    _.each($("input[type='autocomplete from list']"), function(element) {
      element = $(element);
      element.typeahead({
        local: element.attr("data-autocomplete-options").replace(/\n|\t/, "").split(/, */)
      });
      return autocompleteElements.push(element);
    });
    _.each($("input[type='autocomplete from code']"), function(element) {
      element = $(element);
      element.typeahead({
        local: eval(element.attr("data-autocomplete-options"))
      });
      return autocompleteElements.push(element);
    });
    _.each($("input[type='autocomplete from previous entries']"), function(element) {
      element = $(element);
      element.typeahead({
        prefetch: document.location.pathname.substring(0, document.location.pathname.indexOf("index.html")) + ("_list/values/byValue?key=\"" + (element.attr("name")) + "\"")
      });
      return autocompleteElements.push(element);
    });
    _.each(autocompleteElements, (function(_this) {
      return function(autocompeteElement) {
        return autocompeteElement.blur(function() {
          return _this.autoscroll(autocompeteElement);
        });
      };
    })(this));
    if (this.readonly) {
      $('input, textarea').attr("readonly", "true");
    }
    if (this.result.question() === 'Admin Registration') {
      if (typeof Coconut.scannerPayload !== 'undefined') {
        console.log('Display the payload' + JSON.stringify(Coconut.scannerPayload));
      }
    }
    onCurrentPositionSuccess = function(position) {
      var messageText;
      Coconut.currentPositionError = null;
      Coconut.currentPosition = position;
      messageText = 'Gathered current location.';
      console.log(messageText);
      $("#messageText").html(messageText);
      return $("#messageText").slideDown().fadeOut();
    };
    onCurrentPositionError = function(error) {
      var messageText;
      Coconut.currentPositionError = error;
      messageText = 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n';
      console.log(messageText);
      $("#messageText").html(messageText);
      return $("#messageText").slideDown().fadeOut();
    };
    maximumAge = 1000 * 60 * 60;
    return navigator.geolocation.getCurrentPosition(onCurrentPositionSuccess, onCurrentPositionError, {
      maximumAge: maximumAge,
      enableHighAccuracy: true
    });
  };

  QuestionView.prototype.events = {
    "change #question-view input": "onChange",
    "change #question-view select": "onChange",
    "change #question-view textarea": "onChange",
    "click #question-view button:contains(+)": "repeat",
    "click #question-view a:contains(Get current location)": "getLocation",
    "click .next_error": "runValidate",
    "click .validate_one": "onValidateOne",
    "click #submitButton": "onSubmitButton"
  };

  QuestionView.prototype.runValidate = function() {
    return this.validateAll();
  };

  QuestionView.prototype.onChange = function(event) {
    var $target, eventOnChange, eventStamp, messageVisible, name, targetName;
    $target = $(event.target);
    eventStamp = $target.attr("id");
    name = $target.attr("name");
    eventOnChange = $target.attr("data-event_on_change");
    if (typeof eventOnChange !== 'undefined') {
      this.actionOnChange(event, 'eventOnChange');
    }
    if (eventStamp === this.oldStamp && (new Date()).getTime() < this.throttleTime + 1000) {
      return;
    }
    this.throttleTime = (new Date()).getTime();
    this.oldStamp = eventStamp;
    targetName = $target.attr("name");
    if (targetName === "complete") {
      if (this.changedComplete) {
        this.changedComplete = false;
        return;
      }
      this.validateAll();
      Coconut.menuView.update();
      this.save();
      this.updateSkipLogic();
      return this.actionOnChange(event);
    } else {
      this.changedComplete = false;
      messageVisible = window.questionCache[targetName].find(".message").is(":visible");
      return _.delay((function(_this) {
        return function() {
          if (!messageVisible) {
            _this.save();
            _this.updateSkipLogic();
            return _this.actionOnChange(event);
          }
        };
      })(this), 500);
    }
  };

  QuestionView.prototype.onSubmitButton = function(event) {
    var complete;
    complete = $('#complete');
    complete.val(true);
    event.target = complete;
    return this.onChange(event);
  };

  QuestionView.prototype.onValidateOne = function(event) {
    var $target, name;
    $target = $(event.target);
    name = $(event.target).attr('data-name');
    return this.validateOne({
      key: name,
      autoscroll: true,
      leaveMessage: false,
      button: "<button type='button' data-name='" + name + "' class='validate_one'>Validate</button>"
    });
  };

  QuestionView.prototype.validateAll = function() {
    var i, isValid, key, len, questionIsntValid, ref;
    isValid = true;
    ref = window.keyCache;
    for (i = 0, len = ref.length; i < len; i++) {
      key = ref[i];
      questionIsntValid = !this.validateOne({
        key: key,
        autoscroll: isValid,
        leaveMessage: false
      });
      if (isValid && questionIsntValid) {
        isValid = false;
      }
    }
    this.completeButton(isValid);
    if (isValid) {
      $("[name=complete]").parent().scrollTo();
    }
    return isValid;
  };

  QuestionView.prototype.validateOne = function(options) {
    var $message, $question, autoscroll, button, e, key, leaveMessage, message;
    key = options.key || '';
    autoscroll = options.autoscroll || false;
    button = options.button || "<button type='button' class='next_error'>Next Error</button>";
    leaveMessage = options.leaveMessage || false;
    $question = window.questionCache[key];
    $message = $question.find(".message");
    try {
      message = this.isValid(key);
    } catch (_error) {
      e = _error;
      alert("isValid error in " + key + "\n" + e);
      message = "";
    }
    if ($message.is(":visible") && leaveMessage) {
      if (message === "") {
        return true;
      } else {
        return false;
      }
      return true;
    }
  };

  QuestionView.prototype.isValid = function(question_id) {
    var error, labelText, question, questionWrapper, ref, required, result, type, validation, validationFunctionResult, value;
    if (!question_id) {
      return;
    }
    result = [];
    questionWrapper = window.questionCache[question_id];
    if (questionWrapper.hasClass("label")) {
      return "";
    }
    question = $("[name=" + question_id + "]", questionWrapper);
    type = $(questionWrapper.find("input").get(0)).attr("type");
    labelText = type === "radio" ? $("label[for=" + (question.attr("id").split("-")[0]) + "]", questionWrapper).text() || "" : (ref = $("label[for=" + (question.attr("id")) + "]", questionWrapper)) != null ? ref.text() : void 0;
    required = questionWrapper.attr("data-required") === "true";
    validation = unescape(questionWrapper.attr("data-validation"));
    if (validation === "undefined") {
      validation = null;
    }
    value = window.getValueCache[question_id]();
    if (!questionWrapper.is(":visible")) {
      return "";
    }
    if (question.find("input").length !== 0 && (type === "checkbox" || type === "radio")) {
      return "";
    }
    if (required && (value === "" || value === null)) {
      result.push("'" + labelText + "' is required.");
    }
    if ((validation != null) && validation !== "") {
      try {
        validationFunctionResult = (CoffeeScript["eval"]("(value) -> " + validation, {
          bare: true
        }))(value);
        if (validationFunctionResult != null) {
          result.push(validationFunctionResult);
        }
      } catch (_error) {
        error = _error;
        if (error === 'invisible reference') {
          return '';
        }
        alert("Validation error for " + question_id + " with value " + value + ": " + error);
      }
    }
    if (result.length !== 0) {
      return result.join("<br>") + "<br>";
    }
    return "";
  };

  QuestionView.prototype.scrollToQuestion = function(question) {
    return this.autoscroll($(question).prev());
  };

  QuestionView.prototype.autoscroll = function(event) {
    var $div, $target, safetyCounter;
    clearTimeout(this.autoscrollTimer);
    if (event.jquery) {
      $div = event;
      window.scrollTargetName = $div.attr("data-question-name") || $div.attr("name");
    } else {
      $target = $(event.target);
      window.scrollTargetName = $target.attr("name");
      $div = window.questionCache[window.scrollTargetName];
    }
    this.$next = $div.next();
    if (!this.$next.is(":visible") && this.$next.length > 0) {
      safetyCounter = 0;
      while (!this.$next.is(":visible") && (safetyCounter += 1) < 100) {
        this.$next = this.$next.next();
      }
    }
    if (this.$next.is(":visible")) {
      if (window.questionCache[window.scrollTargetName].find(".message").is(":visible")) {
        return;
      }
      $(window).on("scroll", (function(_this) {
        return function() {
          $(window).off("scroll");
          return clearTimeout(_this.autoscrollTimer);
        };
      })(this));
      return this.autoscrollTimer = setTimeout((function(_this) {
        return function() {
          $(window).off("scroll");
          return _this.$next.scrollTo().find("input[type=text],input[type=number]").focus();
        };
      })(this), 1000);
    }
  };

  QuestionView.prototype.actionOnChange = function(event, type) {
    var $divQuestion, $target, code, error, message, name, newFunction, nodeName, value;
    nodeName = $(event.target).get(0).nodeName;
    $target = nodeName === "INPUT" || nodeName === "SELECT" || nodeName === "TEXTAREA" ? $(event.target) : $(event.target).parent().parent().parent().find("input,textarea,select");
    if (!$target.is(":visible")) {
      return;
    }
    name = $target.attr("name");
    $divQuestion = $(".question [data-question-name=" + name + "]");
    if (typeof type !== 'undefined' && type === 'eventOnChange') {
      code = $divQuestion.attr("data-event_on_change");
    } else {
      code = $divQuestion.attr("data-action_on_change");
    }
    try {
      value = ResultOfQuestion(name);
    } catch (_error) {
      error = _error;
      if (error === "invisible reference") {
        return;
      }
    }
    if (code === "" || (code == null)) {
      return;
    }
    if (typeof type !== 'undefined' && type === 'eventOnChange') {
      try {
        $target = $(event.target);
        code = "function(target) = { KiwiUtils.toggleAcceptedSurgery(target) }";
        code = "return KiwiUtils.toggleAcceptedSurgery(target)";
        newFunction = new Function("target", code);
        return newFunction($target);
      } catch (_error) {
        error = _error;
        name = (/function (.{1,})\(/.exec(error.constructor.toString())[1]);
        message = error.message;
        return alert("Action on change error in question " + ($divQuestion.attr('data-question-id') || $divQuestion.attr("id")) + "\n\n" + name + "\n\n" + message);
      }
    } else {
      code = "(value) -> " + code;
      try {
        newFunction = CoffeeScript["eval"].apply(this, [code]);
        return newFunction(value);
      } catch (_error) {
        error = _error;
        name = (/function (.{1,})\(/.exec(error.constructor.toString())[1]);
        message = error.message;
        return alert("Action on change error in question " + ($divQuestion.attr('data-question-id') || $divQuestion.attr("id")) + "\n\n" + name + "\n\n" + message);
      }
    }
  };

  QuestionView.prototype.updateSkipLogic = function() {
    var $question, error, message, name, ref, result, results, skipLogicCode;
    ref = window.questionCache;
    results = [];
    for (name in ref) {
      $question = ref[name];
      skipLogicCode = window.skipLogicCache[name];
      if (skipLogicCode === "" || (skipLogicCode == null)) {
        continue;
      }
      try {
        result = eval(skipLogicCode);
      } catch (_error) {
        error = _error;
        if (error === "invisible reference") {
          result = true;
        } else {
          name = (/function (.{1,})\(/.exec(error.constructor.toString())[1]);
          message = error.message;
          alert("Skip logic error in question " + ($question.attr('data-question-id')) + "\n\n" + name + "\n\n" + message);
        }
      }
      if (result) {
        results.push($question[0].style.display = "none");
      } else {
        results.push($question[0].style.display = "");
      }
    }
    return results;
  };

  QuestionView.prototype.save = _.throttle(function() {
    var coords, currentData, currentPosition, error;
    currentData = $('form').toObject({
      skipEmpty: false
    });
    currentPosition = {};
    if (Coconut.currentPosition !== null) {
      coords = {};
      _.each(Coconut.currentPosition.coords, function(value, key) {
        return coords[key] = value;
      });
      currentPosition.coords = coords;
      currentPosition.timestamp = Coconut.currentPosition.timestamp;
    }
    if (Coconut.currentPositionError !== null) {
      error = {};
      error.code = Coconut.currentPositionError.code;
      error.message = Coconut.currentPositionError.message;
      currentData.currentPositionError = error;
      if (Coconut.currentPosition !== null) {
        currentData.lastRecordedPosition = currentPosition;
      }
    } else {
      if (Coconut.currentPosition !== null) {
        currentData.currentPosition = currentPosition;
      }
    }
    currentData.lastModifiedAt = moment(new Date()).format(Coconut.config.get("datetime_format"));
    if (typeof Coconut.currentAdmin !== 'undefined' && Coconut.currentAdmin !== null) {
      currentData.savedBy = Coconut.currentAdmin.id;
      if (this.result.question() === 'Admin Registration') {
        currentData._id = Coconut.currentAdmin.get("_id");
        currentData.clientId = Coconut.currentAdmin.get("_id");
        currentData.serviceUuid = Coconut.currentAdmin.get("serviceUuid");
        currentData.Fingerprints = Coconut.currentAdmin.get("Fingerprints");
      }
    } else {
      currentData.savedBy = $.cookie('current_user');
    }
    if (typeof Coconut.currentClient !== 'undefined' && Coconut.currentClient !== null) {
      currentData.clientId = Coconut.currentClient.get("_id");
      currentData.serviceUuid = Coconut.currentClient.get("serviceUuid");
      if (this.result.question() === 'Admin Registration' || this.result.question() === 'Individual Registration') {
        console.log("currentClient: " + JSON.stringify(Coconut.currentClient));
        currentData._id = currentData.clientId;
        currentData.Fingerprints = Coconut.currentClient.get("Fingerprints");
        console.log("currentData: " + JSON.stringify(currentData));
      }
      if (this.result.question() === 'Admin Registration') {
        CoconutUtils.setSession('currentAdmin', currentData.email);
      }
    }
    if (typeof Coconut.offlineUser !== 'undefined' && Coconut.offlineUser !== null) {
      currentData.createdByOfflineUser = true;
    }
    return this.result.save(currentData, {
      success: (function(_this) {
        return function(model) {
          var messageText;
          messageText = 'Saving...';
          $("#messageText").html(messageText);
          $("#messageText").slideDown().fadeOut();
          Coconut.router.navigate("edit/result/" + model.id, false);
          Coconut.menuView.update();
          if (_this.result.complete()) {
            Coconut.syncView.sync.replicateToServer();
            if (_this.result.question() === 'Admin Registration') {
              return Coconut.router.navigate("postAdminRegistrationMenu", true);
            } else if (_this.result.question() === 'Individual Registration') {
              Coconut.currentClient = _this.result;
              return Coconut.router.navigate("postUserRegistrationMenu", true);
            } else {
              return Coconut.router.navigate("displayClientRecords", true);
            }
          }
        };
      })(this)
    }, 1000);
  });

  QuestionView.prototype.completeButton = function(value) {
    this.changedComplete = true;
    if ($('[name=complete]').prop("checked") !== value) {
      return $('[name=complete]').click();
    }
  };

  QuestionView.prototype.toHTMLForm = function(questions, groupId) {
    if (questions == null) {
      questions = this.model;
    }
    window.skipLogicCache = {};
    if (questions.length == null) {
      questions = [questions];
    }
    return _.map(questions, (function(_this) {
      return function(question) {
        var districts, div, html, i18nKey, i18nLabelText, i18nOptionText, index, key, label, labelText, name, newGroupId, option, optionText, options, phrase, question_id, repeatable;
        if (question.repeatable() === "true") {
          repeatable = "<button>+</button>";
        } else {
          repeatable = "";
        }
        if ((question.type() != null) && (question.label() != null) && question.label() !== "") {
          name = question.get('safeLabel');
          if (name === null) {
            name = question.safeLabel();
          }
          labelText = question.label();
          i18nLabelText = polyglot.t(question.get('safeLabel'));
          if (i18nLabelText) {
            labelText = i18nLabelText;
          }
          window.skipLogicCache[name] = question.skipLogic() !== '' ? CoffeeScript.compile(question.skipLogic(), {
            bare: true
          }) : '';
          question_id = question.get("id");
          if (question.repeatable() === "true") {
            name = name + "[0]";
            question_id = question.get("id") + "-0";
          }
          if (groupId != null) {
            name = "group." + groupId + "." + name;
          }
          if (question.type() === 'header') {
            div = "<div id='" + question_id + name + "Div' class='question " + ((typeof question.type === "function" ? question.type() : void 0) || '') + "'>";
            label = "<h2>" + labelText + " </h2>";
          } else if (question.type() === 'subheader') {
            div = "<div id='" + question_id + name + "Div' class='question " + ((typeof question.type === "function" ? question.type() : void 0) || '') + "'>";
            label = "<h3>" + labelText + " </h3>";
          } else if (question.type() === 'spacer') {
            div = "<div id='" + question_id + name + "Div' class='question " + ((typeof question.type === "function" ? question.type() : void 0) || '') + "'>";
            label = "<p>&nbsp</p>";
          } else if (question.type() === 'instructions') {
            div = "<div id='" + question_id + name + "Div' class='question " + ((typeof question.type === "function" ? question.type() : void 0) || '') + "'>";
            label = "<p>" + labelText + " </p>";
          } else {
            div = "<div " + (question.validation() ? question.validation() ? "data-validation = '" + (escape(question.validation())) + "'" : void 0 : "") + " id='" + question_id + name + "Div' data-required='" + (question.required()) + "' class='question " + ((typeof question.type === "function" ? question.type() : void 0) || '') + "' data-question-name='" + name + "' data-question-id='" + question_id + "' data-action_on_change='" + (_.escape(question.actionOnChange())) + "' data-event_on_change='" + (_.escape(question.eventOnChange())) + "' >";
            label = "<label type='" + (question.type()) + "' for='" + question_id + "'>" + labelText + " <span></span></label>";
          }
          return div + " " + ((function() {
            switch (question.type()) {
              case "checkbox":
                return "";
              default:
                return label;
            }
          })()) + " <div class='message'></div> " + ((function() {
            var i, len, ref;
            switch (question.type()) {
              case "textarea":
                return ("<div class='form-group'><textarea class='form-control' name='" + name + "' id='" + question_id + "' value='" + (question.value()) + "' placeholder='") + polyglot.t('Enter') + "&nbsp;" + i18nLabelText + "'>" + "</textarea></div>";
              case "select":
                if (this.readonly) {
                  return question.value();
                } else {
                  html = ("<div class='form-group'><select name='" + name + "' id='" + question_id + "' class='form-control' data-event_on_change='" + (_.escape(question.eventOnChange())) + "'><option value=''> -- ") + polyglot.t("SelectOne") + " -- </option>";
                  ref = question.get("select-options").split(/, */);
                  for (index = i = 0, len = ref.length; i < len; index = ++i) {
                    option = ref[index];
                    optionText = option;
                    i18nKey = question.get('safeLabel') + "::" + optionText;
                    i18nOptionText = polyglot.t(i18nKey);
                    if (i18nOptionText !== i18nKey) {
                      optionText = i18nOptionText;
                    }
                    html += "<option name='" + name + "' id='" + question_id + "-" + index + "' value='" + option + "'>" + optionText + "</option>";
                  }
                  return html += "</select></div>";
                }
                break;
              case "selectDistrict":
                if (this.readonly) {
                  return question.value();
                } else {
                  html = ("<div class='form-group'><select name='" + name + "' id='" + question_id + "' class='form-control'><option value=''> -- ") + polyglot.t("SelectOne") + " -- </option>";
                  districts = KiwiUtils.districts;
                  index = 0;
                  for (key in districts) {
                    if (!hasProp.call(districts, key)) continue;
                    phrase = districts[key];
                    if (key !== '_id' && key !== '_rev') {
                      index++;
                      optionText = phrase;
                      html += "<option name='" + key + "' id='" + question_id + "-" + index + "' value='" + option + "'>" + optionText + "</option>";
                    }
                  }
                  return html += "</select></div>";
                }
                break;
              case "radio":
                if (this.readonly) {
                  return "<div class='form-group radiodrop'><input class='radioradio form-control' name='" + name + "' type='text' id='" + question_id + "' value='" + (question.value()) + "'></input></div>";
                } else {
                  options = question.get("radio-options");
                  return _.map(options.split(/, */), function(option, index) {
                    return "<div class='form-group'><input class='radio form-control' type='radio' name='" + name + "' id='" + question_id + "-" + index + "' value='" + (_.escape(option)) + "'/> <label class='radio' for='" + question_id + "-" + index + "'>" + option + "</label></div> <!-- <div class='ui-radio'> <label for=''" + question_id + "-" + index + "' data-corners='true' data-shadow='false' data-iconshadow='true' data-wrapperels='span' data-icon='radio-off' data-theme='c' class='ui-btn ui-btn-corner-all ui-btn-icon-left ui-radio-off ui-btn-up-c'> <span class='ui-btn-inner ui-btn-corner-all'> <span class='ui-btn-text'>" + option + "</span> <span class='ui-icon ui-icon-radio-off ui-icon-shadow'>&nbsp;</span> </span> </label> <input type='radio' name='" + name + "' id='" + question_id + "-" + index + "' value='" + (_.escape(option)) + "'/> </div> -->";
                  }).join("");
                }
                break;
              case "checkbox":
                if (this.readonly) {
                  return "<div class='form-group'><input class='form-control' name='" + name + "' type='text' id='" + question_id + "' value='" + (_.escape(question.value())) + "'></input></div>";
                } else {
                  return "<div class='checkbox'> <label for='" + question_id + "'> <input name='" + name + "' id='" + question_id + "' type='checkbox' value='true'>" + labelText + " <span></span></input> </label> </div>";
                }
                break;
              case "autocomplete from list":
              case "autocomplete from previous entries":
              case "autocomplete from code":
                return "<!-- autocomplete='off' disables browser completion --> <input autocomplete='off' name='" + name + "' id='" + question_id + "' type='" + (question.type()) + "' value='" + (question.value()) + "' data-autocomplete-options='" + (question.get("autocomplete-options")) + "'></input> <ul id='" + question_id + "-suggestions' data-role='listview' data-inset='true'/>";
              case "location":
                return "<a data-question-id='" + question_id + "'>Get current location</a> <label for='" + question_id + "-description'>Location Description</label> <input type='text' name='" + name + "-description' id='" + question_id + "-description'></input> " + (_.map(["latitude", "longitude"], function(field) {
                  return "<label for='" + question_id + "-" + field + "'>" + field + "</label><input readonly='readonly' type='number' name='" + name + "-" + field + "' id='" + question_id + "-" + field + "'></input>";
                }).join("")) + " " + (_.map(["altitude", "accuracy", "altitudeAccuracy", "heading", "timestamp"], function(field) {
                  return "<input type='hidden' name='" + name + "-" + field + "' id='" + question_id + "-" + field + "'></input>";
                }).join(""));
              case "image":
                return "<img style='" + (question.get("image-style")) + "' src='" + (question.get("image-path")) + "'/>";
              case "label":
                return "";
              case "header":
                return "";
              case "subheader":
                return "";
              case "spacer":
                return "";
              case "instructions":
                return "<p>" + text + "</p>";
              case "date":
                return ("<div class='form-group'> <input type='date' class='form-control' name='" + name + "' id='" + question_id + "' value='" + (question.value()) + "' placeholder='") + polyglot.t('Enter') + (" " + i18nLabelText + "'/>\n </div>");
              case "time":
                return ("<div class='form-group'> <input type='time' class='form-control' name='" + name + "' id='" + question_id + "' value='" + (question.value()) + "' placeholder='") + polyglot.t('Enter') + (" " + i18nLabelText + "'/> </div>");
              default:
                return ("<div class='form-group'><input type='text' class='form-control' name='" + name + "' id='" + question_id + "' value='" + (question.value()) + "' placeholder='") + polyglot.t('Enter') + (" " + i18nLabelText + "'></div>");
            }
          }).call(_this)) + " </div> " + repeatable;
        } else {
          newGroupId = question_id;
          if (question.repeatable()) {
            newGroupId = newGroupId + "[0]";
          }
          return ("<div data-group-id='" + question_id + "' class='question'>") + _this.toHTMLForm(question.questions(), newGroupId) + "</div>" + repeatable;
        }
      };
    })(this)).join("");
  };

  QuestionView.prototype.updateCache = function() {
    var $qC, accessorFunction, i, inputs, len, name, question, ref, selects, type;
    window.questionCache = {};
    window.getValueCache = {};
    window.$questions = $(".question");
    ref = window.$questions;
    for (i = 0, len = ref.length; i < len; i++) {
      question = ref[i];
      name = question.getAttribute("data-question-name");
      if ((name != null) && name !== "") {
        accessorFunction = {};
        window.questionCache[name] = $(question);
        $qC = window.questionCache[name];
        selects = $("select[name=" + name + "]", $qC);
        if (selects.length === 0) {
          inputs = $("input[name=" + name + "]", $qC);
          if (inputs.length !== 0) {
            type = inputs[0].getAttribute("type");
            if (type === "radio") {
              (function(name, $qC) {
                return accessorFunction = function() {
                  return $("input:checked", $qC).safeVal();
                };
              })(name, $qC);
            } else if (type === "checkbox") {
              (function(name, $qC) {
                return accessorFunction = function() {
                  return $("input", $qC).map(function() {
                    return $(this).safeVal();
                  });
                };
              })(name, $qC);
            } else {
              (function(inputs) {
                return accessorFunction = function() {
                  return inputs.safeVal();
                };
              })(inputs);
            }
          } else {
            (function(name, $qC) {
              return accessorFunction = function() {
                return $(".textarea[name=" + name + "]", $qC).safeVal();
              };
            })(name, $qC);
          }
        } else {
          (function(selects) {
            return accessorFunction = function() {
              return selects.safeVal();
            };
          })(selects);
        }
        window.getValueCache[name] = accessorFunction;
      }
    }
    return window.keyCache = _.keys(questionCache);
  };

  QuestionView.prototype.repeat = function(event) {
    var button, i, inputElement, len, name, newIndex, newQuestion, questionID, re, ref;
    button = $(event.target);
    newQuestion = button.prev(".question").clone();
    questionID = newQuestion.attr("data-group-id");
    if (questionID == null) {
      questionID = "";
    }
    ref = newQuestion.find("input");
    for (i = 0, len = ref.length; i < len; i++) {
      inputElement = ref[i];
      inputElement = $(inputElement);
      name = inputElement.attr("name");
      re = new RegExp(questionID + "\\[(\\d)\\]");
      newIndex = parseInt(_.last(name.match(re))) + 1;
      inputElement.attr("name", name.replace(re, questionID + "[" + newIndex + "]"));
    }
    button.after(newQuestion.add(button.clone()));
    return button.remove();
  };

  QuestionView.prototype.getLocation = function(event) {
    var question_id;
    question_id = $(event.target).closest("[data-question-id]").attr("data-question-id");
    $("#" + question_id + "-description").val("Retrieving position, please wait.");
    return navigator.geolocation.getCurrentPosition((function(_this) {
      return function(geoposition) {
        _.each(geoposition.coords, function(value, key) {
          return $("#" + question_id + "-" + key).val(value);
        });
        $("#" + question_id + "-timestamp").val(moment(geoposition.timestamp).format(Coconut.config.get("datetime_format")));
        $("#" + question_id + "-description").val("Success");
        _this.save();
        return $.getJSON("http://api.geonames.org/findNearbyPlaceNameJSON?lat=" + geoposition.coords.latitude + "&lng=" + geoposition.coords.longitude + "&username=mikeymckay&callback=?", null, function(result) {
          $("#" + question_id + "-description").val(parseFloat(result.geonames[0].distance).toFixed(1) + " km from center of " + result.geonames[0].name);
          return _this.save();
        });
      };
    })(this), function(error) {
      return $("#" + question_id + "-description").val("Error: " + error);
    }, {
      frequency: 1000,
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    });
  };

  return QuestionView;

})(Backbone.View);

(function($) {
  $.fn.scrollTo = function(speed, callback) {
    var e;
    if (speed == null) {
      speed = 500;
    }
    try {
      $('html, body').animate({
        scrollTop: $(this).offset().top + 'px'
      }, speed, null, callback);
    } catch (_error) {
      e = _error;
      console.log("error", e);
      console.log("Scroll error with 'this'", this);
    }
    return this;
  };
  return $.fn.safeVal = function() {
    if (this.is(":visible") || this.parents(".question").filter(function() {
      return !$(this).hasClass("group");
    }).is(":visible")) {
      return $.trim(this.val() || '');
    } else {
      return null;
    }
  };
})($);
