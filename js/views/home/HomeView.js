define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'text!templates/home/homeTemplate.html',
], function($, _, Backbone, Marionette, homeTemplate){

  var HomeView = Marionette.ItemView.extend({
    template: homeTemplate,
    events: {

    },

    initialize: function() {


    },

    onRender: function(){
 
      console.log("rendered!");

    }

  });

  return HomeView;
  
});
