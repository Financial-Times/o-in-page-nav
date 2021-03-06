/* eslint-env mocha, sinon, proclaim */
import proclaim from 'proclaim';
import sinon from 'sinon/pkg/sinon';
import * as fixtures from './helpers/fixtures';

const InPageNav = require('./../main');

describe("InPageNav", () => {
	it('is defined', () => {
		proclaim.equal(typeof InPageNav, 'function');
	});

	it('has a static init method', () => {
		proclaim.equal(typeof InPageNav.init, 'function');
	});

	it("should autoinitialize", (done) => {
		const initSpy = sinon.spy(InPageNav, 'init');
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
		setTimeout(function(){
			proclaim.equal(initSpy.called, true);
			initSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize when the event is not dispached", () => {
		const initSpy = sinon.spy(InPageNav, 'init');
		proclaim.equal(initSpy.called, false);
	});

	describe("should create a new", () => {
		let getOptionsStub;
		let calculateHeadings;

		beforeEach(() => {
			getOptionsStub = sinon.stub(InPageNav, 'getOptions').returns({});
			calculateHeadings = sinon.stub(InPageNav, 'calculateHeadings').returns({});
			fixtures.htmlCode();
		});

		afterEach(() => {
			getOptionsStub.restore();
			calculateHeadings.restore();
			fixtures.reset();
		});

		it("component array when initialized", () => {
			const inPageNav = InPageNav.init();
			proclaim.equal(inPageNav instanceof Array, true);
			proclaim.equal(inPageNav[0] instanceof InPageNav, true);
		});

		it("single component when initialized with a root element", () => {
			const inPageNav = InPageNav.init('#element');
			proclaim.equal(inPageNav instanceof InPageNav, true);
		});
	});
});
