define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'myapp',
  'views/home/ListItemsView',
  'text!templates/home/listEditTemplate.html'
], function($, _, Backbone, Marionette, app, ListItemsView, listEditTemplate){

  var ListEditView = Marionette.ItemView.extend({
    template: listEditTemplate,
    defaults: {
      index: 0,
      description: "Description"
    },

    events: {
      "click .saveList" : "saveList",
      "click .cancelListEdit" : "cancelListEdit",
      "click .deleteList" : "deleteList"
    },
    initialize: function(data) {

      ListModel = Backbone.Model.extend({
        url: '/lists/' + data.id
      });

      this.model = new ListModel(data);

      this.inConfirmDelete = false;

    },
    onShow: function() {
      var that = this;

      $('.listTitle').html(this.model.get('title') + ' settings');

      $('#listTitleInput').val(this.model.get('title'));
    },
    saveList: function() {

      listData = $('.listForm').serializeObject();

      this.model.save(listData, 
        {
          patch: true,
          success: function(data) {
            // var listItemsView = new ListItemsView({id: data.id,listMode: 'watch'});
            // app.content.show(listItemsView);
            Backbone.history.navigate('/lists/' + data.id, {trigger: true});
          }
        }
      );
    },
    cancelListEdit: function() {
      Backbone.history.navigate('/lists/' + this.model.id, {trigger: true});
    },
    deleteList: function() {
      var that = this;

      if(this.inConfirmDelete) {
        
        $('.deleteList').addClass('disabled');
        $('.deleteListLabel').fadeOut(350);

        this.model.destroy({
          success: function() {
            Backbone.history.navigate('/lists', {trigger: true});
          }
        });
      }
      else {
        $('.deleteListLabel').fadeIn(150);
        $('.deleteList').html('Yes, do it!');
        this.inConfirmDelete = true;
      }
    }

  });

  return ListEditView;
  
});
