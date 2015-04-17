if (typeof window.KiwiUtils === "undefined" || window.KiwiUtils === null) {
  window.KiwiUtils = {};
}

KiwiUtils.fetchDistricts = function() {
  var deferred, districts, options, opts;
  if (!options) {
    options = {};
  }
  deferred = $.Deferred();
  districts = new Backbone.Model({
    _id: 'districts'
  });
  opts = _.extend(options, opts);
  districts.fetch({
    success: function(record) {
      KiwiUtils.districts = record.toJSON();
      return deferred.resolve();
    },
    error: function(error, response) {
      return console.log("Unable to fetch districts.  error:" + JSON.stringify(error) + " response: " + response);
    }
  });
  return deferred.promise();
};

KiwiUtils.toggleAcceptedSurgery = function(target) {
  var els, name, value;
  name = target.attr("name");
  if (name === 'acceptedSurgeryL') {
    els = ['566TypeofOperationLDiv', '189ClampusedLDiv', '964SutureTypeLDiv', '827ComplicationsLDiv', '57ExcessbleedingLDiv', '533MarginfragmantseveredLDiv', '151GlobePunctureLDiv', '152ComplicationsReferralLDiv', '153ReferralHospitalLDiv'];
  } else if (name === 'acceptedSurgeryR') {
    els = ['47TypeofOperationRDiv', '776ClampusedRDiv', '985SutureTypeRDiv', '280ComplicationsRDiv', '636ExcessbleedingRDiv', '207MarginfragmantseveredRDiv', '174GlobePunctureRDiv', '175ComplicationsReferralRDiv', '176ReferralHospitalRDiv'];
  }
  value = target.val();
  if (value === '') {

  } else if (value === 'Yes') {
    return CoconutUtils.showDivs(els);
  } else {
    return CoconutUtils.hideDivs(els);
  }
};
