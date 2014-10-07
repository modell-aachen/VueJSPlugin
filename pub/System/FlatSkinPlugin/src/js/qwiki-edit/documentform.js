;(function ($, _, document, window, undefined) {
    'use strict';

    // This will clone the document controls from the rightbar into to #main
    // form.
    var cloneForm = function() {
            var $original = $('#qw-documentform .foswikiForm');

            var $formdataclone = $('<div></div>').addClass('formdataclone').hide();
            $formdataclone.append($original.clone());

            // for some reason the cloned selects do not have the 'selected' set
            $formdataclone.find('select').each(function(idx, item) {
                var $select = $(item);
                var name = $select.attr('name');
                if(!name.length) {
                    return;
                }

                var $hidden = $('<input type="hidden">');
                $hidden.attr('name', name);
                $hidden.val($original.find('select[name="'+name+'"]').val());

                $select.replaceWith($hidden);
            });

            $('form#main').find('div.formdataclone').remove();
            $('form#main').append($formdataclone);
    };

    // Updates the #main form with the document controls from the right bar.
    // An event on #main will be triggered, that a change has occured.
    var updateForm = function() {
        cloneForm();

        // TODO: trigger only if values actually changed
        $('#main').trigger('documentcontrol');
    };

    // Sets up the #main form with the document control data and binds the
    // rightbar, so it updates #main when data changes.
    $(function($){
        $('#qw-documentform').on('qw.sidebar.closing', updateForm);
        cloneForm();
    });
}(jQuery, window._, window.document, window));
