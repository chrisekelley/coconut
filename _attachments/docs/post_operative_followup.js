{
  "_id": "Post-Operative Followup",
  "id": "Post-Operative Followup",
  "noClientPush": "true",
  "safeLabel": "Post-OperativeFollowup",
  "enabled": "true",
  "required": "false",
  "questions": [
  {
    "id": "20",
    "_id": "20",
    "label": "Surgeon",
    "type": "select",
    "repeatable": "false",
    "select-options": "A,B,C,D,E,F,G,H",
    "validation": "",
    "required": "false",
    "safeLabel": "Surgeon"
  },
  {
    "id": "21",
    "_id": "21",
    "label": "Location where service was provided",
    "type": "select",
    "repeatable": "false",
    "select-options": "Household, School, Community, Clinic/hospital",
    "validation": "",
    "required": "false",
    "safeLabel": "serviceLocation"
  },
  {
    "id": "345",
    "_id": "345",
    "label": "Date/Time",
    "type": "date-time",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "DateTime"
  },
  {
    "id": "777",
    "_id": "777",
    "label": "Name of procedure being followed",
    "type": "select",
    "repeatable": "false",
    "select-options": "Hydrocele,Trichiasis",
    "validation": "",
    "required": "true",
    "safeLabel": "Nameofprocedurebeingfollowed"
  },
  {
    "id": "108",
    "_id": "108",
    "label": "Followup date",
    "type": "select",
    "repeatable": "false",
    "select-options": "1 week,2 weeks,1 month,6 months,1 year",
    "validation": "",
    "required": "true",
    "safeLabel": "Followupdate"
  },
  {
    "id": "166",
    "_id": "166",
    "label": "Recurrence",
    "type": "checkbox",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "Recurrence"
  },
  {
    "id": "730",
    "_id": "730",
    "label": "Complications - refer to clinic/hospital",
    "type": "checkbox",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "Complicationsrefertoclinichospital"
  },
  {
    "id": "192",
    "_id": "192",
    "label": "Continue monitoring",
    "type": "checkbox",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "Continuemonitoring"
  },
  {
    "id": "193",
    "_id": "193",
    "label": "Referred to hospital because of complication",
    "type": "checkbox",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "ComplicationsReferralR"
  },
  {
    "id": "194",
    "_id": "194",
    "label": "Referral Hospital",
    "type": "input",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "ReferralHospitalR"
  },
  {
    "id": "915",
    "_id": "915",
    "label": "Complete",
    "type": "checkbox",
    "repeatable": "false",
    "validation": "",
    "required": "true",
    "safeLabel": "CompletedTreatment"
  }
],
  "collection": "question"
}