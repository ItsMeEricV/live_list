define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'marionette',
  'vent',
  'myapp',
  'nestable',
  'modernizr',
  'autosize',
  'utility',
  'views/home/ListView',
  'text!templates/home/listsTemplate.html',
  'firebase',
  'backfire'
], function($, jqueryui, _, Backbone, Marionette, vent, app, nestable, modernizr, autosize, utility, ListView, listsTemplate){

  var ListsView = Marionette.CompositeView.extend({
    childView: ListView,
    childViewContainer: ".lists",
    template: listsTemplate,
    events: {

      "click .newList" : "newList",
      "click .deleteList" : "deleteList",
      "click .listButton" : "goToList"

    },
    initialize: function() {

      var that = this;

      var List = Backbone.Model.extend({
        //urlRoot: '/lists',
        // parse: function(response) {
        //   response.id = (utility.isEmpty(response._id)) ? response.id : response._id['$oid']
        //   delete response._id;
        //   return response;
        // }
        defaults: {
          title: "Unknown"
        }
      });

      var Lists = Backbone.Firebase.Collection.extend({
        //url: '/lists',
        model: List,
        firebase: app.firebaseURL + '/lists/'
        // parse: function(response) {
        //   // list_items = response.list_items;
        //   // for (var key in list_items) {
        //   //   list_items[key]._id = list_items[key]._id['$oid'];
        //   // }
        //   // console.log(response.list_items);
        //   console.log(response);

        //   return response;
        // }
      });

      this.collection = new Lists();
      this.collection.newLists = 0;
      this.count = 0;
      this.initialLoadComplete = false;

      this.listenTo(this.collection, "sync", this.slideIn, this);
      this.listenTo( this.collection, 'add', _.debounce(_.bind(this.listAdded, this), 250) );

      this.windoWidthBreakPoints = { "xs" : 20, "sm" : 40, "md" : 80, "lg" : 115 }


    },
    onRender: function() {
      
    },
    onShow: function(){
      
      var that = this;

      $('.live_list').css('opacity','1.0');

    },
    slideIn: function() {
      if(!this.collection.length) this.initialLoadComplete = true;

        $.each(this.collection.models,function(i,item) {

          setTimeout(function() {
          
            list = $('div[data-id="' + item.get('id') + '"]');
            list.animate({
              opacity: '1.0',
              // marginLeft: '+=200px',
              // marginRight: '-=200px'
            },500,function() {
              
              $(this).animate({
                opacity: '1.0',
                // marginLeft: '-=40px',
                // marginRight: '+=40px'
              },200);

              //don't do full slide animation next time
              app.slideListsIn = false;

            });
          },100+(i*160));

          //if has "Untitled List" in name then this is a newly created list this hasn't been edit yet. Track this in order to add a unique counting integer to more new lists.
          if(item.get('title').indexOf('Untitled List') > -1) {
            this.collection.newLists += 1;
          }

        });

      // }
      // else {
      //   $('.live_list').animate({
      //     marginLeft: '+=160px',
      //     marginRight: '-=160px'
      //   },0,function() {
          
      //     $(this).animate({
      //       opacity: '1.0'
      //     },200);

      //   });
      // }


    },
    newList: function() {

      var that = this;

      list = this.collection.create({title: "Untitled List " + (this.collection.newLists + 1)});

      //increment newLists
      this.collection.newLists += 1;;

      //immediately route to the newly created list
      Backbone.history.navigate('/lists/' + list.id,{trigger:true});

    },
    goToList: function(e) {

      var id = $(e.currentTarget).data("id");
      Backbone.history.navigate('/lists/' + id,{trigger:true});

    },
    //set a model's options based on it's ID
    setModelById: function(id,attrs) {

      //find the model that matches the currently selected cue
      model = this.collection.where({id: id})[0];
      model.save(attrs, {patch: true});
      this.collection.set(model,{remove: false});

    },
    listAdded: function(item) {
      //check if initial load from Firebase is done. This is needed so that the FINAL model from firebase doesn't not inadvertently call the listAdded function
      if(this.initialLoadComplete) {
        list = $('div[data-id="' + item.id + '"]');
        list.animate({
          // marginLeft: '+=160px',
          // marginRight: '-=160px'
        },0,function() {
          $(this).animate({
          opacity: '1.0',
        },300);
        });
      }
      else {
        this.initialLoadComplete = true;
      }
    }


  });

  return ListsView;
  
});
