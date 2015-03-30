var HelpView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

HelpView = (function(superClass) {
  extend(HelpView, superClass);

  function HelpView() {
    return HelpView.__super__.constructor.apply(this, arguments);
  }

  HelpView.prototype.el = '#content';

  HelpView.prototype.events = {
    "click input[value=Send]": "send"
  };

  HelpView.prototype.render = function() {
    return this.$el.html("<label style='display:block' for='message'>If you are having trouble please contact your supervisor as soon as possible. You can also describe the problem in the box below and it will send a message to our support team. We'll get back to you as soon as possible.</label> <textarea style='width:100%' id='message' name='message'></textarea> <div id='messageBox'></div> </div> <input type='submit' value='Send'></input>");
  };

  HelpView.prototype.send = function() {
    var help, messageText, sync;
    messageText = $("#message").val();
    if (messageText.length === 0) {
      return false;
    }
    help = new Help({
      date: moment(new Date()).format(Coconut.config.get("date_format")),
      text: messageText,
      user: User.currentUser.id.replace(/user\./, "")
    });
    help.save();
    sync = new Sync();
    $("#messageBox").append("Attempting to 'Send Data'");
    sync.sendToCloud({
      success: function() {
        return $("#messageBox").append("Thank you for your feedback, it has been sent");
      },
      error: function() {
        return $("#messageBox").append("There was a problem sending data, but your messages has been saved. If you have connectivity you can try again by pressing the 'Send data' button at the bottom of the screen.");
      }
    });
    return false;
  };

  return HelpView;

})(Backbone.View);
