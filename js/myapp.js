define([
  'marionette',
  'views/modal/ModalLoginRegion',
  'views/modal/ModalTermsRegion',
  'vent'
  ], function (Marionette, ModalLoginRegion, ModalTermsRegion, vent) {

    // set up the app instance
    var MyApp = new Marionette.Application();

    //https://github.com/t2k/backbone.marionette-RequireJS/blob/master/assetsAMD/js/app.js
    //add regions
    MyApp.addRegions({
      content: '#page',
      navbar: '#signInSpace2',
      outerNavbar: '#navbarContainer',
      modal: ModalLoginRegion
    });

    MyApp.isUserLoggedIn = false;

    // configuration, setting up regions, etc ...

    // export the app from this module
    return MyApp;
});