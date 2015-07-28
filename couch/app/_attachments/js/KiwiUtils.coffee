if typeof window.KiwiUtils == "undefined" || window.KiwiUtils == null
    window.KiwiUtils = {};

KiwiUtils.fetchDistricts = () ->
  if !options
    options = {}
  deferred = $.Deferred();
  #    Coconut.translation = {} if !Coconut.translation
  districts = new Backbone.Model {_id: 'districts'}
  opts =
    _.extend options, opts
  districts.fetch
    success: (record)->
      KiwiUtils.districts = record.toJSON()
      deferred.resolve()

    error: (error, response) ->
      console.log("Unable to fetch districts.  error:" + JSON.stringify(error) + " response: " + response)
  return deferred.promise()

KiwiUtils.toggleAcceptedSurgery = (target) ->
  name = target.attr("name")
#  if name == 'acceptedSurgeryL' || name == 'acceptedSurgeryR'
  if name == 'acceptedSurgeryL'
    elsYes = ['566TypeofOperationLDiv','189ClampusedLDiv','964SutureTypeLDiv','827ComplicationsLDiv','57ExcessbleedingLDiv',
           '533MarginfragmantseveredLDiv','151GlobePunctureLDiv','152ComplicationsReferralLDiv','153ReferralHospitalLDiv']
    elsNo = ['135ProvidedEpilationConsultationLDiv']
  else if name == 'acceptedSurgeryR'
    elsYes = ['47TypeofOperationRDiv','776ClampusedRDiv','985SutureTypeRDiv','280ComplicationsRDiv','636ExcessbleedingRDiv',
           '207MarginfragmantseveredRDiv','174GlobePunctureRDiv','175ComplicationsReferralRDiv','176ReferralHospitalRDiv']
    elsNo = ['1352ProvidedEpilationConsultationRDiv']
  value = target.val()
  if value == ''
  else if value == 'Yes'
    CoconutUtils.showDivs(elsYes)
    CoconutUtils.hideDivs(elsNo)
  else
    CoconutUtils.showDivs(elsNo)
    CoconutUtils.hideDivs(elsYes)
