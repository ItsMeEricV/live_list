define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'marionette',
  'nestable',
  'modernizr',
  'autosize',
  'views/home/CueView',
  'text!templates/home/homeTemplate.html'
], function($, jqueryui, _, Backbone, Marionette, nestable, modernizr, autosize, CueView, homeTemplate){

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
      "click .newSection" : "newSection",
      "focus .descriptionTextarea" : "selectCue",
      "blur .cue-description" : "blurCue",
      "keydown .form-control" : "checkKey"
      //"keyup .cue-description" : "descriptionSize"
      //"click .dd3-content" : "toggleCue",
      //"click .dd3-section-content" : "toggleCue"

    },

    initialize: function() {

      this.collection = new Backbone.Collection([
          {id: 1, index: 1, selected: false, type: "cue", description: "Tim"},
          {id: 2, index: 2, selected: false, type: "cue", description: "Ida"},
          {id: 3, index: 0, selected: false, type: "section", description: "Act I - Scene II"},
          {id: 4, index: 3, selected: false, type: "cue", description: "Rob"}
      ]);

      this.windoWidthBreakPoints = { "xs" : 20, "sm" : 40, "md" : 80, "lg" : 115 }
      this.defaultDescHeight = 40;
      this.wasEscKey = "no";

    },

    onRender: function() {



    },

    onShow: function(){

      var that = this;

      //$('.dd').nestable({ /* config options */ });

      $('.dd').nestable({ 
        callback: function(l,e){
              // l is the main container
              // e is the element that was moved

              cues = $('.dd').nestable('serialize');

              count = 0;
              
              $.each(that.collection.models,function(i,item) {
                if(item.get("type") === "cue") {
                  //item.set("cue_number",count+1);
                  //count += 1;
                }
              });

              console.log(that.collection);

              //that.render();

          }
      });

        $('textarea').autosize({
          callback: function() {
            console.log($(this).css("height"));
            $(this).closest('.dd3-content').css("height", parseInt($(this).css("height")) + 1 );
          }
        });

    },

    //add a new cue to the list
    newCue: function() {

      cueCount = this.collection.length;

      cue = new Backbone.Model({id: cueCount + 1, index: cueCount+1, type: "cue", selected: false, description: "-"});

      this.collection.add(cue);

      this.render();
      this.onShow();

    }, 
    //add a new cue to the list
    newSection: function() {

      cueCount = this.collection.length;

      cue = new Backbone.Model({id: cueCount + 1, index: 0, type: "section", selected: false, description: "-"});

      this.collection.add(cue);

      this.render();
      this.onShow();

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
      model = this.collection.where({id: cueId})[0];

      cue.val(model.get("description"));

      //if cue is not already focused then open text box for editing the description
      // if(!$(e.currentTarget).closest(".dd3-content").find(".form-control").is(":visible")) { 
      //   description = $(e.currentTarget).find("#description");
      //   descriptionValue = $(e.currentTarget).find("#description").html();
      //   cueField = $(e.currentTarget).closest(".dd3-content");

      //   //set textarea value
      //   model = this.collection.where({id: cueId})[0];
      //   cueField.html('<textarea class="form-control" rows="1">' + model.get("description") + '</textarea>');
      //   cueField.find('textarea').autosize({
      //       callback: function() {
      //         cueField.css("height", cueField.find('textarea').css("height"));
      //       }
      //     });

      //   cueField.find('.form-control').focus();

      //   cue.addClass('nestable-selected');
      //   //this.setModelById({"id": cueId, values: [{"key": "selected", "value": true}]);
      // }
      
    },
    blurCue: function(e) {

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
    checkKey: function(e) {

  
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
    setModelById: function(options) {

      //find the model that matches the currently selected cue
      model = this.collection.where({id: options.id})[0];
      //set new attributes and merge back to the collection. Using remove: false so we don't remove the unmodified models
      // model.set(options.key, options.value);
      //this.collection.set(model,{remove: false});
      for (var newValue in options.values) {
        model.set(options.values[newValue].key, options.values[newValue].value);
      }
      this.collection.set(model,{remove: false});
      console.log(this.collection);

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
