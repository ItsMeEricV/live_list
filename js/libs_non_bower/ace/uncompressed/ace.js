if(! ('ace' in window) ) window['ace'] = {}
jQuery(function($) {
	//at some places we try to use 'tap' event instead of 'click' if jquery mobile plugin is available
	window['ace'].click_event = $.fn.tap ? "tap" : "click";
});





ace.handle_side_menu = function($) {
	$('#menu-toggler').on(ace.click_event, function() {
		$('#sidebar').toggleClass('display');
		$(this).toggleClass('display');
		return false;
	});
	//mini
	var $minimized = $('#sidebar').hasClass('menu-min');
	$('#sidebar-collapse').on(ace.click_event, function(){
		$minimized = $('#sidebar').hasClass('menu-min');
		ace.settings.sidebar_collapsed(!$minimized);//@ ace-extra.js
	});

	var touch = "ontouchend" in document;
	//opening submenu
	$('.nav-list').on(ace.click_event, function(e){
		//check to see if we have clicked on an element which is inside a .dropdown-toggle element?!
		//if so, it means we should toggle a submenu
		var link_element = $(e.target).closest('a');
		if(!link_element || link_element.length == 0) return;//if not clicked inside a link element
		
		$minimized = $('#sidebar').hasClass('menu-min');
		
		if(! link_element.hasClass('dropdown-toggle') ) {//it doesn't have a submenu return
			//just one thing before we return
			//if sidebar is collapsed(minimized) and we click on a first level menu item
			//and the click is on the icon, not on the menu text then let's cancel event and cancel navigation
			//Good for touch devices, that when the icon is tapped to see the menu text, navigation is cancelled
			//navigation is only done when menu text is tapped
			if($minimized && ace.click_event == "tap" &&
				link_element.get(0).parentNode.parentNode == this /*.nav-list*/ )//i.e. only level-1 links
			{
					var text = link_element.find('.menu-text').get(0);
					if( e.target != text && !$.contains(text , e.target) )//not clicking on the text or its children
					  return false;
			}

			return;
		}
		//
		var sub = link_element.next().get(0);

		//if we are opening this submenu, close all other submenus except the ".active" one
		if(! $(sub).is(':visible') ) {//if not open and visible, let's open it and make it visible
		  var parent_ul = $(sub.parentNode).closest('ul');
		  if($minimized && parent_ul.hasClass('nav-list')) return;
		  
		  parent_ul.find('> .open > .submenu').each(function(){
			//close all other open submenus except for the active one
			if(this != sub && !$(this.parentNode).hasClass('active')) {
				$(this).slideUp(200).parent().removeClass('open');
				
				//uncomment the following line to close all submenus on deeper levels when closing a submenu
				//$(this).find('.open > .submenu').slideUp(0).parent().removeClass('open');
			}
		  });
		} else {
			//uncomment the following line to close all submenus on deeper levels when closing a submenu
			//$(sub).find('.open > .submenu').slideUp(0).parent().removeClass('open');
		}

		if($minimized && $(sub.parentNode.parentNode).hasClass('nav-list')) return false;

		$(sub).slideToggle(200).parent().toggleClass('open');
		return false;
	 })
}



