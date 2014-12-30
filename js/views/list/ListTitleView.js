define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'myapp',
  'views/home/ListEditView',
  'text!templates/list/listTitleTemplate.html',
], function($, _, Backbone, Marionette, app, ListEditView, listTitleTemplate){

  var ListTitleView = Marionette.ItemView.extend({
    template: listTitleTemplate,
    events: {
      "mouseenter .listTitleButton" : "listTitleHoverOn",
      "mouseleave .listTitleButton" : "listTitleHoverOff",
      "click .listTitleButton" : "listEdit"
    },
    initialize: function(data) {
      var listTitleModel = Backbone.Model.extend({
        defaults: {
          id: data.id,
          title: "-",
          url: "http://" + document.domain + "/lists/" + data.id
        }
      });
      this.model = new listTitleModel();
      this.listenTo(this.model,"change",this.render,this);

      this.listId = data.id;
      this.listData = new Firebase(app.firebaseURL + '/lists/' + data.id); //for the whole list
      //set the "open list in new tab" URL in the view
      //$('#listInNewTab').attr('href',"http://" + document.domain + "/lists/" + data.id);
    },
    onShow: function() {
      var that = this;

      this.listData.on('value',function(dataSnapshot) {
        //set the title of the list in the view
        that.model.set("title", dataSnapshot.val().title);
      });
    },
    onDestroy: function() {
      this.listData.off('value');
    },
    listEdit: function() {

      var listEditView = new ListEditView(this.model);
      Backbone.history.navigate('/lists/' + this.listId + '/edit');
      app.content.show(listEditView);

    },
    listTitleHoverOn: function() {
      $('.listTitleButton').css('color','#0072C6');
      $('.editListLabel').fadeIn(150);
    },
    listTitleHoverOff: function() {
      $('.listTitleButton').css('color','#FFFFFF');
      $('.editListLabel').fadeOut(150);
    },
  });

  return ListTitleView;
  
});
