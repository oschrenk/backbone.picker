# README #

`backbone.picker` is a [backbone.js](http://documentcloud.github.com/backbone/) driven replacement for an enhanced (with toggle support) radio button group.

## Idea ##

The `Backbone.View` has an initialize function, drawing the complete option and extending the appropiate elements with some id/classes to identify the option. `zepto.js` than takes care of binding binding `onClick` function to these elements.

Identifying the appropiate pickers will be hard. The first try is using `class` attributes:

	class="picker <id_of_picker> <id_of_option>"
	
The binding function has to relay the `picker_id` and the `option_id`. The appropiate model will be changed, resulting in a call of the `change()` function of the view. All it should do is triggering a re-render of the option group. We can save resurces here by only changing the background color of the appropiate box.

## Problems ##

A challenge is that raphael can't group SVG objects. Therefore I can't really implement the idea of an hierarchy via DOM ids. I have to bind an event to multiple SVG objects. Maybe I can bind multiple `class` attributes to the various SVG elements like so 

	class="picker <id> active"
	
where as the `<id>` is the id of the option group and active is used for the currently selected option. Then I can bind a `click` event to `#canvas .picker .<id>`. 
