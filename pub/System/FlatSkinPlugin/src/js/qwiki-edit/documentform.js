;(function ($, _, document, window, undefined) {
    'use strict';

    // This will clone the document controls from the rightbar into to #main
    // form.
    var cloneForm = function() {
            var $original = $('#qw-documentform .foswikiForm');

            var $formdataclone = $('<div></div>').addClass('formdataclone').hide();
            $formdataclone.find('form').remove();
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
        $('.qw-documentcontrol').on('qw.offcanvas.closing', updateForm);
        cloneForm();
        var $changeForm = $('<form></form>').submit(function(){
            cloneForm();
            var $main = $('form#main');
            $(this).find('input').each(function() {
                var $this = $(this);
                $main.append($('<input type="hidden"/>').attr('name', $this.attr('name')).val($this.val()));
            });
            $main.submit();
            return false;
        });
        $('#qw-documentform input[name="action_replaceform"]').wrap($changeForm);
    });
}(jQuery, window._, window.document, window));
