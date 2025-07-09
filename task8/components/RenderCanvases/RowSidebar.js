import { Renderer } from "./Renderer.js";

/**
 * Renders the row headers (1, 2, 3...).
 * It also calculates the required width to fit the largest visible row number.
 */
export class RowSidebar extends Renderer {
	constructor(canvas) {
		super(canvas);

		/**
		 * @type {number} The current calculated width required for the row headers.
		 * This is updated during rendering.
		 */
		this.requiredWidth = 100; // Initial default width
	}

	/**
	 * Renders the visible row headers and calculates the required width.
	 * @param {import('../SheetModel.js').SheetModel} model
	 * @param {import('../Viewport.js').Viewport} viewport
	 */
	render(model, viewport) {
		this.configure();
		this.clear();

		const viewWidth = this.canvas.width / this.dpr;
		const viewHeight = this.canvas.height / this.dpr;

		// Draw background
		this.ctx.fillStyle = "#f5f5f5";
		this.ctx.fillRect(0, 0, viewWidth, viewHeight);

		// Determine the range of rows to render
		const { row: startRow } = model.getCellCoordsFromPosition(
			0,
			viewport.scrollTop
		);
		const { row: endRow } = model.getCellCoordsFromPosition(
			0,
			viewport.scrollTop + viewHeight
		);

		//  Calculate Required Width
		// Find the largest row number in the current view to measure its width
		const lastVisibleRowNumber = endRow + 1;
		const textMetrics = this.ctx.measureText(
			lastVisibleRowNumber.toString()
		);
		const newRequiredWidth = Math.ceil(textMetrics.width) + 30; // Text width

		// Update the required width if it has changed
		if (
			this.requiredWidth !== newRequiredWidth &&
			newRequiredWidth !== undefined
		) {
			this.requiredWidth = newRequiredWidth;
		}

		this.fillText(startRow, endRow, model, viewport, "#ccc", "#616161");

		// this.ctx.strokeStyle = "#ccc";
		// this.ctx.lineWidth = 1;
		// this.ctx.fillStyle = "#616161";
		// this.ctx.font = "12px Arial";
		// this.ctx.textAlign = "right";
		// this.ctx.textBaseline = "middle";

		// //  Render Rows
		// for (let r = startRow; r <= endRow; r++) {
		// 	const { y, height } = model.getCellDimensions(r, 0);
		// 	const drawY = y - viewport.scrollTop;

		// 	// Draw bottom border for each header cell
		// 	this.ctx.beginPath();
		// 	this.ctx.moveTo(0, drawY + height - 0.5);
		// 	this.ctx.lineTo(viewWidth, drawY + height - 0.5);
		// 	this.ctx.stroke();

		// 	// Draw row number label
		// 	// The text is right-aligned with 10px padding
		// 	this.ctx.fillText(
		// 		(r + 1).toString(),
		// 		viewWidth - 5,
		// 		drawY + height / 2
		// 	);
		// }
	}

	fillText(startRow, endRow, model, viewport, strokeStyle, fillStyle) {
		const viewWidth = this.canvas.width / this.dpr;

		this.ctx.strokeStyle = strokeStyle;
		this.ctx.lineWidth = 1 / this.dpr;
		this.ctx.fillStyle = fillStyle;
		this.ctx.font = "12px Arial";
		this.ctx.textAlign = "right";
		this.ctx.textBaseline = "middle";

		//  Render Rows
		for (let r = startRow; r <= endRow; r++) {
			const { y, height } = model.getCellDimensions(r, 0);
			const drawY = y - viewport.scrollTop;
			const snappedY = this.snap(drawY);

			// Draw bottom border for each header cell
			this.ctx.beginPath();
			this.ctx.moveTo(0, snappedY + height);
			this.ctx.lineTo(viewWidth, snappedY + height);
			this.ctx.stroke();

			// Draw row number label
			// The text is right-aligned with 10px padding
			this.ctx.fillText(
				(r + 1).toString(),
				viewWidth - 5,
				drawY + height / 2 + 2
			);
		}

		if (model.rowSidebarSelecting) {
			// Create border when
			const extremeLines = [startRow - 1, endRow];

			this.ctx.strokeStyle = "#107c41";
			this.ctx.lineWidth = 2;
			for (let i = 0; i < 2; i++) {
				let r = extremeLines[i];

				const { y, height } = model.getCellDimensions(r, 0);

				let add = 0;
				if (i == 0) add -= 1;

				const drawY = y - viewport.scrollTop;
				const snappedY = this.snap(drawY);

				// Draw bottom border for each header cell
				this.ctx.beginPath();
				this.ctx.moveTo(0, snappedY + height + add - 0.3);
				this.ctx.lineTo(viewWidth, snappedY + height + add - 0.3);
				this.ctx.stroke();
			}
		}
	}

	getRequiredWidth() {
		return this.requiredWidth;
	}

	highlightRows(viewY, height, model, viewport) {
		// Highlight column

		this.ctx.fillStyle = "#caead8";
		this.ctx.strokeStyle = "#107c41";

		if (model.rowSidebarSelected) {
			this.ctx.fillStyle = "#107c41";
			this.ctx.strokeStyle = "white";
		}

		// console.log(
		// 	"viewY, gridContainerOffsetTop",
		// 	viewY,
		// 	gridContainerOffsetTop
		// );

		// const rowWidth = this.getRequiredWidth();

		this.ctx.fillRect(0, viewY, this.requiredWidth, height);

		const selectedCell = model.selection;

		const startCell = selectedCell.start.row;
		const endCell = selectedCell.end.row;
		// console.log("startRow, endRow", startRow, endRow);
		// console.log(
		// 	"this.requiredWidth, viewY, height",
		// 	this.requiredWidth,
		// 	viewY,
		// 	height
		// );

		this.fillText(
			Math.min(startCell, endCell),
			Math.max(startCell, endCell),
			model,
			viewport,
			"#b5e1c8",
			model.rowSidebarSelected ? "white" : "#0f703b"
		);

		this.ctx.lineWidth = 2;
		this.ctx.strokeStyle = "#107c41";
		this.ctx.beginPath();
		this.ctx.moveTo(this.requiredWidth - 1, viewY - 2);
		this.ctx.lineTo(this.requiredWidth - 1, viewY + height + 1);
		this.ctx.stroke();
	}
}
