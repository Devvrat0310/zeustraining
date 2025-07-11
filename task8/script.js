import { SheetModel } from "./components/SheetModel.js";
import { Viewport } from "./components/Viewport.js";

import { ExcelGrid } from "./components/RenderCanvases/ExcelGrid.js";
import { SelectCell } from "./components/SelectCell.js";
import { ColumnHeader } from "./components/RenderCanvases/ColumnHeader.js";
import { RowSidebar } from "./components/RenderCanvases/RowSidebar.js";

import { Scrollbar } from "./components/Scrollbar.js";

import { ZoomManager } from "./components/ZoomManager.js";

import { CommandManager } from "./components/CommandManager.js";
import { ResizeColumnCommand } from "./components/commands/ResizeColumnCommand.js";
import { ResizeRowCommand } from "./components/commands/ResizeRowCommand.js";
import { SetCellValueCommand } from "./components/commands/SetCellValueCommand.js";

import { ColumnResizeHandler } from "./components/eventHandlers/ColumnResizeHandler.js";
import { RowResizeHandler } from "./components/eventHandlers/RowResizeHandler.js";
import { ColumnSelectionHandler } from "./components/eventHandlers/ColumnSelectionHandler.js";
import { RowSelectionHandler } from "./components/eventHandlers/RowSelectionHandler.js";
import { CellSelectionHandler } from "./components/eventHandlers/CellSelectionHandler.js";
import { SetFunctionValues } from "./components/SetFunctionValues.js";

// import userRecords from "./DB/tables/userRecords.json" assert { type: "json" };

/**
 * The main application class, acting as the Controller.
 */
class Spreadsheet {
	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this.spreadsheetElement = this.container.querySelector(".canvases");
		this.cellEditor = this.container.querySelector("#cell-editor"); // Cell editor element
		this.barInput = this.container.querySelector(".bar-input");
		this.selectedCell = this.container.querySelector(".selected-cell");

		this.corner = this.container.querySelector(".corner");
		// this.calculations = this.container.querySelector(".calculations");

		this.setFunctionValues = new SetFunctionValues();

		// this.temp = this.container
		// 	.querySelector(".calculations")
		// 	.querySelector("#average");

		// this.temp.innerHTML = "blah blah";

		this.zoomManager = new ZoomManager();

		this.model = new SheetModel(500, 500);

		this.viewport = new Viewport(this.container);

		this.commandManager = new CommandManager();

		// Init viewing canvas
		this.mainGrid = new ExcelGrid(
			this.container.querySelector(".main-canvas")
		);

		this.selectCell = new SelectCell(
			this.container.querySelector(".selection-canvas")
		);
		this.columnHeader = new ColumnHeader(
			this.container.querySelector(".columns-canvas")
		);
		this.rowSidebar = new RowSidebar(
			this.container.querySelector(".rows-canvas")
		);

		this.scrollbarController = new Scrollbar(this);
		this.selectionScrollAnimationFrameId = null; // To manage selection auto-scroll

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

	initHTML() {
		const templateString = `
		<div id="spreadsheet-container">
			<div class="spreadsheet">
				<div class="content-bar">
					<input
						type="text"
						class="selected-cell"
						value="A1"
					/>
					<div class="formulas"></div>
					<input
						type="text"
						class="bar-input"
						value=""
					/>
				</div>
				<div class="canvases">
					<canvas class="corner"></canvas>
					<div class="column-header-container">
						<canvas class="columns-canvas"></canvas>
					</div>

					<div class="row-header-container">
						<canvas class="rows-canvas"></canvas>
					</div>

					<div class="main-grid-container">
						<canvas class="main-canvas"></canvas>
					</div>
					<canvas class="selection-canvas"></canvas>
					<div class="scrollbar-track scrollbar-track-vertical">
						<div
							class="scrollbar-thumb scrollbar-thumb-vertical"
						></div>
					</div>
				</div>
				<div class="scrollbar-track scrollbar-track-horizontal">
					<div
						class="scrollbar-thumb scrollbar-thumb-horizontal"
					></div>
				</div>
			</div>
			<textarea
				id="cell-editor"
				class="cell-editor"
			></textarea>
		</div>
			 `;
	}

	init() {
		this.addEventListeners();
		this.model.loadJsonData(this);
		// this.render();
	}

	/**
	 * Updates the CSS grid layout based on the calculated required width for the row headers.
	 */
	updateLayout() {
		const newWidth = this.rowSidebar.requiredWidth;
		const currentGridCols =
			this.spreadsheetElement.style.gridTemplateColumns;
		const newGridCols = `${newWidth}px 1fr`;

		// Only update the DOM if the layout has actually changed to avoid unnecessary reflows
		if (currentGridCols !== newGridCols) {
			this.spreadsheetElement.style.gridTemplateColumns = newGridCols;

			// A layout change means viewport dimensions might change, so we re-render
			return true;
		}
		return false;
	}

