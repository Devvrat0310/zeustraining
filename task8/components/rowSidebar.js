import { createLine, handleDynamicDPI } from "./canvasComponents.js";

/**
 * creating numbering rows
 */

export class rowsCanvas {
	constructor(parent, totalCanvas, lastRowEnd, zoom) {
		const parentDiv = document.querySelector(".rows");
		if (!parentDiv) throw new Error("Parent .columns element not found");

		this.lastRowEnd = lastRowEnd;

		this.canvas = document.createElement("canvas");
		this.canvas.classList.add("canvas");
		parentDiv.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");

		this.zoom = zoom;

		this.rowHeight = 20 * this.zoom;
		this.colWidth = 50 * this.zoom;

		this.canvas.width = 50 * this.zoom;
		this.canvas.height = 1000 - (1000 % this.rowHeight);

		this.dpr = handleDynamicDPI(this.canvas, this.ctx);

		this.drawRows();

		return { lastRowEnd: this.lastRowEnd, this: this };
	}

	setZoom(zoom, lastRowEnd) {
		this.lastRowEnd = lastRowEnd;

		this.zoom = zoom;

		this.rowHeight = 20 * this.dpr * this.zoom;
		this.colWidth = 50 * this.dpr * this.zoom;

		this.canvas.width = 50 * this.zoom;
		this.canvas.height = 1000 - (1000 % this.rowHeight);

		this.drawRows();

		return this.lastRowEnd;
	}

	drawRows() {
		const rowsFit = Math.floor(this.canvas.height / this.rowHeight);
		const startIdx = this.lastRowEnd;
		const endIdx = startIdx + rowsFit;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillStyle = "#e9e9e9";

		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		let maxWidth = this.canvas.width + 0.5;

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
			let y = (i - startIdx) * this.rowHeight + 0.5;
			// console.log("y", y);

			createLine(this.ctx, 0, y, maxWidth, y, 1, "#ccc");

			const label = i;
			this.ctx.font = `${15 * this.zoom}px monospace`;
			this.ctx.textAlign = "right";

			this.ctx.fillStyle = "#5c6b72";
			this.ctx.fillText(
				label + 1,
				maxWidth - 5,
				y + this.rowHeight / 2 + 5 * this.zoom
			);
		}

		console.log("Maxwidth", maxWidth);
		// this.canvas.width = maxWidth;

		this.lastRowEnd = endIdx;
		// console.log("✅ Updated this.lastRowEnd to", this.lastRowEnd);
	}
}

export const allRows = [];
