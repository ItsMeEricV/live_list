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
    modelbinder: 'libs/modelbinder/Backbone.ModelBinder.min',
    //smartystreets: '//d79i1fxsrar4t.cloudfront.net/jquery.liveaddress/2.4/jquery.liveaddress',
    smartystreets: 'libs/smartystreets/liveaddress.min',
    phoneformat: 'libs/phoneformat/PhoneFormat',
    queryparams: 'libs/queryparams/backbone.queryparams',
    videojs: 'libs/videojs/video',
    jqueryPlaceholder: 'libs/jquery/jquery.placeholder',
    modernizr: 'libs/modernizr/modernizr.custom.90981',
    utility: 'libs/utilities/utilities',
    //minified ace files
      //ace: 'libs/ace/ace.min',
      //aceExtra: 'libs/ace/ace-extra.min',
    //full ace files
      ace: 'libs/ace/uncompressed/ace',
      aceExtra: 'libs/ace/uncompressed/ace-extra',
      aceElement: 'libs/ace/ace-elements.min',
      jqueryMobile: 'libs/ace/jquery.mobile.custom.min',
      typeahead: 'libs/ace/typeahead-bs2.min',
      jqueryUITouchPunch: 'libs/ace/jquery.ui.touch-punch.min',
      jquerySlimscroll: 'libs/ace/jquery.slimscroll.min',
      // jqueryEasyPieChart: 'libs/ace/jquery.easy-pie-chart.min',
      // jquerySparkline: 'libs/ace/jquery.sparkline.min',
      // jqueryFlot: 'libs/ace/flot/jquery.flot.min',
      // jqueryFlotPie: 'libs/ace/flot/jquery.flot.pie.min',
      // jqueryFlotResize: 'libs/ace/flot/jquery.flot.resize.min',
      jqueryHotkeys: 'libs/ace/jquery.hotkeys.min',
      jqueryMaskedInput: 'libs/ace/jquery.maskedinput.min',
      bootstrapWysiwyg: 'libs/ace/bootstrap-wysiwyg.min',
    templates: '../templates'
  },
  shim: {
        'bootstrap' : ['jquery'],
        'jqueryDownload' : ['jquery'],
        'jqueryScrollTo' : ['jquery'],
        'jplayer' : ['jquery'],
        'circleplayer' : ['jquery'],
        'grab' : ['jquery'],
        'transform2d' : ['jquery'],
        'smartystreets' : ['jquery'],
        'phoneformat' : [],
        'ace' : ['jquery', 'jqueryUI', 'bootstrap'],
        'aceElement' : ['jquery'],
        'aceExtra' : ['jquery'],
        'jqueryMobile' : ['jquery'],
        'videojs' : ['jquery'],
        'jqueryPlaceholder' : ['jquery']
    },
    marionette: {
      deps : ['jquery', 'underscore', 'backbone'],
      exports : 'Marionette'
    },
    ace: {
        deps: ['jquery', 'aceExtra', 'aceElement', 'bootstrap', 'jqueryMobile', 'jqueryUI', 'typeahead', 'jqueryUITouchPunch','jquerySlimscroll'],
        exports: 'ace'
        //'jqueryEasyPieChart','jqueryFlot','jqueryFlotPie','jqueryFlotResize'
    }

});

require([
  // Load our app module and pass it to our definition function
  'app','jquery', 'jqueryUI', 'bootstrap'

], function(App){

  //TODO: Understand why this command does not work. It always returns a Uncaught TypeError: Cannot call method 'start' of undefined error. But if I put app.start() in app.js it works.
  // return App.start();


});