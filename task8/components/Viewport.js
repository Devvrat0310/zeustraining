/**
 * Manages the state of the visible area of the spreadsheet (the "viewport").
 * This includes scroll position, zoom level, and container dimensions.
 */
export class Viewport {
	/**
	 * Initializes the Viewport.
	 * @param {HTMLElement} container The main spreadsheet container element.
	 */
	constructor(container) {
		/** @type {number} The horizontal scroll position in pixels. */
		this.scrollLeft = 0;
		/** @type {number} The vertical scroll position in pixels. */
		this.scrollTop = 0;
		/** @type {number} The current zoom factor. */
		this.zoom = 1;

		/** @type {number} The width of the viewport container. */
		this.width = container.clientWidth;
		/** @type {number} The height of the viewport container. */
		this.height = container.clientHeight;
	}

	/**
	 * Updates the viewport dimensions, e.g., on window resize.
	 * @param {number} width The new width.
	 * @param {number} height The new height.
	 */
	updateDimensions(container) {
		this.width = container.clientWidth;
		this.height = container.clientHeight;
	}
}
