// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.
require.config({
  waitSeconds: 200,
  paths: {
    jquery: 'libs/jquery/jquery-1.10.2.min',
    jqueryUI: 'libs/jquery/jquery-ui-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    marionette: 'libs/marionette/backbone.marionette.min',
    'backbone.wreqr' : 'libs/marionette/backbone.wreqr.min',
    'backbone.babysitter' : 'libs/marionette/backbone.babysitter.min',
    syphon: 'libs/syphon/backbone.syphon.min',
    json2: 'libs/json2/json2',
    dateFormat: 'libs/jquery/jquery.dateFormat-1.0',
    bootstrap: 'libs/bootstrap/bootstrap-min',
    footable: 'libs/footable/footable',
    fancybox: 'libs/fancybox/jquery.fancybox.pack',
    jplayer: 'libs/jplayer/jquery.jplayer.min',
    jqueryDownload: 'libs/jquery/jquery.fileDownload',
    jqueryScrollTo: 'libs/jquery/jquery-scrollto',
    circleplayer: 'libs/jplayer/circle.player',
    grab: 'libs/jplayer/jquery.grab',
    transform2d: 'libs/jplayer/jquery.transform2d',

    templates: '../templates'
  },
  shim: {
        'bootstrap' : ['jquery'],
    }

});

require([
  // Load our app module and pass it to our definition function
  'app','jquery', 'jqueryUI', 'bootstrap'

], function(App){

  //TODO: Understand why this command does not work. It always returns a Uncaught TypeError: Cannot call method 'start' of undefined error. But if I put app.start() in app.js it works.
  // return App.start();


});