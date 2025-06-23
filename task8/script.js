function createLine(ctx, startX, startY, endX, endY, width, color) {
	ctx.beginPath();
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
}

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
		this.canvas.setAttribute("height", window.innerHeight * 2);
		this.canvas.setAttribute("width", window.innerWidth * 2);
		this.canvas.classList.add("canvas");

		parent.appendChild(this.canvas);
		// document.body.appendChild(this.canvas);

		this.gridData = [];
		this.rowWidths = [];
		this.colWidths = [];

		this.ctx = this.canvas.getContext("2d");

		const rect = this.canvas.getBoundingClientRect();

		this.canvasOffsetX = rect.left;
		this.canvasOffsetY = rect.top;

		console.log(
			"this.canvasOffsetX, this.canvasOffsetY",
			this.canvasOffsetX,
			this.canvasOffsetY
		);

		this.rowHeight = 25;
		this.rowWidth = 50;
		this.drawGrid();
		this.selectCell();
		this.resizeRow();

		this.outlinedOriginX;
		this.outlinedOriginY;
	}

	/**
	 * Creates the excel grid to draw cells in the current canvas.
	 */
	drawGrid() {
		let i = 0;
		while (i * 10 < this.canvas.width) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = "#d0d0d0"; // Similar to Excel's grid color
			this.ctx.lineWidth = 2;
			this.ctx.moveTo(i * 50, 0);
			this.ctx.lineTo(i * 50, this.canvas.height);
			this.ctx.stroke();
			i++;
		}

		i = 0;

		while (i * 10 < this.canvas.height) {
			this.ctx.beginPath();
			this.ctx.lineWidth = 2;
			this.ctx.moveTo(0, i * 25);
			this.ctx.lineTo(this.canvas.width, i * 25);
			this.ctx.stroke();
			i++;
		}
	}

	/**
	 * Increase the width or height of the canvas to handle infinite scrolling.
	 *
	 * @param {number} deltaY - The amount of scroll.
	 * @param {boolean} isHorizontalScrolling - Set to true of shift is pressed through the screen horizontally.
	 */
	handleScroll(deltaY, isHorizontalScrolling) {
		if (isHorizontalScrolling) {
			this.canvas.setAttribute(
				"width",
				Math.max(this.canvas.width + deltaY, window.innerWidth * 2)
			);
		} else {
			this.canvas.setAttribute(
				"height",
				Math.max(this.canvas.height + deltaY, window.innerHeight * 2)
			);
		}
		this.drawGrid();
	}

	// outlineCell
	/**
	 * Draws and outlines a cell on the canvas with a green border and light fill color.
	 *
	 * @param {number} originX - The x-coordinate of the top-left corner of the cell relative to canvas.
	 * @param {number} originY - The y-coordinate of the top-left corner of the cell reltative to canvas.
	 */
	outlineCell(originX, originY) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "green";
		this.ctx.fillStyle = "#e8f2ec";
		this.ctx.lineWidth = 2;

		this.ctx.fillRect(originX, originY, 50, 25);
		this.ctx.strokeRect(originX, originY, 50, 25);

		this.outlinedOriginX = originX;
		this.outlinedOriginY = originY;
	}

	// eraseOutlineCell
	eraseOutlineCell() {
		this.ctx.beginPath();
		this.ctx.strokeStyle = "#d0d0d0";
		this.ctx.fillStyle = "white";
		this.ctx.lineWidth = 2;

		this.ctx.fillRect(this.outlinedOriginX, this.outlinedOriginY, 50, 25);
		this.ctx.strokeRect(this.outlinedOriginX, this.outlinedOriginY, 50, 25);
	}

	// logic to handle cell selection : fill cell with color and add border to the selected cell
	selectCell() {
		this.canvas.addEventListener("click", (e) => {
			console.log("hehe");
			console.log(
				"this.canvasOffsetX, this.canvasOffsetY",
				this.canvasOffsetX,
				this.canvasOffsetY
			);

			// Coordinates of click
			const x = e.clientX - this.canvasOffsetX;
			const y = e.clientY - this.canvasOffsetY;

			console.log("x, y", x, y);

			// origin coordinates of clicked cell
			let originX = x - (x % 50);
			let originY = y - (y % 25);

			if (originX == 0 || originY == 0) return;

			console.log("originX, originY", originX, originY);

			this.eraseOutlineCell();
			this.outlineCell(originX, originY);
		});
	}

	resizeRow() {
		let colLine = 50;
		let rowLine = 25;

		let hoverColLine = false;
		let hoverRowLine = false;

		let dragColLine = false;
		let dragRowLine = false;

		this.canvas.addEventListener("mousemove", (e) => {
			const x = e.clientX - this.canvasOffsetX;
			const y = e.clientY - this.canvasOffsetY;

			if (Math.floor(y / 25) == 0 && Math.floor(x / 50) == 0) return;

			// Check if the cursor is in proximity of 5px to a column line in the first row.
			// if (Math.floor(y / 25) == 0 && (x % 50 < 10 || x % 50 > 40)) {
			if (Math.floor(y / 25) == 0 && x % 50 == 0) {
				// if (x % 50 > 40) {
				// 	colLine = x - (x % 50) + 50;
				// } else {
				// 	colLine = x - (x % 50);
				// }
				if (x % 50 == 0) {
					colLine = x - (x % 50);
				}

				this.canvas.style.cursor = "col-resize";
				hoverColLine = true;
			}

			// Check if the cursor is in proximity of 5px to a row line in the first column.
			else if (Math.floor(x / 50) == 0 && (y % 25 < 5 || y % 25 > 20)) {
				// if (y % 25 > 20) {
				// 	rowLine = y - (y % 25) + 25;
				// } else {
				// 	rowLine = y - (y % 25);
				// }
				if (y % 25 == 0) {
					rowLine = y - (y % 25);
				}

				this.canvas.style.cursor = "row-resize";
				hoverRowLine = true;
			} else {
				this.canvas.style.cursor = "auto";
				hoverColLine = false;
				hoverRowLine = false;
			}
		});

		this.canvas.addEventListener("mousedown", (e) => {
			if (!hoverColLine && !hoverRowLine) return;

			if (hoverColLine) dragColLine = true;
			if (hoverRowLine) dragRowLine = true;
			console.log("mousedowned");
		});

		this.canvas.addEventListener("mousemove", (e) => {
			if (!dragColLine && !dragRowLine) return;

			const x = e.clientX - this.canvasOffsetX;
			const y = e.clientY - this.canvasOffsetY;

			console.log(
				"hoverColLine, hoverRowLine",
				hoverColLine,
				hoverRowLine
			);

			console.log("colLine, x: ", colLine, x);

			if (dragColLine) {
				// erase current line
				this.ctx.beginPath();
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = "white";
				this.ctx.moveTo(colLine, 0);
				this.ctx.lineTo(colLine, this.canvas.height);
				this.ctx.stroke();

				// create new line
				this.ctx.beginPath();
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = "#d0d0d0";
				this.ctx.moveTo(x, 0);
				this.ctx.lineTo(x, this.canvas.height);
				this.ctx.stroke();
				colLine = x;
			} else if (dragRowLine) {
				// erase current line
				this.ctx.beginPath();
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = "white";
				this.ctx.moveTo(0, rowLine);
				this.ctx.lineTo(this.canvas.width, rowLine);
				this.ctx.stroke();

				// create new line
				this.ctx.beginPath();
				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = "#d0d0d0";
				this.ctx.moveTo(0, y);
				this.ctx.lineTo(this.canvas.width, y);
				this.ctx.stroke();
				rowLine = y;
				// this.ctx.moveTo(0, rowLine);
				// this.ctx.lineTo(this.canvas.width, rowLine);
				// this.ctx.stroke();
				// rowLine = y;
			}
		});

		this.canvas.addEventListener("mouseup", (e) => {
			dragColLine = false;
			dragRowLine = false;
		});
	}
}

