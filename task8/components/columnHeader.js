import { createLine, handleDynamicDPI } from "./canvasComponents.js";
import { Grid } from "./CreateGrid.js";

export class ColumnsCanvas extends Grid {
	constructor(parent, gridIndex, height, width, zoom) {
		super(parent, gridIndex, height, width, zoom, "column_");
		this.drawCols();
		this.handleColumnOffset();
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

	handleColumnOffset() {
		this.parent.style.marginLeft = `${this.colWidth}px`;
	}

	setZoom(zoom) {
		this.zoom = zoom;
		console.log("this.zoom, zoom", this.zoom, zoom);
		super._initDimensions(15, 1000);

		this.ctx.font = `${10 * this.zoom}px arial`;

		// this.
		this.drawCols();
		this.handleColumnOffset();
	}

	drawCols() {
		const colsFit = Math.floor(this.canvas.width / this.colWidth);
		const startIdx = this.gridIndex * colsFit;
		const endIdx = startIdx + colsFit;

		console.log("Drawing columns from", startIdx, "to", endIdx);

		this.updateCanvasOffsets();
		this.ctx.fillStyle = "white";
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "#e9e9e9";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		createLine(
			this.ctx,
			0,
			this.canvas.height - 0.5,
			this.canvas.width,
			this.canvas.height - 0.5,
			1,
			"#bdbdbd"
		);

		for (let i = startIdx; i <= endIdx; i++) {
			const x = (i - startIdx) * this.colWidth;
			createLine(
				this.ctx,
				x - 0.5,
				0,
				x - 0.5,
				this.canvas.height,
				1,
				"#ccc"
			);

			const label = this.colCoordinate(i);
			this.ctx.fillStyle = "#5c6b72";
			this.ctx.font = `${10 * this.zoom}px arial`;
			this.ctx.textAlign = "center";
			this.ctx.fillText(label, x + this.colWidth / 2, 12 * this.zoom);
		}

		this.lastColumnEnd = endIdx;
		return this.lastColumnEnd;
	}

	initResizeHandlers() {
		this.colLine = 50;
		this.rowLine = 15;
		this.hoverColLine = false;
		this.hoverRowLine = false;
		this.dragColLine = false;
		this.dragRowLine = false;

		this.canvas.addEventListener(
			"mousemove",
			this.handleMouseMove.bind(this)
		);
		this.canvas.addEventListener(
			"mousedown",
			this.handleMouseDown.bind(this)
		);
		this.canvas.addEventListener(
			"mousemove",
			this.handleDragMove.bind(this)
		);
		this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
	}

	handleMouseMove(e) {
		const x = e.clientX - this.canvasOffsetX;
		const y = e.clientY - this.canvasOffsetY;

		this.hoverColLine = false;
		this.hoverRowLine = false;

		if (Math.floor(y / 15) === 0 && x % 50 === 0) {
			this.colLine = x - (x % 50);
			this.canvas.style.cursor = "col-resize";
			this.hoverColLine = true;
		} else if (Math.floor(x / 50) === 0 && y % 15 === 0) {
			this.rowLine = y - (y % 15);
			this.canvas.style.cursor = "row-resize";
			this.hoverRowLine = true;
		} else {
			this.canvas.style.cursor = "auto";
		}
	}

	handleMouseDown() {
		if (this.hoverColLine) this.dragColLine = true;
		if (this.hoverRowLine) this.dragRowLine = true;
	}

	handleDragMove(e) {
		if (!this.dragColLine && !this.dragRowLine) return;

		const x = e.clientX - this.canvasOffsetX;
		const y = e.clientY - this.canvasOffsetY;

		if (this.dragColLine) {
			this.eraseLine(this.colLine, 0, this.colLine, this.canvas.height);
			this.drawLine(x, 0, x, this.canvas.height, "#d0d0d0");
			this.colLine = x;
		} else if (this.dragRowLine) {
			this.eraseLine(0, this.rowLine, this.canvas.width, this.rowLine);
			this.drawLine(0, y, this.canvas.width, y, "#d0d0d0");
			this.rowLine = y;
		}
	}

	handleMouseUp() {
		this.dragColLine = false;
		this.dragRowLine = false;
	}

	drawLine(x1, y1, x2, y2, color) {
		this.ctx.beginPath();
		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = color;
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}

	eraseLine(x1, y1, x2, y2) {
		this.ctx.save();
		this.ctx.globalCompositeOperation = "destination-out";
		this.drawLine(x1, y1, x2, y2, "white");
		this.ctx.restore();
	}
}

export class ColumnManager {
	constructor(columnsDiv, pushedOverlayColumns, zoomManager) {
		this.columnsDiv = columnsDiv;
		this.pushedOverlayColumns = pushedOverlayColumns;
		this.zoomManager = zoomManager;
		this.totalColumnSheet = 0;
		this.lastColumnEnd = 0;
		this.columns = [];
		this.startColumnInView = 0;
	}

