class Router extends Backbone.Router
  routes:
    "design": "design"
    "select": "select"
    "facility": "facility"
    "househould": "household"
    "collect/:question_id/:case_id": "collect"
    "analyze/:form_id": "analyze"
    "": "blank"

  blank: ->
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>")

  facility: ->
    Coconut.todoView.templateData = {
      todoType: "Facility"
      todoItems : [
        {
          form: "facility"
          caseID: "XASDAX"
          shahia: "Washoe"
          firstName: "Abdul"
        },
        {
          form: "facility"
          caseID: "XSSDAX"
          shahia: "Reno"
          firstName: "Mohammed"
        }
      ]
      completedItems : [
        {
          form: "facility"
          caseID: "ASSXXZ"
          shahia: "Stone Town"
          firstName: "Sarah"
          date: "11-Nov-2011"
        },
        {
          form: "facility"
          caseID: "XASDAX"
          shahia: "Washoe"
          firstName: "Eva"
          date: "11-Dec-2011"
        }
      ]
    }
    Coconut.todoView.render()

  household: ->
    Coconut.todoView.templateData = {
      todoType: "Household"
      todoItems : [
        {
          form: "facility"
          caseID: "XASDAX"
          shahia: "Washoe"
          firstName: "Abdul"
        },
        {
          form: "facility"
          caseID: "XSSDAX"
          shahia: "Reno"
          firstName: "Mohammed"
        }
      ],
      completedItems : [
        {
          form: "facility"
          caseID: "ASSXXZ"
          shahia: "Stone Town"
          firstName: "Sarah"
          date: "11-Nov-2011"
        },
        {
          form: "facility"
          caseID: "XASDAX"
          shahia: "Washoe"
          firstName: "Eva"
          date: "11-Dec-2011"
        }
      ]
    }
    Coconut.todoView.render()

  design: ->
    $("#content").empty()
    Coconut.designView ?= new DesignView()
    Coconut.designView.render()

  select: ->
    $("#content").empty()
    Coconut.questions.fetch
      success: ->
        Coconut.formSelectView ?= new FormSelectView()
        Coconut.formSelectView.render()

  collect:(question_id,case_id) ->
    $("#content").empty()
    question = new Question
      id: question_id
      case_id: case_id

    question.fetch
      success: ->
        Coconut.questionView.model = question
        Coconut.questionView.render()

  startApp: ->
    Coconut.questions = new QuestionCollection()
    Coconut.questionView = new QuestionView()
    Coconut.todoView = new TodoView()
    # Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start()

Coconut = {}
Coconut.router = new Router()
Coconut.router.startApp()
