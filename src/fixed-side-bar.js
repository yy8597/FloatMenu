// fixed-side-bar.js
// module
!(function () {
	// Feature test to rule out some older browsers
  	if ("querySelector" in document && "addEventListener" in window) {
	    var titles = document.querySelectorAll('h1.mTitle');
	    var lists = [];
	    var fixedSide = document.getElementById('fix-side');
	    var content = [];
	    var container = fixedSide.querySelector('.fix-menu');
	    // container.className = '';


	    if(titles){
	    	var length = titles.length;
		    forEach(titles, function (i, title) {
		    	var list = document.createElement('a');
		    	list.setAttribute('href', '#' + title.id);
		    	list.setAttribute('data-scroll', null);
		    	list.innerHTML = title.getAttribute('title') || title.innerText;
		    	list.setAttribute('title', list.innerHTML);
		    	// list.style.top = -20 * (length - i) + 'px';
		    	lists.push(list);

		    	container.appendChild(list);
		    	
		    });
		    // fixedSide.appendChild(container);
		}



		var relocation = function () {
			content = [0]
			if(titles){
				forEach(titles, function (i, title) {
					content.push(_getLocation(title));
				});
			}
		}
		var _resizeList = [];

		relocation();

		
		window.addEventListener("resize", function () {resizeHandler()}, false);
	    var resizeHandler = function () {
	    	relocation();
	        forEach(_resizeList, function (i, _resizeFn) {
	        	_resizeFn(container);
	        })
	    }

	    // Highlight active link on the navigation
	    var selectActiveMenuItem = function (i) {
		    forEach(lists, function (i, el) {
		        lists[i].className = lists[i].className.replace(/[\s]{0,}active/, "");
		    });
		    if(i < 0){
		    	return;
		    }
		    lists[i].className += lists[i].className ? " active" : "active";
	    };

	    // Highlight active link when scrolling
		var wasNavigationTapped = false;
		window.addEventListener("scroll", function () {

			// Determine viewport and body size
			var top = window.pageYOffset,
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
				forEach(content, function (i, loc) {
					top += 80; //适配scroll.js中的调整值
					if (loc < top && ((i + 1) >= content.length ? true : (content[i + 1] > top))) {
						selectActiveMenuItem(i - 1);
						r = 1;
						return false;
					}
				});
				if(!r){
					selectActiveMenuItem(- 1);
				}
			}
		}, false);

		

		// Attach FastClick to remove the 300ms tap delay
	    FastClick.attach(document.body);

	    // Init smooth scrolling
	    smoothScroll.init();

	    window.fixedSideBar = {
	    	onResize : function (fn) {
	    		_resizeList.push(fn);
	    	},
	    	triggerResize : function () {
	    		resizeHandler()
	    	}
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
		fixedSideBar.onResize(function (container) {
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