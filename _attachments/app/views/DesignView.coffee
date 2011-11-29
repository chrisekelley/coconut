class DesignView extends Backbone.Model

  template: Handlebars.compile "
    <select id='element_selector'>
      {{#each types}}
        <option>{{this}}</option>
      {{/each}}
    </select>
    <button>Add</button>
    <div id='questions'>
    </div>
  "

  initialize: ->
    $("button:contains(Add)").live "click", this.add

  events:
    "click": "add",
    "click button:contains(Add)": "add"

  add: (event) =>
    console.log "FOO"
    console.log target

  render: =>
    templateData = {}
    templateData.types = "string,date,number,textarea".split(',')
    $("#content").html(this.template(templateData))
