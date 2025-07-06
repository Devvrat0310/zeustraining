/**
 * A command to handle the action of resizing a column.
 */
export class ResizeColumnCommand {
    /**
     * @param {SheetModel} model The data model to perform the action on.
     * @param {number} colIndex The index of the column to resize.
     * @param {number} newWidth The target width of the column.
     */
    constructor (model, colIndex, newWidth) {
        /** @type {SheetModel} */
        this.model = model;
        /** @type {number} */
        this.colIndex = colIndex;
        /** @type {number} */
        this.newWidth = newWidth;
        /** @type {number} The width before the resize, for the undo operation. */
        this.oldWidth = model.columnWidths[ colIndex ];
    }

    /**
     * Executes the resize action.
     */
    execute() {
        this.model.setColumnWidth(this.colIndex, this.newWidth);
    }

    /**
     * Undoes the resize action by restoring the old width.
     */
    undo() {
        this.model.setColumnWidth(this.colIndex, this.oldWidth);
    }
}
