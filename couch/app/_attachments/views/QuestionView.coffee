window.SkipTheseWhen = ( argQuestions, result ) ->
  questions = []
  argQuestions = argQuestions.split(/\s*,\s*/)
  for question in argQuestions
    questions.push window.questionCache[question]
  disabledClass = "disabled_skipped"

  for question in questions
    if result
      question.addClass disabledClass
    else
      question.removeClass disabledClass

window.ResultOfQuestion = ( name ) -> return window.getValueCache[name]?() || null


class QuestionView extends Backbone.View

  initialize: ->
    Coconut.resultCollection ?= new ResultCollection()
    @autoscrollTimer = 0

  el: '#content'

  triggerChangeIn: ( names, type ) ->

    for name in names
      elements = []
      elements.push window.questionCache[name].find("input, select, textarea, img")
      $(elements).each (index, element) =>
        event = target : element
        @actionOnChange event,type

  render: =>
    formNameText = @model.safeLabel()
    i18nFormNameText = polyglot.t(formNameText)
    if i18nFormNameText
        formNameText = i18nFormNameText

    @$el.html "
    <style>
      .message
      {
        color: grey;
        font-weight: bold;
        padding: 10px;
        border: 1px yellow dotted;
        background: yellow;
        display: none;
      }


      label.radio {
        border-radius:20px;
        display:block;
        padding:4px 11px;
        border: 1px solid black;
        cursor: pointer;
        text-decoration: none;
      }

      input[type='radio']:checked + label {
        background-color:#ddd;
        background: #5393c5;
        background-image: -webkit-gradient(linear,left top,left bottom,from(#5393c5),to(#6facd5));
        background-image: -webkit-linear-gradient(#5393c5,#6facd5);
        background-image: -moz-linear-gradient(#5393c5,#6facd5);
        background-image: -ms-linear-gradient(#5393c5,#6facd5);
        background-image: -o-linear-gradient(#5393c5,#6facd5);
        background-image: linear-gradient(#5393c5,#6facd5);
      }
      input[type='radio']{
        height: 0px;
      }
      div.question.radio{
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .tt-hint{
        display:none
      }
      .tt-dropdown-menu{
        width: 100%;
        background-color: lightgray;
      }
      .tt-suggestion{
        background-color: white;
        border-radius:20px;
        display:block;
        padding:4px 11px;
        border: 1px solid black;
        cursor: pointer;
        text-decoration: none;
      }
      .tt-suggestion .{
      }

    </style>
      <!--
      <div style='position:fixed; right:5px; color:white; padding:20px; z-index:5' id='messageText'>
        <a href='#help/#{@model.id}'>Help</a>
      </div>
      -->
      <div style='position:fixed; right:5px; color:white; background-color: #333; padding:20px; display:none; z-index:10' id='messageText'>
        Saving...
      </div>
      <h1>#{formNameText}</h1>
      <div id='question-view'>
        <form onsubmit=\"return false;\">
          #{@toHTMLForm(@model)}
          <p>&nbsp;</p>
            <div data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\" data-icon=\"null\" data-iconpos=\"null\" data-theme=\"c\" class=\"ui-btn ui-shadow ui-btn-corner-all ui-submit ui-btn-up-b\" aria-disabled=\"false\">
    <span class=\"ui-btn-inner ui-btn-corner-all\">
    <span class=\"ui-btn-text\">Submit</span></span>
    <button type=\"submit\" data-theme=\"c\" id=\"submitButton\" name=\"submit\" value=\"true\" class=\"ui-btn-hidden\" aria-disabled=\"false\">Submit</button>
    <input type=\"hidden\" id=\"complete\" name=\"complete\"/>
    </div>

    </form>
      </div>
    "


    #Load data into form
#    js2form($('form').get(0), @result.toJSON())

    @updateCache()

    # for first run
    @updateSkipLogic()

    # skipperList is a list of questions that use skip logic in their action on change events
    skipperList = []

    # onChangeList is a list of questions that have onChange events different from skip logic - they have event_on_change properties
    onChangeList = []

    $(@model.get("questions")).each (index, question) =>

      # remember which questions have skip logic in their actionOnChange code
      skipperList.push(question.safeLabel()) if question.actionOnChange().match(/skip/i)

      # remember which questions have onchange  in their actionOnChange code
      onChangeList.push(question.safeLabel()) if question.eventOnChange() != ""

      if question.get("action_on_questions_loaded")? and question.get("action_on_questions_loaded") isnt ""
        CoffeeScript.eval question.get "action_on_questions_loaded"

    # Trigger a change event for each of the questions that contain skip logic in their actionOnChange code
    @triggerChangeIn skipperList
    # Trigger a change event for each of the questions that contain eventOnChange code
    @triggerChangeIn onChangeList,"eventOnChange"

#    @$el.find("input[type=text],input[type=number],input[type='autocomplete from previous entries'],input[type='autocomplete from list'],input[type='autocomplete from code']").textinput()
#    @$el.find('input[type=checkbox]').checkboxradio()
#    @$el.find('ul').listview()
#    @$el.find('select').selectmenu()
#    @$el.find('a').button()
#    @$el.find('input[type=date]').datebox
#      mode: "calbox"
#      dateFormat: "%d-%m-%Y"

    autocompleteElements = []
    _.each $("input[type='autocomplete from list']"), (element) ->
      element = $(element)
      element.typeahead
        local: element.attr("data-autocomplete-options").replace(/\n|\t/,"").split(/, */)
      autocompleteElements.push element

    _.each $("input[type='autocomplete from code']"), (element) ->
      element = $(element)
      element.typeahead
        local: eval(element.attr("data-autocomplete-options"))
      autocompleteElements.push element

    _.each $("input[type='autocomplete from previous entries']"), (element) ->
      element = $(element)
      element.typeahead
        prefetch: document.location.pathname.substring(0,document.location.pathname.indexOf("index.html")) + "_list/values/byValue?key=\"#{element.attr("name")}\""
      autocompleteElements.push element

    _.each autocompleteElements, (autocompeteElement) =>
      autocompeteElement.blur =>
        @autoscroll autocompeteElement
    $('input, textarea').attr("readonly", "true") if @readonly

    if @result.question() == 'Admin Registration'
      if typeof Coconut.scannerPayload != 'undefined'
        console.log 'Display the payload' + JSON.stringify Coconut.scannerPayload

    onCurrentPositionSuccess = (position) ->
      Coconut.currentPositionError = null
      Coconut.currentPosition = position
      messageText = 'Gathered current location.'
      console.log(messageText);
      $("#messageText").html(messageText)
      $("#messageText").slideDown().fadeOut()

    onCurrentPositionError = (error) ->
      Coconut.currentPositionError = error;
      messageText = 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n'
      console.log(messageText);
      $("#messageText").html(messageText)
      $("#messageText").slideDown().fadeOut()

    maximumAge = 1000*60*60 # 1 hour
#   timeout: 5000  # disabled
    navigator.geolocation.getCurrentPosition(onCurrentPositionSuccess, onCurrentPositionError, { maximumAge: maximumAge, enableHighAccuracy: true });

  events:
    "change #question-view input"    : "onChange"
    "change #question-view select"   : "onChange"
    "change #question-view textarea" : "onChange"
    "click #question-view button:contains(+)" : "repeat"
    "click #question-view a:contains(Get current location)" : "getLocation"
    "click .next_error"   : "runValidate"
    "click .validate_one" : "onValidateOne"
    "click #submitButton" : "onSubmitButton"

  runValidate: -> @validateAll()

  onChange: (event) ->
    $target = $(event.target)

    #
    # Don't duplicate events unless 1 second later
    #
    eventStamp = $target.attr("id")
    name = $target.attr("name")
#    question = @model.get("questions")[name]
#    if typeof question != 'undefined'
#      onChangeFunction = question.get("onChangeFunction")
#      if typeof onChangeFunction != 'undefined'
#        onChangeFunction = this.model.get("onChangeFunction")
#        tmpFunc = new Function(onChangeFunction);
#        tmpFunc(name);

    eventOnChange = $target.attr("data-event_on_change")
    if typeof eventOnChange != 'undefined'
      @actionOnChange(event,'eventOnChange')

    return if eventStamp == @oldStamp and (new Date()).getTime() < @throttleTime + 1000

    @throttleTime = (new Date()).getTime()
    @oldStamp     = eventStamp

    targetName = $target.attr("name")

    if targetName == "complete"
      if @changedComplete
        @changedComplete = false
        return

      @validateAll()

      # Update the menu
      Coconut.menuView.update()
      @save()
      @updateSkipLogic()
      @actionOnChange(event)
    else
      @changedComplete = false
      messageVisible = window.questionCache[targetName].find(".message").is(":visible")
# Hack by Mike to solve problem with autocomplete fields being validated before
      _.delay =>
        unless messageVisible
#          wasValid = @validateOne
#            key: targetName
#            autoscroll: false
#            button: "<button type='button' data-name='#{targetName}' class='validate_one'>Validate</button>"
          @save()
          @updateSkipLogic()
          @actionOnChange(event)
#          @autoscroll(event) if wasValid
      , 500

  onSubmitButton: (event) ->
    complete = $('#complete')
    complete.val(true);
    event.target = complete
    this.onChange(event)


  onValidateOne: (event) ->
    $target = $(event.target)
    name = $(event.target).attr('data-name')
    @validateOne
      key : name
      autoscroll: true
      leaveMessage : false
      button : "<button type='button' data-name='#{name}' class='validate_one'>Validate</button>"

  validateAll: () ->

    isValid = true

    for key in window.keyCache

      questionIsntValid = not @validateOne
        key          : key
        autoscroll   : isValid
        leaveMessage : false

      if isValid and questionIsntValid
        isValid = false

    @completeButton isValid

    $("[name=complete]").parent().scrollTo() if isValid # parent because the actual object is display:none'd by jquery ui

    return isValid


  validateOne: ( options ) ->

    key          = options.key          || ''
    autoscroll   = options.autoscroll   || false
    button       = options.button       || "<button type='button' class='next_error'>Next Error</button>"
    leaveMessage = options.leaveMessage || false

    $question = window.questionCache[key]
    $message  = $question.find(".message")

    try
      message = @isValid(key)
    catch e
      alert "isValid error in #{key}\n#{e}"
      message = ""

    if $message.is(":visible") and leaveMessage
      if message is "" then return true else return false

#    if message is ""
#      $message.hide()
#      if autoscroll
#        @autoscroll $question
      return true
#    else
#      $message.show().html("
#        #{message}
#        #{button}
#      ").find("button").button()
#      # undo autoscrolling - horrible hack but it works!
##      @scrollToQuestion($question)
#      return false


  isValid: ( question_id ) ->

    return unless question_id
    result = []

    questionWrapper = window.questionCache[question_id]

    # early exit, don't validate labels
    return "" if questionWrapper.hasClass("label")

    question        = $("[name=#{question_id}]", questionWrapper)

    type            = $(questionWrapper.find("input").get(0)).attr("type")
    labelText       =
      if type is "radio"
        $("label[for=#{question.attr("id").split("-")[0]}]", questionWrapper).text() || ""
      else
        $("label[for=#{question.attr("id")}]", questionWrapper)?.text()
    required        = questionWrapper.attr("data-required") is "true"
    validation      = unescape(questionWrapper.attr("data-validation"))
    validation      = null if validation is "undefined"

    value           = window.getValueCache[question_id]()

    #
    # Exit early conditions
    #

    # don't evaluate anything that's been skipped. Skipped = valid
    return "" if not questionWrapper.is(":visible")

    # "" = true
    return "" if question.find("input").length != 0 and (type == "checkbox" or type == "radio")

    result.push "'#{labelText}' is required." if required && (value is "" or value is null)

    if validation? && validation isnt ""

      try
        validationFunctionResult = (CoffeeScript.eval("(value) -> #{validation}", {bare:true}))(value)
        result.push validationFunctionResult if validationFunctionResult?
      catch error
        return '' if error == 'invisible reference'
        alert "Validation error for #{question_id} with value #{value}: #{error}"

    if result.length isnt 0
      return result.join("<br>") + "<br>"

    return ""

  scrollToQuestion: (question) ->
    # hack upon hack!
    @autoscroll $(question).prev()

  autoscroll: (event) ->

    clearTimeout @autoscrollTimer

    # Some hacks in here to try and make it work
    if event.jquery
      $div = event
      window.scrollTargetName = $div.attr("data-question-name") || $div.attr("name")
    else
      $target = $(event.target)
      window.scrollTargetName = $target.attr("name")
      $div = window.questionCache[window.scrollTargetName]

    @$next = $div.next()

    if not @$next.is(":visible") and @$next.length > 0
      safetyCounter = 0
      while not @$next.is(":visible") and (safetyCounter+=1) < 100
        @$next = @$next.next()

    if @$next.is(":visible")
      return if window.questionCache[window.scrollTargetName].find(".message").is(":visible")
      $(window).on( "scroll", => $(window).off("scroll"); clearTimeout @autoscrollTimer; )
      @autoscrollTimer = setTimeout(
        =>
          $(window).off( "scroll" )
          @$next.scrollTo().find("input[type=text],input[type=number]").focus()
        1000
      )

  # takes an event as an argument, and looks for an input, select or textarea inside the target of that event.
  # Runs the change code associated with that question.
  actionOnChange: (event, type) ->

    nodeName = $(event.target).get(0).nodeName
    $target =
      if nodeName is "INPUT" or nodeName is "SELECT" or nodeName is "TEXTAREA"
        $(event.target)
      else
        $(event.target).parent().parent().parent().find("input,textarea,select")

    # don't do anything if the target is invisible
    return unless $target.is(":visible")

    name = $target.attr("name")
    $divQuestion = $(".question [data-question-name=#{name}]")
    if typeof type != 'undefined' && type == 'eventOnChange'
      code = $divQuestion.attr("data-event_on_change")
    else
      code = $divQuestion.attr("data-action_on_change")
    try
      value = ResultOfQuestion(name)
    catch error
      return if error == "invisible reference"

    return if code == "" or not code?
    if typeof type != 'undefined' && type == 'eventOnChange'
      try
        $target = $(event.target)
#        code = "function($target) = #{code}"
        code = "function(target) = { KiwiUtils.toggleAcceptedSurgery(target) }"
        code = "return KiwiUtils.toggleAcceptedSurgery(target)"
        newFunction = new Function("target", code);
#        newFunction.target = $target
#        newFunction.apply(@, [$target])
        newFunction($target)
      catch error
        name = ((/function (.{1,})\(/).exec(error.constructor.toString())[1])
        message = error.message
        alert "Action on change error in question #{$divQuestion.attr('data-question-id') || $divQuestion.attr("id")}\n\n#{name}\n\n#{message}"
    else
      code = "(value) -> #{code}"
      try
        newFunction = CoffeeScript.eval.apply(@, [code])
        newFunction(value)
      catch error
        name = ((/function (.{1,})\(/).exec(error.constructor.toString())[1])
        message = error.message
        alert "Action on change error in question #{$divQuestion.attr('data-question-id') || $divQuestion.attr("id")}\n\n#{name}\n\n#{message}"

  updateSkipLogic: ->

    for name, $question of window.questionCache

      skipLogicCode = window.skipLogicCache[name]
      continue if skipLogicCode is "" or not skipLogicCode?

      try
        result = eval(skipLogicCode)
      catch error
        if error == "invisible reference"
          result = true
        else
          name = ((/function (.{1,})\(/).exec(error.constructor.toString())[1])
          message = error.message
          alert "Skip logic error in question #{$question.attr('data-question-id')}\n\n#{name}\n\n#{message}"

      if result
        $question[0].style.display = "none"
      else
        $question[0].style.display = ""



  # We throttle to limit how fast save can be repeatedly called
  save: _.throttle( ->

    currentData = $('form').toObject(skipEmpty: false)
    currentPosition = {}
    if Coconut.currentPosition != null
      coords = {}
      _.each Coconut.currentPosition.coords, (value,key) ->
        coords[key] = value
      currentPosition.coords = coords
      currentPosition.timestamp = Coconut.currentPosition.timestamp

    if Coconut.currentPositionError != null
      error = {}
      error.code = Coconut.currentPositionError.code
      error.message = Coconut.currentPositionError.message
      currentData.currentPositionError = error
      if Coconut.currentPosition != null
        currentData.lastRecordedPosition = currentPosition
    else
      if Coconut.currentPosition != null
        currentData.currentPosition = currentPosition

    # Make sure lastModifiedAt is always updated on save
    currentData.lastModifiedAt = moment(new Date()).format(Coconut.config.get "datetime_format")
    if typeof Coconut.currentAdmin != 'undefined' && Coconut.currentAdmin != null
      currentData.savedBy = Coconut.currentAdmin.id
      if @result.question() == 'Admin Registration'
        currentData._id = Coconut.currentAdmin.get("_id")
        currentData.clientId = Coconut.currentAdmin.get("_id")
        currentData.serviceUuid = Coconut.currentAdmin.get("serviceUuid")
        currentData.Fingerprints = Coconut.currentAdmin.get("Fingerprints")
#        if (Coconut.currentAdmin != null)
#          _.extend(Coconut.currentAdmin, currentData)
    else
      currentData.savedBy = $.cookie('current_user')
    if typeof Coconut.currentClient != 'undefined' && Coconut.currentClient != null
      currentData.clientId = Coconut.currentClient.get("_id")
      currentData.serviceUuid = Coconut.currentClient.get("serviceUuid")
      if @result.question() == 'Admin Registration' || @result.question() == 'Individual Registration'
        console.log "currentClient: " + JSON.stringify Coconut.currentClient
        currentData._id = currentData.clientId
        currentData.Fingerprints = Coconut.currentClient.get("Fingerprints")
        console.log "currentData: " + JSON.stringify currentData
      if @result.question() == 'Admin Registration'
#        Coconut.currentAdmin = Coconut.currentClient
        CoconutUtils.setSession('currentAdmin', currentData.email)
    if typeof Coconut.offlineUser!= 'undefined' && Coconut.offlineUser != null
      currentData.createdByOfflineUser = true

    @result.save currentData,
        success: (model) =>
          messageText = 'Saving...'
          $("#messageText").html(messageText)
          $("#messageText").slideDown().fadeOut()


          Coconut.router.navigate("edit/result/#{model.id}",false)

          # Update the menu
          Coconut.menuView.update()

          # Update the top nav strip
#          Controller.displaySiteNav()
          if @result.complete()
            Coconut.syncView.sync.replicateToServer()
            if @result.question() == 'Admin Registration'
              Coconut.router.navigate("postAdminRegistrationMenu",true)
            else if @result.question() == 'Individual Registration'
              Coconut.currentClient = @result
              Coconut.router.navigate("postUserRegistrationMenu",true)
            else
              Coconut.router.navigate("displayClientRecords",true)
    , 1000)

  completeButton: ( value ) ->
    @changedComplete = true
    if $('[name=complete]').prop("checked") isnt value
      $('[name=complete]').click()

  toHTMLForm: (questions = @model, groupId) ->
    window.skipLogicCache = {}
    # Need this because we have recursion later
    questions = [questions] unless questions.length?
    _.map(questions, (question) =>
      if question.repeatable() == "true" then repeatable = "<button>+</button>" else repeatable = ""
      if question.type()? and question.label()? and question.label() != ""
        name = question.get('safeLabel')
        if (name == null)
          name = question.safeLabel()
        labelText = question.label()
        i18nLabelText = polyglot.t(question.get('safeLabel'))
        if i18nLabelText
            labelText = i18nLabelText
#        console.log "labelText:" + labelText
        window.skipLogicCache[name] = if question.skipLogic() isnt '' then CoffeeScript.compile(question.skipLogic(),bare:true) else ''
        question_id = question.get("id")
        if question.repeatable() == "true"
          name = name + "[0]"
          question_id = question.get("id") + "-0"
        if groupId?
          name = "group.#{groupId}.#{name}"
        if question.type() == 'header'
          div = "<div id='#{question_id}#{name}Div' class='question #{question.type?() or ''}'>"
          label = "<h2>#{labelText} </h2>"
        else if question.type() == 'subheader'
          div = "<div id='#{question_id}#{name}Div' class='question #{question.type?() or ''}'>"
          label = "<h3>#{labelText} </h3>"
        else if question.type() == 'spacer'
          div = "<div id='#{question_id}#{name}Div' class='question #{question.type?() or ''}'>"
          label = "<p>&nbsp</p>"
        else if question.type() == 'instructions'
          div = "<div id='#{question_id}#{name}Div' class='question #{question.type?() or ''}'>"
          label = "<p>#{labelText} </p>"
        else
          div = "<div
          #{
          if question.validation()
            "data-validation = '#{escape(question.validation())}'" if question.validation()
          else
            ""
          }
          id='#{question_id}#{name}Div'
          data-required='#{question.required()}'
          class='question #{question.type?() or ''}'
          data-question-name='#{name}'
          data-question-id='#{question_id}'
          data-action_on_change='#{_.escape(question.actionOnChange())}'
          data-event_on_change='#{_.escape(question.eventOnChange())}'

          >"
#          label = "<label type='#{question.type()}' for='#{question_id}'>#{question.label()} <span></span></label>"
          label = "<label type='#{question.type()}' for='#{question_id}'>#{labelText} <span></span></label>"
        return "
          #{
          div
          }

          #{
            switch question.type()
#              when "textarea"
#                ""
              when "checkbox"
                ""
              else
                label
          }
          <div class='message'></div>

          #{
            switch question.type()
              when "textarea"
                "<div class='form-group'><textarea class='form-control' name='#{name}' id='#{question_id}' value='#{question.value()}' placeholder='" + polyglot.t('Enter') + "&nbsp;" +  i18nLabelText + "'>" + "</textarea></div>"

# Selects look lame - use radio buttons instead or autocomplete if long list
#              when "select"
#                "
#                  <select name='#{name}'>#{
#                    _.map(question.get("select-options").split(/, */), (option) ->
#                      "<option>#{option}</option>"
#                    ).join("")
#                  }
#                  </select>
#                "

              when "select"
                if @readonly
                  question.value()
                else
                  html = "<div class='form-group'><select name='#{name}' id='#{question_id}' class='form-control' data-event_on_change='#{_.escape(question.eventOnChange())}'><option value=''> -- " + polyglot.t("SelectOne") + " -- </option>"
                  for option, index in question.get("select-options").split(/, */)
#                    html += "<option name='#{name}' id='#{question_id}-#{index}' value='#{option}'>#{option}</option>"
                     optionText = option
                     i18nKey = question.get('safeLabel') + "::" + optionText
                     i18nOptionText = polyglot.t(i18nKey)
                     if i18nOptionText != i18nKey
                        optionText = i18nOptionText
#                     console.log "labelText: " + labelText + " optionText: " + optionText
                     html += "<option name='#{name}' id='#{question_id}-#{index}' value='#{option}'>#{optionText}</option>"
                  html += "</select></div>"
              when "selectDistrict"
                if @readonly
                  question.value()
                else
                  html = "<div class='form-group'><select name='#{name}' id='#{question_id}' class='form-control'><option value=''> -- " + polyglot.t("SelectOne") + " -- </option>"
                  districts = KiwiUtils.districts
                  index = 0
                  for own key, phrase of districts
                    if key != '_id' && key != '_rev'
                      index++
                      optionText = phrase
                      html += "<option name='#{key}' id='#{question_id}-#{index}' value='#{option}'>#{optionText}</option>"
                  html += "</select></div>"
              when "radio"
                if @readonly
                  "<div class='form-group radiodrop'><input class='radioradio form-control' name='#{name}' type='text' id='#{question_id}' value='#{question.value()}'></input></div>"
                else
                  options = question.get("radio-options")
                  _.map(options.split(/, */), (option,index) ->
                    "
                      <div class='form-group'><input class='radio form-control' type='radio' name='#{name}' id='#{question_id}-#{index}' value='#{_.escape(option)}'/>
                      <label class='radio' for='#{question_id}-#{index}'>#{option}</label></div>

<!--
                      <div class='ui-radio'>
                        <label for=''#{question_id}-#{index}' data-corners='true' data-shadow='false' data-iconshadow='true' data-wrapperels='span' data-icon='radio-off' data-theme='c' class='ui-btn ui-btn-corner-all ui-btn-icon-left ui-radio-off ui-btn-up-c'>
                          <span class='ui-btn-inner ui-btn-corner-all'>
                            <span class='ui-btn-text'>#{option}</span>
                            <span class='ui-icon ui-icon-radio-off ui-icon-shadow'>&nbsp;</span>
                          </span>
                        </label>
                        <input type='radio' name='#{name}' id='#{question_id}-#{index}' value='#{_.escape(option)}'/>
                      </div>
-->

                    "
                  ).join("")


              when "checkbox"
                if @readonly
                  "<div class='form-group'><input class='form-control' name='#{name}' type='text' id='#{question_id}' value='#{_.escape(question.value())}'></input></div>"
                else
#                  "<input style='display:none' name='#{name}' id='#{question_id}' type='checkbox' value='true'></input>"
                  "<div class='checkbox'>
                    <label for='#{question_id}'>
                        <input name='#{name}' id='#{question_id}' type='checkbox' value='true'>#{labelText} <span></span></input>
                    </label>
                   </div>"
              when "autocomplete from list", "autocomplete from previous entries", "autocomplete from code"
                "
                  <!-- autocomplete='off' disables browser completion -->
                  <input autocomplete='off' name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}' data-autocomplete-options='#{question.get("autocomplete-options")}'></input>
                  <ul id='#{question_id}-suggestions' data-role='listview' data-inset='true'/>
                "
#              when "autocomplete from previous entries" or ""
#                "
#                  <!-- autocomplete='off' disables browser completion -->
#                  <input autocomplete='off' name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}'></input>
#                  <ul id='#{question_id}-suggestions' data-role='listview' data-inset='true'/>
#                "
              when "location"
                "
                  <a data-question-id='#{question_id}'>Get current location</a>
                  <label for='#{question_id}-description'>Location Description</label>
                  <input type='text' name='#{name}-description' id='#{question_id}-description'></input>
                  #{
                    _.map(["latitude", "longitude"], (field) ->
                      "<label for='#{question_id}-#{field}'>#{field}</label><input readonly='readonly' type='number' name='#{name}-#{field}' id='#{question_id}-#{field}'></input>"
                    ).join("")
                  }
                  #{
                    _.map(["altitude", "accuracy", "altitudeAccuracy", "heading", "timestamp"], (field) ->
                      "<input type='hidden' name='#{name}-#{field}' id='#{question_id}-#{field}'></input>"
                    ).join("")
                  }
                "

              when "image"
                "<img style='#{question.get "image-style"}' src='#{question.get "image-path"}'/>"
              when "label"
                ""
              when "header"
                ""
              when "subheader"
                ""
              when "spacer"
                ""
              when "instructions"
                "<p>#{text}</p>"
              when "date"
                "<div class='form-group'>
                    <input type='date' class='form-control' name='#{name}' id='#{question_id}' value='#{question.value()}' placeholder='" + polyglot.t('Enter') + " #{i18nLabelText}'/>\n
                </div>"

              when "time"
                "<div class='form-group'>
                    <input type='time' class='form-control' name='#{name}' id='#{question_id}' value='#{question.value()}' placeholder='" + polyglot.t('Enter') + " #{i18nLabelText}'/>
                </div>"
              else
#                "<input name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}'></input>"
                 "<div class='form-group'><input type='text' class='form-control' name='#{name}' id='#{question_id}' value='#{question.value()}' placeholder='" + polyglot.t('Enter') + " #{i18nLabelText}'></div>"
          }
          </div>
          #{repeatable}
        "
      else
        newGroupId = question_id
        newGroupId = newGroupId + "[0]" if question.repeatable()
        return "<div data-group-id='#{question_id}' class='question'>" + @toHTMLForm(question.questions(), newGroupId) + "</div>" + repeatable
    ).join("")

  updateCache: ->
    window.questionCache = {}
    window.getValueCache = {}
    window.$questions = $(".question")

    for question in window.$questions
      name = question.getAttribute("data-question-name")
      if name? and name isnt ""
        accessorFunction = {}
        window.questionCache[name] = $(question)


        # cache accessor function
        $qC = window.questionCache[name] # questionContext
        selects = $("select[name=#{name}]", $qC)
        if selects.length is 0
          inputs  = $("input[name=#{name}]", $qC)
          if inputs.length isnt 0
            type = inputs[0].getAttribute("type")
            if type is "radio"
              do (name, $qC) -> accessorFunction = -> $("input:checked", $qC).safeVal()
            else if type is "checkbox"
              do (name, $qC) -> accessorFunction = -> $("input", $qC).map( -> $(this).safeVal())
            else
              do (inputs) -> accessorFunction = -> inputs.safeVal()
          else # inputs is 0
            do (name, $qC) -> accessorFunction = -> $(".textarea[name=#{name}]", $qC).safeVal()

        else # selects isnt 0
          do (selects) -> accessorFunction = -> selects.safeVal()

        window.getValueCache[name] = accessorFunction

    window.keyCache = _.keys(questionCache)

  repeat: (event) ->
    button = $(event.target)
    newQuestion = button.prev(".question").clone()
    questionID = newQuestion.attr("data-group-id")
    questionID = "" unless questionID?

    # Fix the indexes
    for inputElement in newQuestion.find("input")
      inputElement = $(inputElement)
      name = inputElement.attr("name")
      re = new RegExp("#{questionID}\\[(\\d)\\]")
      newIndex = parseInt(_.last(name.match(re))) + 1
      inputElement.attr("name", name.replace(re,"#{questionID}[#{newIndex}]"))

    button.after(newQuestion.add(button.clone()))
    button.remove()

  getLocation: (event) ->
    question_id = $(event.target).closest("[data-question-id]").attr("data-question-id")
    $("##{question_id}-description").val "Retrieving position, please wait."
    navigator.geolocation.getCurrentPosition(
      (geoposition) =>
        _.each geoposition.coords, (value,key) ->
          $("##{question_id}-#{key}").val(value)
        $("##{question_id}-timestamp").val(moment(geoposition.timestamp).format(Coconut.config.get "datetime_format"))
        $("##{question_id}-description").val "Success"
        @save()
        $.getJSON "http://api.geonames.org/findNearbyPlaceNameJSON?lat=#{geoposition.coords.latitude}&lng=#{geoposition.coords.longitude}&username=mikeymckay&callback=?", null, (result) =>
          $("##{question_id}-description").val parseFloat(result.geonames[0].distance).toFixed(1) + " km from center of " + result.geonames[0].name
          @save()
      (error) ->
        $("##{question_id}-description").val "Error: #{error}"
      {
        frequency: 1000
        enableHighAccuracy: true
        timeout: 30000
        maximumAge: 0
      }
    )

# jquery helpers

( ($) ->

  $.fn.scrollTo = (speed = 500, callback) ->
    try
      $('html, body').animate {
        scrollTop: $(@).offset().top + 'px'
        }, speed, null, callback
    catch e
      console.log "error", e
      console.log "Scroll error with 'this'", @

    return @


  $.fn.safeVal = () ->

    if @is(":visible") or @parents(".question").filter( -> return not $(this).hasClass("group")).is(":visible")
      return $.trim( @val() || '' )
    else
      return null

)($)
