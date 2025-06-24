import { columnsCanvas, allColumns } from "./components/columnHeader.js";

import { createLine, handleDynamicDPI } from "./components/canvasComponents.js";

let zoom = 1;

/**
 * Draws an excel grid pattern canvas, and contains methods to handle various functionalities.
 *
 * @param {HTMLDivElement} parent - The parent element in which to draw the canvas.
 */
class createCanvas {
	constructor(parent, totalCanvas) {
		this.parent = parent;

		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", `canvas_${totalCanvas}`);
		this.canvas.setAttribute("height", 1000);
		this.canvas.setAttribute("width", 1000);
		this.canvas.classList.add("canvas");

		parent.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");

		this.outlinedOriginX;
		this.outlinedOriginY;

		this.ctx = this.canvas.getContext("2d");
		this.dpr = handleDynamicDPI(this.canvas, this.ctx);
		console.log("dpr : ", this.dpr);
		// this.ctx.scale(dpr, dpr);

		this.rowHeight = 20;
		this.colWidth = 50;

		this.zoom = 1;

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

	setZoom(change) {
		// const previousZoom
		this.zoom += change;
		this.zoom = Math.min(3, Math.max(0.4, this.zoom));
		// this.zoom = Math.max(0.5, this.zoom);
		this.zoom = parseFloat(this.zoom.toFixed(1)); // => 3
		console.log("this.zoom", this.zoom);

		this.rowHeight = 20 * this.dpr * this.zoom;
		this.colWidth = 50 * this.dpr * this.zoom;

		this.canvas.width = 1000 - (1000 % this.colWidth);
		this.canvas.height = 1000 - (1000 % this.rowHeight);

		console.log(
			"this.canvas.width, this.canvas.height",
			this.canvas.width,
			this.canvas.height
		);

		this.drawGrid();
		// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

const mainCanvas = document.querySelector(".main-canvas");

const allCanvases = [];

allCanvases.push(new createCanvas(mainCanvas, 0));
allCanvases.push(new createCanvas(mainCanvas, 0));

let totalColumnSheet = 0;

let lastColumnEnd = 0;

const columns = document.querySelector(".columns");

function createNewColumn() {
	let columnInstant = new columnsCanvas(
		columns,
		totalColumnSheet,
		lastColumnEnd,
		zoom
	);

	lastColumnEnd = columnInstant.lastColumnEnd;
	allColumns.push(columnInstant.this);
}

for (let i = 0; i < 2; i++) {
	createNewColumn();
}

// new rowsCanvas(0);
// new rowsCanvas(1);

let totalRowSheet = 0;

let totalDeltaHorizontal = 0;
let totalDeltaVertical = 0;

const columnsDiv = document.getElementsByClassName("columns")[0];
const rowsDiv = document.querySelector(".rows");

function handleScroll(deltaY, isHorizontalScrolling) {
	if (isHorizontalScrolling) {
		totalDeltaHorizontal += deltaY;
		if (totalDeltaHorizontal >= 1000) {
			totalDeltaHorizontal = 0;
			createNewColumn();
			allCanvases.push(new createCanvas(mainCanvas, 0));

			totalDeltaHorizontal = 0;
		} else if (totalDeltaHorizontal <= -1000) {
			let len = columnsDiv.children.length;
			if (len > 2) {
				columnsDiv.removeChild(columnsDiv.children[len - 1]);
			}
			totalColumnSheet--;
			totalDeltaHorizontal = 0;
		}
	} else {
		totalDeltaVertical += deltaY;
		if (totalDeltaVertical >= 1000) {
			totalDeltaVertical = 0;
			new rowsCanvas(totalRowSheet);
			totalRowSheet++;
			totalDeltaVertical = 0;
		} else if (totalDeltaVertical <= -1000) {
			let len = rowsDiv.children.length;
			if (len > 2) {
				rowsDiv.removeChild(rowsDiv.children[len - 1]);
			}
			totalRowSheet--;
			totalDeltaVertical = 0;
		}
	}
}
function handleZoom(e) {
	e.preventDefault();

	if (e.deltaY < 0) {
		zoom += 0.2;

		// zoom in
		// newCanvas.setZoom(0.2);
		// newCanvas2.setZoom(0.2);
		lastColumnEnd = 0;
		allCanvases.forEach((element) => {
			console.log("element", element);
			element.setZoom(0.2);
		});

		allColumns.forEach((element) => {
			lastColumnEnd = element.setZoom(0.2, lastColumnEnd);
		});
	} else {
		zoom -= 0.2;
		// zoom out
		// newCanvas.setZoom(-0.2);
		// newCanvas2.setZoom(-0.2);
		lastColumnEnd = 0;
		allCanvases.forEach((element, index) => {
			element.setZoom(-0.2);
		});
		allColumns.forEach((element) => {
			lastColumnEnd = element.setZoom(-0.2, lastColumnEnd);
		});
	}

	zoom = Math.min(3, Math.max(0.4, zoom));
	zoom = parseFloat(zoom.toFixed(1));
}

document.addEventListener(
	"wheel",
	(e) => {
		if (e.shiftKey) {
			handleScroll(e.deltaY, true);
		} else if (e.ctrlKey) {
			handleZoom(e);
		} else {
			console.log("unshifted");
			handleScroll(e.deltaY, false);
		}
	},
	{ passive: false }
);
