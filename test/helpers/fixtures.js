let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}


function htmlCode () {
	const html = `<div>
			<div id="element" data-o-component="o-in-page-nav">
				<a class='o-in-page-nav__item--section-1'>one</a>
				<a class='o-in-page-nav__item--section-2'>two</a>
				<a class='o-in-page-nav__item--section-3'>three</a>
			</div>
			<div class='customContainer'>
				<h2 id='section-1'>Section 1</h2>
				<h2 id='section-2'>Section 2</h2>
				<h2 id='section-3'>Section 3</h2>
			</div>
		</div>
		`;
	insert(html);
}

export {
	htmlCode,
	reset
};
