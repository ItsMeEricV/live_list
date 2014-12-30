define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'myapp',
  'text!templates/home/listEditTemplate.html'
], function($, _, Backbone, Marionette, app, listEditTemplate){

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

      ListModel = Backbone.Firebase.Model.extend({
        //url: '/lists/' + data.id
        firebase: app.firebaseURL + '/lists/'+data.id
      });

      this.model = new ListModel(data);

      this.inConfirmDelete = false;

      this.listenTo(this.model, "sync", this.setAttributes, this);

      

    },
    onShow: function() {
      var that = this;

      this.setAttributes();

    },
    onDestroy: function() {

    },
    setAttributes: function() {
      $('.listTitle').html(this.model.get('title') + ' settings');

      $('#listTitleInput').val(this.model.get('title'));
    },
    saveList: function() {

      listData = $('.listForm').serializeObject();

      this.model.set(listData, 
        {
          patch: true
        }
      );

      Backbone.history.navigate('/lists/' + this.model.id, {trigger: true});
    },
    cancelListEdit: function() {
      Backbone.history.navigate('/lists/' + this.model.id, {trigger: true});
    },
    deleteList: function() {
      var that = this;

      if(this.inConfirmDelete) {
        
        $('.deleteList').addClass('disabled');
        $('.deleteListLabel').fadeOut(350);

        this.model.destroy({});
        Backbone.history.navigate('/', {trigger: true});
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
