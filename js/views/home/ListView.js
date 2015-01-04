define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'text!templates/home/listTemplate.html'
], function($, _, Backbone, Marionette, listTemplate){

  var ListView = Marionette.ItemView.extend({
    template: listTemplate,
    tagName: "p",
    // attributes: function() {
    //   return {
    //     "data-id": this.model.get("id"),
    //     "data-index" : this.model.get("index"),
    //     "data-list_type" : this.model.get("list_type"),
    //     "data-order" : this.model.get("order")
    //   };
    // },
    // className: function() {
    //   // if(this.model.get("type") === "cue") {
    //     return "dd-item dd3-item";
    //   // }
    //   // else {
    //   //   return "dd-item";
    //   // }
    // },
    defaults: {
      index: 0,
      description: "Description"
    },

    events: {

    },
    //if using a table must uncomment out next line
    //tagName : "tr",

    initialize: function() {
      this.listenTo(this.model,"change",this.listChanged);

    },
    onRender: function() {

    },
    listChanged: function(item) {
      list = $(this.el).find('button[data-id="' + item.id + '"]');
      list.css("background-color","grey");
      list.animate({
        "background-color" : "grey"
      },300,function() {
        $(this).html(item.get("title"));
        $(this).animate({
          "background-color" : "#df691a"
      },300);
      });
    },

    onDestroy: function() {
      //TODO implement some notification when a List is destroyed
    }

  });

  return ListView;
  
});
