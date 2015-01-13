jQuery(function($) {
	$(".classic").click(function(){
	$(".flex-box").slideToggle("hide");
	$(".table").slideToggle("show");
	
	var el = $("#classic-label");
	if ( el.html() === "Flat View") {
		el.html("Classic View");
	} 
    else { 
    	el.html("Flat View");
	}
	
	});
});
