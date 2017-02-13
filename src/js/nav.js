/**
 * Add a second navigation menu to quickly navigate to
 * anchors in the page.
 *
 */

import oViewport from 'o-viewport';

oViewport.listenTo('scroll');
oViewport.listenTo('resize');

function nav() {
	let list = '';
	const lis = [];
	let scrollmargin;
	let headings = [];
	let currentheading;
	const qsa = document.querySelectorAll.bind(document);
	const qs = document.querySelector.bind(document);
	const sidebar = qs('.o-techdocs-sidebar ul');

	if (!sidebar) return;

	let dockpoint = offset(sidebar) + sidebar.scrollHeight;

	// Find heading 2s and build a link list.  Only proceed if there would be more than one item in the list
	[].slice.call(qsa('.o-techdocs-content h2[id]')).forEach(function(el) {
		headings.push({id:el.id, pos:offset(el)});
		lis.push('<li id="o-techdocs-pagenav-'+el.id+'"><a href="#'+el.id+'">'+el.innerHTML+'</a></li>');
	});
	if (lis.length < 2) return;
	list = document.createElement('UL');
	list.className = "o-techdocs-nav o-techdocs-nav--page";
	list.setAttribute('data-o-grid-colspan', '12');
	list.innerHTML = lis.join('');

	// Insert the new nav list after the existing one
	sidebar.parentNode.appendChild(list);

	// Determine border tolerance for highlighting nav sections (once immediately, and then on resize)
	calcScrollMargin();

	function calcScrollMargin() {
		scrollmargin = oViewport.getSize().height / 8;
	}

	// Return the vertical offset of the top of the element from the top of the document
	function offset(el) {
		let os = 0;
		let treeEl = el;

		while (treeEl) {
			os += treeEl.offsetTop;
			treeEl = treeEl.offsetParent;
		}
		return os;
	}

	function showHideMenu() {
		const isOneCol = offset(qs('.o-techdocs-content')) > offset(qs('.o-techdocs-nav'));
		if (isOneCol && list.getAttribute('aria-hidden') !== 'true') {
			list.setAttribute('aria-hidden', true);
		} else if (!isOneCol && list.getAttribute('aria-hidden') === 'true') {
			list.setAttribute('aria-hidden', false);
		}
	}

	showHideMenu();

	// On scroll, determine which section is in view, and highlight it
	document.addEventListener('oViewport.scroll', function() {
		const scrolltop = window.pageYOffset || document.body.scrollTop;
		const scrollos = scrolltop + scrollmargin;
		let candidate;
		headings.forEach(function(heading) {

			// Heading is before current scroll position, so might be the current heading
			if (heading.pos <= scrollos) {
				candidate = heading;

			// Heading is after current scroll position, can't be the current or any future one
			} else if (heading.pos > scrollos) {
				return false;
			}
		});
		if (candidate && candidate.id !== currentheading) {
			[].slice.call(list.querySelectorAll('li')).forEach(function(el) {
				el.setAttribute('aria-selected', 'false');
			});
			document.getElementById('o-techdocs-pagenav-'+candidate.id).setAttribute('aria-selected', 'true');
			currentheading = candidate.id;
		} else if (!candidate) {
			[].slice.call(list.querySelectorAll('li')).forEach(function(el) {
				el.setAttribute('aria-selected', 'false');
			});
		}

		// Dock or undock the navigation menu
		const docked = list.classList.contains('o-techdocs-nav--affix');
		if (!docked && scrolltop > dockpoint) {
			list.classList.add('o-techdocs-nav--affix');
			const width = qs('.o-techdocs-nav').offsetWidth + 'px';
			list.style.width = list.style.maxWidth = list.style.minWidth = list.style.flexBasis = width;
		} else if (docked && scrolltop < dockpoint) {
			list.classList.remove('o-techdocs-nav--affix');
			list.style.width = list.style.maxWidth = list.style.minWidth = list.style.flexBasis = '';
		}
	}, false);

	// On resize, reconsider boundary tolerance for section highlighting
	document.addEventListener('oViewport.resize', function() {
		calcScrollMargin();
		showHideMenu();
	});

	// On window load, recache all the heading positions as they may have moved since DOMReady, due to images being loaded in
	window.addEventListener('o.load', function() {
		headings = [];
		[].slice.call(qsa('.o-techdocs-content h2[id]')).forEach(function(el) {
			headings.push({id:el.id, pos:offset(el)});
		});

		// Calculate the dock point for the menu
		dockpoint = offset(sidebar) + sidebar.scrollHeight;
	}, false);
};

export { nav };
