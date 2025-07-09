import { Renderer } from "./Renderer.js";

/**
 * Renders the column headers (A, B, C...).
 */
export class ColumnHeader extends Renderer {
	/**
	 * Converts a column index to its corresponding spreadsheet-style label (e.g., A, B, ..., Z, AA, AB, ...).
	 * @param {number} idx The zero-based column index.
	 * @returns {string} The column label.
	 */
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

	render(model, viewport) {
		this.configure();
		this.clear();

		const viewWidth = this.canvas.width / this.dpr;
		const viewHeight = this.canvas.height / this.dpr;

		this.viewHeight = viewHeight;

		// Draw background
		this.ctx.fillStyle = "#f5f5f5";
		this.ctx.fillRect(0, 0, viewWidth, viewHeight);

		const { col: startCol } = model.getCellCoordsFromPosition(
			viewport.scrollLeft,
			0
		);
		const { col: endCol } = model.getCellCoordsFromPosition(
			viewport.scrollLeft + viewWidth,
			0
		);

		// if (model.columnHeaderSelected) {
		// 	this.fillText(startCol, endCol, model, viewport, "#ccc", "#616161");
		// } else {
		this.fillText(startCol, endCol, model, viewport, "#ccc", "#616161");
		// }
	}

	fillText(startCol, endCol, model, viewport, strokeStyle, fillStyle) {
		const viewHeight = this.canvas.height / this.dpr;

		this.ctx.strokeStyle = strokeStyle;
		this.ctx.lineWidth = 1 / this.dpr;
		this.ctx.fillStyle = fillStyle;
		this.ctx.font = "12px Arial";
		this.ctx.textAlign = "center";
		this.ctx.textBaseline = "middle";

		// console.log("inside fill text green", startCol, endCol);

		for (let c = startCol; c <= endCol; c++) {
			const { x, width } = model.getCellDimensions(0, c);
			const drawX = x - viewport.scrollLeft;

			const snappedX = this.snap(drawX);

			// console.log("model.zoom", model.zoom);
			// Draw right border for each header cell
			this.ctx.beginPath();
			this.ctx.moveTo(snappedX + width, 0);
			this.ctx.lineTo(snappedX + width, viewHeight);
			this.ctx.stroke();

			// this.ctx.fillStyle = "#0f703b";
			// Draw label
			this.ctx.fillText(
				this.colCoordinate(c),
				drawX + width / 2,
				viewHeight / 2 + 1
			);
		}

		if (model.columnHeaderSelected) {
			// Create border when
			const extremeLines = [startCol - 1, endCol];

			this.ctx.strokeStyle = "#107c41";
			this.ctx.lineWidth = 2;
			for (let i = 0; i < 2; i++) {
				let c = extremeLines[i];

				const { x, width } = model.getCellDimensions(0, c);

				let add = 0;
				if (i == 0) add -= 1;

				const drawX = x - viewport.scrollLeft;

				const snappedX = this.snap(drawX);

				this.ctx.beginPath();
				this.ctx.moveTo(snappedX + width + add - 0.1, 0);
				this.ctx.lineTo(snappedX + width + add - 0.1, viewHeight);
				this.ctx.stroke();
			}
		}
	}

	highlightColumns(viewX, width, model, viewport) {
		// Highlight column
		this.ctx.fillStyle = "#caead8";
		this.ctx.strokeStyle = "#107c41";

		if (model.columnHeaderSelected) {
			this.ctx.fillStyle = "#107c41";
			this.ctx.strokeStyle = "white";
		}

		this.ctx.fillRect(viewX, 0, width, 18);
		const selectedCell = model.selection;

		const startCell = selectedCell.start.col;
		const endCell = selectedCell.end.col;
		const startCol = Math.min(startCell, endCell);
		const endCol = Math.max(startCell, endCell);

		this.fillText(
			startCol,
			endCol,
			model,
			viewport,
			"#b5e1c8",
			model.columnHeaderSelected ? "white" : "#0f703b"
		);

		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = "#107c41";
		this.ctx.beginPath();
		this.ctx.moveTo(viewX - 2, 19);
		this.ctx.lineTo(viewX + width + 1, 19);
		this.ctx.stroke();
	}
}
