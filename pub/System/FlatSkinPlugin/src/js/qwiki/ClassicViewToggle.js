/*jQuery(function($) {
	$(".classic").click(function() {
		$(".qw-document-head").css("transform", "translate3D(0, -65px, 0)");
		$(".classic").css("right","0");
		$(".classic").css("transform", "translate3D(-2px, 56px, 0)");
		var el = $("#classic-label");
		if ( el.html() === "Reduced View") {
			el.html("Classic View");
			$(".qw-document-head").css("min-height" , "60px");
			$(".qw-document-head").css("transform", "translate3D(0, 0, 0)");
	        $(".qw-document-head").css("background-color", "#F5F5F5");
	        $(".classic").css("transform", "translate3D(0, -9px, 0)");
	        $(".content").css("transform","translate3D(0, 0,0)");
		} 
	    else { 
	    	el.html("Reduced View");
	    	$(".qw-document-head").css("min-height" , "173px");
	    	$(".qw-document-head").css("background-color", "white");
	    	$(".qw-document-head").css("padding-top","0.4rem");
	    	$(".qw-page").find(".content").css("transform","translate3D(0, -72px,0)"); 	
		}
		
	});
});*/



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




