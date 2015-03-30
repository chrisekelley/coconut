# Explanation of forms and form markup

## Form Markup

admin_reg.js is for the users of the app - in your case, the midwives, nurses, or doctors who would be entering data into the app.

indiv_reg.js is for the patient registration

trichiasis_surg.js is an example of the patient encounter form.

Here is an example of some of the markup from trichiasis_surgery.js:

     "_id": "Trichiasis Surgery",
      "_rev": "2-5c44d63968d07e1c9f97605d3d1de2e0",
      "id": "Trichiasis Surgery",
      "noClientPush": "true",
      "enabled": "true",
      "required": "false",
      "safeLabel": "trichiasisSurgery",
      "questions": [
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

Rename the file and the '_id' and 'id' fields to whatever your form is about. Remove the '_rev' field - it is created by couchdb and is changed with each version.
 Name the safeLabel the same as your db table name (no spaces).

Note the different types of field types: input, select, date-time, checkbox, header, and subheader.
The last two types - header and subheader - are display only, to denote different sections in a form. I currently do not use the repeatable or validation fields.

## i18n - Supporting multiple languages

If your app needs translations, you'll need to have the translation files in the i18n directory. Each label and select option
will need a translation:

(from pt_PT.coffee:)

Labels:

    "Home": "Início"
    "Sync": "Sinc"
    "Scanner": "Scan"

Select label and options. Note that select options have a "::"" between the label and the option:

    "Followupdate": "Data de Visita de Acompanhamento"
    "Followupdate::1 week": "1 semana"
    "Followupdate::2 weeks": "2 semanas"
    "Followupdate::1 month": "1 mês"

