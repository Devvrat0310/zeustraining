import { createLine, handleDynamicDPI } from "./canvasComponents.js";
import { Grid } from "./CreateGrid.js";

export class ExcelGrid extends Grid {
	constructor(parent, gridIndex, height, width, zoom = 1) {
		super(parent, gridIndex, height, width, zoom, "grid_");
		this.drawGrid();
	}

	updateCanvasOffsets() {
		const rect = this.canvas.getBoundingClientRect();
		this.canvasOffsetX = rect.left;
		this.canvasOffsetY = rect.top;
	}

	setZoom(zoom) {
		this.zoom = zoom;
		this._initDimensions(1000, 1000);
		this.drawGrid();
	}

	drawGrid() {
		this.updateCanvasOffsets();
		const { ctx, canvas, rowHeight, colWidth, dpr } = this;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const rows = Math.ceil(canvas.height / rowHeight);
		const cols = Math.ceil(canvas.width / colWidth);

		ctx.lineWidth = 1;
		ctx.strokeStyle = "#d0d0d0";

		let startIndex = 0;
		if (this.gridIndex === 0) {
			startIndex = 1;
		}

		for (let i = startIndex; i <= cols; i++) {
			const x = Math.round(i * colWidth) - 0.5;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}

		for (let j = 0; j <= rows; j++) {
			const y = Math.round(j * rowHeight) - 0.5;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}
	}

	_bindEvents() {
		this.canvas.addEventListener("click", this._onCanvasClick.bind(this));
	}

	_onCanvasClick(e) {
		this.updateCanvasOffsets();
		const x = e.clientX - this.canvasOffsetX;
		const y = e.clientY - this.canvasOffsetY;

		const originX = x - (x % this.colWidth);
		const originY = y - (y % this.rowHeight);

		this.eraseOutlineCell();
		this.outlineCell(originX, originY);
		this.strokeAllCorners();
	}
}

/**
 * Manages multiple ExcelGrid canvas instances within a main canvas element,
 * providing creation and zoom synchronization functionality.
 *
 * @class CanvasManager
 * @param {HTMLCanvasElement} mainCanvas - The main canvas DOM element to render on.
 * @param {Object} zoomManager - An object managing the current zoom level.
 * @param {number} zoomManager.zoom - The current zoom factor.
 *
 */
export class CanvasManager {
	constructor(mainCanvas, zoomManager, excelLeftSpace, excelTopSpace) {
		this.mainCanvas = mainCanvas;
		this.zoomManager = zoomManager;
		this.totalCanvas = 0;
		this.canvases = [];
		this.excelLeftSpace = excelLeftSpace;
		this.excelTopSpace = excelTopSpace;
	}

	createCanvas() {
		const canvas = new ExcelGrid(
			this.mainCanvas,
			this.totalCanvas,
			1000,
			1000,
			this.zoomManager.zoom
		);
		this.canvases.push(canvas);
		this.totalCanvas++;
	}

	updatePushedOverlayHeight(height) {
		console.log("this.excelTopSpace", this.excelTopSpace);
		let space = parseInt(this.excelTopSpace.style.height, 10);
		space += height;
		this.excelTopSpace.style.height = `${space}px`;
	}

	addCanvasesToBottom() {
		// child element div
		const removedChildElement = this.mainCanvas.removeChild(
			this.mainCanvas.firstElementChild
		);

		// Update id for new column div
		removedChildElement.id = `grid_${this.totalCanvas}`;
		// Add removed child to the end
		this.mainCanvas.appendChild(removedChildElement);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.canvases.shift();
		removedChildClass.gridIndex = this.totalCanvas;
		removedChildClass.drawGrid();
		this.canvases.push(removedChildClass);

		this.totalCanvas++;
	}

