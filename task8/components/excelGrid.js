import { createLine, handleDynamicDPI } from "./canvasComponents.js";

/**
 * Draws an excel grid pattern canvas, and contains methods to handle various functionalities.
 *
 * @param {HTMLDivElement} parent - The parent element in which to draw the canvas.
 */
export class createExcelGrid {
	constructor(parent, totalCanvas, zoom) {
		this.parent = parent;

		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", `canvas_${totalCanvas}`);
		this.canvas.classList.add("canvas");

		parent.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");

		this.outlinedOriginX;
		this.outlinedOriginY;

		this.ctx = this.canvas.getContext("2d");

		this.dpr = handleDynamicDPI(this.canvas, this.ctx);

		console.log("dpr canvas: ", this.dpr);
		// this.ctx.scale(dpr, dpr);
		this.zoom = zoom;

		this.rowHeight = 20 * this.zoom;
		this.colWidth = 50 * this.zoom;

		this.canvas.width = 1000 - (1000 % this.colWidth);
		this.canvas.height = 1000 - (1000 % this.rowHeight);

		this.canvasOffsetX;
		this.canvasOffsetY;

		this.drawGrid();
		this.selectCell();
	}

	updateCanvasOffsets() {
		const rect = this.canvas.getBoundingClientRect();
		this.canvasOffsetX = rect.left;
		this.canvasOffsetY = rect.top;

		console.log(
			"updated offsets, x, y: ",
			this.canvasOffsetX,
			this.canvasOffsetY
		);
	}

	setZoom(zoom) {
		this.zoom = zoom;

		this.rowHeight = 20 * this.dpr * this.zoom;
		this.colWidth = 50 * this.dpr * this.zoom;

		this.canvas.width = 1000 - (1000 % this.colWidth);
		this.canvas.height = 1000 - (1000 % this.rowHeight);

		this.drawGrid();
	}

	drawGrid() {
		this.updateCanvasOffsets();
		const dpr = window.devicePixelRatio || 1;

		const rowHeight = this.rowHeight;
		const colWidth = this.colWidth;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const rows = Math.ceil(this.canvas.height / dpr / rowHeight);
		const cols = Math.ceil(this.canvas.width / dpr / colWidth);

		this.ctx.lineWidth = 1; // usually better for grids
		this.ctx.strokeStyle = "#d0d0d0";

		for (let i = 0; i <= cols; i++) {
			const x = Math.round(i * colWidth) + 0.5;
			this.ctx.beginPath();
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, this.canvas.height / dpr);
			this.ctx.stroke();
		}

		for (let j = 0; j <= rows; j++) {
			const y = Math.round(j * rowHeight) + 0.5;
			this.ctx.beginPath();
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(this.canvas.width / dpr, y);
			this.ctx.stroke();
		}
	}

	/**
	 * Draws and outlines a cell on the canvas with a green border and light fill color.
	 *
	 * @param {number} originX - The x-coordinate of the top-left corner of the cell relative to canvas.
	 * @param {number} originY - The y-coordinate of the top-left corner of the cell reltative to canvas.
	 */
	outlineCell(originX, originY) {
		// originX = this.dpr;
		// originY = this.dpr;
		this.ctx.strokeStyle = "green";
		this.ctx.fillStyle = "#e8f2ec";
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;

		this.ctx.fillRect(originX, originY, this.colWidth, this.rowHeight);
		this.ctx.strokeRect(originX, originY, this.colWidth, this.rowHeight);

		this.outlinedOriginX = originX;
		this.outlinedOriginY = originY;
	}

	/**
	 *
	 * @param {number} originX - x coordinate of each corner of a cell to start the stroke(line)
	 * @param {*} originY - y coordinate of each corner of a cell to start the stroke(line)
	 * @param {*} endX - ending x coordinate of the stroke
	 * @param {*} endY - ending y coordinate of the stroke
	 */
	strokeEachCorner(originX, originY, endX, endY) {
		this.ctx.strokeStyle = "#d0d0d0";
		this.ctx.lineWidth = 1;

		createLine(
			this.ctx,
			originX,
			originY,
			originX,
			originY + endY,
			1,
			"#d0d0d0"
		);
		createLine(
			this.ctx,
			originX,
			originY,
			originX + endX,
			originY,
			1,
			"#d0d0d0"
		);
	}

	strokeAllCorners() {
		let adjOriginX = [0, 50, 50, 0];
		let adjOriginY = [0, 0, 20, 20];

		let adjEndX = [-2, 2, 2, -2];
		let adjEndY = [-2, -2, 2, 2];

		for (let i = 0; i < 4; i++) {
			this.strokeEachCorner(
				this.outlinedOriginX + adjOriginX[i] * this.zoom,
				this.outlinedOriginY + adjOriginY[i] * this.zoom,
				adjEndX[i] * this.zoom,
				adjEndY[i] * this.zoom
			);
		}
	}

	// eraseOutlineCell
	eraseOutlineCell() {
		this.ctx.strokeStyle = "white";
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.lineWidth = 3;

		this.ctx.fillRect(
			this.outlinedOriginX,
			this.outlinedOriginY,
			this.colWidth,
			this.rowHeight
		);
		this.ctx.strokeRect(
			this.outlinedOriginX,
			this.outlinedOriginY,
			this.colWidth,
			this.rowHeight
		);

		this.ctx.strokeStyle = "#d0d0d0";
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.lineWidth = 1;

		this.outlinedOriginX += 0.5;
		this.outlinedOriginY += 0.5;

		this.ctx.fillRect(
			this.outlinedOriginX,
			this.outlinedOriginY,
			this.colWidth,
			this.rowHeight
		);
		this.ctx.strokeRect(
			this.outlinedOriginX,
			this.outlinedOriginY,
			this.colWidth,
			this.rowHeight
		);

		this.strokeAllCorners();
	}

	// logic to handle cell selection : fill cell with color and add border to the selected cell
	selectCell() {
		this.canvas.addEventListener("click", (e) => {
			this.updateCanvasOffsets();

			// Coordinates of click
			const x = e.clientX - this.canvasOffsetX;
			const y = e.clientY - this.canvasOffsetY;

			console.log("clicked, x, y", x, y);

			// origin coordinates of clicked cell
			let originX = x - (x % (this.colWidth * this.dpr));
			let originY = y - (y % (this.rowHeight * this.dpr));

			console.log("originX, originY", originX, originY);

			this.eraseOutlineCell();
			this.outlineCell(originX, originY);
		});
	}
}

export const allCanvases = [];
