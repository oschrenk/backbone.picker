# README #

`backbone.picker` is a [backbone.js](http://documentcloud.github.com/backbone/) driven replacement for an enhanced (with toggle support) radio button group.

## Problems ##

### raphael.js ###

A challenge is that raphael can't group SVG objects. Therefore I can't really implement the idea of an hierarchy via DOM ids. I have to bind an event to multiple SVG objects. Maybe I can bind multiple `class` attributes to the various SVG elements like so 

	class="picker <id> active"
	
where as the `<id>` is the id of the option group and active is used for the currently selected option. Then I can bind a `click` event to `#canvas .picker .<id>`. 