	addCanvasesToTop() {
		// Check if already at the beggining
		if (this.totalCanvas == 4) return;

		// child element div
		const removedChildElement = this.mainCanvas.removeChild(
			this.mainCanvas.lastElementChild
		);
		// Update id for new column div
		removedChildElement.id = `grid_${this.totalCanvas - 5}`;
		// Insert removed child to the front
		this.mainCanvas.insertBefore(
			removedChildElement,
			this.mainCanvas.firstChild
		);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.canvases.pop();
		removedChildClass.gridIndex = this.totalCanvas - 5;
		removedChildClass.drawGrid();
		this.canvases.unshift(removedChildClass);

		this.totalCanvas--;
	}

	/**
	 * Handle scrolling and update column headers based on column index in view.
	 *
	 * @param {boolean} scrollRight - Set to true if scrolling towards right.
	 */
	scrollCanvasVertical(scrollRight) {
		// For scrolling Right.
		// Remove element from beggining from dom tree.
		// Remove element from beggining of the rows array
		// Add array push of the length of the column
		// Append element to the end of the rowsDiv.
		// Append columnClass to the end of the rows array
		// Exact reverse for scrolling left.
		if (scrollRight) {
			for (let i = 0; i < 3; i++) {
				this.addCanvasesToBottom();
			}
			this.updatePushedOverlayHeight(this.canvases[0].canvas.height);
		} else {
			for (let i = 0; i < 3; i++) {
				this.addCanvasesToTop();
			}
			this.updatePushedOverlayHeight(-this.canvases[0].canvas.height);
		}
	}

	updatePushedOverlayWidth(width) {
		// Add empty space:
		let space = parseInt(this.excelLeftSpace.style.width, 10);
		space += width;
		this.excelLeftSpace.style.width = `${space}px`;
	}

	addCanvasToRight(index) {
		// child element div
		const removedChildElement = this.mainCanvas.removeChild(
			this.mainCanvas.firstElementChild
		);
		// Update id for new column div
		removedChildElement.id = `grid_${this.totalCanvas}`;
		// Add removed child to the end
		this.mainCanvas.appendChild(removedChildElement);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.canvases.shift();
		removedChildClass.gridIndex = this.totalCanvas;
		removedChildClass.drawGrid();
		this.canvases.push(removedChildClass);

		this.totalCanvas++;
	}

	addCanvasToLeft() {
		// Check if already at the beggining
		if (this.totalCanvas == 12) return;

		// child element div
		const removedChildElement = this.mainCanvas.removeChild(
			this.mainCanvas.lastElementChild
		);
		// Update id for new column div
		removedChildElement.id = `grid_${this.totalCanvas - 5}`;
		// Insert removed child to the front
		this.mainCanvas.insertBefore(
			removedChildElement,
			this.mainCanvas.firstChild
		);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.canvases.pop();
		removedChildClass.gridIndex = this.totalCanvas - 5;
		removedChildClass.drawGrid();
		this.canvases.unshift(removedChildClass);

		// Add empty space:

		this.totalCanvas--;
	}

	/**
	 * Handle scrolling and update column headers based on column index in view.
	 *
	 * @param {boolean} scrollRight - Set to true if scrolling towards right.
	 */
	scrollCanvasHorizontal(scrollRight) {
		// For scrolling Right.
		// Remove element from beggining from dom tree.
		// Remove element from beggining of the canvases array
		// Add array push of the length of the column
		// Append element to the end of the mainCanvas.
		// Append columnClass to the end of the canvases array
		// Exact reverse for scrolling left.

		if (scrollRight) {
			for (let i = 0; i < 3; i++) {
				this.addCanvasToRight();
			}
			this.updatePushedOverlayWidth(this.canvases[0].canvas.width);
		} else {
			for (let i = 0; i < 3; i++) {
				this.addCanvasToLeft();
			}
			this.updatePushedOverlayWidth(-this.canvases[0].canvas.width);
		}
	}

	zoomAll() {
		this.canvases.forEach((canvas) =>
			canvas.setZoom(this.zoomManager.zoom)
		);

		if (this.totalCanvas > 12) {
			this.excelLeftSpace.style.width =
				this.canvases[0].canvas.width + "px";
			this.excelTopSpace.style.height =
				this.canvases[0].canvas.height + "px";
		}
	}
}
