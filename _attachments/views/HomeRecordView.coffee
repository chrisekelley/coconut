class HomeRecordView extends Backbone.View
#  el: '#content table tbody'
#  el: ''
  tagName: 'tr'

  render: =>
    @$el.html "
    <td><a href=\"/#show/case/#{@model.get "_id"}\">#{@model.get "question"}</a></td><td>#{@model.get "user"}</td>
                    <td>#{@model.get "lastModifiedAt"}</td>
            "

#  render: =>
#    @$el.html "
#                       <tr id='#{@model.get "_id"}'>
#        <td><a href=\"/#show/case/#{@model.get "_id"}\">#{@model.get "question"}</a></td><td>#{@model.get "user"}</td>
#                        <td>#{@model.get "lastModifiedAt"}</td></tr>
#                "
