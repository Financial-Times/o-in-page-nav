import Viewport from 'o-viewport';

class InPageNav {

	constructor (InPageNavEl, opts) {
		this.inPageNavEl = InPageNavEl;
		this.opts = opts || InPageNav.getOptions(InPageNavEl);

		// the thing to look for within the container. Defaults to h2
		if (this.opts.headingsSelector) {
			this.headingsSelector = this.opts.headingsSelector;
		} else {
			 this.headingsSelector = 'h2';
		}

		// the container of the menu content. Defaults to body.
		if (this.opts.containerEl) {
			this.containerEl = document.body;
		} else {
			this.containerEl = document.querySelector(this.opts.containerEl);
		}

		// the container of the menu content. Defaults to body.
		if (this.opts.activeNavItemClass) {
			this.activeClass = this.opts.activeNavItemClass;
		} else {
			this.activeClass = 'o-in-page-nav-item--active';
		}

		// The root of the selector for matching a page section to a menu nav item
		if (this.opts.navItemClassRoot) {
			this.navItemSelectorRoot = this.opts.navItemClassRoot;
		} else {
			this.navItemSelectorRoot = '.o-in-page-nav__item--';
		}

		this.headings = InPageNav.calculateHeadings(this.headingsSelector, this.containerEl);

		/* add inner wrapper div to prevent the margins collapsing */
		let inner = document.createElement('div');
		inner.style.marginTop = '-1px';
		inner.style.paddingTop = '1px';
		inner.innerHTML = this.inPageNavEl.innerHTML;
		this.inPageNavEl.innerHTML = '';
		this.inPageNavEl.appendChild(inner);

		this.activeMenuItem;

		this.dockPoint = InPageNav.offset(this.inPageNavEl); // don't recalc this unless the viewport changes.

		// Add viewport listeners
		Viewport.listenTo('scroll');
		Viewport.listenTo('resize');

		this.scrollWindowHandler = this.scrollWindowHandler.bind(this);
		this.showHideMenu = this.resizeWindowHandler.bind(this);

		document.addEventListener('oViewport.scroll', this.scrollWindowHandler);
		document.addEventListener('oViewport.resize', this.resizeWindowHandler);
	}

	static getOptions(inPageNavEl){
		let opts = {};
		if (inPageNavEl.hasAttribute('data-o-in-page-nav-headings-selector')) {
			opts.headingsSelector = inPageNavEl.getAttribute('data-o-in-page-nav-headings-selector');
		}
		if (inPageNavEl.hasAttribute('data-o-in-page-nav-headings-container-el')) {
			opts.containerEl = inPageNavEl.getAttribute('data-o-in-page-nav-headings-container-el');
		}
		if (inPageNavEl.hasAttribute('data-o-in-page-nav-active-nav-item-class')) {
			opts.activeNavItemClass = inPageNavEl.getAttribute('data-o-in-page-nav-active-nav-item-class');
		}
		if (inPageNavEl.hasAttribute('data-o-in-page-nav-nav-item-class-root')) {
			opts.navItemClassRoot = inPageNavEl.getAttribute('data-o-in-page-nav-nav-item-class-root');
		}

		return opts;
	}

	resizeWindowHandler(){
		/* TODO: show hide the menu according to the window width */

		/* the dock point may have changed if the page has reflowed, so recalc that */
		this.dockPoint = InPageNav.offset(this.inPageNavEl);

		/* the headings may have changed position so recalc those */
		this.headings = InPageNav.calculateHeadings();

	}


	// If the viewport resizes vertically, (say, because a section is open/closed) these need to be recaculated
	static calculateHeadings(selector, rootEl) {
		const elSelector = selector || 'h2';
		const containerEl = rootEl || document.body;
		const els = containerEl.querySelectorAll(elSelector);
		let headings = [];
		els.forEach((el) => {
			headings.push( { id: el.id, position: InPageNav.offset(el) } );
		});

		if (headings.length === 0){
			throw new Error('"o-in-page-nav error": No headings were found in the main document to link to.');
		}

		return headings;
	}

	get scrollMargin() {
		return Viewport.getSize().height / 8;
	}

	get scrollTop() {
		return window.pageYOffset || document.body.scrollTop;
	}

	scrollWindowHandler(){
		if(this.shouldDock()) {
			this.dock();
		} else {
			this.undock();
		}
		this.getCurrentHeading();
		return false;
	}

	getCurrentHeading(){
		const scrollOffset = this.scrollTop + this.scrollMargin;
		let candidate;

		this.headings.forEach(function(heading) {

			// Heading is before current scroll position, so might be the current heading
			if (heading.position <= scrollOffset) {
				candidate = heading;

			// Heading is after current scroll position, can't be the current or any future one
			} else if (heading.position > scrollOffset) {
				return false;
			}
		});

		if (candidate && candidate.id !== this.activeMenuItem) {
			this.headings.forEach((heading) => {
				document.querySelector(this.navItemSelectorRoot + heading.id).classList.remove(this.activeClass);
			});
			document.querySelector(this.navItemSelectorRoot + candidate.id).classList.add(this.activeClass);
			this.activeMenuItem = candidate.id;

		} else if (!candidate) {
			this.headings.forEach((heading) => {
				document.querySelector(this.navItemSelectorRoot + heading.id).classList.remove(this.activeClass);
			});
		}
	}

	shouldDock(){
		return (this.scrollTop > this.dockPoint);
	}

	dock(){
		this.inPageNavEl.classList.add('o-in-page-nav--affix');
	}

	undock(){
		this.inPageNavEl.classList.remove('o-in-page-nav--affix');
	}

	buildMenu(){}; //TODO

	// Return the vertical offset of the top of the element from the top of the document
	static offset(el) {
		let offset = 0;
		let treeEl = el;

		// Walk back up the tree until we reach the top
		while (treeEl) {
			offset += treeEl.offsetTop;
			treeEl = treeEl.offsetParent;
		}
		return offset;
	}

	static init (rootEl, opts) {
		if (!rootEl) {
			rootEl = document.body;
		}
		if (!(rootEl instanceof HTMLElement)) {
			rootEl = document.querySelector(rootEl);
		}
		if (rootEl instanceof HTMLElement && /\bo-in-page-nav\b/.test(rootEl.getAttribute('data-o-component'))) {
			return new InPageNav(rootEl, opts);
		}
		return Array.from(rootEl.querySelectorAll('[data-o-component="o-in-page-nav"]'), rootEl => new InPageNav(rootEl, opts));
	}
}

export default InPageNav;
