define([
  'marionette',
  'vent'
  ], function (Marionette, vent) {

    // set up the app instance
    var MyApp = new Marionette.Application();

    //https://github.com/t2k/backbone.marionette-RequireJS/blob/master/assetsAMD/js/app.js
    //add regions
    MyApp.addRegions({
      content: '#page'
    });

    // export the app from this module
    return MyApp;
});