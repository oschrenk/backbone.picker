$(document).ready(function() {

	var Option = Backbone.Model.extend({
		defaults: {
			"value": undefined,
			"path": undefined,
			"active": false
		}
	});

	var Options = Backbone.Collection.extend({
		model: Option,
		//localStorage: new Store("todos"),
		current: function() {
			return this.filter(function(todo) {
				return todo.get('active');
			});
		},
		url: 'options'
	});

	var OptionGroup = Backbone.Model.extend({
		defaults: {
			"id": undefined,
			"options": undefined
		},
		current: function() {
			return this.get('options').current();
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
		boxes: [],
		events: {},
		initialize: function() {
			var x = this.options['x'];
			var y = this.options['y'];
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

			var clicker = function() {
				if (this.model.get('options').models[i].get('active') === true) {
					this.model.set('options').models[i].get('active') = false;
					boxes[i].attr({
						fill: this.options["notSelectedBoxColor"]
					});
				} else {
					for (j = 0; j < numberOfBoxes; j++) {
						if (j == i) {
							boxes[j].attr({
								fill: this.options["selectedBoxColor"]
							});
						} else {
							boxes[j].attr({
								fill: this.options["notSelectedBoxColor"]
							});
						}
					}
					this.model.select(i);
				};
			};

			for (var i = 0; i < numberOfBoxes; i++) {
				var isFirst = (i == 0);
				var isSelected = (this.model.get('options').models[i].get('active') === true);
				var isLast = (i == numberOfBoxes - 1);

				var tlRadius = isFirst ? this.options["radius"] : 0;
				var trRadius = isLast ? this.options["radius"] : 0;
				var brRadius = isLast ? this.options["radius"] : 0;
				var blRadius = isFirst ? this.options["radius"] : 0;

				this.boxes[i] = paper.roundedRect(
				this.options["x"] + i * this.options["boxWidth"], this.options["y"], this.options["boxWidth"], this.options["boxHeight"], tlRadius, trRadius, brRadius, blRadius).attr({
					fill: isSelected ? this.options["selectedBoxColor"] : this.options["notSelectedBoxColor"],
					"stroke": this.options["strokeColor"],
					"stroke-width": this.options["strokeThickness"]
				});

				paper.path(this.model.get('options').models[i].get('path')).attr(opaque).translate(
				this.options["x"] + i * this.options["boxWidth"] + (this.options["boxWidth"] - this.options["iconWidth"]) / 2, this.options["y"] + (this.options["boxHeight"] - this.options["iconHeight"]) / 2);
			}
		},
		change: function() {
			console.log("change");
		},
		render: function() {

		}
	});

	var width = 768;
	var height = 1024 / 2;
	var canvas = Raphael("canvas", width, height);

	var Application = Backbone.Controller.extend({
		paper: canvas,
		routes: {
			"combat": "combatAction"
		},
		combatAction: function() {
			console.log("foobar");
		}
	});

	AppView = Backbone.View.extend({
		el: $("body"),
		initialize: function() {
			this.weaponTypes = weaponTypes;
		}
	});

	var options = new Options;
	options.add(new Option({
		value: 1,
		path: "M16,8.286C8.454,8.286,2.5,16,2.5,16s5.954,7.715,13.5,7.715c5.771,0,13.5-7.715,13.5-7.715S21.771,8.286,16,8.286zM16,20.807c-2.649,0-4.807-2.156-4.807-4.807c0-2.65,2.158-4.807,4.807-4.807c2.648,0,4.807,2.158,4.807,4.807C20.807,18.648,18.648,20.807,16,20.807zM16,13.194c-1.549,0-2.806,1.256-2.806,2.806S14.45,18.807,16,18.807S18.807,17.55,18.807,16C18.807,14.451,17.55,13.194,16,13.194z"
	}), {
		silent: true
	});
	options.add(new Option({
		value: 2,
		path: "M16,8.286C8.454,8.286,2.5,16,2.5,16s5.954,7.715,13.5,7.715c5.771,0,13.5-7.715,13.5-7.715S21.771,8.286,16,8.286zM16,20.807c-2.649,0-4.807-2.156-4.807-4.807c0-2.65,2.158-4.807,4.807-4.807c2.648,0,4.807,2.158,4.807,4.807C20.807,18.648,18.648,20.807,16,20.807zM16,13.194c-1.549,0-2.806,1.256-2.806,2.806S14.45,18.807,16,18.807S18.807,17.55,18.807,16C18.807,14.451,17.55,13.194,16,13.194z"
	}), {
		silent: true
	});

	var optionGroup = new OptionGroup({
		"id": "test",
		"options": options
	});

	var stuff = new OptionGroupView({
		model: optionGroup,
		paper: canvas
	});
	stuff.initialize();

	//Initiate a new history and controller class
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;

});
