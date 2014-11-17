define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'myapp',
  'text!templates/home/itemTemplate.html',
  'text!templates/home/editItemTemplate.html'
], function($, _, Backbone, Marionette, app, itemTemplate, editItemTemplate){

  var ItemView = Marionette.ItemView.extend({
    //template: itemTemplate,
    tagName: "li",
    attributes: function() {
      return {
        "data-id": this.model.get("id"),
        "data-index" : this.model.get("index"),
        "data-list_type" : this.model.get("list_type"),
        "data-order" : this.model.get("order")
      };
    },
    //return the correct template based on the mode of the list. Using the app.listMode global array to retrieve this data.
    getTemplate: function(){
      if (app.listMode[app.activeList] === "edit"){
        return editItemTemplate;
      } else {
        return itemTemplate;
      }
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
      console.log(app.listMode[app.activeList]);
    }

  });

  return ItemView;
  
});
