;(function ($, _, document, window, undefined) {
    'use strict';

    jQuery('a.foswikiNewLink').livequery(function(){
        $(this).click(function() {
            var $offcanvas = $('.qw-newlink');
            if($offcanvas.length) {
                var $content = $offcanvas.find('.content');
                var $spinner = QWiki.getSpinner();
                $spinner.css('border', '1px solid white').css('border-radius', '3px').css('padding', 5);
                var $wrap = $('<div></div>').css('border', '1px solid black').css('padding', '1px').css('border-radius', '3px').css('display','inline-block').css('position', 'relative').append($spinner);
                var $margin = $('<div></div>').css('text-align', 'center').css('margin-top', 30).append($wrap);
                $content.html('').append($margin);

                var href = $(this).attr('href');
                var sep = (/;/.exec(href))?';':'&';
                href = href.replace(/^[^?]*\??/, '').replace(/#.*/, '');
                href = href.replace(/skin=[^;&]*/, ''); // strip skin, we are going to set it ourselves

                $content.load( foswiki.getPreference('SCRIPTURL') + '/rest' + foswiki.getPreference('SCRIPTSUFFIX') + '/RenderPlugin/template?name=WebCreateNewTopic' + sep + 'topic=' + foswiki.getPreference('WEB') + '/WebCreateNewTopic' + sep + 'expand=webcreatenewtopic%3Abar' + sep + 'render=1' + sep + href );

                $offcanvas.offcanvas({action: 'open'});

                return false;
            } else {
                return true; // fallback to regular WebCreateNewTopic
            }
        });
    });

}(jQuery, window._, window.document, window));
