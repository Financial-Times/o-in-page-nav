/*global require*/
import './../../main.js';

function initDemos() {
	document.addEventListener('DOMContentLoaded', function() {

		if (window.self === window.top) {
			document.querySelector('.demo-notice').remove();
		}

		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));

	});
}

initDemos();
