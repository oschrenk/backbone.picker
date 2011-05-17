$(document).ready(function() {

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
			"active": undefined
		},
		size: function() {
			return this.get('options').size();
		}
	});

	var OptionGroupView = Backbone.View.extend({
		el: 'body',
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
		render: function() {
			for (var key in this.boxes) {
				var currentOption = this.model.get('active');
				var isSelected = (currentOption && currentOption.get('value') === key);
				this.boxes[key].attr({
					fill: isSelected ? this.options["selectedBoxColor"] : this.options["notSelectedBoxColor"]
				});
			}
		}
	});

	var width = 768;
	var height = 1024 / 2;
	var canvas = Raphael("canvas", width, height);

	var lowlightOptions = new Options;
	lowlightOptions.add(new Option({
		value: "natural",
		path: "M16,8.286C8.454,8.286,2.5,16,2.5,16s5.954,7.715,13.5,7.715c5.771,0,13.5-7.715,13.5-7.715S21.771,8.286,16,8.286zM16,20.807c-2.649,0-4.807-2.156-4.807-4.807c0-2.65,2.158-4.807,4.807-4.807c2.648,0,4.807,2.158,4.807,4.807C20.807,18.648,18.648,20.807,16,20.807zM16,13.194c-1.549,0-2.806,1.256-2.806,2.806S14.45,18.807,16,18.807S18.807,17.55,18.807,16C18.807,14.451,17.55,13.194,16,13.194z"
	}), {
		silent: true
	});
	lowlightOptions.add(new Option({
		value: "cyberware",
		path: "M 16,8.286 C 8.454,8.286 2.5,16 2.5,16 2.5,16 8.454,23.715 16,23.715 21.771,23.715 29.5,16 29.5,16 29.5,16 21.771,8.286 16,8.286 z m 0,12.521 c -2.649,0 -4.807,-2.156 -4.807,-4.807 0,-2.65 2.158,-4.807 4.807,-4.807 2.648,0 4.807,2.158 4.807,4.807 0,2.648 -2.159,4.807 -4.807,4.807 z m 0,-7.613 c -1.549,0 -2.806,1.256 -2.806,2.806 0,1.55 1.256,2.807 2.806,2.807 1.55,0 2.807,-1.257 2.807,-2.807 0,-1.549 -1.257,-2.806 -2.807,-2.806 z m 9.303912,-11.0687023 0,3 -3,0 0,2 3,0 0,3.0000003 2,0 0,-3.0000003 3,0 0,-2 -3,0 0,-3 z"
	}), {
		silent: true
	});

	var lowlightOptionGroup = new OptionGroup({
		"id": "test",
		"options": lowlightOptions
	});

	var lowlightView = new OptionGroupView({
		model: lowlightOptionGroup,
		paper: canvas
	});
	lowlightView.initialize();

	// normally you would pass the changed attribute as the second parameter
	// but render method can't with undefined values, so we leave it out 
	lowlightOptionGroup.bind('change:active', function(model) {
	 	lowlightView.render();
	});

	$(".picker").bind('click', function(){
		var classes = $(this).attr("class");
		var optionGroup = widgets[getOptionCharacteristic(classes, 'id.')];
		var value = getOptionCharacteristic(classes, 'value.');
		var selectedOption = optionGroup.get('options').select(function(o){ return o.get('value') === value	; })[0];
		var currentOption =  optionGroup.get('active');
		if (currentOption && currentOption.get('value') === value) {
			optionGroup.set({'active': undefined});
		} else {
			optionGroup.set({'active': selectedOption});
		}
	});
	
	var widgets = {};
	widgets["test"] = lowlightOptionGroup;
	
	function getOptionCharacteristic(classes, characteristic) {
		var c = classes.split(' ');
		for (var i = 0, length = c.length; i < length; ++i) {
			if (_(c[i]).startsWith(characteristic)) {
				return c[i].substring(characteristic.length);
			}
		}
		return undefined;
	}

});
