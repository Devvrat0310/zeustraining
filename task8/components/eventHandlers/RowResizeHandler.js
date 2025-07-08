import { ResizeRowCommand } from "../commands/ResizeRowCommand.js";

export class RowResizeHandler {
	constructor() {
		this.rowIndex = -1;
		this.startY = 0;
		this.startHeight = 0;
	}

	/**
	 * Handles column resizing "Hit Test"
	 *
	 */
	hitTest(e, spreadsheet) {
		console.log("row Pointer hitt");
		const rowContainer = spreadsheet.container.querySelector(
			".row-header-container"
		); // Get the row header container

		if (!rowContainer.contains(e.target)) return false;

		console.log("validated row pointer");
		const y = e.offsetY + spreadsheet.viewport.scrollTop;
		// Check if pointer is near a row edge
		for (let i = 0; i < spreadsheet.model.rowHeights.length; i++) {
			const rowEdgeY = spreadsheet.model.cumulativeRowHeights[i];
			if (Math.abs(y - rowEdgeY) < 5) {
				// 5px grab area
				this.rowIndex = i;
				this.startY = e.clientY;
				this.startHeight = spreadsheet.model.rowHeights[i];

				// this.container.classList.add("row-resize-cursor");

				return true;
			}
		}

		return false;
	}

	onPointerDown(e, spreadsheet) {
		spreadsheet.container.classList.add("row-resize-cursor");
		// e.target.setPointerCapture(e.pointerId);
	}

	onPointerMove(e, spreadsheet) {
		const diffY = e.clientY - this.startY;
		const newHeight = this.startHeight + diffY;
		spreadsheet.model.setRowHeight(this.rowIndex, newHeight);
		spreadsheet.render();
	}

	onPointerUp(e, spreadsheet) {
		spreadsheet.container.classList.remove("row-resize-cursor");
		// e.target.releasePointerCapture(e.pointerId);

		const newHeight = spreadsheet.model.rowHeights[this.rowIndex];
		spreadsheet.model.setRowHeight(this.rowIndex, this.startHeight);

		const command = new ResizeRowCommand(
			spreadsheet.model,
			this.rowIndex,
			newHeight
		);
		spreadsheet.commandManager.execute(command);
		spreadsheet.render();
	}
}
