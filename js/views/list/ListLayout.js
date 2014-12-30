define([
  'jquery',
  'jqueryui',
  'underscore',
  'backbone',
  'marionette',
  'vent',
  'myapp',
  'views/list/ListTitleView',
  'views/list/ListControlsView',
  'views/list/ListContentsView',
  'text!templates/list/listLayoutTemplate.html'
], function($, jqueryui, _, Backbone, Marionette, vent, app, ListTitleView, ListControlsView, ListContentsView, listLayoutTemplate){

  var ListLayout = Marionette.LayoutView.extend({
    template: listLayoutTemplate,
    regions: {
      title: ".listTitle",
      controls: ".listControls",
      contents: ".listContents",
    },
    initialize: function(data) {
      this.listId = data.id;
    },
    onShow: function() {
      //setup the sticky Navbar
      //this.setStickyNavbar();
    },
    onBeforeShow: function() {
      this.getRegion('title').show(new ListTitleView({id: this.listId}));
      this.getRegion('controls').show(new ListControlsView({id: this.listId}));
      this.getRegion('contents').show(new ListContentsView({id: this.listId}));
    },
    setStickyNavbar: function(data) {
      // name your elements here
         var stickyElement   = '.controlsNavbarClass',   // the element you want to make sticky
             bottomElement   = '.fakeFooter'; // the bottom element where you want the sticky element to stop (usually the footer) 
         // make sure the element exists on the page before trying to initalize
         if($( stickyElement ).length){
             $( stickyElement ).each(function(){
                 // let's save some messy code in clean variables
                 // when should we start affixing? (the amount of pixels to the top from the element)
                 var fromTop = $( this ).offset().top, 
                     // where is the bottom of the element?
                     fromBottom = $( document ).height()-($( this ).offset().top + $( this ).outerHeight()),
                     // where should we stop? (the amount of pixels from the top where the bottom element is)
                     // also add the outer height mismatch to the height of the element to account for padding and borders
                     stopOn = $( document ).height()-( $( bottomElement ).offset().top)+($( this ).outerHeight() - $( this ).height()); 
                 // if the element doesn't need to get sticky, then skip it so it won't mess up your layout
                 if( (fromBottom-stopOn) > 70 ){

                     // let's put a sticky width on the element and assign it to the top
                     $( this ).css('width', $( this ).width()).css('top', 0).css('position', '');
                     // assign the affix to the element
                     $( this ).affix({
                         offset: { 
                             // make it stick where the top pixel of the element is
                             top: fromTop,  
                             // make it stop where the top pixel of the bottom element is
                             bottom: stopOn
                         }
                     // when the affix get's called then make sure the position is the default (fixed) and it's at the top
                     }).on('affix.bs.affix', function(){ 
                      $('#hiddenBreaks').show();
                      $( this ).css('top', 0).css('position', ''); 

                    }).on('affix-top.bs.affix', function() {
                      $('#hiddenBreaks').hide();

                    });
                 }
                 // trigger the scroll event so it always activates 
                 $( window ).trigger('scroll'); 
             }); 
         }
    }

  });

  return ListLayout;
  
});
