/**
 * Manages zoom level state and persistence using localStorage.
 *
 * @class ZoomManager
 */
export class ZoomManager {
	/**
	 * Initializes a new instance of ZoomManager.
	 * Loads the zoom level from localStorage or sets it to default (1).
	 */
	constructor() {
		this.zoom = 1;
		this.loadZoom();
	}

	/**
	 * Loads the zoom level from localStorage.
	 * If not present, sets zoom to default (1) and stores it.
	 */
	loadZoom() {
		const temp = window.localStorage.getItem("zoom");
		this.zoom = temp ? parseFloat(temp) : 1;
		window.localStorage.setItem("zoom", this.zoom);
	}

	/**
	 * Sets the zoom level by a given delta, clamps it between 0.6 and 3,
	 * rounds to one decimal place, and persists it to localStorage.
	 * @param {number} delta The amount to change the zoom level by.
	 */
	setZoom(delta) {
		this.zoom = Math.min(3, Math.max(0.6, this.zoom + delta));
		this.zoom = parseFloat(this.zoom.toFixed(1));
		window.localStorage.setItem("zoom", this.zoom);
		this.loadZoom();
	}
}