	/**
	 * The main application render loop.
	 */
	render() {
		// Set zoom in Sheetmodel to current zoom;
		this.model.zoom = this.zoomManager.zoom;

		this.rowSidebar.render(this.model, this.viewport);

		if (this.model.activeCell && document.activeElement !== this.barInput) {
			const { row, col } = this.model.activeCell;
			// Set value in bar input
			this.barInput.value = this.model.getCellValue(row, col) || "";
		}

		// Update the main grid layout if the row header width changed
		const layoutChanged = this.updateLayout();

		this.mainGrid.render(this.model, this.viewport, this.container);
		this.columnHeader.render(this.model, this.viewport);
		this.selectCell.render(this.model, this.viewport, this);

		this.scrollbarController.render();

		this.corner.style.width = `${this.rowSidebar.requiredWidth - 2}px`;
		this.corner.style.height = `${this.columnHeader.viewHeight - 2}px`;

		this.selectCell.updateSelectedColumn(this);
		this.selectCell.updateSelectedRow(this);

		if (layoutChanged) {
			this.rowSidebar.render(this.model, this.viewport);
			this.mainGrid.render(this.model, this.viewport, this.container);
			this.columnHeader.render(this.model, this.viewport);
			this.selectCell.render(this.model, this.viewport, this);
		}
	}

	addEventListeners() {
		this.container.addEventListener("wheel", this.handleWheel.bind(this), {
			passive: false,
		});
		this.container.addEventListener(
			"pointerdown",
			this.handlePointerDown.bind(this)
		);
		this.container.addEventListener(
			"pointermove",
			this.handlePointerMove.bind(this)
		);
		this.container.addEventListener(
			"pointerup",
			this.handlePointerUp.bind(this)
		);

		document.addEventListener("keydown", this.handleKeyDown.bind(this));

		window.addEventListener("resize", this.handleWindowResizing.bind(this));

		// Listener to enable cell editing
		this.container.addEventListener(
			"dblclick",
			this.handleDoubleClick.bind(this)
		);

		// Add listeners to the editor itself to handle commit/cancel
		this.cellEditor.addEventListener(
			"keydown",
			this.handleEditorKeyDown.bind(this)
		);
		this.cellEditor.addEventListener(
			"blur",
			this.handleEditorBlur.bind(this)
		);
	}

	// Centralized keydown handler
	handleKeyDown(e) {
		// console.log("this.barInput.focus()", this.barInput);
		if (document.activeElement === this.barInput) {
			if (e.key === "Enter") {
				// console.log("entered");
				this.barInput.blur();
				this.barInput.value = "";
				return;
			}
			if (e.key.length > 1) {
				return;
			}

			const { row, col } = this.model.activeCell;
			this.model.setCellValue(row, col, this.barInput.value + e.key);
			// console.log("this.barInput", this.barInput);
			// console.log("this.barInput.value", this.barInput.value);
			this.render();
			return;
		}

		// Handles cell selection using keyboard
		else if (this.model.activeCell && e.key.length !== 1) {
			if (e.shiftKey) {
				// Handle multiple cell selection
				this.hideCellEditor(true);
				this.cellSelectionHandler.onKeyDown(e, this, true);
			} else {
				this.hideCellEditor(true);
				this.cellSelectionHandler.onKeyDown(e, this, false);
			}
		}

		// console.log("this.isEditing", this.isEditing);
		// console.log("key resed");
		// The editor's own keydown handler will be called.
		if (this.isEditing) {
			const { newWidth, newHeight } =
				this.selectCell.updateEditorCellWidth(this.cellEditor, this);

			// console.log("newWidth", newWidth);

			this.cellEditor.style.width = `${newWidth}px`;
			this.cellEditor.style.height = `${newHeight}px`;
			// console.log("inside key down isEditing", this.isEditing);
			return;
		}

		// console.log("reached undo redo");
		// Undo/Redo
		if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
			console.log("shift z");
			e.preventDefault();
			this.commandManager.redo();
			this.render();
		} else if (e.ctrlKey && e.key === "z") {
			e.preventDefault();
			this.commandManager.undo();
			this.render();
		}

		console.log("before delete");