ace.general_things = function($) {
 $('.ace-nav [class*="icon-animated-"]').closest('a').on('click', function(){
	var icon = $(this).find('[class*="icon-animated-"]').eq(0);
	var $match = icon.attr('class').match(/icon\-animated\-([\d\w]+)/);
	icon.removeClass($match[0]);
	$(this).off('click');
 });
 
 $('.nav-list .badge[title],.nav-list .label[title]').tooltip({'placement':'right'});



 //simple settings

 $('#ace-settings-btn').on(ace.click_event, function(){
	$(this).toggleClass('open');
	$('#ace-settings-box').toggleClass('open');
 });

 
 $('#ace-settings-navbar').on('click', function(){
	ace.settings.navbar_fixed(this.checked);//@ ace-extra.js
 }).each(function(){this.checked = ace.settings.is('navbar', 'fixed')})

 $('#ace-settings-sidebar').on('click', function(){
	ace.settings.sidebar_fixed(this.checked);//@ ace-extra.js
 }).each(function(){this.checked = ace.settings.is('sidebar', 'fixed')})

 $('#ace-settings-breadcrumbs').on('click', function(){
	ace.settings.breadcrumbs_fixed(this.checked);//@ ace-extra.js
 }).each(function(){this.checked = ace.settings.is('breadcrumbs', 'fixed')})

 $('#ace-settings-add-container').on('click', function(){
	ace.settings.main_container_fixed(this.checked);//@ ace-extra.js
 }).each(function(){this.checked = ace.settings.is('main-container', 'fixed')})

 //Switching to RTL (right to left) Mode
 $('#ace-settings-rtl').removeAttr('checked').on('click', function(){
	ace.switch_direction(jQuery);
 });


 $('#btn-scroll-up').on(ace.click_event, function(){
	var duration = Math.min(400, Math.max(100, parseInt($('html').scrollTop() / 3)));
	$('html,body').animate({scrollTop: 0}, duration);
	return false;
 });
 
  try {
	$('#skin-colorpicker').ace_colorpicker();
  } catch(e) {}

  $('#skin-colorpicker').on('change', function(){
	var skin_class = $(this).find('option:selected').data('skin');

	var body = $(document.body);
	body.removeClass('skin-1 skin-2 skin-3');


	if(skin_class != 'default') body.addClass(skin_class);

	if(skin_class == 'skin-1') {
		$('.ace-nav > li.grey').addClass('dark');
	}
	else {
		$('.ace-nav > li.grey').removeClass('dark');
	}

	if(skin_class == 'skin-2') {
		$('.ace-nav > li').addClass('no-border margin-1');
		$('.ace-nav > li:not(:last-child)').addClass('light-pink').find('> a > [class*="icon-"]').addClass('pink').end().eq(0).find('.badge').addClass('badge-warning');
	}
	else {
		$('.ace-nav > li').removeClass('no-border margin-1');
		$('.ace-nav > li:not(:last-child)').removeClass('light-pink').find('> a > [class*="icon-"]').removeClass('pink').end().eq(0).find('.badge').removeClass('badge-warning');
	}

	if(skin_class == 'skin-3') {
		$('.ace-nav > li.grey').addClass('red').find('.badge').addClass('badge-yellow');
	} else {
		$('.ace-nav > li.grey').removeClass('red').find('.badge').removeClass('badge-yellow');
	}
 });
 
}



ace.widget_boxes = function($) {
	$(document).on('hide.bs.collapse show.bs.collapse', function (ev) {
		var hidden_id = ev.target.getAttribute('id')
		$('[href*="#'+ hidden_id+'"]').find('[class*="icon-"]').each(function(){
			var $icon = $(this)

			var $match
			var $icon_down = null
			var $icon_up = null
			if( ($icon_down = $icon.attr('data-icon-show')) ) {
				$icon_up = $icon.attr('data-icon-hide')
			}
			else if( $match = $icon.attr('class').match(/icon\-(.*)\-(up|down)/) ) {
				$icon_down = 'icon-'+$match[1]+'-down'
				$icon_up = 'icon-'+$match[1]+'-up'
			}

			if($icon_down) {
				if(ev.type == 'show') $icon.removeClass($icon_down).addClass($icon_up)
					else $icon.removeClass($icon_up).addClass($icon_down)
					
				return false;//ignore other icons that match, one is enough
			}

		});
	})


	$(document).on('click.ace.widget', '[data-action]', function (ev) {
		ev.preventDefault();

		var $this = $(this);
		var $action = $this.data('action');
		var $box = $this.closest('.widget-box');

		if($box.hasClass('ui-sortable-helper')) return;

		if($action == 'collapse') {
			var event_name = $box.hasClass('collapsed') ? 'show' : 'hide';
			var event_complete_name = event_name == 'show' ? 'shown' : 'hidden';

			
			var event
			$box.trigger(event = $.Event(event_name+'.ace.widget'))
			if (event.isDefaultPrevented()) return
		
			var $body = $box.find('.widget-body');
			var $icon = $this.find('[class*=icon-]').eq(0);
			var $match = $icon.attr('class').match(/icon\-(.*)\-(up|down)/);
			var $icon_down = 'icon-'+$match[1]+'-down';
			var $icon_up = 'icon-'+$match[1]+'-up';
			
			var $body_inner = $body.find('.widget-body-inner')
			if($body_inner.length == 0) {
				$body = $body.wrapInner('<div class="widget-body-inner"></div>').find(':first-child').eq(0);
			} else $body = $body_inner.eq(0);


			var expandSpeed   = 300;
			var collapseSpeed = 200;

			if( event_name == 'show' ) {
				if($icon) $icon.addClass($icon_up).removeClass($icon_down);
				$box.removeClass('collapsed');
				$body.slideUp(0 , function(){$body.slideDown(expandSpeed, function(){$box.trigger(event = $.Event(event_complete_name+'.ace.widget'))})});
			}
			else {
				if($icon) $icon.addClass($icon_down).removeClass($icon_up);
				$body.slideUp(collapseSpeed, function(){$box.addClass('collapsed');$box.trigger(event = $.Event(event_complete_name+'.ace.widget'))});
			}

			
		}
		else if($action == 'close') {
			var event
			$box.trigger(event = $.Event('close.ace.widget'))
			if (event.isDefaultPrevented()) return
			
			var closeSpeed = parseInt($this.data('close-speed')) || 300;
			$box.hide(closeSpeed , function(){$box.trigger(event = $.Event('closed.ace.widget'));$box.remove();});
		}
		else if($action == 'reload') {
			var event
			$box.trigger(event = $.Event('reload.ace.widget'))
			if (event.isDefaultPrevented()) return

			$this.blur();

			var $remove = false;
			if($box.css('position') == 'static') {$remove = true; $box.addClass('position-relative');}
			$box.append('<div class="widget-box-overlay"><i class="icon-spinner icon-spin icon-2x white"></i></div>');
			
			$box.one('reloaded.ace.widget', function() {
				$box.find('.widget-box-overlay').remove();
				if($remove) $box.removeClass('position-relative');
			});

		}
		else if($action == 'settings') {
			var event = $.Event('settings.ace.widget')
			$box.trigger(event)
		}

	});
}


