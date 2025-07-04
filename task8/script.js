// script.js

import { SheetModel } from "./components/SheetModel.js";
import { Viewport } from "./components/Viewport.js";
import { ExcelGrid } from "./components/ExcelGrid.js";
import { SelectCell } from "./components/SelectCell.js";
import { ColumnHeader } from "./components/ColumnHeader.js";
import { RowSidebar } from "./components/RowSidebar.js";

import { Scrollbar } from "./components/Scrollbar.js";

import { ZoomManager } from "./components/ZoomManager.js";

/**
 * The main application class, acting as the Controller.
 */
class Spreadsheet {
	constructor(containerId) {
		this.container = document.getElementById(containerId);
		this.spreadsheetElement = this.container.querySelector(".canvases");
		this.cellEditor = this.container.querySelector("#cell-editor"); // Cell editor element

		this.corner = this.container.querySelector(".corner");

		// console.log("this.corner.width", this.corner.width);

		this.zoomManager = new ZoomManager();

		this.model = new SheetModel(500, 500);

		this.viewport = new Viewport(this.container);

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
		this.init();
	}

	initHTML() {
		const templateString = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Document</title>
					<link rel="stylesheet" href="style.css" />
				</head>
				<body>
					<div class="spreadsheet">
						<canvas class="corner"></canvas>
						<div class="column-wrapper">
							<div class="pushed-overlay-column" style="width: 0px"></div>
							<div class="columns"></div>
						</div>
						<div class="rows--canvas">
							<div class="row-wrapper">
								<div class="pushed-overlay-row" style="height: 0px"></div>
								<div class="rows"></div>
							</div>
							<div class="main-canvas-wrapper">
								<div class="excel-top-space" style="height: 0"></div>
								<div class="left-space-wrapper">
									<div class="excel-left-space" style="width: 0"></div>
									<div class="main-canvas"></div>
								</div>
							</div>
						</div>
						<canvas class="select-cell-canvas" style="left: 0; top: 0"></canvas>
					</div>
					<script type="module" src="script.js"></script>
				</body>
			</html>
			 `;
	}

	init() {
		this.addEventListeners();
		this.render();

		console.log("this.corner.style.width", this.corner.style.width);
		this.corner.style.width = `${this.rowSidebar.requiredWidth - 2}px`;
		this.corner.style.height = `${this.columnHeader.viewHeight - 2}px`;
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

		// First, render the row header to calculate its required width
		this.rowSidebar.render(this.model, this.viewport);

		// Update the main grid layout if the row header width changed
		const layoutChanged = this.updateLayout();

		// Render the rest of the views
		this.mainGrid.render(this.model, this.viewport);
		this.columnHeader.render(this.model, this.viewport);
		this.selectCell.render(this.model, this.viewport, this);

		this.scrollbarController.render();

		// If the layout changed, it can affect the viewport size and what's visible,
		// so we do a second pass of rendering to ensure everything is drawn correctly
		// in the new layout. This prevents a one-frame lag.
		if (layoutChanged) {
			this.mainGrid.render(this.model, this.viewport);
			this.columnHeader.render(this.model, this.viewport);
			this.rowSidebar.render(this.model, this.viewport);
			this.selectCell.render(this.model, this.viewport, this);
			this.scrollbarController.render();
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
		document.addEventListener(
			"pointermove",
			this.handlePointerMove.bind(this)
		);
		document.addEventListener("pointerup", this.handlePointerUp.bind(this));

		// this.container.addEventListener(
		// 	"keydown",
		// 	this.handleStartCellEditingKeyDown.bind(this)
		// );

		window.addEventListener("keydown", this.handleGlobalKeyDown.bind(this));

		window.addEventListener("resize", this.handleWindowResizing.bind(this));

		// window.addEventListener("resize", this.handleWindowZooming.bind(this));

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

	handleKeyboardNavigation(e, isShift) {
		console.log("inside else");
		console.log("e.key", e.key);

		console.log("is shifted", isShift);
		console.log("this.model.activeCell before", this.model.activeCell);

		let rowBefore = this.model.selection.end.row;
		let colBefore = this.model.selection.end.col;

		let scrolled = false;
		switch (e.key) {
			case "ArrowDown":
				rowBefore += 1;
				break;

			case "ArrowUp":
				rowBefore -= 1;
				break;

			case "ArrowRight":
				colBefore += 1;

				break;

			case "ArrowLeft":
				colBefore -= 1;
				break;

			default:
				break;
		}

		// console.log(
		// 	"Before this.model.selection",
		// 	this.model.selection.start,
		// 	this.model.selection.end
		// );

		rowBefore = Math.max(0, rowBefore);
		colBefore = Math.max(0, colBefore);

		// console.log("this.model.activeCell after", this.model.activeCell);

		if (isShift) {
			// this.model.activeCell = { row: rowBefore, col: colBefore };
			this.model.selection = {
				...this.model.selection,
				end: { row: rowBefore, col: colBefore },
			};
			// console.log(
			// 	"Shifted this.model.selection",
			// 	this.model.selection.start,
			// 	this.model.selection.end
			// );
		} else {
			this.model.activeCell = { row: rowBefore, col: colBefore };

			this.model.selection = {
				start: { ...this.model.activeCell },
				end: { ...this.model.activeCell },
			};
			// console.log(
			// 	"Not shifted this.model.selection",
			// 	this.model.selection.start,
			// 	this.model.selection.end
			// );
		}

		const colWidth =
			this.model.cumulativeColWidths[this.model.selection.end.col];

		const colId = this.model.selection.end.col;

		const rowHeight =
			this.model.cumulativeRowHeights[this.model.selection.end.row];
		const rowId = this.model.selection.end.row;

		let scrollX = 0;
		let scrollY = 0;
		if (
			colWidth + this.model.columnWidths[colId] >
			this.viewport.width + this.viewport.scrollLeft
		) {
			scrollX =
				colWidth +
				this.model.columnWidths[colId] -
				this.viewport.width -
				this.viewport.scrollLeft -
				this.rowSidebar.getRequiredWidth() +
				22;
		}

		if (
			colWidth - this.model.columnWidths[colId] <
			this.viewport.scrollLeft
		) {
			scrollX = -this.model.columnWidths[colId];
			// setTimeout(() => {
			// 	this.scrollBy(-this.model.columnWidths[colId], 0);
			// }, 0);
		}

		if (
			rowHeight +
				this.model.rowHeights[rowId] +
				this.columnHeader.viewHeight >
			this.viewport.height + this.viewport.scrollTop
		) {
			scrollY =
				rowHeight +
				this.model.rowHeights[rowId] +
				this.columnHeader.viewHeight -
				(this.viewport.height + this.viewport.scrollTop);

			// setTimeout(() => {
			// 	this.scrollBy(0, scrollY);
			// }, 0);
		}

		if (
			rowHeight - this.columnHeader.viewHeight <
			this.viewport.scrollTop
		) {
			scrollY = -this.model.rowHeights[rowId];
			setTimeout(() => {
				this.scrollBy(0, -this.model.rowHeights[rowId]);
			}, 0);
		}

		setTimeout(() => {
			this.scrollBy(scrollX, scrollY);
		}, 0);

		this.render();
	}

	// Centralized keydown handler
	handleGlobalKeyDown(e) {
		// The editor's own keydown handler will be called.
		if (this.isEditing) {
			return;
		}

		// Start editing when key pressed
		else if (e.key.length === 1 && this.model.activeCell) {
			this.showCellEditor(e.key);
		}

		// F2 to edit
		else if (e.key === "F2" && this.model.activeCell) {
			e.preventDefault();
			this.showCellEditor();
		} else if (this.model.activeCell) {
			if (e.shiftKey) {
				// Handle multiple cell selection
				this.handleKeyboardNavigation(e, true);
			} else {
				this.handleKeyboardNavigation(e, false);
			}
		} else if (e.ctrlKey && e.key === "+") {
			console.log("Plus key is pressed");
			this.handleZoom(e);
		}
	}

	/**
	 * Handles double-clicking on the grid to start editing a cell.
	 */
	handleDoubleClick(e) {
		console.log("this handle double click ran");
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

		this.cellEditor.style.display = "block";
		this.cellEditor.style.top = `${editorTop - 2}px`;
		this.cellEditor.style.left = `${editorLeft - 2}px`;
		this.cellEditor.style.width = `${width + 3}px`;
		this.cellEditor.style.height = `${height + 3}px`;

		// Set initial value and focus
		const currentValue = this.model.getCellValue(row, col) || "";
		this.cellEditor.value =
			initialValue !== null ? initialValue : currentValue;
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
		this.model.setCellValue(row, col, currentValue);
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
			this.model.setCellValue(row, col, newValue);
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
		if (dx) this.viewport.scrollLeft += dx;
		if (dy) this.viewport.scrollTop += dy;
		this.checkForInfiniteScroll();
		this.render();
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

		// Prevent scrolling beyond the *actual* content size, minus one viewport.
		const maxScrollTop = Math.max(0, actualTotalHeight - viewHeight);
		const maxScrollLeft = Math.max(0, actualTotalWidth - viewWidth);

		this.viewport.scrollLeft = Math.max(
			0,
			this.viewport.scrollLeft
			// Math.min(this.viewport.scrollLeft, maxScrollLeft)
		);
		this.viewport.scrollTop = Math.max(
			0,
			this.viewport.scrollTop
			// Math.min(this.viewport.scrollTop, maxScrollTop)
		);
	}

	handleRowColumnSelection(e) {
		const rect = this.spreadsheetElement.getBoundingClientRect();
		if (e.clientX <= this.rowSidebar.requiredWidth) {
			e.target.setPointerCapture(e.pointerId);
			this.model.rowSidebarSelection = true;

			this.isSelecting = true;

			const col = this.model.colCount;
			const coord = this.model.getCellCoordsFromPosition(
				e.clientX,
				e.clientY + this.viewport.scrollTop - rect.top
			);

			this.model.selection = {
				start: { row: coord.row - 1, col: 0 },
				end: {
					row: coord.row - 1,
					col: col - 1,
				},
			};

			this.model.activeCell = {
				row: this.model.selection.start.row,
				col: 0,
			};
			this.render();
		} else if (
			e.clientY > rect.top &&
			e.clientY <= this.columnHeader.viewHeight + rect.top
		) {
			e.target.setPointerCapture(e.pointerId);
			this.model.columnHeaderSelection = true;
			this.isSelecting = true;

			const row = this.model.rowCount;
			const coord = this.model.getCellCoordsFromPosition(
				e.clientX + this.viewport.scrollLeft,
				e.clientY
			);

			this.model.selection = {
				start: { col: coord.col - 1, row: 0 },
				end: {
					col: coord.col - 1,
					row: row - 1,
				},
			};

			this.model.activeCell = {
				col: this.model.selection.start.col,
				row: 0,
			};
			this.render();
		}
	}

	handlePointerDown(e) {
		if (this.isEditing) {
			this.hideCellEditor(true);
		}

		const headerContainer = this.container.querySelector(
			".column-header-container"
		);

		const rowContainer = this.container.querySelector(
			".row-header-container"
		); // Get the row header container

		if (headerContainer.contains(e.target)) {
			const x = e.offsetX + this.viewport.scrollLeft;
			for (let i = 0; i < this.model.columnWidths.length; i++) {
				const colEdgeX = this.model.cumulativeColWidths[i];
				if (Math.abs(x - colEdgeX) < 5) {
					this.isResizingColumn = {
						colIndex: i,
						startX: e.clientX,
						startWidth: this.model.columnWidths[i],
					};
					this.container.classList.add("col-resize-cursor");
					return;
				}
			}
		}

		// Check for Row Resize
		if (rowContainer.contains(e.target)) {
			const y = e.offsetY + this.viewport.scrollTop;
			// Check if pointer is near a row edge
			for (let i = 0; i < this.model.rowHeights.length; i++) {
				const rowEdgeY = this.model.cumulativeRowHeights[i];
				if (Math.abs(y - rowEdgeY) < 5) {
					// 5px grab area
					this.isResizingRow = {
						rowIndex: i,
						startY: e.clientY,
						startHeight: this.model.rowHeights[i],
					};
					this.container.classList.add("row-resize-cursor");
					return;
				}
			}
		}

		// Start Cell SelectCell
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		if (mainGridContainer.contains(e.target)) {
			// Capture the pointer to ensure move events fire even when outside the element
			e.target.setPointerCapture(e.pointerId);

			this.isSelecting = true;
			const gridX = e.offsetX + this.viewport.scrollLeft;
			const gridY = e.offsetY + this.viewport.scrollTop;
			const coords = this.model.getCellCoordsFromPosition(gridX, gridY);
			this.model.selection = { start: coords, end: coords };
			this.model.activeCell = coords; // The clicked cell is now active

			this.render();
		}
		this.handleRowColumnSelection(e);
	}

	isPointerInHeader(e) {
		if (this.isSelecting) return;
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		const rect = mainGridContainer.getBoundingClientRect();

		// The event's clientX/Y is relative to the viewport, which is what we need.
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
					// 5px grab area
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
					// 5px grab area
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
		this.isPointerInHeader(e);

		// Stop any previously running scroll loop, as the pointer has moved
		// and we need to re-evaluate the scroll direction.
		if (this.selectionScrollAnimationFrameId) {
			cancelAnimationFrame(this.selectionScrollAnimationFrameId);
			this.selectionScrollAnimationFrameId = null;
		}

		if (this.isResizingColumn) {
			const diffX = e.clientX - this.isResizingColumn.startX;
			const newWidth = this.isResizingColumn.startWidth + diffX;
			this.model.setColumnWidth(this.isResizingColumn.colIndex, newWidth);
			this.render();
			return;
		}

		if (this.isResizingRow) {
			const diffY = e.clientY - this.isResizingRow.startY;
			const newHeight = this.isResizingRow.startHeight + diffY;
			this.model.setRowHeight(this.isResizingRow.rowIndex, newHeight);
			this.render();
			return;
		}

		if (this.isSelecting) {
			const mainGridContainer = this.container.querySelector(
				".main-grid-container"
			);
			const rect = mainGridContainer.getBoundingClientRect();

			let scrollDx = 0;
			let scrollDy = 0;
			const scrollMargin = 30; // Start scrolling when mouse is within 30px of the edge
			const maxScrollSpeed = 20; // Max pixels to scroll per frame

			// Calculate horizontal scroll speed based on proximity to edge
			if (e.clientX < rect.left + scrollMargin) {
				scrollDx = -Math.min(
					maxScrollSpeed,
					(rect.left + scrollMargin - e.clientX) / 2
				);
			} else if (e.clientX > rect.right - scrollMargin) {
				scrollDx = Math.min(
					maxScrollSpeed,
					(e.clientX - (rect.right - scrollMargin)) / 2
				);
			}

			// Calculate vertical scroll speed
			if (e.clientY < rect.top + scrollMargin) {
				scrollDy = -Math.min(
					maxScrollSpeed,
					(rect.top + scrollMargin - e.clientY) / 2
				);
			} else if (e.clientY > rect.bottom - scrollMargin) {
				scrollDy = Math.min(
					maxScrollSpeed,
					(e.clientY - (rect.bottom - scrollMargin)) / 2
				);
			}

			// This function updates the selection end-point based on the current pointer coordinates

			const updateSelection = () => {
				if (this.model.rowSidebarSelection) {
					// this.isSelecting = true;

					const col = this.model.colCount;
					const coord = this.model.getCellCoordsFromPosition(
						e.clientX,
						e.clientY + this.viewport.scrollTop
					);

					this.model.selection = {
						...this.model.selection,
						end: {
							row: coord.row - 1,
							col: col - 1,
						},
					};
				} else if (this.model.columnHeaderSelection) {
					const row = this.model.rowCount;
					const coord = this.model.getCellCoordsFromPosition(
						e.clientX + this.viewport.scrollLeft,
						e.clientY
					);

					this.model.selection = {
						...this.model.selection,
						end: {
							col: coord.col - 1,
							row: row - 1,
						},
					};
				} else {
					const gridX =
						e.clientX - rect.left + this.viewport.scrollLeft;
					const gridY =
						e.clientY - rect.top + this.viewport.scrollTop;
					this.model.selection.end =
						this.model.getCellCoordsFromPosition(gridX, gridY);
				}
			};

			if (scrollDx !== 0 || scrollDy !== 0) {
				// If the pointer is outside the grid, start an auto-scroll loop
				const autoScrollLoop = () => {
					this.scrollBy(scrollDx, scrollDy);
					updateSelection(); // Update selection in sync with scrolling
					// `scrollBy` already calls render, so the view is updated.
					this.selectionScrollAnimationFrameId =
						requestAnimationFrame(autoScrollLoop);
				};
				autoScrollLoop();
			} else {
				// If pointer is inside the grid, just update selection and render once.
				updateSelection();
				this.render();
			}

			// console.log("moving, this.model.selection", this.model.selection);
		}
	}

	handlePointerUp(e) {
		this.scrollbarController.handlePointerUp(e);

		if (this.isResizingColumn) {
			this.container.classList.remove("col-resize-cursor");
			const { colIndex, startWidth } = this.isResizingColumn;
			const newWidth = this.model.columnWidths[colIndex];
			this.model.setColumnWidth(colIndex, newWidth);

			this.isResizingColumn = null;
			this.render();
		}

		// Finalize Row Resize
		if (this.isResizingRow) {
			this.container.classList.remove("row-resize-cursor");
			const { rowIndex, startHeight } = this.isResizingRow;
			const newHeight = this.model.rowHeights[rowIndex];

			this.model.setRowHeight(rowIndex, newHeight);

			this.isResizingRow = null;
			this.render();
		}

		if (this.isSelecting) {
			// Stop any autoscrolling loop that might be running
			if (this.selectionScrollAnimationFrameId) {
				cancelAnimationFrame(this.selectionScrollAnimationFrameId);
				this.selectionScrollAnimationFrameId = null;
			}
			this.isSelecting = false;
			this.model.rowSidebarSelection = false;
			this.model.columnHeaderSelection = false;
		}
	}

	handleWindowResizing() {
		console.log("This is resizing");
		// Recalculate viewport size and re-render everything
		this.viewport.updateDimensions(this.container);
		this.render();
		window.location.reload();
		// this.init();
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
