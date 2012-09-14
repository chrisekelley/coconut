class QuestionView extends Backbone.View
  initialize: ->
    Coconut.resultCollection ?= new ResultCollection()

  el: '#content'

  render: =>
    @$el.html "
      <div style='position:fixed; right:5px; color:white; background-color: #333; padding:20px; display:none; z-index:10' id='messageText'>
        Saving...
      </div>
      <div id='question-view'>
        <form>
          #{@toHTMLForm(@model)}
        </form>
      </div>
    "
    js2form($('form').get(0), @result.toJSON())
    @$el.find("input[type=text],input[type=number],input[type='autocomplete from previous entries']").textinput()
    @$el.find('input[type=radio],input[type=checkbox]').checkboxradio()
    @$el.find('ul').listview()
    @$el.find('a').button()
    @$el.find('input[type=date]').datebox
      mode: "calbox"
      dateFormat: "%d-%m-%Y"

#    tagSelector = "input[name=Tags],input[name=tags]"
#    $(tagSelector).tagit
#      availableTags: [
#        "complete"
#      ]
#      onTagChanged: ->
#        $(tagSelector).trigger('change')

    _.each $("input[type='autocomplete from list'],input[type='autocomplete from previous entries']"), (element) ->
      element = $(element)
      if element.attr("type") is 'autocomplete from list'
        source = element.attr("data-autocomplete-options").split(/, */)
      else
        source = document.location.pathname.substring(0,document.location.pathname.indexOf("index.html")) + "_list/values/byValue?key=\"#{element.attr("name")}\""

      element.autocomplete
        source: source
        target: "##{element.attr("id")}-suggestions"
        callback: (event) ->
          element.val($(event.currentTarget).text())
          element.autocomplete('clear')

    $("input[name=complete]").closest("div.question").prepend "
        <div style='background-color:yellow' id='validationMessage'></div>
      "
    $('input,textarea').attr("readonly", "true") if @readonly

  events:
    "change #question-view input": "save"
    "change #question-view select": "save"
    "click #question-view button:contains(+)" : "repeat"
    "click #question-view a:contains(Get current location)" : "getLocation"

  getLocation: (event) ->
    question_id = $(event.target).closest("[data-question-id]").attr("data-question-id")
    $("##{question_id}-description").val "Retrieving position, please wait."
    navigator.geolocation.getCurrentPosition(
      (geoposition) =>
        _.each geoposition.coords, (value,key) ->
          $("##{question_id}-#{key}").val(value)
        $("##{question_id}-timestamp").val(moment(geoposition.timestamp).format(Coconut.config.get "date_format"))
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

  validate: (result) ->
    $("#validationMessage").html ""
    _.each result, (value,key) =>
      $("#validationMessage").append @validateItem(value,key)

    _.chain($("input[type=radio]"))
    .map (element) ->
      $(element).attr("name")
    .uniq()
    .map (radioName) ->
      question = $("input[name=#{radioName}]").closest("div.question")
      required = question.attr("data-required") is "true"
      if required and not $("input[name=#{radioName}]").is(":checked")
        labelID = question.attr("data-question-id")
        labelText = $("label[for=#{labelID}]")?.text()
        $("#validationMessage").append "'#{labelText}' is required<br/>"

    unless $("#validationMessage").html() is ""
      $("input[name=complete]")?.prop("checked", false)
      return false
    else
      return true

  validateItem: (value, question_id) ->
    result = []
    question = $("[name=#{question_id}]")
    labelText = $("label[for=#{question.attr("id")}]")?.text()
    required = question.closest("div.question").attr("data-required") is "true"
    validation = unescape(question.closest("div.question").attr("data-validation"))
    if required and not value?
      result.push "'#{labelText}' is required (NA or 9999 may be used if information not available)"
    if validation != "undefined" and validation != null
      validationFunction = eval "(function(value){#{validation}})"
      result.push validationFunction(value)
    result = _.compact(result)
    if result.length > 0
      return result.join("<br/>") + "<br/>"
    else
      return ""

  save: ->
    currentData = $('form').toObject(skipEmpty: false)

    # don't allow invalid results to be marked and saved as complete
    if currentData.complete and not @validate(currentData)
      return

    @result.save _.extend(
      # Make sure lastModifiedAt is always updated on save
      currentData
      {
        lastModifiedAt: moment(new Date())
          .format(Coconut.config.get "date_format")
        savedBy: $.cookie('current_user')
      }
    ),
      success: ->
        $("#messageText").slideDown().fadeOut()

    @key = "MalariaCaseID"

    # Update the menu
    Coconut.menuView.update()

    if @result.complete()
      unless @result.nextLevelCreated is true # hack needed for tablets
        @result.nextLevelCreated = true
        # Check if the next level needs to be created
        Coconut.resultCollection.fetch
          success: =>
            switch(@result.get 'question')
              when "Case Notification"
                unless @currentKeyExistsInResultsFor 'Facility'
                  result = new Result
                    question: "Facility"
                    MalariaCaseID: @result.get "MalariaCaseID"
                    FacilityName: @result.get "FacilityName"
                    Shehia: @result.get "Shehia"
                  result.save null,
                    success: ->
                      Coconut.menuView.update()
              when "Facility"
                #Add phone number/sheha/shehia/village to household to help with locating
                #Especially important when shehia is outside of facility's district
                unless @currentKeyExistsInResultsFor 'Household'
                  result = new Result
                    question: "Household"
                    MalariaCaseID: @result.get "MalariaCaseID"
                    HeadofHouseholdName: @result.get "HeadofHouseholdName"
                    Shehia: @result.get "Shehia"
                    Village: @result.get "Village"
                    ShehaMjumbe: @result.get "ShehaMjumbe"
                    ContactMobilepatientrelative: @result.get "ContactMobilepatientrelative"
                  result.save null,
                    success: ->
                      Coconut.menuView.update()
              when "Household"
                unless @currentKeyExistsInResultsFor 'Household Members'
                  # -1 because we don't need information for index case
                  _(@result.get("TotalNumberofResidentsintheHousehold")-1).times =>
                    result = new Result
                      question: "Household Members"
                      MalariaCaseID: @result.get "MalariaCaseID"
                      HeadofHouseholdName: @result.get "HeadofHouseholdName"
                    result.save null,
                      success: ->
                        Coconut.menuView.update()

  currentKeyExistsInResultsFor: (question) ->
    Coconut.resultCollection.any (result) =>
      @result.get(@key) == result.get(@key) and result.get('question') == question

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

  toHTMLForm: (questions = @model, groupId) ->
    # Need this because we have recursion later
    questions = [questions] unless questions.length?
    _.map(questions, (question) =>
      if question.onChange
        #TODO
        console.log question.onChange
      if question.repeatable() == "true" then repeatable = "<button>+</button>" else repeatable = ""
      if question.type()? and question.label()? and question.label() != ""
        name = question.label().replace(/[^a-zA-Z0-9 -]/g,"").replace(/[ -]/g,"")
        question_id = question.get("id")
        if question.repeatable() == "true"
          name = name + "[0]"
          question_id = question.get("id") + "-0"
        if groupId?
          name = "group.#{groupId}.#{name}"

        return "
          <div 
            #{
            if question.validation()
              "data-validation = '#{escape(question.validation())}'" if question.validation() 
            else
              ""
            } 
            data-required='#{question.required()}' 
            class='question'
            data-question-id='#{question_id}'
          >#{
            "<label type='#{question.type()}' for='#{question_id}'>#{question.label()} <span></span></label>" unless question.type().match(/hidden/)
          }
          #{
            switch question.type()
              when "textarea"
                "<input name='#{name}' type='text' id='#{question_id}' value='#{question.value()}'></input>"
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
              when "radio", "select"
                if @readonly
                  "<input name='#{name}' type='text' id='#{question_id}' value='#{question.value()}'></input>"
                else
                  options = question.get("radio-options") or question.get("select-options")
                  _.map(options.split(/, */), (option,index) ->
                    "
                      <label for='#{question_id}-#{index}'>#{option}</label>
                      <input type='radio' name='#{name}' id='#{question_id}-#{index}' value='#{option}'/>
                    "
                  ).join("")
              when "checkbox"
                if @readonly
                  "<input name='#{name}' type='text' id='#{question_id}' value='#{question.value()}'></input>"
                else
                  "<input style='display:none' name='#{name}' id='#{question_id}' type='checkbox' value='true'></input>"
              when "autocomplete from list"
                "
                  <!-- autocomplete='off' disables browser completion -->
                  <input autocomplete='off' name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}' data-autocomplete-options='#{question.get("autocomplete-options")}'></input>
                  <ul id='#{question_id}-suggestions' data-role='listview' data-inset='true'/>
                "
              when "autocomplete from previous entries"
                "
                  <!-- autocomplete='off' disables browser completion -->
                  <input autocomplete='off' name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}'></input>
                  <ul id='#{question_id}-suggestions' data-role='listview' data-inset='true'/>
                "
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
                "<a>Get image</a>"
              else
                "<input name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}'></input>"
          }
          </div>
          #{repeatable}
        "
      else
        newGroupId = question_id
        newGroupId = newGroupId + "[0]" if question.repeatable()
        return "<div data-group-id='#{question_id}' class='question group'>" + @toHTMLForm(question.questions(), newGroupId) + "</div>" + repeatable
    ).join("")