ace.widget_reload_handler = function($) {
	//***default action for reload in this demo
	//you should remove this and add your own handler for each specific .widget-box
	//when data is finished loading or processing is done you can call $box.trigger('reloaded.ace.widget')
	$(document).on('reload.ace.widget', '.widget-box', function (ev) {
		var $box = $(this);
		//trigger the reloaded event after 1-2 seconds
		setTimeout(function() {
			$box.trigger('reloaded.ace.widget');
		}, parseInt(Math.random() * 1000 + 1000));
	});
	
	
	//you may want to do something like this:
	/**
	$('#my-widget-box').on('reload.ace.widget', function(){
		//load new data 
		//when finished trigger "reloaded"
		$(this).trigger('reloaded.ace.widget');
	});	
	*/
}



//search box's dropdown autocomplete
ace.enable_search_ahead = function($) {
	ace.variable_US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Dakota","North Carolina","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
	
	try {
		$('#nav-search-input').typeahead({
			source: ace.variable_US_STATES,
			updater:function (item) {
				$('#nav-search-input').focus();
				return item;
			}
		});
	} catch(e) {}
}



ace.switch_direction = function($) {
	var $body = $(document.body);
	$body
	.toggleClass('rtl')
	//toggle pull-right class on dropdown-menu
	.find('.dropdown-menu:not(.datepicker-dropdown,.colorpicker)').toggleClass('pull-right')
	.end()
	//swap pull-left & pull-right
	.find('.pull-right:not(.dropdown-menu,blockquote,.profile-skills .pull-right)').removeClass('pull-right').addClass('tmp-rtl-pull-right')
	.end()
	.find('.pull-left:not(.dropdown-submenu,.profile-skills .pull-left)').removeClass('pull-left').addClass('pull-right')
	.end()
	.find('.tmp-rtl-pull-right').removeClass('tmp-rtl-pull-right').addClass('pull-left')
	.end()
	
	.find('.chosen-container').toggleClass('chosen-rtl')
	.end()

	function swap_classes(class1, class2) {
		$body
		 .find('.'+class1).removeClass(class1).addClass('tmp-rtl-'+class1)
		 .end()
		 .find('.'+class2).removeClass(class2).addClass(class1)
		 .end()
		 .find('.tmp-rtl-'+class1).removeClass('tmp-rtl-'+class1).addClass(class2)
	}
	function swap_styles(style1, style2, elements) {
		elements.each(function(){
			var e = $(this);
			var tmp = e.css(style2);
			e.css(style2 , e.css(style1));
			e.css(style1 , tmp);
		});
	}

	swap_classes('align-left', 'align-right');
	swap_classes('no-padding-left', 'no-padding-right');
	swap_classes('arrowed', 'arrowed-right');
	swap_classes('arrowed-in', 'arrowed-in-right');
	swap_classes('messagebar-item-left', 'messagebar-item-right');//for inbox page


	//redraw the traffic pie chart on homepage with a different parameter
	var placeholder = $('#piechart-placeholder');
	if(placeholder.size() > 0) {
		var pos = $(document.body).hasClass('rtl') ? 'nw' : 'ne';//draw on north-west or north-east?
		placeholder.data('draw').call(placeholder.get(0) , placeholder, placeholder.data('chart'), pos);
	}
}



