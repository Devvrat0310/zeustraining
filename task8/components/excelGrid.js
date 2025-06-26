import { createLine, handleDynamicDPI } from "./canvasComponents.js";
import { Grid } from "./CreateGrid.js";

export class ExcelGrid extends Grid {
	constructor(parent, gridIndex, height, width, zoom = 1) {
		super(parent, gridIndex, height, width, zoom, "grid");
		// this.parent = parent;
		// this.zoom = zoom;
		// this.dpr = window.devicePixelRatio || 1;
		// this.canvas = this._createCanvas(gridIndex);
		// this.ctx = this.canvas.getContext("2d");
		// this._initDimensions();
		// this._appendCanvas();
		// this._bindEvents();
		// this.outlinedCell = null;
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

	outlineCell(originX, originY) {
		const { ctx, colWidth, rowHeight } = this;
		ctx.save();
		ctx.strokeStyle = "green";
		ctx.fillStyle = "#e8f2ec";
		ctx.lineWidth = 2;
		ctx.fillRect(originX, originY, colWidth, rowHeight);
		ctx.strokeRect(originX, originY, colWidth, rowHeight);
		ctx.restore();

		this.outlinedCell = { x: originX, y: originY };
	}

	eraseOutlineCell() {
		if (!this.outlinedCell) return;
		const { ctx, colWidth, rowHeight } = this;
		const { x, y } = this.outlinedCell;

		ctx.save();
		ctx.clearRect(x - 2, y - 2, colWidth + 4, rowHeight + 4);
		ctx.restore();

		this.drawGrid();
		this.outlinedCell = null;
	}

	strokeEachCorner(originX, originY, endX, endY) {
		createLine(
			this.ctx,
			originX,
			originY,
			originX + endX,
			originY + endY,
			1,
			"#d0d0d0"
		);
	}

	strokeAllCorners() {
		if (!this.outlinedCell) return;
		const { x, y } = this.outlinedCell;
		const { zoom } = this;

		const adjOriginX = [0, 50, 50, 0];
		const adjOriginY = [0, 0, 20, 20];
		const adjEndX = [-2, 2, 2, -2];
		const adjEndY = [-2, -2, 2, 2];

		for (let i = 0; i < 4; i++) {
			this.strokeEachCorner(
				x + adjOriginX[i] * zoom,
				y + adjOriginY[i] * zoom,
				adjEndX[i] * zoom,
				adjEndY[i] * zoom
			);
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

export const allCanvases = [];
