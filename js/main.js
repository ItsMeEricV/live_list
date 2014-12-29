require.config({
  waitSeconds: 200,
  paths: {
    jquery: 'libs/jquery/dist/jquery',
    jqueryui: 'libs/jqueryui/ui/jquery-ui',
    backbone: 'libs/backbone-amd/backbone',
    underscore: 'libs/underscore-amd/underscore',
    marionette: 'libs/marionette/lib/backbone.marionette',
    'backbone.wreqr' : 'libs/backbone.wreqr/lib/backbone.wreqr',
    'backbone.babysitter' : 'libs/backbone.babysitter/lib/backbone.babysitter',
    bootstrap: 'libs/bootstrap/dist/js/bootstrap',
    nestable : 'libs/nestable/jquery.nestable',
    modernizr: 'libs/modernizr/modernizr',
    autosize: 'libs/jquery-autosize/jquery.autosize',
    //localstorage: 'libs/backbone.localstorage/backbone.localStorage',
    'bootstrap-switch' : 'libs/bootstrap-switch/dist/js/bootstrap-switch',
    utility: 'libs/utilities/utilities',
    tock: 'libs/tock_ejvaudio/tock',
    flippy: 'libs/flippy/jquery.flippy',
    simpleStorage: 'libs/simpleStorage/simpleStorage',
    ScrollTo: 'libs/jquery-scrollto/jquery-scrollto',
    viewport: 'libs/jquery-viewport/jquery.viewport',
    firebase: 'https://cdn.firebase.com/js/client/2.0.3/firebase',
    backfire: 'https://cdn.firebase.com/libs/backfire/0.4.0/backfire',
    templates: '../templates'
  },
  shim: {
    'bootstrap' : ['jquery'],
    'nestable' : ['jquery'],
    'modernizr' : ['jquery'],
    'autosize' : ['jquery'],
    'flippy' : ['jquery'],
    'viewport' : ['jquery'],
    'firebase' : ['jquery'],
    'backfire' : ['jquery']
  }

});

require([
  // Load our app module and pass it to our definition function
  'app','jquery','bootstrap'

], function(App){

  //TODO: Understand why this command does not work. It always returns a Uncaught TypeError: Cannot call method 'start' of undefined error. But if I put app.start() in app.js it works.
  // return App.start();


});