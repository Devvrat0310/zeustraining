/**
 * Represents the data and state of the entire spreadsheet.
 */
export class SheetModel {
	/**
	 * Initializes the SheetModel.
	 * @param {number} initialRowCount The total number of rows.
	 * @param {number} initialColCount The total number of columns.
	 */
	constructor(initialRowCount, initialColCount) {
		/** @type {number} The default width for columns. */
		this.DEFAULT_COL_WIDTH = 60;
		/** @type {number} The default height for rows. */
		this.DEFAULT_ROW_HEIGHT = 22;

		this.rowCount = initialRowCount;
		this.colCount = initialColCount;

		/** @type {number[]} Stores the width of each column. */
		this.columnWidths = new Array(this.colCount).fill(
			this.DEFAULT_COL_WIDTH
		);
		/** @type {number[]} Stores the height of each row. */
		this.rowHeights = new Array(this.rowCount).fill(
			this.DEFAULT_ROW_HEIGHT
		);

		/**
		 * Stores cell data in an object.
		 * Eg : row 1, col1 => key = '1_1'
		 * @type {Object.<string, { value: any }>}
		 */
		this.cellData = {};

		/**
		 * Stores the current selection range.
		 * @type {{ start: {row: number, col: number}, end: {row: number, col: number} } | null}
		 */
		this.selection = null;

		/**
		 * Stores boolean for checking if we are selecting entire row.
		 * @type {boolean}
		 */
		this.rowSidebarSelection = false;

		/**
		 * Stores boolean for checking if we are selecting entire column.
		 * @type {boolean}
		 */
		this.columnHeaderSelection = false;

		/**
		 * Stores the single active cell coordinates, which is the cell that
		 * would be edited.
		 * @type {{row: number, col: number} | null}
		 */
		this.activeCell = null;

		/** @type {number[]} Init cumulative sums of column widths for faster lookups. */
		this.cumulativeColWidths = [];
		/** @type {number[]} Init cumulative sums of row heights for faster lookups. */
		this.cumulativeRowHeights = [];
		this.recalculateCumulativeDimensions();

		/**
		 * @type {number} A variable to track zoom amount.
		 */
		this.zoom = 1.5;
	}

	/**
	 * Dynamically adds more rows to the model.
	 * @param {number} numRowsToAdd The number of rows to append.
	 */
	addRows(numRowsToAdd) {
		for (let i = 0; i < numRowsToAdd; i++) {
			this.rowHeights.push(this.DEFAULT_ROW_HEIGHT);
		}
		this.rowCount = this.rowHeights.length;
		this.recalculateCumulativeDimensions();

		// console.log("rowCount", this.rowCount);
	}

	/**
	 * Dynamically adds more columns to the model.
	 * @param {number} numColsToAdd The number of columns to append.
	 */
	addColumns(numColsToAdd) {
		for (let i = 0; i < numColsToAdd; i++) {
			this.columnWidths.push(this.DEFAULT_COL_WIDTH);
		}
		this.colCount = this.columnWidths.length;
		this.recalculateCumulativeDimensions();
	}

	/**
	 * Recalculates the cumulative width and height arrays.
	 * This should be called whenever a column or row is resized.
	 */
	recalculateCumulativeDimensions() {
		let cumulativeWidth = 0;
		this.cumulativeColWidths = this.columnWidths.map(
			(w) => (cumulativeWidth += w)
		);
		let cumulativeHeight = 0;
		this.cumulativeRowHeights = this.rowHeights.map(
			(h) => (cumulativeHeight += h)
		);
	}

	/**
	 * Sets the value of a specific cell.
	 * @param {number} row The row index.
	 * @param {number} col The column index.
	 * @param {any} value The value to set.
	 */
	setCellValue(row, col, value) {
		const key = `${col}_${row}`;
		this.cellData[key] = { value };
	}

	/**
	 * Gets the value of a specific cell.
	 * @param {number} row The row index.
	 * @param {number} col The column index.
	 * @returns {any | undefined} The cell's value or undefined if empty.
	 */
	getCellValue(row, col) {
		const key = `${col}_${row}`;
		return this.cellData[key]?.value;
	}

	/**
	 * Sets the width of a specific column and recalculates cumulative widths.
	 * @param {number} colIndex The column index.
	 * @param {number} width The new width.
	 */
	setColumnWidth(colIndex, width) {
		if (colIndex >= 0 && colIndex < this.columnWidths.length) {
			this.columnWidths[colIndex] = Math.max(20, width); // Enforce a minimum width
			this.recalculateCumulativeDimensions();
		}
	}

	/**
	 * Sets the height of a specific row and recalculates cumulative heights.
	 * @param {number} rowIndex The row index.
	 * @param {number} height The new height.
	 */
	setRowHeight(rowIndex, height) {
		if (rowIndex >= 0 && rowIndex < this.rowHeights.length) {
			this.rowHeights[rowIndex] = Math.max(15, height); // Enforce a minimum height
			this.recalculateCumulativeDimensions();
		}
	}

	/**
	 * Converts pixel coordinates to a cell {row, col}.
	 * @param {number} x The x-coordinate in the grid.
	 * @param {number} y The y-coordinate in the grid.
	 * @returns {{row: number, col: number}} The corresponding cell coordinates.
	 */
	getCellCoordsFromPosition(x, y) {
		// Use binary search for performance on large datasets
		const find_idx = (arr, val) => {
			let low = 0,
				high = arr.length - 1;
			while (low <= high) {
				let mid = Math.floor((low + high) / 2);
				if (arr[mid] > val && (mid === 0 || arr[mid - 1] <= val)) {
					return mid;
				} else if (arr[mid] <= val) {
					low = mid + 1;
				} else {
					high = mid - 1;
				}
			}
			return low;
		};

		const col = find_idx(this.cumulativeColWidths, x);
		const row = find_idx(this.cumulativeRowHeights, y);

		return { row, col };
	}

	/**
	 * Gets the pixel position and dimensions of a specific cell.
	 * @param {number} row The row index.
	 * @param {number} col The column index.
	 * @returns {{x: number, y: number, width: number, height: number}}
	 */
	getCellDimensions(row, col) {
		const x = col === 0 ? 0 : this.cumulativeColWidths[col - 1];
		const y = row === 0 ? 0 : this.cumulativeRowHeights[row - 1];
		const width = this.columnWidths[col];
		const height = this.rowHeights[row];
		return { x, y, width, height };
	}
}