const mainCanvas = document.querySelector(".main-canvas");
const newCanvas = new createCanvas(mainCanvas, 0);

let lastColumnEnd = 0;

class columnsCanvas {
	constructor(sheetIndex, canvasWidth = 1000, cellWidth = 50) {
		const parentDiv = document.querySelector(".columns");
		if (!parentDiv) throw new Error("Parent .columns element not found");

		this.canvas = document.createElement("canvas");
		this.canvas.width = canvasWidth;
		this.canvas.height = 25;
		this.canvas.classList.add("canvas");
		parentDiv.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");
		this.cellWidth = cellWidth;

		console.log(
			`\n🟢 Creating sheet ${sheetIndex}, starting at global index ${lastColumnEnd}`
		);
		this.drawCols();
	}

	colCoordinate(idx) {
		let n = idx + 1;
		let label = "";
		while (n > 0) {
			n -= 1;
			label = String.fromCharCode(65 + (n % 26)) + label;
			n = Math.floor(n / 26);
		}
		return label;
	}

	drawCols() {
		const colsFit = Math.floor(this.canvas.width / this.cellWidth);
		const startIdx = lastColumnEnd;
		const endIdx = startIdx + colsFit;

		console.log("→ Will draw indices", startIdx, "to", endIdx - 1);

		for (let i = startIdx; i < endIdx + 1; i++) {
			const x = (i - startIdx) * this.cellWidth;

			createLine(this.ctx, x, 0, x, this.canvas.height, 1, "#ccc");

			const label = this.colCoordinate(i);
			this.ctx.font = "15px monospace";
			this.ctx.textAlign = "center";
			this.ctx.fillText(label, x + this.cellWidth / 2, 18);
		}

		lastColumnEnd = endIdx;
		console.log("✅ Updated lastColumnEnd to", lastColumnEnd);
	}
}

