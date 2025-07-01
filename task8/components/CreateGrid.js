import { createLine, handleDynamicDPI } from "./canvasComponents.js";

/**
 * Draws an excel grid pattern canvas, and contains methods to handle various functionalities.
 *
 * @param {HTMLDivElement} parent - The parent element in which to draw the canvas.
 */
export class Grid {
	constructor(parent, gridIndex, height, width, zoom, canvasName) {
		this.parent = parent;
		this.zoom = zoom;
		this.gridIndex = gridIndex;
		this.canvasName = canvasName || "canvas_";
		this.dpr = window.devicePixelRatio || 1;

		this.canvas = this._createCanvas(gridIndex, canvasName);
		this.ctx = this.canvas.getContext("2d");

		this._initDimensions(height, width);
		this._appendCanvas();

		this.outlinedCell = null;

		// this.drawGrid();
	}

	_createCanvas(totalCanvas, canvasName) {
		const canvas = document.createElement("canvas");
		canvas.id = `${canvasName}${totalCanvas}`;
		canvas.classList.add("canvas");
		return canvas;
	}

	_appendCanvas() {
		this.parent.appendChild(this.canvas);
	}

	_initDimensions(height, width) {
		this.rowHeight = 15 * this.zoom;
		this.colWidth = 50 * this.zoom;
		if (height < 800) {
			this.canvas.height = height * this.zoom;
		} else {
			this.canvas.height = height - (height % this.rowHeight);
		}

		if (width < 800) {
			this.canvas.width = width * this.zoom;
		} else {
			this.canvas.width = width - (width % this.colWidth);
		}

		this.updateCanvasOffsets();
	}

	updateCanvasOffsets() {
		const rect = this.canvas.getBoundingClientRect();
		this.canvasOffsetX = rect.left;
		this.canvasOffsetY = rect.top;
	}

	updatePushedOverlayWidth(width, left, currCanvas) {
		// Add empty space:
		if (width === null) {
			let space = parseInt(currCanvas.style.left, 10);
			space += left;
			currCanvas.style.left = `${space}px`;
		} else {
			let space = parseInt(currCanvas.style.width, 10);
			space += width;
			currCanvas.style.width = `${space}px`;
		}
	}

	updatePushedOverlayHeight(height, top, currCanvas) {
		if (height === null) {
			let space = parseInt(currCanvas.style.top, 10);
			space += top;
			currCanvas.style.left = `${space}px`;
		} else {
			let space = parseInt(currCanvas.style.height, 10);
			space += height;
			currCanvas.style.height = `${space}px`;
		}
	}

	setZoom(zoom) {
		this.zoom = zoom;
		this._initDimensions();
		this.drawGrid();
	}
}
