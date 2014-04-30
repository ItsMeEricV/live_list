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
          console.log(that.collection);

          // that.render();
          // that.onShow();

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
              });

              



            },100+(i*160));

          });
        }
      });

      this.listenTo(this.collection, "reset", this.render, this);

      // new Firehose.Consumer({
      //   uri: '//192.168.60.20:7474/live_list',
      //   message: function(json){
      //     console.log(json);
      //     // console.log(that.collection);
      //     if(json.cid !== app.uuid) {
      //       switch(json.action) {

      //         case "update":
      //           $('li[data-id="' + json.id + '"]').find('textarea').css("background-color","#FFF");
                
      //           //do check to make sure that this is not a "last message in the pipe" from Firehose. This protects double messages upload page reload
      //           model = that.collection.where({id: json.id})[0];
                
      //           if(json.action !== model.get("action_id")) {
      //             model.set(json);
      //             that.collection.sort();
      //             that.render();
      //             that.onShow();
      //           }


      //           break;

      //         case "add":
      //           that.collection.add(json);
      //           break;

      //         case "delete":

      //           //$('li[data-id="' + json.id + '"]')
      //           model = that.collection.where({id:json.id})[0];
      //           that.collection.remove(model);

      //           break;

      //       }

            
      //     }
      //   },
      //   connected: function(){
      //     console.log("Great Scotts!! We're connected!");
      //   },
      //   disconnected: function(){
      //     console.log("Well shucks, we're not connected anymore");
      //   },
      //   error: function(){
      //     console.log("Well then, something went horribly wrong.");
      //   }
      // }).connect();




      //this.listenTo(this.collection, "add", this.render, this);

      this.windoWidthBreakPoints = { "xs" : 20, "sm" : 40, "md" : 80, "lg" : 115 }

    },
    onRender: function() {


    },

    onShow: function(){
      
      var that = this;





    },

    goToList: function(e) {

      var id = $(e.currentTarget).data("id");
      Backbone.history.navigate('/lists/' + id,{trigger:true});

    },
    //add a new cue to the list
    newCue: function() {

      var that = this;

      cueCount = this.collection.where({list_type:"item"}).length;
      // newOrder = (this.collection.length) ? this.collection.length + 1 : 0;

      item = new Backbone.Model({index: cueCount+1, order: this.collection.length, list_type: "item", selected: false, title: ""});

      this.collection.create(item,{
        success: function(item) {

          that.render();
          that.onShow();

          that.newCueWasMade = true;
          $("li[data-id=" + item.id + "]").find('.form-control').focus();
        }
      });



    }, 
    //delete a cue
    deleteCue: function() {

      //model = this.collection.where({selected: true})[0];
      orderToBeDeleted = this.prevSelectedModel.get("order");
      typeToBeDeleted = this.prevSelectedModel.get("list_type");

      console.log(orderToBeDeleted);
      this.prevSelectedModel.destroy();

      $.each(this.collection.models,function(i,item) {

        if(item.get("order") > orderToBeDeleted) {
          newOrder = item.get("order") - 1
          //item.set("order", item.get("order") - 1);

          attrs = {"order":newOrder};

          if(typeToBeDeleted === "item" && item.get("list_type") === "item") {
            newIndex = item.get("index") - 1
            //item.set("index", item.get("index") - 1);
            attrs = {"order":newOrder, "index": newIndex};
          }

          item.save(attrs, {patch: true});
        }


        //item.save();
        

      });
      
      this.render();
      this.onShow();


    },
    //set a model's options based on it's ID
    setModelById: function(id,attrs) {

      //find the model that matches the currently selected cue
      model = this.collection.where({id: id})[0];
      //set new attributes and merge back to the collection. Using remove: false so we don't remove the unmodified models
      // for (var newValue in options.values) {
      //   model.set(options.values[newValue].key, options.values[newValue].value);
      // }
      // console.log(model);
      model.save(attrs, {patch: true});
      this.collection.set(model,{remove: false});

    }
  });

  return ListsView;
  
});
