class CaseView extends Backbone.View
  el: '#content'

  render: =>
    @$el.html "
          <h1>#{polyglot.t 'Case ID'}: #{@case.get("caseID")}</h1>
          <h3>#{polyglot.t 'LastModified'}: #{@case.get("lastModifiedAt")}</h3>
          <table>
            <thead>
              <th>#{polyglot.t 'Property'}</th>
              <th>#{polyglot.t 'Value'}</th>
            </thead>
            <tbody>
               #{
    _.map @case.attributes, (value, property) ->
      "
                      <tr>
                        <td>
                          #{polyglot.t property}
                        </td>
                        <td>
                          #{polyglot.t value}
                        </td>
                      </tr>
                    "
    .join("")
    }
                <tr>
              </tr>
            </tbody>
          </table>
    "
