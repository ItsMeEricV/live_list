define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'marionette',
  'vent',
  'nestable',
  'modernizr',
  'autosize',
  'localstorage',
  'bootstrap-switch',
  'views/home/CueView',
  'text!templates/home/homeTemplate.html',
  'fh'
], function($, jqueryui, _, Backbone, Marionette, vent, nestable, modernizr, autosize, localstorage, bootstrapSwitch, CueView, homeTemplate){

  // CueView = Backbone.Marionette.ItemView.extend({
  //   tagName: "tr",
  //   template: "#row-template"
  // });

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
      "mouseup .bootstrap-switch" : "switchMouseUp"
      //"switchChange.bootstrapSwitch #live-edit-switch" : "switch"
      //"keyup .cue-description" : "descriptionSize"
      //"click .dd3-content" : "toggleCue",
      //"click .dd3-section-content" : "toggleCue"

    },

    initialize: function() {

      // this.listenTo(vent, "goToKeyUp", this.checkKeyUp, this);
      _.bindAll(this, 'checkKeyUp');
      $(document).bind('keyup', this.checkKeyUp);

      var Cue = Backbone.Model.extend({
        url: '/cue'
      });

      var cue = new Cue({
        id: 1,
        wisdom: 'heloo there'
      });

      new Firehose.Consumer({
        //uri: '//localhost:7474/squirrels/' + cue.id,
        uri: '//192.168.60.20:7474/hello2',
        message: function(json){
          //cue.set(json);
          console.log(json);
          console.log("IN FIREHOSE CONSUMER");
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

      var CueCollection = Backbone.Collection.extend({
        //localStorage: new Backbone.LocalStorage("CueCollection")
        url: '/cue'
      });

      this.collection = new CueCollection();

      this.switchIsDrawn = false;
      this.switchState = false;

      //this.collection = new Backbone.Collection([
      // this.collection.add([
      //     {id: 1, index: 1, order: 0, selected: false, type: "cue", description: "Tim"},
      //     {id: 2, index: 2, order: 1, selected: false, type: "cue", description: "Ida"},
      //     {id: 3, index: 0, order: 2, selected: false, type: "section", description: "Act I - Scene II"},
      //     {id: 4, index: 3, order: 3, selected: false, type: "cue", description: "Rob"}
      // ]);

      this.collection.comparator = "order"; 

      this.collection.fetch({
        reset: true
      });

      //this.listenTo(this.collection, "reset", this.render, this);

      this.windoWidthBreakPoints = { "xs" : 20, "sm" : 40, "md" : 80, "lg" : 115 }
      this.defaultDescHeight = 40;
      this.wasEscKey = "no";



    },

    onRender: function() {



    },

    onShow: function(){
      
      var that = this;



      $('.dd').nestable({ 
        
        callback: function(l,e) {
          // l is the main container
          // e is the element that was moved

          cues = $('.dd').nestable('serialize');

          idThatMoved = e.data('id');
          typeThatMoved = e.data('type');

          cueIndexTracker = 0;
          for (var key in cues) {
            console.log(key);
            if(cues[key].type === "cue") {
              cueIndexTracker += 1;
            }
            
            if(cues[key].id === idThatMoved) {
              
              newIndex = cueIndexTracker;
              oldIndex = parseInt(cues[key].index);
              newOrder = parseInt(key);
              oldOrder = parseInt(cues[key].order);
            }
          }

          moveDirection = (newOrder > oldOrder) ? "higher" : "lower";
          count = 0;
          
          $.each(that.collection.models,function(i,item) {
            if(moveDirection === "lower") {
              //if item isn't the one that moved but it's within the reordering range then set new order
              //the "reordering range" is if it's (1) greater than or equal to the new order spot of the moved item
              //                                  (2) less than the old order spot of the moved item
              if(item.get("id") !== idThatMoved && item.get("order") >= newOrder && item.get("order") < oldOrder) {
                item.set("order",item.get("order") + 1)
              }

              //if item is a cue and a cue was moved
              if(item.get("type") === "cue" && typeThatMoved === "cue") {
                //if item isn't the cue that moved and it's within the reindexing range then change it
                if(item.get("id") !== idThatMoved && item.get("index") >= newIndex && item.get("index") < oldIndex ) {
                  item.set("index",item.get("index") + 1)
                }
                else if(item.get("id") === idThatMoved) {  //if it is the one that moved then set it to the new values reported by netstable's callback
                  item.set("index",newIndex);
                  item.set("order",newOrder);
                }
              }
              else { //if a section moved
                if(item.get("id") === idThatMoved) {
                  item.set("order",newOrder);
                }
              }
            }
            else {
              if(item.get("id") !== idThatMoved && item.get("order") <= newOrder && item.get("order") > oldOrder) {
                item.set("order",item.get("order") - 1)
              }

              if(item.get("type") === "cue" && typeThatMoved === "cue") {
                if(item.get("id") !== idThatMoved && item.get("index") <= newIndex && item.get("index") > oldIndex ) {
                  item.set("index",item.get("index") - 1)
                }
                else if(item.get("id") === idThatMoved) {
                  item.set("index",newIndex);
                  item.set("order",newOrder);
                }
              }
              else { //if a section moved
                if(item.get("id") === idThatMoved) {
                  item.set("order",newOrder);
                }
              }
            }

            item.save();

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
      console.log(this.switchState);
        $('#live-edit-switch').bootstrapSwitch('state',this.switchState);
        $('.bootstrap-switch').addClass('pull-right');
        this.switchIsDrawn = true;

        $('#live-edit-switch').on('switchChange.bootstrapSwitch', function(event, state) {
          console.log(event);
          that.switchState = state;
          that.productionState();
        })
    },

    //add a new cue to the list
    newCue: function() {

      cueCount = this.collection.where({type:"cue"}).length;
      // newOrder = (this.collection.length) ? this.collection.length + 1 : 0;

      cue = new Backbone.Model({index: cueCount+1, order: this.collection.length, type: "cue", selected: false, description: ""});

      newCue = this.collection.create(cue);

      this.render();
      this.onShow();

      $("li[data-id=" + newCue.get("id") + "]").find('.form-control').focus();
      console.log("li[data-id=" + newCue.get("id") + "]");

    }, 
    //delete a cue
    deleteCue: function() {

      //model = this.collection.where({selected: true})[0];
      orderToBeDeleted = this.prevSelectedModel.get("order");
      typeToBeDeleted = this.prevSelectedModel.get("type");

      console.log(orderToBeDeleted);
      this.prevSelectedModel.destroy();

      $.each(this.collection.models,function(i,item) {

        if(item.get("order") > orderToBeDeleted) {
          item.set("order", item.get("order") - 1);

          if(typeToBeDeleted === "cue" && item.get("type") === "cue") {
            item.set("index", item.get("index") - 1);
          }
        }

        item.save();

      });
      
      this.render();
      this.onShow();


    },
    //add a new cue to the list
    newSection: function() {

      section = new Backbone.Model({index: 0, order: this.collection.length, type: "section", selected: false, description: ""});

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
      
      cue = $(e.currentTarget);
      cueId = cue.closest("li").data("id");
      cue.addClass('nestable-selected');
      model = this.collection.where({id: cueId})[0];
      this.prevSelectedModel = model;
      this.setModelById({"id": cueId, values: [{"key": "selected", "value": true}]});

      // cue.val(model.get("description"));

      //if cue is not already focused then open text box for editing the description
      // if(!$(e.currentTarget).closest(".dd3-content").find(".form-control").is(":visible")) { 
      //   description = $(e.currentTarget).find("#description");
      //   descriptionValue = $(e.currentTarget).find("#description").html();
      //   cueField = $(e.currentTarget).closest(".dd3-content");

        //set textarea value
        // model = this.collection.where({id: cueId})[0];
        // cueField.html('<textarea class="form-control" rows="1">' + model.get("description") + '</textarea>');
        // cueField.find('textarea').autosize({
        //     callback: function() {
        //       cueField.css("height", cueField.find('textarea').css("height"));
        //     }
        //   });

        //cueField.find('.form-control').focus();


        //this.setModelById({"id": cueId, values: [{"key": "selected", "value": true}]);
      // }
      
    },
    blurCue: function(e) {

      $('.nestable-selected').removeClass("nestable-selected");

      if(this.wasEscKey === "no") {

        blurredCue = $(e.currentTarget);
        blurredCueValue = blurredCue.find('.form-control').val();
        blurredCueId = blurredCue.closest('li').data('id');
        blurredCueIndex = blurredCue.closest('li').data('index');
        this.setModelById({"id": blurredCueId, "values" : [{"key": "selected", "value": false},{"key": "description", "value": blurredCueValue}]});

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
    setModelById: function(options) {

      //find the model that matches the currently selected cue
      model = this.collection.where({id: options.id})[0];
      //set new attributes and merge back to the collection. Using remove: false so we don't remove the unmodified models
      for (var newValue in options.values) {
        model.set(options.values[newValue].key, options.values[newValue].value);
      }
      model.save();
      this.collection.set(model,{remove: false});

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
    },
    productionState: function() {

    }


  });

  return HomeView;
  
});
