jQuery(function($){ 

	$(".switch input").on("change", function() {
		$(this).parent().children("span").toggleClass("checkmark");
	});

	// initialize checkboxes
	$(".switch input").each(function() {
		var $this = $(this);
		if($this.attr('checked')) {
			$this.parent().children("span").addClass("checkmark");
		}
	});
});
