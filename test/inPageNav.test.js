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
		const defaultOptValues = {
			headingsSelector: 'h2',
			headingsContainerEl: 'body',
			activeNavItemClass: 'o-in-page-nav-item--active',
			navItemSelectorRoot: '.o-in-page-nav__item--'
		};

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
				proclaim.strictEqual(testNav[key], defaultOptValues[key]);
			});
		});

		it("uses a value passed in as opts if one exists", () => {
			const customValues = { headingsSelector: 'h5', activeNavItemClass: 'some-class' };

			const testNav = new InPageNav(document.getElementById('element'), customValues);

			proclaim.strictEqual(testNav.headingsSelector, customValues.headingsSelector);
			proclaim.strictEqual(testNav.activeNavItemClass, customValues.activeNavItemClass);
			proclaim.strictEqual(testNav.headingsContainerEl, defaultOptValues.headingsContainerEl);
			proclaim.strictEqual(testNav.navItemSelectorRoot, defaultOptValues.navItemSelectorRoot);
		});

		it("calls getOptions if no opts are passed in", () => {
			const customValues = {headingsSelector: 'h5', activeNavItemClass: 'some-class' };

			getOptionsStub.returns(customValues);

			const testNav = new InPageNav(document.getElementById('element'));

			proclaim.isTrue(getOptionsStub.called);
			proclaim.strictEqual(testNav.headingsSelector, customValues.headingsSelector);
			proclaim.strictEqual(testNav.activeNavItemClass, customValues.activeNavItemClass);
			proclaim.strictEqual(testNav.headingsContainerEl, defaultOptValues.headingsContainerEl);
			proclaim.strictEqual(testNav.navItemSelectorRoot, defaultOptValues.navItemSelectorRoot);
		});

		it('calls calculateHeadings and assigns the result to this.headings', () => {
			let pretendHeadings = {one: "test1", two: "test2", three: "test1"};
			calculateHeadings.returns(pretendHeadings);
			const testNav = new InPageNav(document.getElementById('element'));
			proclaim.deepEqual(testNav.headings, pretendHeadings);
		});

		it('wraps the innerHTML of the nav item with an inner div', () => {
			const navHTML = document.getElementById('element');


			proclaim.notStrictEqual(navHTML.childElementCount, 1);
			const listElCount = navHTML.childElementCount;

			new InPageNav(document.getElementById('element'));

			proclaim.strictEqual(navHTML.childElementCount, 1);
			proclaim.strictEqual(navHTML.childNodes[0].childElementCount, listElCount);
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
		let headingsStub;
		let offsetStub;

		beforeEach(() => {
			headingsStub = sinon.stub(InPageNav, 'calculateHeadings');
			offsetStub = sinon.stub(InPageNav, 'offset');

		});
		afterEach(() => {
			headingsStub.restore();
			offsetStub.restore();
		});

		it('updates the dockpoint and headings', () => {

			const headingsReturnValue = ['heading1', 'heading2'];
			headingsStub.returns(headingsReturnValue);

			const offsetReturn = 'offset';
			offsetStub.returns(offsetReturn);

			const testNav = new InPageNav(document.getElementById('element'));

			testNav.resizeWindowHandler();

			proclaim.isTrue(headingsStub.called);
			proclaim.isTrue(offsetStub.called);

			proclaim.deepEqual(testNav.headings, headingsReturnValue);
			proclaim.strictEqual(testNav.dockPoint, offsetReturn);
		});
	});

	describe("#scrollWindowHandler", () => {
		let shouldDockStub;
		let dockSpy;
		let undockSpy;
		let inPageNav;
		let getOptionsStub;
		let calculateHeadingsStub;
		let updateCurrentHeadingSpy;

		beforeEach(() => {
			shouldDockStub = sinon.stub(InPageNav.prototype, 'shouldDock');
			dockSpy = sinon.spy(InPageNav.prototype, 'dock');
			undockSpy = sinon.spy(InPageNav.prototype, 'undock');
			getOptionsStub = sinon.stub(InPageNav, 'getOptions').returns({});
			calculateHeadingsStub = sinon.stub(InPageNav, 'calculateHeadings').returns([]);
			updateCurrentHeadingSpy = sinon.spy(InPageNav.prototype, 'updateCurrentHeading');

			const el = document.getElementById('element');
			inPageNav = new InPageNav(el);
		});

		afterEach(() => {
			shouldDockStub.restore();
			dockSpy.restore();
			undockSpy.restore();
			getOptionsStub.restore();
			calculateHeadingsStub.restore();
			updateCurrentHeadingSpy.restore();
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
		it('calls updateCurrentHeading', () => {
			inPageNav.scrollWindowHandler(sinon.stub());
			proclaim.isTrue(updateCurrentHeadingSpy.called);
		});
	});

	describe("#updateCurrentHeading", () => {
		it('adds the active class to the current heading', () => {
			const testNavHTML = document.getElementById('element');
			const testNav = new InPageNav(testNavHTML);

			let mockHeadings = [{id: 'section-1', position: 30}, {id: 'section-2', position: 88}, {id: 'section-3', position: 132}];
			testNav.headings = mockHeadings;

			testNav.updateCurrentHeading();

			proclaim.strictEqual(testNavHTML.querySelectorAll('.'+testNav.activeNavItemClass).length, 1);

			let selectedEl = document.querySelector(testNav.navItemSelectorRoot + 'section-1');

			proclaim.isTrue(selectedEl.classList.contains(testNav.activeNavItemClass));

			// Move the headings up a bit
			mockHeadings = [{id: 'section-1', position: 0}, {id: 'section-2', position: 1}, {id: 'section-3', position: 30}];
			testNav.headings = mockHeadings;

			testNav.updateCurrentHeading();
			proclaim.strictEqual(testNavHTML.querySelectorAll('.'+testNav.activeNavItemClass).length, 1);
			proclaim.isFalse(selectedEl.classList.contains(testNav.activeNavItemClass));

			selectedEl = document.querySelector(testNav.navItemSelectorRoot + 'section-3');

			proclaim.isTrue(selectedEl.classList.contains(testNav.activeNavItemClass));

		});

		it('removes the active class from all the other headings', () => {
			const testNavHTML = document.getElementById('element');
			const testNav = new InPageNav(testNavHTML);

			let mockHeadings = [{id: 'section-1', position: 30}, {id: 'section-2', position: 88}, {id: 'section-3', position: 132}];

			testNav.headings = mockHeadings;

			// Add the active class to all of the headings
			mockHeadings.forEach((heading) => {
				document.querySelector(testNav.navItemSelectorRoot + heading.id).classList.add(testNav.activeNavItemClass);
			});

			// check all of the headings got classes
			proclaim.strictEqual(testNavHTML.querySelectorAll('.'+testNav.activeNavItemClass).length, mockHeadings.length);

			testNav.updateCurrentHeading();

			proclaim.strictEqual(testNavHTML.querySelectorAll('.'+testNav.activeNavItemClass).length, 1);

		});
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

		it('extracts headingsSelector if set', () => {

			let declarativeKey = 'data-o-in-page-nav-headings-selector';
			let imperativeKey = 'headingsSelector';

			const testNavHTML = document.getElementById('element');
			testNavHTML.setAttribute(declarativeKey, 'testString');

			const options = InPageNav.getOptions(testNavHTML);
			proclaim.strictEqual(options[imperativeKey], testNavHTML.getAttribute(declarativeKey));
		});

		it('extracts nav item class root if set', () => {
			let declarativeKey = 'data-o-in-page-nav-nav-item-class-root';
			let imperativeKey = 'navItemClassRoot';

			const testNavHTML = document.getElementById('element');
			testNavHTML.setAttribute(declarativeKey, 'testString');

			const options = InPageNav.getOptions(testNavHTML);
			proclaim.strictEqual(options[imperativeKey], testNavHTML.getAttribute(declarativeKey));

		});

		it('extracts active nav item class if set', () => {
			let declarativeKey = 'data-o-in-page-nav-active-nav-item-class';
			let imperativeKey = 'activeNavItemClass';

			const testNavHTML = document.getElementById('element');
			testNavHTML.setAttribute(declarativeKey, 'testString');

			const options = InPageNav.getOptions(testNavHTML);
			proclaim.strictEqual(options[imperativeKey], testNavHTML.getAttribute(declarativeKey));

		});

		it('extracts headings container el if set', () => {
			let declarativeKey = 'data-o-in-page-nav-headings-container-el';
			let imperativeKey = 'headingsContainerEl';

			const testNavHTML = document.getElementById('element');
			testNavHTML.setAttribute(declarativeKey, 'testString');

			const options = InPageNav.getOptions(testNavHTML);
			proclaim.strictEqual(options[imperativeKey], testNavHTML.getAttribute(declarativeKey));
		});
	});

	describe("calculateHeadings", () => {
		it('returns an array of headings objects that have an id and a page offset', () => {
			let headings = InPageNav.calculateHeadings('h2', 'body');

			headings.forEach((heading) => {
				proclaim.ok(document.getElementById(heading.id));
				proclaim.isNumber(heading.position);
			});

			proclaim.strictEqual(headings.length, 3);
		});

		it('calculates sets the position to the return value for offset', () => {
			const offsetStub = sinon.stub(InPageNav, 'offset').returns('testValue3');
			offsetStub.onFirstCall().returns('testValue1');
			offsetStub.onSecondCall().returns('testValue2');

			InPageNav.calculateHeadings('h2', 'body');

			proclaim.isTrue(offsetStub.calledThrice); // m'lady
			offsetStub.restore();
		});

		it('throws if there were no headings found for the selectors passed in', () => {
			proclaim.throws(() => {InPageNav.calculateHeadings('nope', 'nope');});
		});
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