	createColumn() {
		const column = new ColumnsCanvas(
			this.columnsDiv,
			this.totalColumnSheet,
			15,
			1000,
			this.zoomManager.zoom
		);
		this.totalColumnSheet++;
		// console.log("Creating column:", column);
		this.columns.push(column);
	}

	updatePushedOverlayWidth(width) {
		// Add empty space:
		let space = parseInt(this.pushedOverlayColumns.style.width, 10);
		space += width;
		this.pushedOverlayColumns.style.width = `${space}px`;
	}

	addColumnToRight() {
		// child element div
		const removedChildElement = this.columnsDiv.removeChild(
			this.columnsDiv.firstElementChild
		);
		// Update id for new column div
		removedChildElement.id = `column_${this.totalColumnSheet}`;
		// Add removed child to the end
		this.columnsDiv.appendChild(removedChildElement);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.columns.shift();
		removedChildClass.gridIndex = this.totalColumnSheet;
		removedChildClass.drawCols();
		this.columns.push(removedChildClass);

		this.updatePushedOverlayWidth(removedChildClass.canvas.width);

		this.totalColumnSheet++;
	}

	addColumnToLeft() {
		// Check if already at the beggining
		if (this.totalColumnSheet == 4) return;

		// child element div
		const removedChildElement = this.columnsDiv.removeChild(
			this.columnsDiv.lastElementChild
		);
		// Update id for new column div
		removedChildElement.id = `column_${this.totalColumnSheet - 5}`;
		// Insert removed child to the front
		this.columnsDiv.insertBefore(
			removedChildElement,
			this.columnsDiv.firstChild
		);

		// pop and get child element class at first index, update its grid index, redraw and append it to the arraw.
		const removedChildClass = this.columns.pop();
		removedChildClass.gridIndex = this.totalColumnSheet - 5;
		removedChildClass.drawCols();
		this.columns.unshift(removedChildClass);

		// Add empty space:
		this.updatePushedOverlayWidth(-removedChildClass.canvas.width);

		this.totalColumnSheet--;
	}

	/**
	 * Handle scrolling and update column headers based on column index in view.
	 *
	 * @param {boolean} scrollRight - Set to true if scrolling towards right.
	 */
	scrollColumn(scrollRight) {
		// For scrolling Right.
		// Remove element from beggining from dom tree.
		// Remove element from beggining of the columns array
		// Add array push of the length of the column
		// Append element to the end of the columnsDiv.
		// Append columnClass to the end of the columns array
		// Exact reverse for scrolling left.

		if (scrollRight) {
			this.addColumnToRight();
		} else {
			this.addColumnToLeft();
		}
	}

	zoomAll() {
		this.columns.forEach((col) => {
			col.setZoom(this.zoomManager.zoom);
		});
		if (this.totalColumnSheet > 4) {
			this.pushedOverlayColumns.style.width =
				this.columns[0].canvas.width + "px";
		}
	}
}
