jQuery(function($){ 

 	$('.dashboard-list li').on('click', function(e) {
 		e.preventDefault();
 		var target = $(this).data("target");
 		$(".qw-session-container:not(." + target + ")").removeClass("active");
 		$(".qw-session-toptwo:not(." + target + ")").removeClass("active");
 		$(".qw-session-container." + target).addClass("active");  
 		$(".qw-session-toptwo." + target).addClass("active");
	});
});