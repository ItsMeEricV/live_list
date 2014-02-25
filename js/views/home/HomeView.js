define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'marionette',
  'nestable',
  'views/home/CueView',
  'text!templates/home/homeTemplate.html'
], function($, jqueryui, _, Backbone, Marionette, nestable, CueView, homeTemplate){

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
      "dblclick .cue-description" : "editDescription",
      "click .dd3-content" : "toggleCue",
      "click .dd3-section-content" : "toggleCue"

    },

    initialize: function() {

      this.collection = new Backbone.Collection([
          {id: 1, index: 1, selected: false, type: "cue", description: "Tim"},
          {id: 2, index: 2, selected: false, type: "cue", description: "Ida"},
          {id: 3, index: 3, selected: false, type: "section", description: "Act I - Scene II"},
          {id: 4, index: 4, selected: false, type: "cue", description: "Rob"}
      ]);

      //this.render();

    },

    onShow: function(){

      var that = this;

      //$('.dd').nestable({ /* config options */ });

      console.log(this.collection);

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




      // //define the collectionView. We are doing this inside onShow because backbone.collectionView needs the DOM elements to be rendered and shown to work
      // this.cueCollectionView = new Backbone.CollectionView( {
      //   el : $( "ul#cueSortable" ),
      //   selectable : true,
      //   sortable : true,
      //   // selectMultiple : true,
      //   // clickToToggle : true,
      //   collection : this.cueCollection,
      //   modelView : CueView
      // } );

      // //render the collectionView
      // this.cueCollectionView.render();

      // //callback when user sorts the list
      // this.cueCollectionView.on( "sortStop", function() {
      //   selectedModel = that.cueCollectionView.getSelectedModel();
      //   console.log(selectedModel.get( "description" ));
      //   console.log('sort!');
      //   console.log(that.cueCollectionView.collection);

      //   count = 0;
      //   $.each(that.cueCollection.models,function(i,item) {
      //     if(item.get("type") === "cue") {
      //       item.set("cue_number",count+1);
      //       count += 1;
      //     }

      //   });

      //   that.cueCollectionView.render();

      // });

      // this.cueCollectionView.on("doubleClick", function(model) {

      //   console.log(model);
      //   model.set("description" ,"click!!");

      //   //that.cueCollectionView.render();

      // });

    },

    //add a new cue to the list
    newCue: function() {

      cueCount = this.collection.length;

      cue = new Backbone.Model({index: cueCount+1, type: "cue", selected: false, description: "-"});

      this.collection.add(cue);

      this.render();
      this.onShow();

      // console.log($('#nestable3').nestable('serialize'));
      // console.log($('nestable3'));

    },

    editDescription: function(e) {
      console.log($(e.currentTarget));
      description = $(e.currentTarget).find("#description");
      descriptionValue = $(e.currentTarget).find("#description").html();
      $(e.currentTarget).find("#description").html('<input type="text" value="' + descriptionValue + '"</input>');
    },
    toggleCue: function(e) {
      cue = $(e.currentTarget);
      cueId = cue.closest("li").data("id");
      
      if(cue.hasClass('nestable-selected')) {
        cue.removeClass('nestable-selected');
        model = this.collection.where({id: cueId})[0];
        model.set("selected",false);
      }
      else { 

        //check if previously selected and unselect it
        count = 0;
        $.each(this.collection.models,function(i,item) {
          if(item.get("selected")) {
            $('li[data-id="' + item.get("id") + '"]').find('.cue-description').removeClass("nestable-selected");
            model = this.collection.where({id: item.get("id")})[0];
            model.set("selected",false);
            //apply the change to the collection
            this.collection.set(model,{remove: false});
          }
        });

        cue.addClass('nestable-selected');
        model = this.collection.where({id: cueId})[0];
        model.set("selected",true);
        
      }

      //apply the change to the collection
      this.collection.set(model,{remove: false});

      console.log(this.collection);
      
    }

  });

  return HomeView;
  
});
