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

	/**
	 * Handles pointer down function, updates cursor styling to ns-resize
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerDown(e, spreadsheet) {
		spreadsheet.container.classList.add("row-resize-cursor");

		// e.target.setPointerCapture(e.pointerId);
	}

	/**
	 * Handles changing the column width as we click and drag.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerMove(e, spreadsheet) {
		const diffY = e.clientY - this.startY;
		const newHeight = this.startHeight + diffY;
		spreadsheet.model.setRowHeight(this.rowIndex, newHeight);
		spreadsheet.render();
	}

	/**
	 * Sets new row width, executes command.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 */
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

	/**
	 * Updates the mouse cursor as we hover over the row sidebar
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 */
	updateCursor(e, spreadsheet) {
		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);

		const rect = mainGridContainer.getBoundingClientRect();
		const pointerY = e.clientY - rect.top;

		const gridY = pointerY + spreadsheet.viewport.scrollTop;

		// Check for row resize hover in the row header area
		if (e.target.closest(".row-header-container")) {
			for (let i = 0; i < spreadsheet.model.rowCount; i++) {
				const rowEdgeY = spreadsheet.model.cumulativeRowHeights[i];
				if (Math.abs(gridY - rowEdgeY) < 5) {
					spreadsheet.container.classList.remove(
						"row-selection-cursor"
					);
					spreadsheet.container.classList.remove(
						"col-selection-cursor"
					);
					spreadsheet.container.classList.add("row-resize-cursor");
					return true;
				}
			}
			spreadsheet.container.classList.remove("col-selection-cursor");
			spreadsheet.container.classList.add("row-selection-cursor");
			return true;
		}

		spreadsheet.container.classList.remove("row-resize-cursor");
		return false;
	}
}
