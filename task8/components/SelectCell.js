import { Renderer } from "./Renderer.js";

export class SelectCell extends Renderer {
	render(model, viewport, spreadsheet) {
		this.configure();
		this.clear();

		const gridContainer = this.canvas.parentElement.querySelector(
			".main-grid-container"
		);
		const gridContainerOffsetLeft = gridContainer.offsetLeft;
		const gridContainerOffsetTop = gridContainer.offsetTop;

		// console.log("gridContainerOffsetLeft", gridContainerOffsetLeft);
		// console.log("gridContainerOffsetTop", gridContainerOffsetTop);
		// console.log("viewport.scrollLeft", viewport.scrollLeft);
		// console.log("viewport.scrollTop", viewport.scrollTop);
		let viewX;
		let viewY;
		let width;
		let height;
		// 1. Draw the main selection area
		if (model.selection) {
			const { start, end } = model.selection;
			let minRow = Math.min(start.row, end.row);

			let maxRow = Math.max(start.row, end.row);

			let minCol = Math.min(start.col, end.col);
			// if (model.rowSidebarSelection) minCol = 0;

			let maxCol = Math.max(start.col, end.col);

			const startCell = model.getCellDimensions(minRow, minCol);
			const endCell = model.getCellDimensions(maxRow, maxCol);

			viewX = startCell.x - viewport.scrollLeft;
			viewY = startCell.y - viewport.scrollTop;
			width = endCell.x + endCell.width - startCell.x;
			height = endCell.y + endCell.height - startCell.y;

			// console.log(
			// 	"viewX, viewY, width, height",
			// 	viewX,
			// 	viewY,
			// 	width,
			// 	height
			// );

			// console.log("startCell, endCell", startCell, endCell);

			// Main selection area fill
			this.ctx.fillStyle = "rgba(127, 172, 127, 0.2)";
			this.ctx.fillRect(
				viewX + gridContainerOffsetLeft,
				viewY + gridContainerOffsetTop,
				width,
				height
			);

			// Main selection area outline
			this.ctx.strokeStyle = "#137e43";
			this.ctx.lineWidth = 2;
			this.ctx.strokeRect(
				viewX + gridContainerOffsetLeft - 1,
				viewY + gridContainerOffsetTop - 1,
				width + 1,
				height + 1
			);

			spreadsheet.columnHeader.highlightColumns(
				viewX,
				width,
				model,
				viewport
			);
			spreadsheet.rowSidebar.highlightRows(
				viewY,
				height,
				model,
				viewport
			);

			// Highlight column
			// this.ctx.fillStyle = "#caead8";
			// this.ctx.strokeStyle = "#107c41";

			// console.log(
			// 	"viewX, gridContainerOffsetLeft",
			// 	viewX,
			// 	gridContainerOffsetLeft
			// );

			// this.ctx.fillRect(viewX + gridContainerOffsetLeft, 0, width, 40);
			//

			// model.getSelectedResult();
		}

		// 2. Draw a border around the active cell
		if (model.activeCell) {
			const { row, col } = model.activeCell;
			const { x, y, width, height } = model.getCellDimensions(row, col);

			const viewX = x - viewport.scrollLeft;
			const viewY = y - viewport.scrollTop;

			// this.ctx.fillStyle = "#ffffff";
			this.ctx.lineWidth = 2;
			this.ctx.clearRect(
				viewX + gridContainerOffsetLeft + 1,
				viewY + gridContainerOffsetTop + 1,
				width - 2,
				height - 2
			);
		}

		if (model.selection && !spreadsheet.isEditing) {
			// Lower right cornered square  of a selected area
			this.ctx.fillStyle = "#137e43";
			this.ctx.fillRect(
				viewX + width + gridContainerOffsetLeft - 2,
				viewY + height + gridContainerOffsetTop - 2,
				5,
				5
			);

			this.ctx.strokeStyle = "white";
			this.ctx.lineWidth = 1.5;

			this.ctx.strokeRect(
				viewX + width + gridContainerOffsetLeft - 2.5,
				viewY + height + gridContainerOffsetTop - 2.5,
				6,
				6
			);
		}
	}

	updateSelectedColumn(mainController) {
		if (!mainController.model.columnHeaderSelected) return;

		const maxRow = mainController.model.rowCount;

		// Get pixels of bottom most cell in view
		const endRowPixel =
			mainController.viewport.scrollTop + mainController.viewport.height;

		// get start col index of currently selected columns for the calculation of endRowId
		const { row, col } = mainController.model.selection.start;

		const startColCoord = mainController.model.getCellDimensions(row, col);

		const endRowId = mainController.model.getCellCoordsFromPosition(
			startColCoord.x + mainController.rowSidebar.requiredWidth,
			endRowPixel
		);

		mainController.model.selection.end.row = Math.max(
			endRowId.row + 100,
			maxRow - 1
		); // Add 100 row for buffer
	}

	updateSelectedRow(mainController) {
		if (!mainController.model.rowSidebarSelected) return;

		const rect = mainController.spreadsheetElement.getBoundingClientRect();

		const maxCol = mainController.model.colCount;

		const endColPixel =
			mainController.viewport.scrollLeft + mainController.viewport.width;

		// const col = this.model.colCount;
		const { row, col } = mainController.model.selection.start;

		const startRowCoord = mainController.model.getCellDimensions(row, col);

		const endColId = mainController.model.getCellCoordsFromPosition(
			endColPixel,
			startRowCoord.y + rect.top
		);

		console.log("endColId", endColId.col);

		mainController.model.selection.end.col = Math.min(
			maxCol - 1,
			endColId.col + 100
		);

		console.log("maxCol", maxCol);
		console.log(
			"mainController.model.selection.end",
			mainController.model.selection.end
		);

		// const coord = this.model.getCellCoordsFromPosition(
		// 	e.clientX,
		// 	e.clientY + this.viewport.scrollTop - rect.top
		// );

		// this.model.selection = {
		// 	start: { row: coord.row - 1, col: 0 },
		// 	end: {
		// 		row: coord.row - 1,
		// 		col: col - 1,
		// 	},
		// };

		// this.model.activeCell = {
		// 	row: this.model.selection.start.row,
		// 	col: 0,
		// };
	}
}
