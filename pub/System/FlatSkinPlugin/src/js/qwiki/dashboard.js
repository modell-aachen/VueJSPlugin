jQuery(function($){ 

 	$('.dashboard-list li').on('click', function(e) {
 		e.preventDefault();
 		var target = $(this).data("target");
 		$(".qw-dashboard-container:not(." + target + ")").removeClass("active");
 		$(".qw-dashboard-toptwo:not(." + target + ")").removeClass("active");
 		$(".qw-dashboard-container." + target).addClass("active");  
 		$(".qw-dashboard-toptwo." + target).addClass("active");
	});
});