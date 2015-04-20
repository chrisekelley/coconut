var Config,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Config = (function(superClass) {
  extend(Config, superClass);

  function Config() {
    return Config.__super__.constructor.apply(this, arguments);
  }

  Config.prototype.initialize = function() {
    return this.set({
      _id: "coconut.config"
    });
  };

  Config.prototype.fetch = function(options) {
    return Config.__super__.fetch.call(this, {
      success: function() {
        Coconut.config.local = new LocalConfig();
        return Coconut.config.local.fetch({
          success: function() {
            return typeof options.success === "function" ? options.success() : void 0;
          },
          error: function() {
            return typeof options.error === "function" ? options.error() : void 0;
          }
        });
      },
      error: function() {
        return typeof options.error === "function" ? options.error() : void 0;
      }
    });
  };

  Config.prototype.url = "/configuration";

  Config.prototype.title = function() {
    return this.get("title") || "Coconut";
  };

  Config.prototype.database_name = function() {
    return Coconut.db_name;
  };

  Config.prototype.design_doc_name = function() {
    return Coconut.ddoc_name;
  };

  Config.prototype.cloud_url = function() {
    return "" + (this.get("synchronization_target"));
  };

  Config.prototype.cloud_url_with_credentials = function() {
    return this.cloud_url().replace(/https:\/\//, "https://" + (this.get("cloud_credentials")) + "@");
  };

  Config.prototype.coconut_central_url = function() {
    return "" + (this.get("coconut_central_url"));
  };

  Config.prototype.coconut_central_url_with_credentials = function() {
    return this.coconut_central_url().replace(/https:\/\//, "https://" + (this.get("cloud_credentials")) + "@");
  };

  Config.prototype.coconut_forms_url = function() {
    return "" + (this.get("coconut_forms_url"));
  };

  Config.prototype.coconut_forms_url_with_credentials = function() {
    if (!this.coconut_forms_url()) {
      alert("Please tell Chris that the coconut_forms_url is missing.");
      this.coconut_forms_url = "https://kiwicentral.org/coconut-forms/";
    }
    if (this.coconut_forms_url().indexOf("http:") === 0) {
      return this.coconut_forms_url().replace(/http:\/\//, "http://" + (this.get("cloud_credentials")) + "@");
    } else {
      return this.coconut_forms_url().replace(/https:\/\//, "https://" + (this.get("cloud_credentials")) + "@");
    }
  };

  Config.prototype.coconut_forms_design_doc = function() {
    return "" + (this.get("coconut_forms_design_doc"));
  };

  Config.prototype.cloud_credentials = function() {
    return "" + (this.get("cloud_credentials"));
  };

  return Config;

})(Backbone.Model);
