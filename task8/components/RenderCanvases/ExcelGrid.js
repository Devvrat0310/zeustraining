import { Renderer } from "./Renderer.js";

/**
 * Renders the main data grid, including lines and cell values.
 */
export class ExcelGrid extends Renderer {
	/**
	 * Renders the visible portion of the grid.
	 * @param {SheetModel} model
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

					// Extend text across empty cells to the right
					let text = value.toString();
					let spanCol = c;
					let totalWidth = width;

					// Check how many next cells are empty and extend width
					while (
						spanCol + 1 <= endCol &&
						model.getCellValue(r, spanCol + 1) === undefined
					) {
						const nextCellDims = model.getCellDimensions(
							r,
							spanCol + 1
						);
						totalWidth += nextCellDims.width;
						spanCol++;
					}

					// console.log("spanCol", spanCol);

					// Clamp text to fit within the spanned width
					let displayText = text;
					let maxWidth = totalWidth;
					while (
						this.ctx.measureText(displayText).width > maxWidth &&
						displayText.length > 0
					) {
						displayText = displayText.slice(0, -1);
					}

					// console.log("maxWidth", maxWidth);

					// Add ellipsis if text was truncated
					// if (
					// 	displayText.length < text.length &&
					// 	displayText.length > 0
					// ) {
					// 	displayText = displayText.slice(0, -1);
					// }

					// Calculate the actual width the text will take
					const textWidth = Math.min(
						this.ctx.measureText(displayText).width,
						maxWidth
					);

					// Remove vertical grid lines between spanned cells, but only up to where text ends
					if (spanCol > c) {
						this.ctx.save();
						this.ctx.strokeStyle = "#fff";
						this.ctx.lineWidth = 1 / this.dpr;
						let coveredWidth = width;
						for (let cc = c + 1; cc <= spanCol; cc++) {
							const nextCellDims = model.getCellDimensions(r, cc);
							const cellX =
								(model.cumulativeColWidths[cc - 1] || 0) -
								viewport.scrollLeft;
							const snappedX = this.snap(cellX);

							// Only erase the border if it's within the text width
							if (coveredWidth <= textWidth + 5) {
								this.ctx.beginPath();
								this.ctx.moveTo(
									snappedX,
									y - viewport.scrollTop
								);
								this.ctx.lineTo(
									snappedX,
									y - viewport.scrollTop + height
								);
								this.ctx.stroke();
							}
							coveredWidth += nextCellDims.width;
						}
						this.ctx.restore();
					}

					// Draw text after erasing borders
					this.ctx.fillText(displayText, drawX, drawY, maxWidth);

					// Skip over spanned cells in the loop
					c = spanCol;
				}
			}
		}
	}
}
