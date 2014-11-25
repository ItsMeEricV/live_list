Live List
===========

Live events require coordination between many people. **Live List** allows many users to stay in sync with a list that updates in realtime across all viewers.

- 3 modes for lists, Watch, Control, and Edit. A single editor/controller can create the list, edit in real time, and then control the events in the list. Other viewers can watch and their lists will update in realtime
- A system accurate timer is unique for each list, allowing all viewers to have the same time reference

Ingredients
----------------

- Backbone.js
- Firebase

Future features
----------------

1. Security and authorization. Private lists.
1. Vastly improved list item content. For example, having "assigned" list items for a specific viewer which the viewers can then filter for their role. Or someone can view all assignments at once.
1. Multiple named timers. The Firebase setup already supports this, just the UI needs to be extended.

Known Issues
----------------

1. Shifting list item placement while the timer is running causes the displayed time to get off.
1. Mobile viewing could use further optimization.


Local/On Premise support?
----------------

Originally this application used a Rails backend with Firehose and MongoDB. This is significantly more complex that Firebase and has slightly degraded performance, but allows for a local setup where Internet connectivity is poor or security is a major concern. This code is 95% working and lives in the rails-firehose-backend branch.