		// Delete selected area
		if (e.key === "Delete" && this.model.selection) {
			// Clear the value of the selected cell(s)
			console.log("deleted");
			const { start, end } = this.model.selection;
			for (
				let row = Math.min(start.row, end.row);
				row <= Math.max(start.row, end.row);
				row++
			) {
				for (
					let col = Math.min(start.col, end.col);
					col <= Math.max(start.col, end.col);
					col++
				) {
					const oldValue = this.model.getCellValue(row, col) || "";
					const command = new SetCellValueCommand(
						this.model,
						row,
						col,
						"",
						oldValue
					);
					this.commandManager.execute(command);
				}
			}
			this.render();
		}
		// Start editing when key pressed
		else if (
			e.key.length === 1 &&
			this.model.activeCell
			// &&
			// !this.barInput.focus()
		) {
			this.showCellEditor(e.key);
		}

		// F2 to edit
		else if (e.key === "F2" && this.model.activeCell) {
			e.preventDefault();
			this.showCellEditor();
		} else if (e.ctrlKey && e.key === "+") {
			console.log("Plus key is pressed");
			this.handleZoom(e);
		}
	}

	/**
	 * Handles double-clicking on the grid to start editing a cell.
	 */
	handleDoubleClick(e) {
		// console.log("this handle double click ran");
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		if (mainGridContainer.contains(e.target)) {
			console.log("contains");
			const gridX = e.offsetX + this.viewport.scrollLeft;
			const gridY = e.offsetY + this.viewport.scrollTop;
			const coords = this.model.getCellCoordsFromPosition(gridX, gridY);

			// Ensure the clicked cell is the active one before editing
			this.model.activeCell = coords;
			this.model.selection = { start: coords, end: coords };

			this.showCellEditor();
			this.render();
		}
	}

	/**
	 * Positions and displays the cell editor over the active cell.
	 */
	showCellEditor(initialValue = null) {
		if (!this.model.activeCell) return;

		this.isEditing = true;
		// this.selectCell.eraseLowerRightCorner(this);

		const { row, col } = this.model.activeCell;
		const { x, y, width, height } = this.model.getCellDimensions(row, col);

		// Position the editor relative to the main grid container
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		const containerRect = mainGridContainer.getBoundingClientRect();
		const spreadsheetRect = this.spreadsheetElement.getBoundingClientRect();

		const editorTop =
			y -
			this.viewport.scrollTop +
			containerRect.top -
			spreadsheetRect.top;
		const editorLeft =
			x -
			this.viewport.scrollLeft +
			containerRect.left -
			spreadsheetRect.left;

		const rect = this.spreadsheetElement.getBoundingClientRect();
		// console.log("this.spreadsheetElement", rect.top);
		this.cellEditor.style.display = "block";
		this.cellEditor.style.top = `${editorTop + rect.top - 2}px`;
		this.cellEditor.style.left = `${editorLeft + rect.left - 2}px`;
		this.cellEditor.style.width = `${width + 3}px`;
		this.cellEditor.style.height = `${height + 3}px`;

		// Set initial value and focus
		const currentValue = this.model.getCellValue(row, col) || "";
		this.cellEditor.value = initialValue !== null ? "" : currentValue;

		// this.cellEditor.style.width = "200px";
		this.cellEditor.focus();
		this.cellEditor.select();

		// If starting with a fresh key, place cursor at the end
		if (initialValue !== null) {
			this.cellEditor.setSelectionRange(
				initialValue.length,
				initialValue.length
			);
		} else {
			this.cellEditor.select(); // Otherwise, select all text
		}

		// console.log("currentValue", currentValue);
		this.model.setCellValue(row, col, currentValue);
		this.render();
	}

	/**
	 * Hides the cell editor and optionally saves its value to the model.
	 * @param {boolean} saveValue - If true, save the current value. If false, discard it.
	 */
	hideCellEditor(saveValue = false) {
		if (!this.isEditing) return;

		if (saveValue && this.model.activeCell) {
			const { row, col } = this.model.activeCell;
			const newValue = this.cellEditor.value;
			const oldValue = this.model.getCellValue(row, col) || "";
			// this.model.setCellValue(row, col, newValue);

			if (newValue !== oldValue) {
				const command = new SetCellValueCommand(
					this.model,
					row,
					col,
					newValue,
					oldValue
				);
				this.commandManager.execute(command);
			}
		}

		this.cellEditor.style.display = "none";
		this.cellEditor.value = "";
		this.isEditing = false;
		this.render();
	}

	/**
	 * Handles the blur event on the cell editor (e.g., clicking away).
	 */
	handleEditorBlur() {
		this.hideCellEditor(true);
	}

	/**
	 * Handles key presses within the cell editor.
	 * @param {KeyboardEvent} e
	 */
	handleEditorKeyDown(e) {
		switch (e.key) {
			case "Enter":
				e.preventDefault();
				this.hideCellEditor(true);
				break;
			case "Escape":
				e.preventDefault();
				this.hideCellEditor(false);
				break;
		}
	}

	scrollBy(dx, dy) {
		// for (let i = 0; i < 10; i++) {
		if (dx) this.viewport.scrollLeft += dx;
		if (dy) this.viewport.scrollTop += dy;
		this.checkForInfiniteScroll();
		this.render();
		// }
	}

	handleWheel(e) {
		e.preventDefault();
		const dx = e.shiftKey ? e.deltaY : 0;
		const dy = e.shiftKey ? 0 : e.deltaY;
		this.scrollBy(dx, dy);
		// if (e.ctrlKey) {
		// 	this.handleZoom(e);
		// }
	}

	checkForInfiniteScroll() {
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		const viewWidth = mainGridContainer.clientWidth;
		const viewHeight = mainGridContainer.clientHeight;

		const actualTotalWidth =
			this.model.cumulativeColWidths[this.model.colCount - 1] || 0;
		const actualTotalHeight =
			this.model.cumulativeRowHeights[this.model.rowCount - 1] || 0;

		// Infinite Scroll Trigger
		if (this.viewport.scrollTop + viewHeight >= actualTotalHeight - 2000) {
			this.model.addRows(500);
		}
		if (this.viewport.scrollLeft + viewWidth >= actualTotalWidth - 2000) {
			this.model.addColumns(50);
		}

		this.viewport.scrollLeft = Math.max(0, this.viewport.scrollLeft);
		this.viewport.scrollTop = Math.max(0, this.viewport.scrollTop);
	}

	handlePointerDown(e) {
		if (this.isEditing) {
			this.hideCellEditor(true);
		}

		for (const currFeature of this.mouseEventHandlers) {
			if (currFeature.hitTest(e, this)) {
				// console.log("yes column/row event called");
				this.activeHandler = currFeature;
				this.activeHandler.onPointerDown(e, this);
				return;
			}
		}
	}
	isPointerInHeader(e) {
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		const rect = mainGridContainer.getBoundingClientRect();

		const pointerX = e.clientX - rect.left;
		const pointerY = e.clientY - rect.top;

		const gridX = pointerX + this.viewport.scrollLeft;
		const gridY = pointerY + this.viewport.scrollTop;

		let nearRowEdge = false;
		let nearColEdge = false;

		// Check for column resize hover in the column header area
		if (e.target.closest(".column-header-container")) {
			for (let i = 0; i < this.model.colCount; i++) {
				const colEdgeX = this.model.cumulativeColWidths[i];
				if (Math.abs(gridX - colEdgeX) < 5) {
					nearColEdge = true;
					break;
				}
			}
		}

		// Check for row resize hover in the row header area
		if (e.target.closest(".row-header-container")) {
			for (let i = 0; i < this.model.rowCount; i++) {
				const rowEdgeY = this.model.cumulativeRowHeights[i];
				if (Math.abs(gridY - rowEdgeY) < 5) {
					nearRowEdge = true;
					break;
				}
			}
		}

		// Apply/remove cursors
		if (nearColEdge) {
			this.container.classList.add("col-resize-cursor");
		} else {
			this.container.classList.remove("col-resize-cursor");
		}

		if (nearRowEdge) {
			this.container.classList.add("row-resize-cursor");
		} else {
			this.container.classList.remove("row-resize-cursor");
		}
	}

	handlePointerMove(e) {
		// this.isPointerInHeader(e);

		if (this.activeHandler) {
			this.activeHandler.onPointerMove(e, this);
		} else {
			for (const currFeature of this.resizeEventHandler) {
				if (currFeature.updateCursor(e, this)) {
					return;
				}
			}
		}
	}

	handlePointerUp(e) {
		this.scrollbarController.handlePointerUp(e);

		if (this.activeHandler) {
			this.activeHandler.onPointerUp(e, this);
			this.activeHandler = null;
		}
	}

	handleWindowResizing() {
		// Recalculate viewport size and re-render everything
		this.viewport.updateDimensions(this.container);
		this.render();
		window.location.reload();
	}

	/**
	 * Handles the zoom event on the canvas element.
	 * Prevents the default scroll behavior, updates the canvas dimensions,
	 * and applies a zoom factor based on the scroll direction.
	 *
	 * @param {WheelEvent} e The wheel event triggered by user interaction.
	 */
	handleZoom(e) {
		e.preventDefault();
		this.zoomManager.setZoom(e.deltaY < 0 ? 0.2 : -0.2);
		this.render();
	}
}

new Spreadsheet("spreadsheet-container");
