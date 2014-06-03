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
  'jquery-cookie',
  'views/home/ListView',
  'text!templates/home/listsTemplate.html',
  'fh'
], function($, jqueryui, _, Backbone, Marionette, vent, app, nestable, modernizr, autosize, utility, jqueryCookie, ListView, listsTemplate){

  var ListsView = Marionette.CompositeView.extend({
    itemView: ListView,
    itemViewContainer: ".lists",
    template: listsTemplate,
    events: {

      "click .newList" : "newList",
      "click .deleteList" : "deleteList",
      "click .listButton" : "goToList"

    },

    initialize: function(data) {

      var that = this;

      // this.listenTo(vent, "goToKeyUp", this.checkKeyUp, this);
      // _.bindAll(this, 'checkKeyUp');
      // $(document).bind('keyup', this.checkKeyUp);

      var List = Backbone.Model.extend({
        urlRoot: '/lists',
        parse: function(response) {
          response.id = (utility.isEmpty(response._id)) ? response.id : response._id['$oid']
          delete response._id;
          return response;
        }
      });

      var list = new List({
        //text that shows in the item text body
        id: 123,
        title: "Unknown",
      });


      var Lists = Backbone.Collection.extend({
        //localStorage: new Backbone.LocalStorage("CueCollection")
        url: '/lists',
        model: List,
        parse: function(response) {
          // list_items = response.list_items;
          // for (var key in list_items) {
          //   list_items[key]._id = list_items[key]._id['$oid'];
          // }
          // console.log(response.list_items);

          return response
        }
      });

      this.collection = new Lists();

      this.collection.fetch({
        reset: true,
        success: function() {

          if(app.slideListsIn) {
            $.each(that.collection.models,function(i,item) {

              setTimeout(function() {
              
                list = $('div[data-id="' + item.get('id') + '"]');
                list.animate({
                  opacity: '1.0',
                  marginLeft: '+=200px',
                  marginRight: '-=200px'
                },500,function() {
                  
                  $(this).animate({
                    opacity: '1.0',
                    marginLeft: '-=40px',
                    marginRight: '+=40px'
                  },200);

                  //don't do full slide animation next time
                  app.slideListsIn = false;

                });
              },100+(i*160));

            });
          }
          else {
              
            $('.live_list').animate({
              marginLeft: '+=160px',
              marginRight: '-=160px'
            },0,function() {
              
              $(this).animate({
                opacity: '1.0'
              },200);

            });
          }

        }
      });

      this.listenTo(this.collection, "reset", this.render, this);

      //this.listenTo(this.collection, "add", this.render, this);

      this.windoWidthBreakPoints = { "xs" : 20, "sm" : 40, "md" : 80, "lg" : 115 }

    },
    onRender: function() {


    },

    onShow: function(){
      
      var that = this;





    },

    newList: function() {

      //list = new Backbone.Model({title: "New List"});
      this.collection.create({title: "new list"}, 
        {
          wait: true,
          success: function(model) {
        
            list = $('div[data-id="' + model.get('id') + '"]');
              
              list.animate({
                // opacity: '1.0',
                marginLeft: '+=160px',
                marginRight: '-=160px'
              },0,function() {
                
                $(this).animate({
                  opacity: '1.0',
                  // marginLeft: '-=40px',
                  // marginRight: '+=40px'
                },300);

              });
          }}
        );

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

    }
  });

  return ListsView;
  
});
