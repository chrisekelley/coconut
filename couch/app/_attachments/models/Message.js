var Message,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Message = (function(superClass) {
  extend(Message, superClass);

  function Message() {
    return Message.__super__.constructor.apply(this, arguments);
  }

  Message.prototype.url = "/message";

  Message.prototype.sendSMS = function(options) {
    var to;
    to = (this.get("to")).replace(/^07/, "2557");
    return $.ajax({
      url: 'https://CHANGEME/bulksms/dispatch.php',
      dataType: "jsonp",
      data: {
        user: 'user',
        password: 'pass',
        msisdn: to,
        message: this.get("text")
      },
      success: function() {
        return options.success();
      },
      error: function(error) {
        console.log(error);
        if (error.statusText === "success") {
          return options.success();
        } else {
          return options.error(error);
        }
      }
    });
  };

  return Message;

})(Backbone.Model);
