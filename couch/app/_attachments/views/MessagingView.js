var MessagingView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MessagingView = (function(superClass) {
  extend(MessagingView, superClass);

  function MessagingView() {
    this.render = bind(this.render, this);
    this.checkAll = bind(this.checkAll, this);
    return MessagingView.__super__.constructor.apply(this, arguments);
  }

  MessagingView.prototype.initialize = function() {
    this.userCollection = new UserCollection();
    this.messageCollection = new MessageCollection();
    return this.max = 140;
  };

  MessagingView.prototype.el = '#content';

  MessagingView.prototype.events = {
    "click #check-all": "checkAll",
    "click .phone-number": "updateToField",
    "click input[value=Send]": "send",
    "keyup #message": "checkLength"
  };

  MessagingView.prototype.checkLength = function() {
    $("#charCount").html("Characters used: " + ($("#message").val().length) + ". Maximum allowed: " + 140.);
    if ($("#message").val().length > this.max) {
      return $("#charCount").css("color", "red");
    } else {
      return $("#charCount").css("color", "");
    }
  };

  MessagingView.prototype.send = function() {
    var messageText;
    messageText = $("#message").val();
    if (messageText.length > this.max || messageText.length === 0) {
      return false;
    }
    _.each(this.phoneNumbers, function(phoneNumber) {
      var message;
      message = new Message({
        date: moment(new Date()).format(Coconut.config.get("date_format")),
        text: messageText,
        to: phoneNumber
      });
      return message.sendSMS({
        success: function() {
          message.save();
          return $("#messageBox").append("Sent '" + messageText + "' to " + phoneNumber);
        },
        error: function(error) {
          return $("#messageBox").append("Error: [" + error + "] while sending '" + messageText + "' to " + phoneNumber);
        }
      });
    });
    return false;
  };

  MessagingView.prototype.checkAll = function() {
    $("input[type=checkbox].phone-number").attr("checked", $("#check-all").is(":checked"));
    return this.updateToField();
  };

  MessagingView.prototype.updateToField = function() {
    this.phoneNumbers = _.map($("input[type=checkbox].phone-number:checked"), function(item) {
      return $(item).attr("id").replace(/check-user\./, "");
    });
    return $("#to").html(this.phoneNumbers.join(", "));
  };

  MessagingView.prototype.render = function() {
    var fields, messageFields;
    fields = "_id,district,name,comments".split(",");
    messageFields = "date,to,text".split(",");
    this.$el.html("<h2>Send Message</h2> <h3>Select Recipients</h2> <table class='recipients'> <thead> <th></th> " + (_.map(fields, function(field) {
      return "<th>" + (field === "_id" ? "Phone Number" : field.humanize()) + "</th>";
    }).join("")) + " </thead> <tbody> </tbody> </table> <form id='message-form'> Recipients: <div id='to'></div> <label style='display:block' for='message'>Message</label> <textarea style='width:100%' id='message' name='message'></textarea> <div id='messageBox'></div> </div> <input type='submit' value='Send'></input> <span id='charCount'></span> </form> <h3>Sent Messages</h3> <table class='sent-messages'> <thead> " + (_.map(messageFields, function(field) {
      return "<th>" + field + "</th>";
    }).join("")) + " </thead> <tbody> </tbody> </table>");
    this.userCollection.fetch({
      success: (function(_this) {
        return function() {
          $("table.recipients").before("<input id='check-all' type='checkbox'></input>Select All");
          _this.userCollection.sortBy(function(user) {
            return user.get("district");
          }).forEach(function(user) {
            if (!user.get("_id").match(/\d\d\d/)) {
              return;
            }
            return $(".recipients tbody").append("<tr> <td><input class='phone-number' id='check-" + (user.get("_id")) + "' type='checkbox'></input></td> " + (_.map(fields, function(field) {
              var data;
              data = user.get(field);
              if (field === "_id") {
                data = data.replace(/user\./, "");
              }
              return "<td>" + data + "</td>";
            }).join("")) + " </tr>");
          });
          $(".recipients tbody").append("<tr> <td><input class='phone-number' id='check-user.0787263670' type='checkbox'></input></td> <td>0787263670</td> <td></td> <td>Ritha</td> <td>RTI</td> </tr> <tr> <td><input class='phone-number' id='check-user.3141' type='checkbox'></input></td> <td>31415926</td> <td></td> <td>Test</td> <td>Doesn't actually work</td> </tr>");
          return $("a").button();
        };
      })(this)
    });
    return this.messageCollection.fetch({
      success: (function(_this) {
        return function() {
          return _this.messageCollection.forEach(function(item) {
            return $(".sent-messages tbody").append("<tr> " + (_.map(messageFields, function(field) {
              return "<td>" + (item.get(field)) + "</td>";
            }).join("")) + " </tr>");
          });
        };
      })(this)
    });
  };

  return MessagingView;

})(Backbone.View);
