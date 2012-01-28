class TodoView extends Backbone.View
  initialize: ->

  el: $('#content')

  render: =>
    @el.html(this.template(@templateData))

  template: Handlebars.compile "
    <h1>Facility</h1>
    <h2>Items Todo</h2>
    <ul>
      {{#each todoItems}}
        <li><a href='#collect/{{form}}/{{caseID}}'>Collect</a>  {{shahia}} - {{firstName}} - {{caseID}}</li>
      {{/each}}
    </ul>
    <hr/>
    <h2>Items Completed</h2>
    <ul>
      {{#each completedItems}}
        <li><a href='#result/{{form}}/{{caseID}}'>Result</a>  {{shahia}} - {{firstName}} - {{caseID}} - {{date}}</li>
      {{/each}}
    </ul>
  "
