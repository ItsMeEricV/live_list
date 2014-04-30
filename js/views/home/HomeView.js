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
  'bootstrap-switch',
  'utility',
  'jquery-cookie',
  'views/home/CueView',
  'text!templates/home/homeTemplate.html',
  'fh',
  'tock',
  'flippy'
], function($, jqueryui, _, Backbone, Marionette, vent, app, nestable, modernizr, autosize, bootstrapSwitch, utility, jqueryCookie, CueView, homeTemplate){

  var HomeView = Marionette.CompositeView.extend({
    itemView: CueView,
    itemViewContainer: ".dd-list",
    template: homeTemplate,
    events: {

      "click .newCue" : "newCue",
      "click .deleteCue" : "deleteCue",
      "click .newSection" : "newSection",
      "focus .descriptionTextarea" : "selectCue",
      "blur .cue-description" : "blurCue",
      "keydown .form-control" : "checkKeyDown",
      "mouseup .bootstrap-switch" : "switchMouseUp",
      "click .toggleTimer" : "toggleTimer"
      //"switchChange.bootstrapSwitch #live-edit-switch" : "switch"
      //"keyup .cue-description" : "descriptionSize"
      //"click .dd3-content" : "toggleCue",
      //"click .dd3-section-content" : "toggleCue"

    },

    initialize: function(data) {

      var that = this;

      // this.listenTo(vent, "goToKeyUp", this.checkKeyUp, this);
      _.bindAll(this, 'checkKeyUp');
      $(document).bind('keyup', this.checkKeyUp);

      var ListItem = Backbone.Model.extend({
        urlRoot: '/lists/535164067072651d55010000/',
        parse: function(response) {
          response.id = (utility.isEmpty(response._id)) ? response.id : response._id['$oid']
          delete response._id;
          return response;
        }
      });

      var listItem = new ListItem({
        id: 1,
        //numerical display for items. This number is not used for sections.
        index: 0,
        //absolute order in the list. Is not used for display, only for ordering on screen
        order: 0,
        //text that shows in the item text body
        title: "Unknown",
        //can be item or section
        list_type: "item"
      });


      var ListItems = Backbone.Collection.extend({
        //localStorage: new Backbone.LocalStorage("CueCollection")
        url: '/lists/' + data.id,
        model: ListItem,
        parse: function(response) {
          // list_items = response.list_items;
          // for (var key in list_items) {
          //   list_items[key]._id = list_items[key]._id['$oid'];
          // }
          // console.log(response.list_items);
          that.timer = response.timer;
          return response.list_items
        }
      });

      new Firehose.Consumer({
        uri: '//192.168.60.20:7474/live_list',
        message: function(json){
          console.log(json);
          // console.log(that.collection);
          if(json.cid !== app.uuid) {
            switch(json.action) {

              case "select":
                //set all items to white
                $('li').find('textarea').css("background-color","white");
                //show the selected one
                $('li[data-id="' + json.id + '"]').find('textarea').css("background-color","#c79595");
                break;

              case "update":
                $('li[data-id="' + json.id + '"]').find('textarea').css("background-color","#FFF");
                
                //do check to make sure that this is not a "last message in the pipe" from Firehose. This protects double messages upload page reload
                model = that.collection.where({id: json.id})[0];
                
                if(json.action !== model.get("action_id")) {
                  model.set(json);
                  that.collection.sort();
                  that.render();
                  that.onShow();
                }


                break;

              case "add":
                that.collection.add(json);
                break;

              case "delete":

                //$('li[data-id="' + json.id + '"]')
                model = that.collection.where({id:json.id})[0];
                that.collection.remove(model);

                break;

            }

            
          }
        },
        connected: function(){
          console.log("Great Scotts!! We're connected!");
        },
        disconnected: function(){
          console.log("Well shucks, we're not connected anymore");
        },
        error: function(){
          console.log("Well then, something went horribly wrong.");
        }
      }).connect();



      this.collection = new ListItems();

      this.newCueWasMade = false;
      this.switchIsDrawn = false;
      this.switchState = false;
      this.timer = new Object();
      this.timer.state = "stopped";

      this.collection.comparator = "order"; 

      this.collection.fetch({
        success: function() {
          that.collection.sort();

          that.render();
          that.onShow();
        }
      });

      //this.listenTo(this.collection, "add", this.render, this);

      this.windoWidthBreakPoints = { "xs" : 20, "sm" : 40, "md" : 80, "lg" : 115 }
      this.defaultDescHeight = 40;
      this.wasEscKey = "no";

    },
    onRender: function() {

    },

    onShow: function(){
      
      var that = this;

      console.log(typeof $('#clock').val());
      console.log(typeof "00:00:01");

      //handle timer state
      if(this.timer.state === "stopped") {
        $('#toggleTimer').addClass('btn-success').html('GO!!');
      }
      else {
        $('#toggleTimer').addClass('btn-danger').html('Pause');
        var tock = new Tock({
          callback: function () {
            $('#clock').val(tock.msToSimpleTime(tock.lap() + tock.timeToMS("00:00:01")));
          }
        });

        tock.start($('#clock').val());
      }

      $('.dd').nestable({ 
        
        callback: function(l,e) {
          // l is the main container
          // e is the element that was moved

          console.log("in nestable callback");

          cues = $('.dd').nestable('serialize');

          idThatMoved = e.data('id');
          typeThatMoved = e.data('list_type');

          cueIndexTracker = 0;
          for (var key in cues) {
            // console.log(key);
            if(cues[key].list_type === "item") {
              cueIndexTracker += 1;
            }
            
            if(cues[key].id === idThatMoved) {
              
              newIndex = cueIndexTracker;
              oldIndex = parseInt(cues[key].index);
              newOrder = parseInt(key);
              oldOrder = parseInt(cues[key].order);

              console.log("newIndex: "+newIndex);
              console.log("oldIndex: "+oldIndex);
              console.log("newOrder: "+newOrder);
              console.log("oldOrder: "+oldOrder);
              console.log("idThatMoved: "+idThatMoved);
              console.log("typeThatMoved: "+typeThatMoved);
            }
          }

          moveDirection = (newOrder > oldOrder) ? "higher" : "lower";
          console.log(moveDirection);
          count = 0;
          
          
          $.each(that.collection.models,function(i,item) {
            attrs = {};
            currentOrder = item.get("order");
            currentIndex = item.get("index");
            if(moveDirection === "lower") {
              //if item isn't the one that moved but it's within the reordering range then set new order
              //the "reordering range" is if it's (1) greater than or equal to the new order spot of the moved item
              //                                  (2) less than the old order spot of the moved item
              if(item.get("id") !== idThatMoved && item.get("order") >= newOrder && item.get("order") < oldOrder) {
                attrs["order"] = (currentOrder + 1);
                //item.set("order",currentOrder + 1);
                if(item.get("title") == "carrot") {
                  console.log("IT'S A CARROT!");
                }
                console.log("TITLE IS: " +item.get("title") + " and I'm in the order add one if");
              }

              //if item is a item and a item was moved
              if(item.get("list_type") === "item" && typeThatMoved === "item") {
                //if item isn't the cue that moved and it's within the reindexing range then change it
                if(item.get("id") !== idThatMoved && item.get("index") >= newIndex && item.get("index") < oldIndex ) {
                  attrs["index"] = (currentIndex + 1);
                  //item.set("index",currentIndex + 1);
                }
                else if(item.get("id") === idThatMoved) {  //if it is the one that moved then set it to the new values reported by netstable's callback
                  //item.set("index",newIndex);
                  //item.set("order",newOrder);
                  attrs = {"index" : newIndex,"order":newOrder};
                }
              }
              else { //if a section moved
                if(item.get("id") === idThatMoved) {
                  //item.set("order",newOrder);
                  attrs["order"] = newOrder;
                }
              }
            }
            else { // moveDirection is higher
              if(item.get("id") !== idThatMoved && item.get("order") <= newOrder && item.get("order") > oldOrder) {
                attrs["order"] = (currentOrder - 1);
                //item.set("order",currentOrder - 1);
                if(item.get("title") == "carrot") {
                  console.log("IT'S A CARROT!");
                }
                console.log("TITLE IS: " +item.get("title") + " and I'm in the order subtract one if");
              }

              if(item.get("list_type") === "item" && typeThatMoved === "item") {
                if(item.get("id") !== idThatMoved && item.get("index") <= newIndex && item.get("index") > oldIndex ) {
                  attrs["index"] = (currentIndex - 1);
                  //item.set("index",currentIndex - 1);
                }
                else if(item.get("id") === idThatMoved) {
                  //item.set("index",newIndex);
                  //item.set("order",newOrder);
                  attrs = {"index" : newIndex,"order":newOrder};
                }
              }
              else { //if a section moved
                if(item.get("id") === idThatMoved) {
                  //item.set("order",newOrder);
                  attrs["order"] = newOrder;
                }
              }
            }

            //update model if it needs updating
            if(!utility.isEmpty(attrs)) {
              item.save(attrs,{patch:true});
              // console.log("TITLE IS: " +item.get("title"));
              // console.log(attrs);
            }

          });

          that.collection.sort();

          that.render();
          that.onShow();
          that.showSwitch();

        }

        

      });

      //autosize the textarea and its container
      $('textarea').autosize({
        callback: function() {
          $(this).closest('.cue-description').css("height", parseInt($(this).css("height")) + 2 );
        }
      });

      this.showSwitch();

    },
    showSwitch: function() {

      var that = this;
        $('#live-edit-switch').bootstrapSwitch('state',this.switchState);
        $('.bootstrap-switch').addClass('pull-right');
        this.switchIsDrawn = true;

        $('#live-edit-switch').on('switchChange.bootstrapSwitch', function(event, state) {
          that.switchState = state;
          that.toggleState(state);
        });
    },
    toggleState: function(state) {
      //state == true then we are in "live" mode
      //state == false then we are in "edit" mode

      if(state) {
        $.each(this.collection.models, function(i,item){

          setTimeout(function() {
            $("li[data-id=" + item.id + "]").flippy({
            verso: '<div class="panel panel-default live-item" id="' + item.id + '" style="height:30px"><div class="panel-body">Basic panel example</div></div>',
            direction: "TOP",
            duration: "200"
            //depth:"0.09"
          });
          },100 + (i * 160));


        });


        //$('.dd-item').removeClass('dd-item');
      }
      else {
        $.each(this.collection.models, function(i,item){
          setTimeout(function() {
            $("li[data-id=" + item.id + "]").flippyReverse();
          },100 + (i * 160));
        });
      }
        // $('.dd').removeClass('dd');
        // $('.dd-list').removeClass('dd-list');
      
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
    //add a new item to the list
    newSection: function() {

      section = new Backbone.Model({index: 0, order: this.collection.length, list_type: "section", selected: false, description: ""});

      newSection = this.collection.create(section);

      this.render();
      this.onShow();

      $("li[data-id=" + newSection.get("id") + "]").find('.form-control').focus();

    },

    descriptionSize: function(e) {

      cueDescription = $(e.currentTarget);

      descLength = cueDescription.find('.form-control').val().length;
      desc = cueDescription.find('.form-control');
      console.log("descLength is: " + descLength);
      currentDescHeight = parseInt(desc.css("height"));

      switch(this.windowWidth) {
        case "lg" :
          optimumSize = this.defaultDescHeight * (Math.floor(descLength/115) + 1);

          if (currentDescHeight !== optimumSize ) {
            
            desc.css("height", optimumSize);
            cueDescription.css("height", optimumSize);
          }
        break;
      }

    },
    selectCue: function(e) {
      
      item = $(e.currentTarget);
      itemId = item.closest("li").data("id");
      item.addClass('nestable-selected');
      model = this.collection.where({id: itemId})[0];
      this.prevSelectedModel = model;
      //this.setModelById({"id": cueId, values: [{"key": "selected", "value": true}]});
      if(this.newCueWasMade) {
        this.newCueWasMade = false;
      }
      else {
        this.setModelById(itemId,{"selected": true});
      }
      
    },
    blurCue: function(e) {

      console.log("on blur");

      $('.nestable-selected').removeClass("nestable-selected");

      if(this.wasEscKey === "no") {

        blurredCue = $(e.currentTarget);
        blurredCueValue = blurredCue.find('.form-control').val();
        blurredCueId = blurredCue.closest('li').data('id');
        blurredCueIndex = blurredCue.closest('li').data('index');
        //this.setModelById({"id": blurredCueId, "values" : [{"key": "selected", "value": false},{"key": "description", "value": blurredCueValue}]});
        this.setModelById(blurredCueId,{"selected":false, "title":blurredCueValue});

        blurredCue.removeClass("nestable-selected");

        this.wasEscKey = "no";

      }

    },
    checkKeyDown: function(e) {

      if(e.keyCode === 27) {
        this.wasEscKey = "yes";

        cue = $(e.currentTarget);
        cueId = cue.closest('li').data('id');
        cueIndex = cue.closest('li').data('index');
        model = this.collection.where({id: cueId})[0];
        cue.val(model.get("description"));
        $('.nestable-selected').removeClass("nestable-selected");

        this.wasEscKey = "no";
        $(e.currentTarget).blur();
        
      }
      else if(e.keyCode === 13 && e.shiftKey) {
        $(e.currentTarget).blur();
      }

    },
    checkKeyUp: function(e) {
      //78 is n
      //77 is m

      //check if user is currently focused on a textarea. If so then we don't create a new section/cue
      if(!$('.form-control').is(":focus")) {
        //if user hits m then make a new cue
        if(e.keyCode === 109 || e.keyCode === 77) {
          this.newCue();
        }
        else if(e.keyCode === 110 || e.keyCode === 78) {
          this.newSection();
        }
      }

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

    },
    toggleTimer: function(e) {

      e.preventDefault();
      var that = this;

      if($(e.currentTarget).hasClass('btn-success')) {

        $('#toggleTimer').removeClass('btn-success').addClass('btn-danger').html('Pause');
        startTime = $('#clock').val();
        var tock1 = new Tock({
          callback: function () {
            $('#clock').val(tock1.msToSimpleTime(tock1.lap() + tock1.timeToMS(startTime)));
          }
        });

        tock1.start($('#clock').val());
      }
      else if($(e.currentTarget).hasClass('btn-danger')) {
        console.log("OFF");
      }

    },
    nl2br: function (str, is_xhtml) {
      // From: http://phpjs.org/functions
      // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Philip Peterson
      // +   improved by: Onno Marsman
      // +   improved by: Atli Þór
      // +   bugfixed by: Onno Marsman
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   improved by: Brett Zamir (http://brett-zamir.me)
      // +   improved by: Maximusya
      // *     example 1: nl2br('Kevin\nvan\nZonneveld');
      // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
      // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
      // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
      // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
      // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
      var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    },
    br2nl: function(str) {
      return str.replace(/<br>/g, "\r");
    }


  });

  return HomeView;
  
});
