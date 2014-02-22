// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'queryparams'
], function($, _, Backbone,queryparams) {
  
    var AppRouter = Backbone.Router.extend({
    initialize: function() {
      
    },
    routes: {
      // Define URL routes
      'news': 'showNews',
      'store': 'showStore',
      'store/:accountName': 'showProjects',
      'store/:accountName/:projectName': 'showPackages',
      'packages/:id' : 'showPackages',
      'cart': 'showCart',
      'login': 'login',
      'login/forgot' : 'loginForgotPassword',
      'resetPassword/:email/:token' : 'loginForgotPasswordReturn',
      'login/new' : 'loginNewAccount',
      'login/new/:option' : 'loginNewAccount',
      //'newAccount': 'showNewAccount',
      'accountVerify/:email/:token': 'accountVerify',
      //these routes are secure and require a valid session, valid login cookie, or valid login credentials which are verified by the backend
      'user/home' : 'user',
      'user/recordings': 'showRecordings',
      'user/help': 'userHelp',
      'user/account':'userAccount',
      'user/orders':'userOrders',
      // Default
      '*actions': 'defaultAction'
    }
  });


    return AppRouter;

});
