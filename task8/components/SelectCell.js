import { Renderer } from "./RenderCanvases/Renderer.js";

export class SelectCell extends Renderer {
	/**
	 *
	 *
	 * @param {SheetModel} model
	 * @param {Viewport} viewport
	 * @param {Spreadsheet} spreadsheet
	 */
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

			// spreadsheet.setFunctionValues.getSelectionResult(spreadsheet);
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

			// console.log("MODEL IS ACTIVE");
		}

		// console.log("spreadsheet.isEditing", spreadsheet.isEditing);

		if (model.selection && !spreadsheet.isEditing) {
			// console.log("viewX, viewY", viewX, viewY);
			// console.log("MODEL IS writting");

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

	// eraseLowerRightCorner(spreadsheet) {
	// 	console.log(
	// 		"spreadsheet.model.selection && spreadsheet.isEditing",
	// 		spreadsheet.model.selection,
	// 		spreadsheet.isEditing
	// 	);

	// 	const gridContainer = this.canvas.parentElement.querySelector(
	// 		".main-grid-container"
	// 	);
	// 	const gridContainerOffsetLeft = gridContainer.offsetLeft;
	// 	const gridContainerOffsetTop = gridContainer.offsetTop;

	// 	const { row, col } = spreadsheet.model.activeCell;
	// 	const { x, y, width, height } = spreadsheet.model.getCellDimensions(
	// 		row,
	// 		col
	// 	);

	// 	const viewX = x - spreadsheet.viewport.scrollLeft;
	// 	const viewY = y - spreadsheet.viewport.scrollTop;
	// 	console.log("viewX, viewY", viewX, viewY);
	// 	// if (spreadsheet.model.selection && spreadsheet.isEditing) {
	// 	// this.ctx.clearRect(
	// 	// 	viewX + width + gridContainerOffsetLeft - 2,
	// 	// 	viewY + height + gridContainerOffsetTop - 2,
	// 	// 	5,
	// 	// 	5
	// 	// );
	// 	this.ctx.fillStyle = "black";
	// 	this.ctx.clearRect(
	// 		viewX + width + gridContainerOffsetLeft - 2,
	// 		viewY + height + gridContainerOffsetTop - 2,
	// 		5,
	// 		5
	// 	);

	// 	this.ctx.strokeRect;
	// 	// }
	// }

	/**
	 * Keep adding column in model selection as we scroll to the left.
	 * @param {Spreadsheet} mainController
	 */
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

		mainController.model.selection.end.row = Math.min(
			endRowId.row + 100,
			maxRow - 1
		); // Add 100 row for buffer

		console.log(
			"mainController.model.selection",
			mainController.model.selection
		);
	}

	/**
	 * Keep adding column in model selection as we scroll to the bottom.
	 * @param {Spreadsheet} mainController
	 */
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

		mainController.model.selection.end.col = Math.min(
			maxCol - 1,
			endColId.col + 100
		);
	}

	getNextColDimensions(row, col, editorWidth, spreadsheet) {
		const currCol = spreadsheet.model.getCellDimensions(row, col);

		const colCoord = spreadsheet.model.getCellCoordsFromPosition(
			currCol.x + editorWidth,
			currCol.y
		);

		const nextCol = spreadsheet.model.getCellDimensions(row, colCoord.col);

		const nextColWidth = nextCol.width;

		// console.log("colCoord", colCoord);

		const nextColEndPixel = nextCol.x + nextCol.width;

		return { nextColWidth, nextColEndPixel };
	}

	getNextRowDimensions(row, col, editorHeight, spreadsheet) {
		const currRow = spreadsheet.model.getCellDimensions(row, col);

		const rowCoord = spreadsheet.model.getCellCoordsFromPosition(
			currRow.x,
			currRow.y + editorHeight
		);

		const nextRow = spreadsheet.model.getCellDimensions(rowCoord.row, col);

		// console.log("nextRow", nextRow);
		const nextRowHeight = nextRow.height;

		// console.log("rowCoord", rowCoord);

		const nextRowEndPixel = nextRow.y + nextRow.height;

		return { rowCoord, nextRowHeight, nextRowEndPixel };
	}

	/**
	 *
	 * @param {*} text
	 * @param {*} cellEditor
	 */
	updateEditorCellWidth(cellEditor, spreadsheet) {
		// const ctx =
		const text = cellEditor.value;

		// Pass the font style to ctx so that it can properly calculate textwidth
		const computedStyle = window.getComputedStyle(cellEditor);
		this.ctx.font = `${computedStyle.fontStyle} ${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;

		// Current width and height of editor
		const editorWidth = parseFloat(cellEditor.style.width);
		const editorHeight = parseFloat(cellEditor.style.height);

		const textWidth = this.ctx.measureText(text).width;

		const eachLetterWidth = this.ctx.measureText("a").width;

		const { row, col } = spreadsheet.model.activeCell;

		// const currColWidth = spreadsheet.model.getCellDimensions(row, col).width;

		// console.log(
		// 	"currColWidth",
		// 	// currColWidth,
		// 	textWidth,
		// 	textWidth + eachLetterWidth * 2,
		// 	textWidth + eachLetterWidth * 2 + 8
		// );

		const { nextColWidth, nextColEndPixel } = this.getNextColDimensions(
			row,
			col,
			editorWidth,
			spreadsheet
		);

		const { rowCoord, nextRowHeight, nextRowEndPixel } =
			this.getNextRowDimensions(row, col, editorHeight, spreadsheet);

		// 8 for padding, *2 for two letter in buffer
		const targetWidth = textWidth + eachLetterWidth * 2 + 8;

		// Main grid container element to get distance from top to first row
		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);

		const rect = mainGridContainer.getBoundingClientRect();

		// Check if new editor width will take cell outside the view from left
		if (
			editorWidth <= targetWidth &&
			nextColEndPixel - spreadsheet.viewport.scrollLeft <
				spreadsheet.viewport.width -
					spreadsheet.rowSidebar.requiredWidth
		) {
			// do something
			return {
				newWidth: editorWidth + nextColWidth,
				newHeight: editorHeight,
			};
		}
		// Check if new editor width will take cell outside the view from left
		else if (
			nextRowEndPixel - spreadsheet.viewport.scrollTop <
			spreadsheet.viewport.height - rect.top
		) {
			const requiredRows = Math.floor(textWidth / editorWidth) + 1;

			const totalRows = rowCoord.row - row;

			// Check if total rows editor takes up
			if (requiredRows > totalRows) {
				return {
					newWidth: editorWidth,
					newHeight: editorHeight + nextRowHeight,
				};
			}
		}

		return { newWidth: editorWidth, newHeight: editorHeight };
	}
}
