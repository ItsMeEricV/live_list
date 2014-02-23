// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  
    var AppRouter = Backbone.Router.extend({
    initialize: function() {
      
    },
    routes: {
      // Define URL routes
      
      // Default
      '*actions': 'defaultAction'
    }
  });


    return AppRouter;

});
