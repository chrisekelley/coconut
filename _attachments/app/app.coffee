class Router extends Backbone.Router
  routes:
    "design": "design"
    "select": "select"
    "show/results/:question_id": "showResults"
    "new/result/:question_id": "newResult"
    "edit/result/:result_id": "editResult"
    "analyze/:form_id": "analyze"
    "delete/:question_id": "deleteQuestion"
    "edit/:question_id": "editQuestion"
    "manage": "manage"
    "": "default"

  default: ->
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>")
    $("#content").empty()

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
    $("#content").html "
      <h1>#{question_id}</h1>
      <a href='#new/result/#{question_id}'>Start new result</a>
      <h2>Partial Results</h2>
      <table class='notComplete'>
        <thead><tr>
          <th>Name</th>
          <th></th>
          <th></th>
        </tr></thead>
      </table>
      <h2>Complete Results</h2>
      <table class='complete'>
        <thead><tr>
          <th>Name</th>
          <th></th>
          <th></th>
        </tr></thead>
      </table>
    "
    rowTemplate = Handlebars.compile "
      <tr>
        <td>{{toShortString}}</td>
        <td><a href='#edit/result/{{id}}'>Edit</a></td>
        <td><a href='#view/result/{{id}}'>View</a></td>
      </tr>
    "

    # 3 options: edit partials, edit complete, create new
    Coconut.resultCollection ?= new ResultCollection()
    Coconut.resultCollection.fetch
      success: ->
        Coconut.resultCollection.each (result) ->
          result.fetch
            success: ->
              return unless result.question() is question_id
              if result.get("complete") is true
                $("table.complete").append(rowTemplate(result))
              else
                $("table.notComplete").append(rowTemplate(result))

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
