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

	onPointerDown(e, spreadsheet) {
		spreadsheet.container.classList.add("col-resize-cursor");
	}

	onPointerMove(e, spreadsheet) {
		const diffX = e.clientX - this.startX;
		const newWidth = this.startWidth + diffX;
		spreadsheet.model.setColumnWidth(this.colIndex, newWidth);
		spreadsheet.render();
	}

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
}
