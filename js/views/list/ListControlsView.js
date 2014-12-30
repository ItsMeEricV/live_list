define([
  'jquery',
  'underscore',
  'backbone',
  'marionette',
  'myapp',
  'vent',
  'utility',
  'tock',
  'text!templates/list/listControlsTemplate.html',
], function($, _, Backbone, Marionette, app, vent, utility, Tock, listControlsTemplate){

  var ListControlsView = Marionette.ItemView.extend({
    template: listControlsTemplate,
    events: {
      "click .newListItem" : "newListItem",
      "click .deleteListItem" : "deleteListItem",
      "click .newSection" : "newSection",
      "click .toggleTimer" : "toggleTimer",
      "change .listModeSelect" : "listModeSelect"
    },
    initialize: function(data) {

      this.listId = data.id;

      this.timersData = new Firebase(app.firebaseURL + '/timers/' + this.listId); //for the timers associated with this list

    },
    onRender: function(data) {
      var that = this;
      //setup the sticky Navbar
      //this.setStickyNavbar();
      this.listId = data.id;

      //create new Tock timer object. Attach to View
      this.tock1 = new Tock({
        callback: function () {
            //find lap time: (exact time of timer)  +  1000ms
            //intervalTime = that.tock1.lap() + that.tock1.timeToMS("00:00:01");
            intervalTime = that.tock1.lap();

            //set the timer UI to HH:MM:SS (timecode) of the current lap time. This uses the msToTimecode() function which converts milliseconds to timecode form
            $('#clock').val(that.tock1.msToTimecode(intervalTime));
        }
      });

      //fire when timers change
      this.timersData.once('value', function(childSnapshot) {
        if(utility.isEmpty(childSnapshot.val())) {

          newTimer = {state: "stopped", action_time: 0, duration: 0};
          fbTimerObj = that.timersData.push(newTimer);
          $('.toggleTimer').data('id',fbTimerObj.key());
          //handle the state of the timer
          that.setTimerState(newTimer);
          //set the timer object for the view. This is used later in toggleTimer()
          that.timers = {};
          that.timers[fbTimerObj.key()] = newTimer;
          $('#toggleTimer').data('id',fbTimerObj.key());

        }
        else {
          //TODO extend this accept multiple timers in the future
          that.timers = childSnapshot.val();
          $.each(that.timers, function (key, timer) {
            that.setTimerState(timer);

            $('#toggleTimer').data('id',key);
          });
          
        }
      });

      //fire when timers change
      this.timersData.on('child_changed', function(childSnapshot) {
        that.setTimerState(childSnapshot.val());
      });
    },
    onShow: function() {
      var that = this;

    },
    onDestroy: function() {
      this.timersData.off('child_changed');

      this.tock1.stop();
    },
    //add a new listItem to the list
    newListItem: function() {

      vent.trigger("list" + this.listId + ":newListItem");

    }, 
    //delete a listItem
    deleteListItem: function() {

      vent.trigger("list" + this.listId + ":deleteListItem");

    },
    //add a new item to the list
    newSection: function() {

      section = new Backbone.Model({index: 0, order: this.collection.length, list_type: "section", selected: false, description: ""});

      newSection = this.collection.create(section);

      $("li[data-id=" + newSection.get("id") + "]").find('.form-control').focus();

    },
    setTimerState: function(timer) {
      
      //handle timer state
      if(timer.state === "stopped") {
        $('.toggleTimer').removeClass('btn-danger').addClass('btn-success').html('Start');

        this.tock1.stop();

        //if timer is stopped then just set timer value to the previously saved duration (could be zero)
        $('#clock').val(this.tock1.msToTimecode(timer.duration));

      }
      else if(timer.state === "started") {

        $('.toggleTimer').removeClass('btn-success').addClass('btn-danger').html('Pause');

        //if timer is started then subject current time from the start time to set current timer value.
        currentTime = Date.now();
        
        //$('#clock').val(this.tock1.msToTimecode(currentTime - this.timer.action_time));
        //$('#clock').val(this.tock1.msToTimecode(timer.duration));

        //if state is started then start the timer on the client
        //custom modification to Tock.js library allows us to pass milliseconds as a start_time for the timer. In this case we pass the time that is saved on the server
        this.tock1.start(currentTime - timer.action_time) + timer.duration;
      }

    },
    toggleTimer: function(e) {

      e.preventDefault();
      var that = this;
      
      timerId = $(e.currentTarget).data("id");
      //retrieve the clicked timer from all the timers associated with this list. They were previously attached to the Backbone view in initialize() after querying the Firebase server for all timers stored in this list
      timer = this.timers[timerId];
      
      //setup timer parameters to be stored on server
      var timerAction = {};  
      timerFirebase = new Firebase(app.firebaseURL + '/timers/' + this.listId + '/' + timerId);

      //if currently in the OFF state
      if(timer.state === "stopped") {

        //set action time to (current Unix time - previous time on timer)
        timer.action_time = Date.now() - that.tock1.timeToMS($('#clock').val());
        
        //handle timer state
        timer.duration = that.tock1.timeToMS($('#clock').val());
        //start_time = Date.now() - ms;

        //this.tock1.start(start_time);
        this.tock1.start(timer.duration);

        //change button from GO to Pause
        $('#toggleTimer').removeClass('btn-success').addClass('btn-danger').html('Pause');

        //update server with timer value
        timer.state = "started";
        timerFirebase.update(timer);

      }
      else if(timer.state === "started") {

        //set action time to current Unix time
        currentTime = Date.now();
        this.tock1.stop();

        //change button from Pause to Start
        $('#toggleTimer').removeClass('btn-danger').addClass('btn-success').html('Start');

        //update server with timer value
        timer.state = "stopped";
        timer.duration = currentTime - timer.action_time;
        timer.action_time = Date.now();
        timerFirebase.update(timer);
      }

    },
    listModeSelect: function(e) {
      vent.trigger("list" + this.listId + ":listModeSelect",e);
    }

  });

  return ListControlsView;
  
});
