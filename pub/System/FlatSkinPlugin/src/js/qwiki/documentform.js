;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.documentform = {
    name: 'documentform',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      var isEdit = $('body.context-edit').length === 1;
      if ( isEdit ) {
        this.bind();
      }
    },

    bind: function() {
      $('.qw-documentcontrol').on('qw.offcanvas.closing', this, updateForm);
      $('form[name="main"]').submit(function() {
        // apply changes when document control is open and document is being saved.
        if($('.offcanvas-active.documentcontrol').length) {
            cloneForm();
        }
      });

      cloneForm();
      var $changeForm = $('<form></form>').submit(function(){
        cloneForm();
        var $main = $('form[name="main"]');
        $(this).find('input').each(function() {
          var $this = $(this);
          $main.append($('<input type="hidden"/>').attr('name', $this.attr('name')).val($this.val()));
        });

        $main.submit();
        return false;
      });
      $('#qw-documentform input[name="action_replaceform"],#qw-documentform input[name="action_addform"]').wrap($changeForm);
    },

    show: function() {
      $('.qw-documentcontrol').offcanvas({action: 'open'});
    }
  };

  // This will clone the document controls from the rightbar into to form[name="main"]
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

    $('form[name="main"]').find('div.formdataclone').remove();
    $('form[name="main"]').append($formdataclone);
  };

  // Updates the form[name="main"] form with the document controls from the right bar.
  // An event on form[name="main"] will be triggered, that a change has occured.
  var updateForm = function() {
    cloneForm();

    // TODO: trigger only if values actually changed
    $('form[name="main"]').trigger('documentcontrol');
  };
}(jQuery, window._, window.document, window));
