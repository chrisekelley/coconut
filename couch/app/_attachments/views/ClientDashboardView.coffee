class ClientDashboardView extends Backbone.View
#  el: '#content table tbody'
#  el: ''
  tagName: 'p'

  events:
    "click #badScan":  "badScan"

  render: =>
    if !@model
      @$el.html polyglot.t("Error") + ": " + polyglot.t("NoClientLoaded") + "."
    else
      @$el.html polyglot.t(@model.get "Gender") + " " + polyglot.t(@model.get "DOB") + "<a data-role='button' class='btn btn-danger btn-sm' style='margin:15px' id='badScan'>" + polyglot.t("badScan") + "</a>" +
          "<br>ID:" + @model.get "_id"

  badScan: =>
    console.log "badScan"
    Coconut.badScanId = @model.get "_id"
#    CoconutUtils.saveLog(null, "Bad Scan.", Coconut.badScanId);
    log = new Log()
    log.save
      title: "Bad Scan"
      modelId:Coconut.badScanId
      serviceUuid:serviceUuid
      currentPrints:Coconut.currentPrints
      currentDistrict: Coconut.currentDistrict
      currentAdmin: Coconut.currentAdmin
    , success: () =>
        $( "#message").append("<br/>Saved log about problem.")
        console.log("Saved log about problem.")
    ,
      error: (model, err, cb) =>
        console.log(JSON.stringify(err))
    Coconut.trigger "badScan"
    return