if(! ('ace' in window) ) window['ace'] = {}

ace.config = {
 cookie_expiry : 604800, //1 week duration for saved settings
 storage_method: 0 //2 means use cookies, 1 means localStorage, 0 means localStorage if available otherwise cookies
}

ace.settings = {
  is : function(item, status) {
    //such as ace.settings.is('navbar', 'fixed')
    return (ace.data.get('settings', item+'-'+status) == 1)
  },
  exists : function(item, status) {
    return (ace.data.get('settings', item+'-'+status) !== null)
  },
  set : function(item, status) {
    ace.data.set('settings', item+'-'+status, 1)
  },
  unset : function(item, status) {
    ace.data.set('settings', item+'-'+status, -1)
  },
  remove : function(item, status) {
    ace.data.remove('settings', item+'-'+status)
  },

  navbar_fixed : function(fix) {
    fix = fix || false;
    if(!fix && ace.settings.is('sidebar', 'fixed')) {
      ace.settings.sidebar_fixed(false);
    }
    
    var navbar = document.getElementById('navbar');
    if(fix) {
      if(!ace.hasClass(navbar , 'navbar-fixed-top'))  ace.addClass(navbar , 'navbar-fixed-top');
      if(!ace.hasClass(document.body , 'navbar-fixed'))  ace.addClass(document.body , 'navbar-fixed');
      
      ace.settings.set('navbar', 'fixed');
    } else {
      ace.removeClass(navbar , 'navbar-fixed-top');
      ace.removeClass(document.body , 'navbar-fixed');
      
      ace.settings.unset('navbar', 'fixed');
    }
    
    document.getElementById('ace-settings-navbar').checked = fix;
  },


  breadcrumbs_fixed : function(fix) {
    fix = fix || false;
    if(fix && !ace.settings.is('sidebar', 'fixed')) {
      ace.settings.sidebar_fixed(true);
    }

    var breadcrumbs = document.getElementById('breadcrumbs');
    if(fix) {
      if(!ace.hasClass(breadcrumbs , 'breadcrumbs-fixed'))  ace.addClass(breadcrumbs , 'breadcrumbs-fixed');
      if(!ace.hasClass(document.body , 'breadcrumbs-fixed'))  ace.addClass(document.body , 'breadcrumbs-fixed');
      
      ace.settings.set('breadcrumbs', 'fixed');
    } else {
      ace.removeClass(breadcrumbs , 'breadcrumbs-fixed');
      ace.removeClass(document.body , 'breadcrumbs-fixed');
      
      ace.settings.unset('breadcrumbs', 'fixed');
    }
    document.getElementById('ace-settings-breadcrumbs').checked = fix;
  },


  sidebar_fixed : function(fix) {
    fix = fix || false;
    if(!fix && ace.settings.is('breadcrumbs', 'fixed')) {
      ace.settings.breadcrumbs_fixed(false);
    }

    if( fix && !ace.settings.is('navbar', 'fixed') ) {
      ace.settings.navbar_fixed(true);
    }

    var sidebar = document.getElementById('sidebar');
    if(fix) {
      if( !ace.hasClass(sidebar , 'sidebar-fixed') )  ace.addClass(sidebar , 'sidebar-fixed');
      ace.settings.set('sidebar', 'fixed');
    } else {
      ace.removeClass(sidebar , 'sidebar-fixed');
      ace.settings.unset('sidebar', 'fixed');
    }
    document.getElementById('ace-settings-sidebar').checked = fix;
  },

  main_container_fixed : function(inside) {
    inside = inside || false;

    var main_container = document.getElementById('main-container');
    var navbar_container = document.getElementById('navbar-container');
    if(inside) {
      if( !ace.hasClass(main_container , 'container') )  ace.addClass(main_container , 'container');
      if( !ace.hasClass(navbar_container , 'container') )  ace.addClass(navbar_container , 'container');
      ace.settings.set('main-container', 'fixed');
    } else {
      ace.removeClass(main_container , 'container');
      ace.removeClass(navbar_container , 'container');
      ace.settings.unset('main-container', 'fixed');
    }
    document.getElementById('ace-settings-add-container').checked = inside;
    
    
    if(navigator.userAgent.match(/webkit/i)) {
      //webkit has a problem redrawing and moving around the sidebar background in realtime
      //so we do this, to force redraw
      //there will be no problems with webkit if the ".container" class is statically put inside HTML code.
      var sidebar = document.getElementById('sidebar')
      ace.toggleClass(sidebar , 'menu-min')
      setTimeout(function() { ace.toggleClass(sidebar , 'menu-min') } , 0)
    }
  },

  sidebar_collapsed : function(collpase) {
    collpase = collpase || false;

    var sidebar = document.getElementById('sidebar');
    var icon = document.getElementById('sidebar-collapse').querySelector('[class*="icon-"]');
    var $icon1 = icon.getAttribute('data-icon1');//the icon for expanded state
    var $icon2 = icon.getAttribute('data-icon2');//the icon for collapsed state

    if(collpase) {
      ace.addClass(sidebar , 'menu-min');
      ace.removeClass(icon , $icon1);
      ace.addClass(icon , $icon2);

      ace.settings.set('sidebar', 'collapsed');
    } else {
      ace.removeClass(sidebar , 'menu-min');
      ace.removeClass(icon , $icon2);
      ace.addClass(icon , $icon1);

      ace.settings.unset('sidebar', 'collapsed');
    }

  },
  /**
  select_skin : function(skin) {
  }
  */
}


