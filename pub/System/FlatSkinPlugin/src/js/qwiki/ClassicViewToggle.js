jQuery(function($) {
	$(".classic").click(function(){
	$(".flex-box").toggle("hide");
	$(".qw-document-head").attr("display", "none");
	$(".table").toggle("show");
	$(this).attr(display, "flex");

	var el = $("#classic-label");
	if ( el.html() === "Flat View") {
		el.html("Classic View");
	} 
    else { 
    	el.html("Flat View");
	}
	
	});
});
