import { createLine, handleDynamicDPI } from "./canvasComponents.js";

export class columnsCanvas {
	// constructor(sheetIndex) {
	// 	const parentDiv = document.querySelector(".columns");
	// 	if (!parentDiv) throw new Error("Parent .columns element not found");

	// 	this.canvas = document.createElement("canvas");
	// 	this.canvas.width = 1000;
	// 	this.canvas.height = 20;
	// 	this.canvas.classList.add("canvas");
	// 	parentDiv.appendChild(this.canvas);

	// 	this.ctx = this.canvas.getContext("2d");

	// 	handleDynamicDPI(this.canvas, this.ctx);

	// 	this.colWidth = 50;
	// 	this.rowHeight = 20;

	// 	console.log(
	// 		`Creating sheet ${sheetIndex}, starting at global index ${this.lastColumnEnd}`
	// 	);
	// 	this.drawCols();
	// }
	constructor(parent, totalCanvas, lastColumnEnd, zoom) {
		this.parent = parent;
		totalCanvas++;

		this.lastColumnEnd = lastColumnEnd;

		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", `canvas_${totalCanvas}`);
		this.canvas.setAttribute("height", 20);
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

		this.zoom = zoom;

		this.parent.style.marginLeft = `${this.colWidth * this.zoom}px`;

		this.canvasOffsetX;
		this.canvasOffsetY;

		this.updateCanvasOffsets();

		const check = this.drawCols();

		console.log("check", check);
		return { lastColumnEnd: check, this: this };

		// return this.lastColumnEnd;
		// this.selectCell();
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

	setZoom(change, lastColumnEnd) {
		this.lastColumnEnd = lastColumnEnd;

		// const previousZoom
		this.zoom += change;
		this.zoom = Math.min(3, Math.max(0.4, this.zoom));
		// this.zoom = Math.max(0.5, this.zoom);
		this.zoom = parseFloat(this.zoom.toFixed(1)); // => 3
		console.log("this.zoom", this.zoom);

		this.rowHeight = 20 * this.dpr * this.zoom;
		this.colWidth = 50 * this.dpr * this.zoom;

		console.log("this.rowHeight,", this.rowHeight);

		this.canvas.width = 1000 - (1000 % this.colWidth);
		this.canvas.height = 20 * this.zoom;
		// this.canvas.height = 20 - (20 % this.rowHeight);

		console.log(
			"this.canvas.width, this.canvas.height, column header",
			this.canvas.width,
			this.canvas.height
		);

		this.parent.style.marginLeft = `${this.colWidth}px`;

		this.drawCols();

		return this.lastColumnEnd;
		// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
		const colsFit = Math.floor(this.canvas.width / this.colWidth);
		const startIdx = this.lastColumnEnd;
		const endIdx = startIdx + colsFit;

		this.updateCanvasOffsets();

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = "#e9e9e9";

		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		console.log(
			"this.canvasOffsetX, this.canvasOffsetY",
			this.canvasOffsetX,
			this.canvasOffsetY
		);

		// console.log("→ Will draw indices", startIdx, "to", endIdx - 1);

		for (let i = startIdx; i < endIdx + 1; i++) {
			const x = (i - startIdx) * this.colWidth;

			createLine(
				this.ctx,
				x + 0.5,
				0,
				x + 0.5,
				this.canvas.height,
				1,
				"#ccc"
			);

			const label = this.colCoordinate(i);
			this.ctx.fillStyle = "#000000";
			this.ctx.font = `${15 * this.zoom}px monospace`;
			this.ctx.textAlign = "center";
			this.ctx.fillText(label, x + this.colWidth / 2, 15 * this.zoom);
		}

		this.lastColumnEnd = endIdx;
		console.log("✅ Updated this.lastColumnEnd to", this.lastColumnEnd);

		return this.lastColumnEnd;
	}
	resizeRow() {
		let colLine = 50;
		let rowLine = 20;

		let hoverColLine = false;
		let hoverRowLine = false;

		let dragColLine = false;
		let dragRowLine = false;

		this.canvas.addEventListener("mousemove", (e) => {
			const x = e.clientX - this.canvasOffsetX;
			const y = e.clientY - this.canvasOffsetY;

			if (Math.floor(y / 20) == 0 && Math.floor(x / 50) == 0) return;

			// Check if the cursor is in proximity of 5px to a column line in the first row.
			// if (Math.floor(y / 20) == 0 && (x % 50 < 10 || x % 50 > 40)) {
			if (Math.floor(y / 20) == 0 && x % 50 == 0) {
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
			else if (Math.floor(x / 50) == 0 && (y % 20 < 5 || y % 20 > 20)) {
				// if (y % 20 > 20) {
				// 	rowLine = y - (y % 20) + 20;
				// } else {
				// 	rowLine = y - (y % 20);
				// }
				if (y % 20 == 0) {
					rowLine = y - (y % 20);
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

// Usage

export const allColumns = [];
