import Viewport from 'o-viewport';

class InPageNav {

	constructor (InPageNavEl, opts) {
		this.inPageNavEl = InPageNavEl;
		this.opts = opts || {}; // no opts right now

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

	scrollWindowHandler(event){

		if(this.shouldDock()) {
			this.dock();
		} else {
			this.undock();
		}

		/* which menu item should be highlighted */
		return false;
	}

	shouldDock(){
		const scrolltop = window.pageYOffset || document.body.scrollTop;
		const dockpoint = InPageNav.offset(this.inPageNavEl) + this.inPageNavEl.scrollHeight;

		return scrolltop > dockpoint
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