//check the status of something
ace.settings.check = function(item, val) {
  if(! ace.settings.exists(item, val) ) return;//no such setting specified
  var status = ace.settings.is(item, val);//is breadcrumbs-fixed? or is sidebar-collapsed? etc
  
  var mustHaveClass = {
    'navbar-fixed' : 'navbar-fixed-top',
    'sidebar-fixed' : 'sidebar-fixed',
    'breadcrumbs-fixed' : 'breadcrumbs-fixed',
    'sidebar-collapsed' : 'menu-min',
    'main-container-fixed' : 'container'
  }


  //if an element doesn't have a specified class, but saved settings say it should, then add it
  //for example, sidebar isn't .fixed, but user fixed it on a previous page
  //or if an element has a specified class, but saved settings say it shouldn't, then remove it
  //for example, sidebar by default is minimized (.menu-min hard coded), but user expanded it and now shouldn't have 'menu-min' class
  
  var target = document.getElementById(item);//#navbar, #sidebar, #breadcrumbs
  if(status != ace.hasClass(target , mustHaveClass[item+'-'+val])) {
    ace.settings[item.replace('-','_')+'_'+val](status);//call the relevant function to mage the changes
  }
}






//save/retrieve data using localStorage or cookie
//method == 1, use localStorage
//method == 2, use cookies
//method not specified, use localStorage if available, otherwise cookies
ace.data_storage = function(method, undefined) {
  var prefix = 'ace.';

  var storage = null;
  var type = 0;
  
  if((method == 1 || method === undefined) && 'localStorage' in window && window['localStorage'] !== null) {
    storage = ace.storage;
    type = 1;
  }
  else if(storage == null && (method == 2 || method === undefined) && 'cookie' in document && document['cookie'] !== null) {
    storage = ace.cookie;
    type = 2;
  }

  //var data = {}
  this.set = function(namespace, key, value, undefined) {
    if(!storage) return;
    
    if(value === undefined) {//no namespace here?
      value = key;
      key = namespace;

      if(value == null) storage.remove(prefix+key)
      else {
        if(type == 1)
          storage.set(prefix+key, value)
        else if(type == 2)
          storage.set(prefix+key, value, ace.config.cookie_expiry)
      }
    }
    else {
      if(type == 1) {//localStorage
        if(value == null) storage.remove(prefix+namespace+'.'+key)
        else storage.set(prefix+namespace+'.'+key, value);
      }
      else if(type == 2) {//cookie
        var val = storage.get(prefix+namespace);
        var tmp = val ? JSON.parse(val) : {};

        if(value == null) {
          delete tmp[key];//remove
          if(ace.sizeof(tmp) == 0) {//no other elements in this cookie, so delete it
            storage.remove(prefix+namespace);
            return;
          }
        }
        
        else {
          tmp[key] = value;
        }

        storage.set(prefix+namespace , JSON.stringify(tmp), ace.config.cookie_expiry)
      }
    }
  }

  this.get = function(namespace, key, undefined) {
    if(!storage) return null;
    
    if(key === undefined) {//no namespace here?
      key = namespace;
      return storage.get(prefix+key);
    }
    else {
      if(type == 1) {//localStorage
        return storage.get(prefix+namespace+'.'+key);
      }
      else if(type == 2) {//cookie
        var val = storage.get(prefix+namespace);
        var tmp = val ? JSON.parse(val) : {};
        return key in tmp ? tmp[key] : null;
      }
    }
  }

  
  this.remove = function(namespace, key, undefined) {
    if(!storage) return;
    
    if(key === undefined) {
      key = namespace
      this.set(key, null);
    }
    else {
      this.set(namespace, key, null);
    }
  }
}





