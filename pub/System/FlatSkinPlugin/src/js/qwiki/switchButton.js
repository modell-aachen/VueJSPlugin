jQuery(function($){ 

	$(".switch input").on("change", function() {
		var $this = $(this);
		var $spans = $(this).parent().children("span");
		if($this.attr('checked')) {
			$spans.addClass("checkmark");
		} else {
			$spans.removeClass("checkmark");
		}
	});

	// initialize checkboxes
	$(".switch input").each(function() {
		var $this = $(this);
		if($this.attr('checked')) {
			$this.parent().children("span").addClass("checkmark");
		}
	});
});
