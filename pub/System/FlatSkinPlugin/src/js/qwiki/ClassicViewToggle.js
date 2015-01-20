jQuery(function($) {
	$(".classic").click(function() {
		var $this = $(this);
		$(".qw-document-head").toggleClass("move");
		var el = $("#classic-label");
		if ( el.text() === "Reduced View") {
			el.text("Classic View");
			
		} 
	    else { 
	    	el.text("Reduced View");
		}
	
	});
});




