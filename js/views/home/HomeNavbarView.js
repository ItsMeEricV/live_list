define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'text!templates/home/homeNavbarLayoutTemplate.html'
], function($, _, Backbone, Marionette, homeNavbarLayoutTemplate){

  var HomeNavbarView = Marionette.ItemView.extend({
    template: homeNavbarLayoutTemplate,
    events: {

      'a .click' : 'prevent'

    },
    initialize: function(data) {
      // this.showChoice = data.showChoice;
      // this.hideChoice = (this.showChoice === "mainNavButtons") ? "shoppingCart" : "mainNavButtons";
      // console.log(this.hideChoice);
      // console.log(this.showChoice);
    },

    onRender: function(){
   

 
    },
    onShow: function() {

      // if(this.showChoice === "shoppingCart") $('.navbar-brand').hide();   
      
      // if(!$('.'+ this.showChoice).is(':visible')) {     
      //   // $('.' + this.hideChoice).fadeOut(400, function() {
      //   //   $('.' + this.showChoice).fadeIn(400);
      //   // });
      //   $('.' + this.hideChoice).hide();
      //   $('.' + this.showChoice).show();
 
      // }

    },
    prevent: function(e) {
      e.prevenDefault();
    }
  });

  return HomeNavbarView;
  
});
