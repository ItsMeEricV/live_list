define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'bootstrap',
  'myapp',
  'vent',
  'views/modals/ModalDemoRegion',
  'text!templates/modals/modalDemoTemplate.html'
], function($, _, Backbone, Marionette, bootstrap, app, vent, ModalDemoRegion, modalDemoTemplate){

  var ModalDemoView = Marionette.ItemView.extend({
    template: modalDemoTemplate,
    events: {

      'click .termsOk': 'termsOk',
      'click .close': 'termsOk'

    },
    initialize: function() {

      //listen for keyUps for making new list items and sections
      _.bindAll(this, 'checkKeyUp');
      $(document).bind('keyup', this.checkKeyUp);

    },
    onShow: function() {
      // fragment = Backbone.history.fragment;
      // Backbone.history.navigate(fragment+"/terms");

    },

    termsOk: function() {
      //destroy the modal dialog
      app.modalDemo.destroy(this);
    },
    checkKeyUp: function(e) {
      //if escape key is typed then close modal
      if(e.keyCode === 27) {
        app.modalDemo.destroy(this);
      }
    }
  });

  return ModalDemoView;
});
