export class Cell {
	/**
	 *
	 * @param {*} row
	 * @param {*} col
	 * @param {Spreadsheet} mainController - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 */
	constructor(row, col, mainController) {
		this.index = { row: row, col: col };
	}
}
