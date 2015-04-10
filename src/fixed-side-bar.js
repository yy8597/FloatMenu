// fixed-side-bar.js
// module
!(function () {
	// Feature test to rule out some older browsers
    var titles = $('h1.mTitle');
    var lists = [];
    var fixedSide = $('#fix-side');
    var content = [];
    var container = fixedSide.find('.fix-menu');
    // container.className = '';


    if(titles.length){
    	var length = titles.length;
	    titles.each(function (i, title) {
	    	var list = $('<a>');
	    	list.html($(this).attr('title') || $(this).text());
	    	list.attr({
	    		"href" : '#' + $(this).attr('id'),
	    		"data-scroll" : null,
	    		"title" : list.html()
	    	})

	    	lists.push(list);

	    	container.append(list);
	    	
	    });
	    // fixedSide.appendChild(container);
	}



	var relocation = function () {
		content = [0]
		titles.each(function () {
			content.push($(this).offset().top);
		});
	}
	var _resizeList = [];

	relocation();

	$(window).bind('resize', function () {resizeHandler()})
    var resizeHandler = function () {
    	relocation();
        forEach(_resizeList, function (i, _resizeFn) {
        	_resizeFn(container);
        })
    }

    // Highlight active link on the navigation
    var selectActiveMenuItem = function (i) {
	    forEach(lists, function (i, el) {
	    	var thelist = lists[i][0];
	        thelist.className = thelist.className.replace(/[\s]{0,}active/, "");
	    });
	    if(i < 0){
	    	container.hide();
	    	return;
	    }
	    container.show();
	    lists[i][0].className += lists[i][0].className ? " active" : "active";
    };

    // Highlight active link when scrolling
	var wasNavigationTapped = false;
	var goTop = $('#gotop').parent();
	$(window).bind('scroll', function () {scrollHandler()});
	var scrollHandler = function () {
		// alert('scroll')
		// Determine viewport and body size
		var top = window.pageYOffset || document.documentElement.scrollTop,
		body = document.body,
		html = document.documentElement,
		viewport = window.innerHeight,
		bodyheight = Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		);

		// For each content link, when it's in viewport, highlight it
		if (!wasNavigationTapped) {
			var r;
			top += 100; //适配scroll.js中的调整值
			forEach(content, function (i, loc) {
				if (loc < top && ((i + 1) >= content.length ? true : (content[i + 1] > top))) {
					selectActiveMenuItem(i - 1);
					r = 1;
					return false;
				}
			});
			// alert(1)
			if(!r){
				selectActiveMenuItem(- 1);
			}
		}
		
		if(top > 500){
			goTop.show();
		}else{
			goTop.hide();
		}
		
	}

	// Attach FastClick to remove the 300ms tap delay
    FastClick.attach(document.body);

    // Init smooth scrolling
    smoothScroll.init();

    window.fixedSideBar = {
    	onResize : function (fn) {
    		_resizeList.push(fn);
    	},
    	triggerResize : function () {
    		resizeHandler();
    		scrollHandler();
    	}
    }

	// forEach method, that passes back the stuff we need
	function forEach (array, callback, scope) {
		for (var i = 0; i < array.length; i++) {
			var r = callback.call(scope, i, array[i]);
	 		if(r !== undefined && !r){
	 			break;
	 		};
		}
	}

	function _getLocation (anchor, headerHeight ) {
	    var location = 0, headerHeight = headerHeight || 0;
	    if (anchor.offsetParent) {
	      do {
	        location += anchor.offsetTop;
	        anchor = anchor.offsetParent;
	      } while (anchor);
	    }
	    location = location - headerHeight;
	    if ( location >= 0 ) {
	      return location;
	    } else {
	      return 0;
	    }
	};
})();

// page
!(function () {
	if(fixedSideBar){
		// fixedSideBar.init({
		// 	title : $('.mTitle')
		// })
		fixedSideBar.onResize(function (container) {
			container = container[0]
			if(document.body.clientWidth < 960){
				if(container.className.indexOf('fix-menu-mini') == -1){
					container.className += ' fix-menu-mini';
				}
			}else {
				container.className = container.className.replace(/fix-menu-mini/, "");
			}
		});

		fixedSideBar.triggerResize();
	}
})();