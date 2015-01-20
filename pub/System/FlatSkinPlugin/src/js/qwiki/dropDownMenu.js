
jQuery(function($){ 
	$('.qw-more-menu  > li').bind('mouseover', openSubMenu);
	$('.qw-more-menu  > li').bind('mouseout', closeSubMenu);
		
		function openSubMenu() {
			$(this).find('ul').css('visibility', 'visible');	
		}
		
		function closeSubMenu() {
			$(this).find('ul').css('visibility', 'hidden');	
		}

	
});