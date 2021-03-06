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
  var elsNo, elsYes, name, value;
  name = target.attr("name");
  if (name === 'acceptedSurgeryL') {
    elsYes = ['566TypeofOperationLDiv', '189ClampusedLDiv', '964SutureTypeLDiv', '827ComplicationsLDiv', '57ExcessbleedingLDiv', '533MarginfragmantseveredLDiv', '151GlobePunctureLDiv', '152ComplicationsReferralLDiv', '153ReferralHospitalLDiv'];
    elsNo = ['135ProvidedEpilationConsultationLDiv'];
  } else if (name === 'acceptedSurgeryR') {
    elsYes = ['47TypeofOperationRDiv', '776ClampusedRDiv', '985SutureTypeRDiv', '280ComplicationsRDiv', '636ExcessbleedingRDiv', '207MarginfragmantseveredRDiv', '174GlobePunctureRDiv', '175ComplicationsReferralRDiv', '176ReferralHospitalRDiv'];
    elsNo = ['1352ProvidedEpilationConsultationRDiv'];
  }
  value = target.val();
  if (value === '') {

  } else if (value === 'Yes') {
    CoconutUtils.showDivs(elsYes);
    return CoconutUtils.hideDivs(elsNo);
  } else {
    CoconutUtils.showDivs(elsNo);
    return CoconutUtils.hideDivs(elsYes);
  }
};

KiwiUtils.searchForUser = function(searchType, success, error, term1, term2) {
  var endkey, key, users, viewOptions;
  viewOptions = {};
  users = new SecondaryIndexCollection;
  if (searchType === 'by_DOBGenderIndivReg') {
    key = [term1, term2];
    return users.fetch({
      fetch: 'query',
      options: {
        query: {
          key: key,
          include_docs: true,
          fun: searchType
        }
      },
      success: success,
      error: error
    });
  } else {
    key = term1;
    endkey = key + '\uffff';
    return users.fetch({
      fetch: 'query',
      options: {
        query: {
          include_docs: true,
          fun: searchType,
          startkey: key,
          endkey: endkey
        }
      },
      success: success,
      error: error
    });
  }
};
