define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'jqueryScrollTo',
  'myapp',
  'views/modal/ModalTermsView',
  'views/modal/ModalTermsRegion',
  'queryparams',
  'text!templates/home/homeTemplate.html',
  'ace',
  'aceExtra'
], function($, _, Backbone, Marionette, jqueryScrollTo, app, ModalTermsView, ModalTermsRegion, queryparams, homeTemplate){

  var HomeView = Marionette.ItemView.extend({
    template: homeTemplate,
    events: {

      'click .sampleScroll': 'sampleScroll',
      'click .firstSample': 'firstSample',
      'click .secondSample': 'secondSample',
      'click .purchaseButton' : 'purchase',
      'click #termsOfService' : 'termsOfService',


    },

    initialize: function(data) {

      this.params = data;

    },

    onRender: function(){

      // $('.shoppingCart').fadeOut(400,function() {
      //   $('.navbar-brand').fadeIn(400);
      //   $('.mainNavButtons').fadeIn(400);
      // });

      // $('.nav li').removeClass('active');
      // $('#homeNavButton').addClass('active');

      // //$('#samplesTab a:last').tab('show');
      // $('#samplesTab a:first').tab('show');


      // this.$el.html(homeTemplate);

 
    },
    onShow: function() {
      //$('#firstSample').fadeIn();
      // $('#samplesTab a:first').tab('show');
      //instantiate the modalTerms region. Using the "app" context so that we can close the modal univerally
      app.modalTerms = new ModalTermsRegion();

      if(this.params.terms) {
        this.termsOfService();
      }
    },

    sampleScroll: function() {
      $('#chsSample1').ScrollTo();
    },
    purchase: function(e) {
      e.preventDefault();

      Backbone.history.navigate("store",{trigger:true});
    },
    termsOfService: function(e) {

      if(typeof(e) == "object") e.preventDefault();
      modalTermsView = new ModalTermsView();
      app.modalTerms.show(modalTermsView);
    }
  });

  return HomeView;
  
});
