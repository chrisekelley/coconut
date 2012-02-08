class Router extends Backbone.Router
  routes:
    "design": "design"
    "select": "select"
    "show/results/:question_id": "showResults"
    "new/result/:question_id": "newResult"
    "edit/result/:result_id": "editResult"
    "edit/resultSummary/:question_id": "editResultSummary"
    "analyze/:form_id": "analyze"
    "delete/:question_id": "deleteQuestion"
    "edit/:question_id": "editQuestion"
    "manage": "manage"
    "": "default"

  default: ->
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>")
    $("#content").empty()
    $("#loading").toggle(false)

  editResultSummary: (question_id) ->
    Coconut.resultSummaryEditor ?= new ResultSummaryEditorView()
    Coconut.resultSummaryEditor.question = new Question
      id: question_id

    Coconut.resultSummaryEditor.question.fetch
      success: ->
        Coconut.resultSummaryEditor.render()

  editQuestion: (question_id) ->
    Coconut.designView ?= new DesignView()
    Coconut.designView.render()
    Coconut.designView.loadQuestion question_id

  deleteQuestion: (question_id) ->
    Coconut.questions.get(question_id).destroy
      success: ->
        Coconut.menuView.render()
        Coconut.router.navigate("manage",true)

  manage: ->
    Coconut.questions.fetch
      success: ->
        $("#content").html "
          <a href='#design'>New</a>
          <table>
            <thead>
              <th>
                <td>Name</td>
              </th>
              <th></th>
              <th></th>
              <th></th>
            </thead>
            <tbody>
            </tbody>
          </table>
        "
        Coconut.questions.each (question) ->
          $("tbody").append "
            <tr>
              <td>#{question.id}</td>
              <td><a href='#edit/#{question.id}'>edit</a></td>
              <td><a href='#delete/#{question.id}'>delete</a></td>
              <td><a href='#edit/resultSummary/#{question.id}'>summary</a></td>
            </tr>
          "

  newResult: (question_id) ->
    Coconut.questionView ?= new QuestionView()
    Coconut.questionView.result = new Result
      question: question_id
    Coconut.questionView.model = new Question {id: question_id}
    Coconut.questionView.model.fetch
      success: ->
        Coconut.questionView.render()

  editResult: (result_id) ->
    Coconut.questionView ?= new QuestionView()

    Coconut.questionView.result = new Result
      _id: result_id
    Coconut.questionView.result.fetch
      success: ->
        Coconut.questionView.model = new Question
          id: Coconut.questionView.result.question()
        Coconut.questionView.model.fetch
          success: ->
            Coconut.questionView.render()

  design: ->
    $("#content").empty()
    Coconut.designView ?= new DesignView()
    Coconut.designView.render()

  showResults:(question_id) ->
    Coconut.resultsView ?= new ResultsView()
    Coconut.resultsView.question = new Question
      id: question_id
    Coconut.resultsView.render()

  startApp: ->
    Coconut.questions = new QuestionCollection()
    Coconut.questionView = new QuestionView()
    Coconut.todoView = new TodoView()
    Coconut.menuView = new MenuView()
    Coconut.menuView.render()
    # Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start()

Coconut = {}
Coconut.router = new Router()
Coconut.router.startApp()
