import Viewport from 'o-viewport';

class InPageNav {

	constructor (InPageNavEl, opts) {
		this.inPageNavEl = InPageNavEl;
		this.opts = opts || {}; // no opts right now

		// replace this with a function that determines what the headings should be
		this.headingIDs = ['section-1', 'section-2', 'section-3', 'section-4'];
		this.headings = this.headingIDs.map((headingID) => {
			let el = document.getElementById(headingID);
			return { id: el.id, position: InPageNav.offset(el) };
		});

		/* prevent the margins collapsing */
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
		//this.showHideMenu = this.showHideMenu.bind(this);

		document.addEventListener('oViewport.scroll', this.scrollWindowHandler);
		//document.addEventListener('oViewport.resize', this.showHideMenu);
	}
/*
	showHideMenu(){}

	showMenu(){
		this.inPageNavEl.setAttribute('aria-hidden', false);
	}
	hideMenu(){
		this.inPageNavEl.setAttribute('aria-hidden', true);
	}
*/



	get scrollMargin() {
		return Viewport.getSize().height / 8;
	}

	get scrollTop() {
		return window.pageYOffset || document.body.scrollTop;
	}

	scrollWindowHandler(event){

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
				document.querySelector('.sticky-nav-'+heading.id).classList.remove('o-in-page-nav-item--active');
			});
			document.querySelector('.sticky-nav-'+candidate.id).classList.add('o-in-page-nav-item--active');
			this.activeMenuItem = candidate.id;

		} else if (!candidate) {
			this.headings.forEach((heading) => {
				document.querySelector('.sticky-nav-'+heading.id).classList.remove('o-in-page-nav-item--active');
			});
		}
	}

	shouldDock(){
		return (this.scrollTop > this.dockPoint);
	}
/*
	isDocked(){
		return this.inPageNavEl.classList.contains('o-in-page-nav--affix');
	}
*/

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
