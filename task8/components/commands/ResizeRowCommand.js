/**
 * A command to handle the action of resizing a row.
 */
export class ResizeRowCommand {
	/**
	 * @param {SheetModel} model The data model to perform the action on.
	 * @param {number} rowIndex The index of the row to resize.
	 * @param {number} newHeight The target height of the row.
	 */
	constructor(model, rowIndex, newHeight) {
		/** @type {SheetModel} */
		this.model = model;
		/** @type {number} */
		this.rowIndex = rowIndex;
		/** @type {number} */
		this.newHeight = newHeight;
		/** @type {number} The height before the resize, for the undo operation. */
		this.oldHeight = model.rowHeights[rowIndex];
	}

	/**
	 * Executes the resize action.
	 */
	execute() {
		this.model.setRowHeight(this.rowIndex, this.newHeight);
	}

	/**
	 * Undoes the resize action by restoring the old height.
	 */
	undo() {
		this.model.setRowHeight(this.rowIndex, this.oldHeight);
	}
}
