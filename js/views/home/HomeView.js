define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'marionette',
  'backbone.collectionView',
  'views/home/CueView',
  'text!templates/home/homeTemplate.html'
], function($, jqueryui, _, Backbone, Marionette, CollectionView, CueView, homeTemplate){

  var HomeView = Marionette.ItemView.extend({
    template: homeTemplate,
    events: {

      "click .newCue" : "newCue",
      "dblclick li" : "editDescription"

    },

    initialize: function() {

      this.cueCollection = new Backbone.Collection([
          {cue_number: 1, type: "cue", description: "Tim"},
          {cue_number: 2, type: "cue", description: "Ida"},
          {cue_number: 3, type: "cue", description: "Rob"}
      ]);

    },

    onShow: function(){

      var that = this;

      //define the collectionView. We are doing this inside onShow because backbone.collectionView needs the DOM elements to be rendered and shown to work
      this.cueCollectionView = new Backbone.CollectionView( {
        el : $( "ul#cueSortable" ),
        selectable : true,
        sortable : true,
        // selectMultiple : true,
        // clickToToggle : true,
        collection : this.cueCollection,
        modelView : CueView
      } );

      //render the collectionView
      this.cueCollectionView.render();

      //callback when user sorts the list
      this.cueCollectionView.on( "sortStop", function() {
        selectedModel = that.cueCollectionView.getSelectedModel();
        console.log(selectedModel.get( "description" ));
        console.log('sort!');
        console.log(that.cueCollectionView.collection);

        count = 0;
        $.each(that.cueCollection.models,function(i,item) {
          if(item.get("type") === "cue") {
            item.set("cue_number",count+1);
            count += 1;
          }

        });

        that.cueCollectionView.render();

      });

      // this.cueCollectionView.on("doubleClick", function(model) {

      //   console.log(model);
      //   model.set("description" ,"click!!");

      //   //that.cueCollectionView.render();

      // });

    },

    //add a new cue to the list
    newCue: function() {

      cueCount = this.cueCollection.length;

      cue = new Backbone.Model({cue_number: cueCount+1, type: "cue", description: "-"});

      this.cueCollection.add(cue);

    },

    editDescription: function(e) {
      console.log($(e.currentTarget));
      description = $(e.currentTarget).find("#description");
      descriptionValue = $(e.currentTarget).find("#description").html();
      $(e.currentTarget).find("#description").html('<input type="text" value="' + descriptionValue + '"</input>');
    }

  });

  return HomeView;
  
});
