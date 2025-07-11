import { ResizeColumnCommand } from "../commands/ResizeColumnCommand.js";

export class ColumnResizeHandler {
	constructor() {
		this.colIndex = -1;
		this.startX = 0;
		this.startWidth = 0;
	}

	/**
	 * Handles column resizing "Hit Test"
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	hitTest(e, spreadsheet) {
		const headerContainer = spreadsheet.container.querySelector(
			".column-header-container"
		);

		if (!headerContainer.contains(e.target)) return false;
		const x = e.offsetX + spreadsheet.viewport.scrollLeft;
		for (let i = 0; i < spreadsheet.model.columnWidths.length; i++) {
			const colEdgeX = spreadsheet.model.cumulativeColWidths[i];
			if (Math.abs(x - colEdgeX) < 5) {
				this.colIndex = i;
				this.startX = e.clientX;
				this.startWidth = spreadsheet.model.columnWidths[i];
				spreadsheet.container.classList.add("col-resize-cursor");
				return true;
			}
		}

		return false;
	}

	/**
	 * Handles pointer down function, updates cursor styling to ew-resize
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerDown(e, spreadsheet) {
		spreadsheet.container.classList.add("col-resize-cursor");
	}

	/**
	 * Handles changing the column width as we click and drag.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerMove(e, spreadsheet) {
		const diffX = e.clientX - this.startX;
		const newWidth = this.startWidth + diffX;
		spreadsheet.model.setColumnWidth(this.colIndex, newWidth);
		spreadsheet.render();
	}

	/**
	 * Sets new col width, executes command.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerUp(e, spreadsheet) {
		spreadsheet.container.classList.remove("col-resize-cursor");
		// const { colIndex, startWidth } = spreadsheet.isResizingColumn;

		const newWidth = spreadsheet.model.columnWidths[this.colIndex];
		spreadsheet.model.setColumnWidth(this.colIndex, this.startWidth);

		const command = new ResizeColumnCommand(
			spreadsheet.model,
			this.colIndex,
			newWidth
		);
		spreadsheet.commandManager.execute(command);

		spreadsheet.render();
	}

	updateCursor(e, spreadsheet) {
		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);

		const rect = mainGridContainer.getBoundingClientRect();
		const pointerX = e.clientX - rect.left;

		const gridX = pointerX + spreadsheet.viewport.scrollLeft;

		// Check for column resize hover in the column header area
		if (e.target.closest(".column-header-container")) {
			for (let i = 0; i < spreadsheet.model.colCount; i++) {
				const colEdgeX = spreadsheet.model.cumulativeColWidths[i];
				if (Math.abs(gridX - colEdgeX) < 5) {
					spreadsheet.container.classList.remove(
						"col-selection-cursor"
					);
					spreadsheet.container.classList.remove(
						"row-selection-cursor"
					);
					spreadsheet.container.classList.add("col-resize-cursor");
					return true;
				}
			}
			spreadsheet.container.classList.remove("row-selection-cursor");
			spreadsheet.container.classList.add("col-selection-cursor");
			return true;
		}

		spreadsheet.container.classList.remove("col-resize-cursor");

		return false;
	}
}
