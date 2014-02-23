define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'text!templates/home/cueTemplate.html'
], function($, _, Backbone, Marionette, cueTemplate){

  var CueView = Marionette.ItemView.extend({
    template: cueTemplate,
    events: {

    },
    //if using a table must uncomment out next line
    //tagName : "tr",

    initialize: function() {

    }

  });

  return CueView;
  
});