//cookie storage
ace.cookie = {
  // The following functions are from Cookie.js class in TinyMCE, Moxiecode, used under LGPL.

  /**
   * Get a cookie.
   */
  get : function(name) {
    var cookie = document.cookie, e, p = name + "=", b;

    if ( !cookie )
      return;

    b = cookie.indexOf("; " + p);

    if ( b == -1 ) {
      b = cookie.indexOf(p);

      if ( b != 0 )
        return null;

    } else {
      b += 2;
    }

    e = cookie.indexOf(";", b);

    if ( e == -1 )
      e = cookie.length;

    return decodeURIComponent( cookie.substring(b + p.length, e) );
  },

  /**
   * Set a cookie.
   *
   * The 'expires' arg can be either a JS Date() object set to the expiration date (back-compat)
   * or the number of seconds until expiration
   */
  set : function(name, value, expires, path, domain, secure) {
    var d = new Date();

    if ( typeof(expires) == 'object' && expires.toGMTString ) {
      expires = expires.toGMTString();
    } else if ( parseInt(expires, 10) ) {
      d.setTime( d.getTime() + ( parseInt(expires, 10) * 1000 ) ); // time must be in miliseconds
      expires = d.toGMTString();
    } else {
      expires = '';
    }

    document.cookie = name + "=" + encodeURIComponent(value) +
      ((expires) ? "; expires=" + expires : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  },

  /**
   * Remove a cookie.
   *
   * This is done by setting it to an empty value and setting the expiration time in the past.
   */
  remove : function(name, path) {
    this.set(name, '', -1000, path);
  }
};


//local storage
ace.storage = {
  get: function(key) {
    return window['localStorage'].getItem(key);
  },
  set: function(key, value) {
    window['localStorage'].setItem(key , value);
  },
  remove: function(key) {
    window['localStorage'].removeItem(key);
  }
};






//count the number of properties in an object
//useful for getting the number of elements in an associative array
ace.sizeof = function(obj) {
  var size = 0;
  for(var key in obj) if(obj.hasOwnProperty(key)) size++;
  return size;
}

//because jQuery may not be loaded at this stage, we use our own toggleClass
ace.hasClass = function(elem, className) {
  return (" " + elem.className + " ").indexOf(" " + className + " ") > -1;
}
ace.addClass = function(elem, className) {
 if (!ace.hasClass(elem, className)) {
  var currentClass = elem.className;
  elem.className = currentClass + (currentClass.length? " " : "") + className;
 }
}
ace.removeClass = function(elem, className) {ace.replaceClass(elem, className);}

ace.replaceClass = function(elem, className, newClass) {
  var classToRemove = new RegExp(("(^|\\s)" + className + "(\\s|$)"), "i");
  elem.className = elem.className.replace(classToRemove, function (match, p1, p2) {
    return newClass? (p1 + newClass + p2) : " ";
  }).replace(/^\s+|\s+$/g, "");
}

ace.toggleClass = function(elem, className) {
  if(ace.hasClass(elem, className))
    ace.removeClass(elem, className);
  else ace.addClass(elem, className);
}




//data_storage instance used inside ace.settings etc
ace.data = new ace.data_storage(ace.config.storage_method);


//CHS defaults

// ace.settings.sidebar_fixed(true);
// ace.settings.navbar_fixed(false);


jQuery(function($) {
  //ace.click_event defined in ace-elements.js
  ace.handle_side_menu(jQuery);

  ace.enable_search_ahead(jQuery);  

  ace.general_things(jQuery);//and settings

  ace.widget_boxes(jQuery);
  // ace.widget_reload_handler(jQuery);//this is for demo only, you can remove and have your own function, please see examples/widget.html

  /**
  //make sidebar scrollbar when it is fixed and some parts of it is out of view
  //>> you should include jquery-ui and slimscroll javascript files in your file
  //>> you can call this function when sidebar is clicked to be fixed
  $('.nav-list').slimScroll({
    height: '400px',
    distance:0,
    size : '6px'
  });
  */
});