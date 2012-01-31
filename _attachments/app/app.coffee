class Router extends Backbone.Router
  routes:
    "design": "design"
    "select": "select"
    "show/results/:question_id": "showResults"
    "new/result/:question_id": "newResult"
    "edit/result/:result_id": "editResult"
    "analyze/:form_id": "analyze"
    "": "default"

  default: ->
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>")
    $("#content").empty()
    Coconut.questions.fetch
      success: ->
        _.each Coconut.questions.models, (question) ->
          $("div#menu").prepend "
            <a href='#show/results/#{question.id}'>#{question.id}</a>
          "

  newResult: (question_id) ->
    Coconut.questionView ?= new QuestionView()
    Coconut.questionView.result = new Result
      question: @model.id
    Coconut.questionView.model = new Question {id: question_id}
    Coconut.questionView.model.fetch
      success: ->
        Coconut.questionView.render()

  editResult: (result_id) ->
    Coconut.questionView ?= new QuestionView()
    Coconut.questionView.result = new Result
      question: @model.id
    Coconut.questionView.model = new Question {id: question_id}
    Coconut.questionView.model.fetch
      success: ->
        Coconut.questionView.render()

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
    # Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start()

Coconut = {}
Coconut.router = new Router()
Coconut.router.startApp()
