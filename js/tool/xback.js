// ;
// ! function(pkg, undefined) {
// 	var STATE = 'x-back';
// 	var element;

// 	var onPopState = function(event) {
// 		event.state === STATE && fire();
// 		record(STATE); //初始化事件时，push
// 	}

// 	var record = function(state) {
// 		history.pushState(state, null, location.href);
// 	}

// 	var fire = function() {
// 		var event = document.createEvent('Events');
// 		event.initEvent(STATE, false, false);
// 		element.dispatchEvent(event);
// 	}

// 	var listen = function(listener) {
// 		element.addEventListener(STATE, listener, false);
// 	}

// 	! function() {
// 		element = document.createElement('span');
// 		window.addEventListener('popstate', onPopState);
// 		this.listen = listen;
// 		record(STATE);
// 	}.call(window[pkg] = window[pkg] || {});
// }('XBack');
