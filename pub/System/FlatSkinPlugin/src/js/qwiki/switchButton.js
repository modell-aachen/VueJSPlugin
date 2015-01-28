jQuery(function($){ 

	//if switch button has to be checked at the beggining,
	// $(".switch input").on("load", function() {}

	$(".switch input").on("change", function() {
		console.log("change");
		$(this).parent().children("span").toggleClass("checkmark");
	});
});