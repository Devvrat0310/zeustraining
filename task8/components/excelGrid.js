import { Renderer } from "./Renderer.js";

/**
 * Renders the main data grid, including lines and cell values.
 */
export class ExcelGrid extends Renderer {
	/**
	 * Renders the visible portion of the grid.
	 * @param {Object} model
	 * @param {Object} viewport
	 */
	render(model, viewport) {
		this.configure();
		this.clear();

		const viewWidth = this.canvas.width / this.dpr;
		const viewHeight = this.canvas.height / this.dpr;

		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(0, 0, viewWidth, viewHeight);

		const { row: startRow, col: startCol } =
			model.getCellCoordsFromPosition(
				viewport.scrollLeft,
				viewport.scrollTop
			);
		const { row: endRow, col: endCol } = model.getCellCoordsFromPosition(
			viewport.scrollLeft + viewWidth,
			viewport.scrollTop + viewHeight
		);

		// Draw grid lines
		this.ctx.strokeStyle = "#e0e0e0";

		// console.log("this.ctx.lineWidth before", this.ctx.lineWidth);

		this.ctx.lineWidth = 1 / this.dpr;
		// console.log("this.ctx.lineWidth after", this.ctx.lineWidth);

		// this.ctx.scale(this.dpr, this.dpr);

		// Draw vertical lines
		for (let c = startCol; c <= endCol; c++) {
			const cellX =
				(model.cumulativeColWidths[c - 1] || 0) - viewport.scrollLeft;
			const snappedX = this.snap(cellX);

			// console.log("snappedX", snappedX);
			this.ctx.beginPath();
			this.ctx.moveTo(snappedX, 0);
			this.ctx.lineTo(snappedX, viewHeight);
			this.ctx.stroke();
		}

		// Draw horizontal lines
		for (let r = startRow; r <= endRow; r++) {
			const cellY =
				(model.cumulativeRowHeights[r - 1] || 0) - viewport.scrollTop;
			const snappedY = this.snap(cellY);
			this.ctx.beginPath();
			this.ctx.moveTo(0, snappedY);
			this.ctx.lineTo(viewWidth, snappedY);
			this.ctx.stroke();
		}

		// Draw cell data
		this.ctx.fillStyle = "#333";
		this.ctx.font = "14px Arial";
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "middle";

		for (let r = startRow; r <= endRow; r++) {
			for (let c = startCol; c <= endCol; c++) {
				const value = model.getCellValue(r, c);
				if (value !== undefined) {
					const { x, y, width, height } = model.getCellDimensions(
						r,
						c
					);
					const drawX = x - viewport.scrollLeft + 5;
					const drawY = y - viewport.scrollTop + height / 2;
					this.ctx.fillText(
						value.toString(),
						drawX,
						drawY,
						width - 10
					);
				}
			}
		}
	}
}
