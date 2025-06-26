import { createLine, handleDynamicDPI } from "./canvasComponents.js";
import { Grid } from "./CreateGrid.js";

/**
 *
 */
export class RowsCanvas extends Grid {
	constructor(parent, gridIndex, height, width, zoom = 1) {
		super(parent, gridIndex, height, width, zoom, "row");
		this.drawRows();
	}

	setZoom(zoom) {
		this.zoom = zoom;

		super._initDimensions(1000, 50);

		this.ctx.font = `${15 * this.zoom}px monospace`;
		this.drawRows();
	}

	drawRows() {
		const rowsFit = Math.floor(this.canvas.height / this.rowHeight);
		const startIdx = this.gridIndex * rowsFit;
		const endIdx = startIdx + rowsFit;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "#e9e9e9";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.strokeStyle = "#bdbdbd";
		this.ctx.lineWidth = 1;
		// this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

		const maxWidth = this.canvas.width - 0.5;
		createLine(
			this.ctx,
			maxWidth,
			0,
			maxWidth,
			this.canvas.height,
			1,
			"#bdbdbd"
		);

		this.ctx.font = `${10 * this.zoom}px monospace`;
		this.ctx.textAlign = "right";
		this.ctx.fillStyle = "#5c6b72";

		for (let i = startIdx; i <= endIdx; i++) {
			const y = (i - startIdx) * this.rowHeight - 0.5;
			createLine(this.ctx, 0, y, maxWidth, y, 1, "#ccc");
			this.ctx.fillText(
				i + 1,
				maxWidth - 5,
				y + this.rowHeight / 2 + 5 * this.zoom
			);
		}

		this.lastRowEnd = endIdx;
	}
}

/**
 * Manages a collection of RowsCanvas instances within a container element.
 * Handles creation, removal, and zooming of row canvases.
 *
 * @class RowManager
 * @param {HTMLElement} rowsDiv - The container element where row canvases are appended.
 * @param {Object} zoomManager - An object managing the zoom level, expected to have a `zoom` property.
 *
 * @property {HTMLElement} rowsDiv - The container for row canvases.
 * @property {Object} zoomManager - The zoom manager object.
 * @property {number} totalRowSheet - The total number of row sheets created.
 * @property {number} lastRowEnd - The end position of the last row.
 * @property {RowsCanvas[]} rows - Array holding all RowsCanvas instances.
 *
 * @method createRow - Creates a new RowsCanvas, appends it to the container, and updates internal state.
 * @method removeLastRow - Removes the last RowsCanvas from the container and updates internal state.
 * @method zoomAll - Applies the current zoom level to all RowsCanvas instances.
 */
export class RowManager {
	constructor(rowsDiv, pushedOverlayRows, zoomManager) {
		this.rowsDiv = rowsDiv;
		this.zoomManager = zoomManager;
		this.totalRowSheet = 0;
		this.lastRowEnd = 0;
		this.rows = [];
		this.pushedOverlayRows = pushedOverlayRows;
	}

	createRow() {
		const row = new RowsCanvas(
			this.rowsDiv,
			this.totalRowSheet,
			1000,
			50,
			this.zoomManager.zoom
		);
		this.totalRowSheet++;
		this.lastRowEnd = row.lastRowEnd;
		this.rows.push(row);
	}

	removeLastRow() {
		if (this.rowsDiv.children.length > 2) {
			this.rowsDiv.removeChild(this.rowsDiv.lastElementChild);
			this.rows.pop();
			allRows.pop();
			this.totalRowSheet--;
		}
	}

	updatePushedOverlayWidth(height) {
		let space = parseInt(this.pushedOverlayRows.style.height, 10);
		space += height;
		this.pushedOverlayRows.style.height = `${space}px`;
	}

	addRowToBottom() {
		// child element div
		const removedChildElement = this.rowsDiv.removeChild(
			this.rowsDiv.firstElementChild
		);
		// Update id for new column div
		removedChildElement.id = `canvas_${this.totalRowSheet}`;
		// Add removed child to the end
		this.rowsDiv.appendChild(removedChildElement);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.rows.shift();
		removedChildClass.gridIndex = this.totalRowSheet;
		removedChildClass.drawRows();
		this.rows.push(removedChildClass);

		this.updatePushedOverlayWidth(removedChildClass.canvas.height);
		this.totalRowSheet++;
	}

	addRowToTop() {
		// Check if already at the beggining
		if (this.totalRowSheet == 4) return;

		console.log("window.scrollY", window.scrollY);
		const height = 1000 - (1000 % (20 * this.zoomManager.zoom));

		const sheetIndex = Math.floor(window.scrollY / height);
		console.log("sheetIndex", sheetIndex);

		console.log("height", height);

		// child element div
		const removedChildElement = this.rowsDiv.removeChild(
			this.rowsDiv.lastElementChild
		);
		// Update id for new column div
		removedChildElement.id = `canvas_${this.totalRowSheet - 5}`;
		// Insert removed child to the front
		this.rowsDiv.insertBefore(removedChildElement, this.rowsDiv.firstChild);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.rows.pop();
		removedChildClass.gridIndex = this.totalRowSheet - 5;
		removedChildClass.drawRows();
		this.rows.unshift(removedChildClass);

		this.updatePushedOverlayWidth(-removedChildClass.canvas.height);

		this.totalRowSheet--;
	}

	/**
	 * Handle scrolling and update column headers based on column index in view.
	 *
	 * @param {boolean} scrollRight - Set to true if scrolling towards right.
	 */
	scrollRow(scrollRight) {
		// For scrolling Right.
		// Remove element from beggining from dom tree.
		// Remove element from beggining of the rows array
		// Add array push of the length of the column
		// Append element to the end of the rowsDiv.
		// Append columnClass to the end of the rows array
		// Exact reverse for scrolling left.

		if (scrollRight) {
			this.addRowToBottom();
		} else {
			this.addRowToTop();
		}
	}

	zoomAll() {
		this.rows.forEach((row) => {
			row.setZoom(this.zoomManager.zoom);
		});
	}
}
