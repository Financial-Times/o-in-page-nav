import oInPageNav from './src/js/inPageNav';

const constructAll = function() {
	oInPageNav.init();
	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

document.addEventListener('o.DOMContentLoaded', constructAll);

export default oInPageNav;
