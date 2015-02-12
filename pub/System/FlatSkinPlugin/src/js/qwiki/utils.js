;(function ($, _, document, window, undefined) {
  'use strict';

  QWiki.plugins.utils = {
    name: 'utils',

    init: function( options ) {
      if ( typeof options === 'object' ) {
        $.extend( this, options );
      }

      this.bind();
    },

    bind: function() {
      this.unbind();

      $('[data-split-string]').each( function() {
        splitString( this, $(this).data('pattern') );
      });

      $('[data-submit-form]').on('click', this, submitForm );
      $('[data-cancel-form]').on('click', this, cancelForm );
    },

    unbind: function() {
      $('[data-submit-form]').off('click', submitForm );
      $('[data-cancel-form]').off('click', cancelForm );
    }
  };

  var submitForm = function( evt ) {
    var self = evt.data;
    var $sender = $(this);

    var target = $sender.data('submit-form');
    if ( !target ) {
      return false;
    }

    $.blockUI();
    $('form' + target).submit();
    return false;
  };

  var cancelForm = function( evt ) {
    var self = evt.data;
    var $sender = $(this);

    var target = $sender.data('cancel-form');
    if ( !target ) {
      return false;
    }
    var $originalForm = $('form' + target);

    // building a new form, so we do not have to modify the original one and
    // do not submit all the text/data
    var $form = $('<form method="post"></form>');
    $form.attr('action', $originalForm.attr('action'));
    $form.append('<input type="hidden" name="action_cancel" value="cancel" />');
    $.each(["redirectto", "topicparent", "newtopic"], function(idx, item) {
      var $item = $originalForm.find("input[name='" + item + "']");
      if($item.length) {
        $form.append($item.clone());
      }
    });
    $('body').append($form);
    $form.submit();
    return false;
  };

  var splitString = function( elem, pattern ) {
    if ( !pattern ) {
      return;
    }

    var $self = $(elem);
    var text = $self.data( 'origText' );

    if ( !text ) {
      text = $self.text();
      $self.data( 'origText', text );
    }

    var regex = new RegExp( pattern );
    if ( regex.test( text ) === false ) {
      return;
    }

    var parts = text.split( regex );
    $self.text( parts.join( ' ' ) );
  };

}(jQuery, window._, window.document, window));
