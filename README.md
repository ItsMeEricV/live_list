Live List
===========

Live events require coordination between multiple members, often between many teams. Traditionally this is done using voice intercom, scripts, or expensive software. Live List allows coordination of live events using a simple list interface, and is easily viewable on any desktop or mobile device.

**[LIVE DEMO](http://livelist.ericvierhaus.com)**

All list features update in realtime, without the need for page reloading.
In addition to basic text, list items can be marked as active by the list controller so that all viewers know which list item is the currently active item. In a live theatre event, list items can be used as cues. In addition, each list has a controllable and shared system-accurate **timer** so that all list viewers are referencing the same time. 

There are three list modes. **Watch**, **Control**, and **Edit**.

 1. Watch: Viewers see the timer, list item text and status. No control functionality is exposed
 1. Control: Used when the event is "live." The list controller activates the currently active list item.
 1. Edit: For building and reordering the list.

Ingredients
----------------

- Backbone.js
- [Firebase](https://www.firebase.com/)
- [Tock](https://github.com/mrchimp/tock)

Future features
----------------

1. Security and authorization. Private lists.
1. Vastly improved list item content. For example, having "assigned" list items for a specific viewer which the viewers can then filter for their role. Or someone can view all assignments at once.
1. Multiple named timers. The Firebase setup already supports this, just the UI needs to be extended.

Known Issues
----------------

1. Mobile viewing could use further optimization.
1. "Sections" are not implemented yet
1. Internet Explorer == untested


Local/On Premise support?
----------------

Originally this application used a Rails backend with Firehose and MongoDB. This is significantly more complex that Firebase and has slightly degraded performance, but allows for a local setup where Internet connectivity is poor or security is a major concern. This code is 95% working and lives in the [rails-firehose-backend](https://github.com/ejvaudio/live_list/tree/rails-firehose-backend) branch.