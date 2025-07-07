/**
 * A command to handle changing a cell's value.
 */
export class SetCellValueCommand {
	/**
	 * @param {SheetModel} model The data model.
	 * @param {number} row The row index of the cell.
	 * @param {number} col The column index of the cell.
	//  * @param {{start:{row: number, col: number}, end: {row: number, col: number}}} coords The selected cell range.
	 * @param {any} newValue The new value for the cell.
	 * @param {any} oldValue The previous value of the cell (for undo).
	 */
	constructor(model, row, col, newValue, oldValue) {
		this.model = model;
		this.row = row;
		this.col = col;
		this.newValue = newValue;
		this.oldValue = oldValue;
	}

	execute() {
		this.model.setCellValue(this.row, this.col, this.newValue);
	}

	undo() {
		this.model.setCellValue(this.row, this.col, this.oldValue);
	}
}
