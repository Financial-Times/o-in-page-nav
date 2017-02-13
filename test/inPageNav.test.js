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

});
