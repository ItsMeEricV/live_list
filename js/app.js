// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'marionette',
  'myapp',
  'router',
  'vent',
  'bootstrap',
  'simpleStorage',
  'utility',
  'views/home/ListsView',
  'views/home/ListItemsView'
], function($, _, Backbone, Marionette, app, AppRouter, vent, bootstrap, simpleStorage, utility, ListsView, ListItemsView){

  var that = this;


  //create unique ID for this app instance so that a live list does not respond to it's own calls
  app.uuid = guid();

  app.on("initialize:before", function(){

    app.slideListsIn = true;

    //if Backbone history has not already been start it then start it
    if(!Backbone.history.started) {
      Backbone.history.start({pushState: true});
    }

    $(document).on('click', 'a:not([data-bypass])', function (evt) {

      var href = $(this).attr('href');
      var protocol = this.protocol + '//';

      if (href.slice(protocol.length) !== protocol) {
        evt.preventDefault();
        app_router.navigate(href, true);
      }
    });
  });


  //DEFINE ROUTES
  var app_router = new AppRouter();

  app_router.on('route:listItemsView', function (id) {
    
    //return the listMode for this list stored on the client. If not previously stored then default is "watch"
    //var listMode = simpleStorage.get('listMode') || 'watch';  //global listMode

    var listMode = 'watch';
    if(!utility.isEmpty(simpleStorage.get(id))) {
      listMode = simpleStorage.get(id).listMode || 'watch';
    }

    var listItemsView = new ListItemsView({id: id,listMode: listMode});
    listItemsView.collection.fetch({
      success: function(data) {
        
        $.each(listItemsView.collection.models, function(i,item) {
          item.set('list_mode',listMode);
        });

        listItemsView.collection.sort();
        app.content.show(listItemsView);
        
      }
    });
    
    

  });

  app_router.on('route:defaultAction', function (actions,params) {

    // We have no matching route, lets display the home page and home navbar
    var listsView = new ListsView();
    app.content.show(listsView);

  });


  /*******************************************/
  //Extra helper functions. Should go in an external file someday

      //prefilter all Ajax requests with the API prefix
      $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
        
        if(options.url.indexOf('7474/live_list') == -1) {
          options.url = '/api/v1' + options.url + '?cid=' + app.uuid;
        }
        
      });


      $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
          if (o[this.name] !== undefined) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
        });
        return o;
      };


      $.fn.animateRotate = function(startAngle, endAngle, duration, easing, complete){
          return this.each(function(){
              var elem = $(this);

              $({deg: startAngle}).animate({deg: endAngle}, {
                  duration: duration,
                  easing: easing,
                  step: function(now){
                      elem.css({
                        '-moz-transform':'rotate('+now+'deg)',
                        '-webkit-transform':'rotate('+now+'deg)',
                        '-o-transform':'rotate('+now+'deg)',
                        '-ms-transform':'rotate('+now+'deg)',
                        'transform':'rotate('+now+'deg)'
                      });
                  },
                  complete: complete || $.noop
              });
          });
      };

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }

  /******************************************/


  //start the app. 
  //TODO This should be in main.js as "App.start()" but it's not working and returns an error.
  app.start();

});
