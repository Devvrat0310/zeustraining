export class EventHandlerManager {
	constructor(spreadsheet) {
		this.columnResizeHandler = new ColumnResizeHandler();
		this.rowResizeHandler = new RowResizeHandler();
		this.columnSelectionHandler = new ColumnSelectionHandler();
		this.rowSelectionHandler = new RowSelectionHandler();
		this.cellSelectionHandler = new CellSelectionHandler();

		/**
		 * @type {Array[Object]} - An array that contains all the mouse event handlers
		 */
		this.mouseEventHandlers = [
			this.columnResizeHandler,
			this.rowResizeHandler,
			this.columnSelectionHandler,
			this.rowSelectionHandler,
			this.cellSelectionHandler,
		];

		this.resizeEventHandler = [
			this.columnResizeHandler,
			this.rowResizeHandler,
		];

		this.activeHandler = null;

		this.init();
	}
}
