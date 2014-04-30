define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'text!templates/home/itemTemplate.html'
], function($, _, Backbone, Marionette, itemTemplate){

  var ItemView = Marionette.ItemView.extend({
    template: itemTemplate,
    tagName: "li",
    attributes: function() {
      return {
        "data-id": this.model.get("id"),
        "data-index" : this.model.get("index"),
        "data-list_type" : this.model.get("list_type"),
        "data-order" : this.model.get("order")
      };
    },
    className: function() {
      // if(this.model.get("type") === "cue") {
        return "dd-item dd3-item";
      // }
      // else {
      //   return "dd-item";
      // }
    },
    defaults: {
      index: 0,
      description: "Description"
    },

    events: {

    },
    //if using a table must uncomment out next line
    //tagName : "tr",

    initialize: function() {

    }

  });

  return ItemView;
  
});
