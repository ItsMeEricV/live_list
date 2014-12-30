define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'bootstrap',
  'myapp',
  'simpleStorage'
], function($, _, Backbone, Marionette, bootstrap, app, simpleStorage){

   var ModalDemoRegion = Backbone.Marionette.Region.extend({
    el: "#modal_demo",
 
    constructor: function(){

      this.on("show", this.showModal, this);

    },
 
    getEl: function(selector){
      var $el = $(selector);
      $el.on("hidden", this.destroy);
      return $el;
    },
 
    showModal: function(view){
      this.listenTo(this,"destroy", this.hideModal, this);
      this.$el.modal('show');
    },

    onShow: function() {

      //$ ('.loginUsername').focus();

    },
 
    hideModal: function(){
      simpleStorage.set("live_list_demo_modal",true);
      this.$el.modal('hide');

    }
  });



  return ModalDemoRegion;
});
