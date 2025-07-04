/**
 * A base class for all rendering.
 */
export class Renderer {
	/**
	 * @param {HTMLCanvasElement} canvas The canvas element to be rendered upon.
	 */
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.dpr = window.devicePixelRatio || 1;
	}

	/**
	 * Configures the canvas dimensions for the current device pixel ratio.
	 */
	configure() {
		const rect = this.canvas.getBoundingClientRect();

		this.canvas.width = rect.width * this.dpr;
		this.canvas.height = rect.height * this.dpr;
		this.ctx.scale(this.dpr, this.dpr);
	}

	/**
	 * Clears the entire canvas.
	 */
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * Snaps a logical coordinate to the nearest physical pixel center.
	 * This prevents blurry lines caused by anti-aliasing.
	 * @param {number} coordinate The logical coordinate to snap.
	 * @returns {number} The snapped coordinate.
	 */
	snap(coordinate) {
		return (Math.floor(coordinate * this.dpr) + 0.5) / this.dpr;
	}
}
