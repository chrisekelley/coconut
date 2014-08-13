class CaseView extends Backbone.View
  el: '#content'

  render: =>
    @$el.html "
          <h1>Case ID: #{@case.get("caseID")}</h1>
          <h2>Last Modified: #{@case.get("lastModifiedAt")}</h1>
          <table>
            <thead>
              <th>Property</th>
              <th>Value</th>
            </thead>
            <tbody>
               #{
    _.map @case.attributes, (value, property) ->
      "
                      <tr>
                        <td>
                          #{property}
                        </td>
                        <td>
                          #{value}
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
