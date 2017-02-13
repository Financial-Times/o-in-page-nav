o-in-page-nav [![Circle CI](https://circleci.com/gh/Financial-Times/o-in-page-nav/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/o-in-page-nav/tree/master)
=================

This component does two things:

* Make a navigation element 'stick' to the screen when the window scroll position reaches the top of the 'sticky' nav
* As the scrolling continues, adds an active class to the nav item that is on the screen

This component has no styling. You should style it in keeping with your product.

- [Usage](#usage)
	- [Markup](#markup)
	- [JavaScript](#javascript)
	- [Sass](#sass)
- [Contact](#contact)
- [Licence](#licence)

## Usage

This component can be used imperatively, passed in as options to the constructor, or declaratively using data attributes on the `o-in-page-nav` node eg `data-o-in-page-nav-headings-selector="h3"`.

The available configuration options are:

* **headings-container-el**: The container of the content for the nav. This defaults to the document body.
* **headings-selector**: The selector to be applied to the headings-container-el. This defaults to `h2`.
* **active-nav-item-class**: The class to be added to the 'active' item in the navigation. Defaults to `o-in-page-nav-item--active`
* **nav-item-selector-root**: The root of the selector used to highlight the active item. Defaults to `.o-in-page-nav__item--`.


### Markup

We advise your navigation markup uses a `<nav>` with some links in, rather than using an ordered list. The reasons for this are discussed at length [in this CSS tricks article](https://css-tricks.com/navigation-in-lists-to-be-or-not-to-be/), tl;dr Screen readers.

Your nav links should have a class of `o-in-page-nav__item--{section id}`. This is used to highlight the active element as the page scrolls. If you want to define your own selector (not use `o-in-page-nav*`), you can set a custom selector root in the options on the `o-in-page-nav` element.

The `h2`s, or whatever you've chosen as your heading elements, should have an id so they can be jump linked to.

```html
<nav role="navigation" data-o-component='o-in-page-nav'>
	<a class="o-in-page-nav__item--section-1" href="#section-1">Section 1</a>
	<a class="o-in-page-nav__item--section-2" href="#section-2">Section 2</a>
	<a class="o-in-page-nav__item--section-3" href="#section-3">Section 3</a>
	<a class="o-in-page-nav__item--section-4" href="#section-4">Section 4</a>
</nav>
<!-- whatever your body markup is -->
<div class='content'>
	<h2 id='section-1'>Section 1</h2>
	<p> ... </p>
	<h2 id='section-2'>Section 2</h2>
	<p> ... </p>
	<h2 id='section-3'>Section 3</h2>
	<p> ... </p>
	<h2 id='section-4'>Section 4</h2>
	<p> ... </p>
</div>
```

### JavaScript

No code will run automatically unless you are using the Build Service.
You must either construct an `OInPageNav` instance or fire the `o.DOMContentLoaded` event, which all Origami components listen for.

#### Constructing an o-in-page-nav

```js
const OInPageNav = require('o-in-page-nav');

const nav = new OInPageNav();
```

#### Firing an oDomContentLoaded event

You only need to do this once, as all Origami components listen for this event.

```js
document.addEventListener('DOMContentLoaded', function() {
	document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
});
```

### Sass

This component does not provide any styles except those needed to 'stick' the menu to the screen at the right scroll point.

The JavaScript used to highlight the 'current' item in the nav will apply and remove an active class. This can be set in the component options, so if you want to use your own class name convention, that will work. It defaults to `.o-in-page-nav-item--active`. If you want to style on that, that's fine too.

This component makes no guesses about what screen sizes it should be shown / hidden. For single column widths, this component should probably be hidden but that is up to your application to handle.

---

## Contact

If you have any questions or comments about this component, or need help using it, please either [raise an issue](https://github.com/Financial-Times/o-in-page-nav/issues), visit [#ft-origami](https://financialtimes.slack.com/messages/ft-origami/) or email [Origami Support](mailto:origami-support@ft.com).

----

## Licence

This software is published by the Financial Times under the [MIT licence](http://opensource.org/licenses/MIT).
