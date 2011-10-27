--- 
title: Application Design in Coconut
layout: default
category: none
---

##Introduction

Coconut loops through the JSON form definitions to render the forms. 

FormView loads the form.template.html, which provides the formElements div, where each form element is appended. FormView's render
function loops through each of the formElements using the addOne function. AddOne sets up the table and inserts new rows when a formelement's closeRow == "true".
It also renders a few other special widgets, such as headers and hidden fields. 
Most form elements are inserted using the following code:
<pre><code>
currentParent.append((new FormElementView({model: formElement}))
.render().el);
</code>
</pre>
Note how the currentParentName is saved in FormView's currentParentName field - this shows where the element should be appended.

FormElementView renders each element inside a td using the form-element-template, which calls the {{{renderWidget}}} tag.
Handlebars.registerHelper("renderWidget"... in formElementRender.js uses the relevant template based on the inputType for the element. 
Each widget is pre-compiled before the loop:

{% highlight html %}
inputTextWidgetCompiledHtml = Handlebars.compile($("#inputTextWidget")
.html());
datepickerWidgetCompiledHtml = Handlebars.compile($("#datepickerWidget")
.html());
checkboxWidgetCompiledHtml = Handlebars.compile($("#checkboxWidget")
.html());
{% endhighlight %}

Look at the index2.html example. Each widget has its own handlebars.js template (see inputTextWidget). 

{% highlight js %}
<script id="dropdownWidget" type="text/x-handlebars-template">
	<select id='{{ "{{identifier" }}}}' 
	{{ "{{#options" }}}}data-{{ "{{name" }}}}='{{ "{{value" }}}}' 
	{{ "{{/options" }}}} name='{{ "{{identifier" }}}}'>
	{{ "{{dropdown enumerations" }}}}
	{{ "{{/dropdown" }}}}
	</select>
</script>
{% endhighlight %}

Performance test is at http://jsperf.com/test-pre-compiling-handlebars-js-templates

In the current example, the forms are PatientRegistration and ArrestDocket.js.

##How do I customize page flow?
-----------------

app.js constructs the Backbone.Router. List the routes in the routes method:
    
    routes: {
        	"home":                 "home",    // #home
        	"newPatient":                 "newPatient",    // #newPatient
        	"arrestDocket":                 "arrestDocket",    // #arrestDocket
            "*actions": "defaultRoute" // matches http://example.com/#anything-here
        }
     
and create a method for each route:
    
        newPatient: function () {
        	registration = new Form({_id: "PatientRegistration"});
        	registration.fetch({
        		success: function(model){
        			(new FormView({model: model})).render(); 
        		}
        	});
        },