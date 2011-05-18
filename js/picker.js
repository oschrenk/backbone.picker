var Option = Backbone.Model.extend({
	defaults: {
		"value": undefined,
		"path": undefined
	}
});

var Options = Backbone.Collection.extend({
	model: Option,
	url: 'options'
});

var OptionGroup = Backbone.Model.extend({
	defaults: {
		"id": undefined,
		"options": undefined,
		"active": undefined,
		"defaultValue": undefined
	},
	value: function() {
		if (this.get('active')) {
			return this.get('active').get('value');
		}
		return this.get('defaultValue');
	},
	size: function() {
		return this.get('options').size();
	}
});

var OptionGroupView = Backbone.View.extend({
	options: {
		"x": 0,
		"y": 0,
		"radius": 3,
		"boxWidth": 37,
		"boxHeight": 33,
		"iconWidth": 32,
		"iconHeight": 32,
		"strokeColor": "#262626",
		"strokeThickness": 1,
		"shadowRadiusDisposition": 1,
		"selectedBoxColor": "#585858",
		"notSelectedBoxColor": "#f6f7f6"
	},
	boxes: {},
	initialize: function() {
		var paper = this.options['paper'];
		var numberOfBoxes = this.model.size();
		var transparent = {
			fill: "#000",
			opacity: 0
		};
		var opaque = {
			fill: this.options["strokeColor"],
			stroke: this.options["strokeColor"]
		};

		for (var i = 0; i < numberOfBoxes; i++) {
			var isFirst = (i == 0);
			var isLast = (i == numberOfBoxes - 1);

			var tlRadius = isFirst ? this.options["radius"] : 0;
			var trRadius = isLast ? this.options["radius"] : 0;
			var brRadius = isLast ? this.options["radius"] : 0;
			var blRadius = isFirst ? this.options["radius"] : 0;
			var x = this.options["x"] + i * this.options["boxWidth"];
			var y = this.options['y'];
			var diff = x + (this.options["boxWidth"] - this.options["iconWidth"]) / 2;

			var option = this.model.get('options').models[i];
			var optionValue = option.get('value');
			
			// underlying rounded rectangle indicating state
			// on initialize nothing is selected
			this.boxes[optionValue] = paper.roundedRect(
			x , y, this.options["boxWidth"], this.options["boxHeight"], tlRadius, trRadius, brRadius, blRadius).attr({
				fill: this.options["notSelectedBoxColor"],
				"stroke": this.options["strokeColor"],
				"stroke-width": this.options["strokeThickness"]
			});

			// symbol
			paper.path(option.get('path')).attr(opaque).translate(diff, 0);
		
			// transparent clickable box
			var transparentBox = paper.rect(this.options["x"] + i * this.options["boxWidth"], this.options["y"], this.options["boxWidth"], this.options["boxHeight"]).attr(transparent);
			$(transparentBox.node).attr("class", "picker " + "id." + this.model.id + " value." + option.get('value'));	
		}
	},
	render: function(currentOption) {
		for (var key in this.boxes) {
			var isSelected = (currentOption && currentOption.get('value') === key);
			this.boxes[key].attr({
				fill: isSelected ? this.options["selectedBoxColor"] : this.options["notSelectedBoxColor"]
			});
		}
	}
});