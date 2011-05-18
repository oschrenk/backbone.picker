$(document).ready(function() {

	var width = 200;
	var height = 200 / 2;
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
		"id": "lowlight",
		"options": lowlightOptions,
		"defaultValue": "none"
	});

	var lowlightView = new OptionGroupView({
		model: lowlightOptionGroup,
		paper: canvas
	});
	lowlightView.initialize();

	var widgets = {};
	widgets["lowlight"] = lowlightOptionGroup;

	lowlightOptionGroup.bind('change:active', function(model, currentOption) {
	 	lowlightView.render(currentOption);
	});
	
	lowlightOptionGroup.bind('change:active', function(model) {
		$('#option').html(model.value());
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