// Usage
new columnsCanvas(0);
new columnsCanvas(1);

/**
 * creating numbering rows
 */
let lastRowEnd = 0;
class rowsCanvas {
	constructor(sheetIndex) {
		const parentDiv = document.querySelector(".rows");
		if (!parentDiv) throw new Error("Parent .columns element not found");

		this.canvas = document.createElement("canvas");
		this.canvas.width = 50;
		this.canvas.height = 1000;
		this.canvas.classList.add("canvas");
		parentDiv.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");
		this.cellHeight = 25;

		console.log(
			`\n🟢 Creating sheet ${sheetIndex}, starting at global index ${lastColumnEnd}`
		);
		this.drawRows();
	}

	drawRows() {
		const rowsFit = Math.floor(this.canvas.height / this.cellHeight);
		const startIdx = lastRowEnd;
		const endIdx = startIdx + rowsFit;

		console.log("→ Will draw indices", startIdx, "to", endIdx - 1);

		// let maxWidth = this.ctx.measureText(endIdx).width + 15;
		let maxWidth = this.canvas.width;

		createLine(
			this.ctx,
			maxWidth,
			0,
			maxWidth,
			this.canvas.height,
			1,
			"#d0d0d0"
		);

		for (let i = startIdx; i < endIdx; i++) {
			let y = (i - startIdx) * this.cellHeight;
			console.log("y", y);

			createLine(this.ctx, 0, y, maxWidth, y, 1, "#ccc");

			const label = i;
			this.ctx.font = "15px monospace";
			this.ctx.textAlign = "center";

			this.ctx.fillText(label, maxWidth / 2, y + this.cellHeight / 2 + 5);

			// const textLength = this.ctx.measureText(label).width;
			// maxWidth = Math.max(Math.floor(textLength), maxWidth);
			console.log("i: ", i);
			// console.log("Math.floor(textLength): ", Math.floor(textLength));
		}

		console.log("Maxwidth", maxWidth);
		// this.canvas.width = maxWidth;

		lastRowEnd = endIdx;
		console.log("✅ Updated lastRowEnd to", lastRowEnd);
	}
}

new rowsCanvas(0);
new rowsCanvas(1);

let totalColumnSheet = 0;
let totalRowSheet = 0;

let totalDeltaHorizontal = 0;
let totalDeltaVertical = 0;

const columnsDiv = document.getElementsByClassName("columns")[0];
const rowsDiv = document.querySelector(".rows");

function handleScroll(deltaY, isHorizontalScrolling) {
	// console.log("totalDeltaY", totalDeltaY);
	if (isHorizontalScrolling) {
		totalDeltaHorizontal += deltaY;
		if (totalDeltaHorizontal >= 1000) {
			totalDeltaHorizontal = 0;
			new columnsCanvas(totalColumnSheet);
			totalColumnSheet++;
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

/**
 * Handles drawing and managing the excel grid on canvas
 */
class Grid {
	constructor(canvasId, data) {
		/**@type {HTMLCanvasElement} Canvas reference */
		this.canvas = document.getElementById(canvasId);
		/**@type {CanvasRenderingContext2D} */
		this.ctx = this.canvas.getContext("2d");

		/**@type {Cell[][]} 2D Array of Cells */
		this.gridData = data;

		/**@type {number[]} Row heights */
		this.rowHeights = [];

		/**@type {number[]} Column widths */
		this.colWidths = [];
		// more init here
	}
}

document.addEventListener("wheel", (e) => {
	console.log("e.deltaX, e.deltaY", e.deltaX, e.deltaY);

	if (e.shiftKey) {
		handleScroll(e.deltaY, true);
	} else {
		console.log("unshifted");
		handleScroll(e.deltaY, false);
	}
});
