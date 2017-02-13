/* eslint-env mocha, sinon, proclaim */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';
import Viewport from 'o-viewport';

const InPageNav = require('./../main');

describe("InPageNav", () => {
	beforeEach(() => {
		fixtures.htmlCode();
	});

	afterEach(() => {
		fixtures.reset();
	});

	describe("constructor", () => {
		let getOptionsStub;
		let calculateHeadings;
		const defaultOptValues = { headingsSelector: 'h2',
											containerEl: document.body,
											activeNavItemClass: 'o-in-page-nav-item--active',
											navItemSelectorRoot: '.o-in-page-nav__item--'};

		beforeEach(() => {
			getOptionsStub = sinon.stub(InPageNav, 'getOptions').returns({});
			calculateHeadings = sinon.stub(InPageNav, 'calculateHeadings').returns({});
		});

		afterEach(() => {
			getOptionsStub.restore();
			calculateHeadings.restore();
		});

		it("adds viewport listeners", () => {
			const viewportSpy = sinon.spy(Viewport, 'listenTo');
			InPageNav.init();
			proclaim.isTrue(viewportSpy.calledTwice);
			viewportSpy.restore();
		});

		it("adds document listener for viewport scroll events", () => {
			const documentSpy = sinon.spy(document, 'addEventListener');
			InPageNav.init();
			proclaim.isTrue(documentSpy.called);
			documentSpy.restore();
		});

		it("sets defaults if no opts are passed in and none are declared", () => {

			const testNav = new InPageNav(document.getElementById('element'));

			Object.keys(defaultOptValues).forEach(function(key) {
				proclaim.strictEqual(testNav[key], defaultOptValues[key])
			});
		});

		it("uses a value passed in as opts if one exists", () => {
			const customValues = { headingsSelector: 'h5', activeNavItemClass: 'some-class' };

			const testNav = new InPageNav(document.getElementById('element'), customValues);

			proclaim.strictEqual(testNav.headingsSelector, customValues.headingsSelector);
			proclaim.strictEqual(testNav.activeNavItemClass, customValues.activeNavItemClass);
			proclaim.strictEqual(testNav.containerEl, defaultOptValues.containerEl);
			proclaim.strictEqual(testNav.navItemSelectorRoot, defaultOptValues.navItemSelectorRoot);
		});

		it("calls getOptions if no opts are passed in", () => {
			const customValues = {headingsSelector: 'h5', activeNavItemClass: 'some-class' }

			getOptionsStub.returns(customValues);

			const testNav = new InPageNav(document.getElementById('element'));

			proclaim.isTrue(getOptionsStub.called);
			proclaim.strictEqual(testNav.headingsSelector, customValues.headingsSelector);
			proclaim.strictEqual(testNav.activeNavItemClass, customValues.activeNavItemClass);
			proclaim.strictEqual(testNav.containerEl, defaultOptValues.containerEl);
			proclaim.strictEqual(testNav.navItemSelectorRoot, defaultOptValues.navItemSelectorRoot);
		});

		it('calls calculateHeadings and assigns the result to this.headings', () => {
			let pretendHeadings = {one: "test1", two: "test2", three: "test1"};
			calculateHeadings.returns(pretendHeadings);
			const testNav = new InPageNav(document.getElementById('element'));
			proclaim.deepEqual(testNav.headings, pretendHeadings)
		});

		it('wraps the innerHTML of the nav item with an inner div', () => {
			const originalHTML = document.getElementById('element').innerHTML;
			const expectedInnerHTML = document.createElement('div');
			expectedInnerHTML.innerHTML = originalHTML;

			const testNav = new InPageNav(document.getElementById('element'));

		});

		it('sets the dockPoint to the return value of InPageNav.offset', () => {
			const offsetReturn = 1234;
			const offsetStub = sinon.stub(InPageNav, 'offset').returns(offsetReturn);
			const testNav = new InPageNav(document.getElementById('element'));

			proclaim.isTrue(offsetStub.called);
			proclaim.strictEqual(testNav.dockPoint, offsetReturn);
			offsetStub.restore();
		});
	});

	describe('#resizeWindowHandler', () => {
		it('updates the dockpoint');
		it('updates the headings');
	});

	describe("#scrollWindowHandler", () => {
		let shouldDockStub;
		let dockSpy;
		let undockSpy;
		let inPageNav;
		let getOptionsStub;
		let calculateHeadings;

		beforeEach(() => {
			shouldDockStub = sinon.stub(InPageNav.prototype, 'shouldDock');
			dockSpy = sinon.spy(InPageNav.prototype, 'dock');
			undockSpy = sinon.spy(InPageNav.prototype, 'undock');
			getOptionsStub = sinon.stub(InPageNav, 'getOptions').returns({});
			calculateHeadings = sinon.stub(InPageNav, 'calculateHeadings').returns([]);

			const el = document.getElementById('element');
			inPageNav = new InPageNav(el);
		});

		afterEach(() => {
			shouldDockStub.restore();
			dockSpy.restore();
			undockSpy.restore();
			getOptionsStub.restore();
			calculateHeadings.restore();
		});

		it('calls dock if the result of shouldDock is true', () => {
			shouldDockStub.returns(true);

			inPageNav.scrollWindowHandler(sinon.stub());
			proclaim.isTrue(shouldDockStub.called);
			proclaim.isTrue(dockSpy.called);
			proclaim.isFalse(undockSpy.called);
		});
		it('calls undock if the result of shouldDock is false', () => {
			shouldDockStub.returns(false);

			inPageNav.scrollWindowHandler(sinon.stub());
			proclaim.isTrue(shouldDockStub.called);
			proclaim.isFalse(dockSpy.called);
			proclaim.isTrue(undockSpy.called);
		});

	});

	describe("#getCurrentHeading", () => {
		it('adds the active class to the current heading');
		it('removes the active class from all the other headings');
	});

	describe("#dock", () => {

		let getOptionsStub;
		let calculateHeadings;

		beforeEach(() => {
			getOptionsStub = sinon.stub(InPageNav, 'getOptions').returns({});
			calculateHeadings = sinon.stub(InPageNav, 'calculateHeadings').returns({});
		});

		afterEach(() => {
			getOptionsStub.restore();
			calculateHeadings.restore();
		});

		it("adds the fixed class to the navigation container", () => {
			const el = document.getElementById('element');
			const inPageNav = new InPageNav(el);
			inPageNav.dock();
			proclaim.isTrue(inPageNav.inPageNavEl.classList.contains('o-in-page-nav--affix'));
		});
	});

	describe("#undock", () => {

		let getOptionsStub;
		let calculateHeadings;

		beforeEach(() => {
			getOptionsStub = sinon.stub(InPageNav, 'getOptions').returns({});
			calculateHeadings = sinon.stub(InPageNav, 'calculateHeadings').returns({});
		});

		afterEach(() => {
			getOptionsStub.restore();
			calculateHeadings.restore();
		});

		it("removes the fixed class to the navigation container", () => {
			const el = document.getElementById('element');
			const inPageNav = new InPageNav(el);
			inPageNav.undock();
			proclaim.isFalse(inPageNav.inPageNavEl.classList.contains('o-in-page-nav--affix'));
		});
	});

	describe("getOptions", () => {
		it('extracts the data options from the element passed in to it');
	});

	describe("calculateHeadings", () => {
		it('returns an array of headings objects that have an id and a page offset');
		it('throws if there were no headings found for the selectors passed in');
	});

	describe("#offset", () => {
		it("returns the vertical offset of the element from the top of the document", () => {
			const el = document.getElementById('element');

			/* make sure this isn't already true */
			proclaim.notEqual(InPageNav.offset(el), 50);

			/* set the top to be something we know */
			el.style.top = '50px';
			el.style.position = 'absolute';

			proclaim.strictEqual(InPageNav.offset(el), 50);
		});
	});

});
