// Generated by CoffeeScript 1.6.3
var SyncView, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SyncView = (function(_super) {
  __extends(SyncView, _super);

  function SyncView() {
    this.update = __bind(this.update, this);
    this.render = __bind(this.render, this);
    _ref = SyncView.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  SyncView.prototype.initialize = function() {
    return this.sync = new Sync();
  };

  SyncView.prototype.el = '#content';

  SyncView.prototype.render = function() {
    this.$el.html("        <h2>Cloud Server: <span class='sync-target'>" + (this.sync.target()) + "</span></h2>        <a data-role='button' class='btn btn-primary btn-lg' href='#sync/send'>Send data</a>        ");
    $("a").button();
    return this.update();
  };

  SyncView.prototype.update = function() {
    var _this = this;
    return this.sync.fetch({
      success: function() {
        $(".sync-sent-status").html(_this.sync.was_last_send_successful() ? _this.sync.last_send_time() : "" + (_this.sync.last_send_time()) + " - last attempt FAILED");
        return $(".sync-get-status").html(_this.sync.was_last_get_successful() ? _this.sync.last_get_time() : "" + (_this.sync.last_get_time()) + " - last attempt FAILED");
      },
      error: function() {
        console.log("synclog doesn't exist yet, create it and re-render");
        _this.sync.save();
        return _.delay(_this.update, 1000);
      }
    });
  };

  return SyncView;

})(Backbone.View);
