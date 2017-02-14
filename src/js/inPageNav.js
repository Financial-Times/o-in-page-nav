import Viewport from 'o-viewport';

class InPageNav {

	constructor (InPageNavEl, opts) {
		this.inPageNavEl = InPageNavEl;

		// User opts is either what is passed in imperatively, or found on the InPageNavEl
		const userOpts = opts || InPageNav.getOptions(InPageNavEl);

		// Destructure userOpts
		const { headingsSelector = 'h2',
					containerEl = document.body,
					activeNavItemClass = 'o-in-page-nav-item--active',
					navItemSelectorRoot = '.o-in-page-nav__item--'} = userOpts;

		// Bind the destructured variables to `this`
		Object.assign(this, { headingsSelector, containerEl, activeNavItemClass, navItemSelectorRoot });

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

	get scrollMargin() {
		return Viewport.getSize().height / 8;
	}

	get scrollTop() {
		return window.pageYOffset || document.body.scrollTop;
	}

	resizeWindowHandler(){

		/* the dock point may have changed if the page has reflowed, so recalc that */
		this.dockPoint = InPageNav.offset(this.inPageNavEl);

		/* the headings may have changed position so recalc those */
		this.headings = InPageNav.calculateHeadings();

	}

	scrollWindowHandler(){
		if(this.shouldDock()) {
			this.dock();
		} else {
			this.undock();
		}
		this.updateCurrentHeading();
		return false;
	}

	updateCurrentHeading(){
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
				document.querySelector(this.navItemSelectorRoot + heading.id).classList.remove(this.activeNavItemClass);
			});
			document.querySelector(this.navItemSelectorRoot + candidate.id).classList.add(this.activeNavItemClass);
			this.activeMenuItem = candidate.id;

		} else if (!candidate) {
			this.headings.forEach((heading) => {
				document.querySelector(this.navItemSelectorRoot + heading.id).classList.remove(this.activeNavItemClass);
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

	// If the viewport resizes vertically, (say, because a section is open/closed) these need to be recaculated
	static calculateHeadings(elSelector, containerEl) {

		const els = containerEl.querySelectorAll(elSelector);
		let headings = [];
		els.forEach((el) => {
			headings.push( { id: el.id, position: InPageNav.offset(el) } );
		});

		if (headings.length === 0){
			throw new Error('"o-in-page-nav error": Unable to find any headings for container and selector provided');
		}

		return headings;
	}

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
