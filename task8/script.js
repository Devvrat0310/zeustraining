import { ColumnsCanvas, ColumnManager } from "./components/columnHeader.js";
import { createLine, handleDynamicDPI } from "./components/canvasComponents.js";
import { RowsCanvas, RowManager } from "./components/RowSidebar.js";
import { ExcelGrid, CanvasManager } from "./components/ExcelGrid.js";
import { SelectCell } from "./components/SelectCell.js";
import { VariableData } from "./components/Data.js";

/**
 * Manages zoom level state and persistence using localStorage.
 *
 * @class ZoomManager
 */
class ZoomManager {
	/**
	 * Initializes a new instance of ZoomManager.
	 * Loads the zoom level from localStorage or sets it to default (1).
	 */
	constructor() {
		this.zoom = 1;
		this.loadZoom();
	}

	/**
	 * Loads the zoom level from localStorage.
	 * If not present, sets zoom to default (1) and stores it.
	 */
	loadZoom() {
		const temp = window.localStorage.getItem("zoom");
		this.zoom = temp ? parseFloat(temp) : 1;
		window.localStorage.setItem("zoom", this.zoom);
	}

	/**
	 * Sets the zoom level by a given delta, clamps it between 0.6 and 3,
	 * rounds to one decimal place, and persists it to localStorage.
	 * @param {number} delta The amount to change the zoom level by.
	 */
	setZoom(delta) {
		this.zoom = Math.min(3, Math.max(0.6, this.zoom + delta));
		this.zoom = parseFloat(this.zoom.toFixed(1));
		window.localStorage.setItem("zoom", this.zoom);
		this.loadZoom();
	}
}

/**
 * Represents a spreadsheet application with zoom, scroll, and dynamic row/column management.
 * Handles user interactions for scrolling and zooming, and manages the main canvas, columns, and rows.
 *
 * @class Spreadsheet
 * @constructor
 *
 */
class Spreadsheet {
	/**
	 * Initializes the spreadsheet controller for a given spreadsheet index.
	 * Sets up DOM references, managers, and initial state for spreadsheet interaction.
	 *
	 * @param {number} index - The index of the spreadsheet instance to initialize.
	 */
	constructor(index) {
		this.spreadsheetIndex = index;
		this.zoomManager = new ZoomManager();
		this.mainCanvas = document.querySelector(".main-canvas");
		this.columnsDiv = document.getElementsByClassName("columns")[0];
		this.pushedOverlayColumns = document.querySelectorAll(
			".pushed-overlay-column"
		)[index];
		this.pushedOverlayRows = document.querySelectorAll(
			".pushed-overlay-row"
		)[index];

		this.SelectCell = new SelectCell(index, this.zoomManager.zoom);

		this.excelLeftSpace =
			document.querySelectorAll(".excel-left-space")[index];
		this.excelTopSpace =
			document.querySelectorAll(".excel-top-space")[index];

		this.rowsDiv = document.querySelector(".rows");

		this.corner = document.querySelector(".corner");

		this.canvasWidth = 1000 - (1000 % (50 * this.zoomManager.zoom));
		this.canvasHeight = 1000 - (1000 % (15 * this.zoomManager.zoom));
		this.updateCornerBoxSize();

		this.canvasManager = new CanvasManager(
			this.mainCanvas,
			this.zoomManager,
			this.excelLeftSpace,
			this.excelTopSpace
		);
		this.columnManager = new ColumnManager(
			this.columnsDiv,
			this.pushedOverlayColumns,
			this.zoomManager
		);
		this.rowManager = new RowManager(
			this.rowsDiv,
			this.pushedOverlayRows,
			this.zoomManager
		);

		this.colWidths = [];
		this.rowHeights = [];

		this.totalDeltaHorizontal = 0;
		this.totalDeltaVertical = 0;

		this.scrolledFirstTime = 0;

		this.initMemory();
		this.init();
		this.addEventListeners();
	}

	/**
	 * Injects a predefined HTML template into the end of the document body.
	 * The template includes canvas elements, column and row wrappers, overlays, and main canvas containers,
	 * which are likely used for rendering a grid or spreadsheet-like interface.
	 *
	 */
	createHTML() {
		const templateString = `
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
		`;

		const body = document.querySelector("body");

		body.innerHTML += templateString;
	}

	/**
	 * Updates the size of the corner box element and redraws its border lines
	 * according to the current zoom level. Adjusts both the CSS size and the
	 * actual canvas pixel dimensions, then draws the right and bottom borders.
	 *
	 */
	updateCornerBoxSize() {
		const currZoom = this.zoomManager.zoom;
		this.corner.style.width = `${50 * currZoom}px`;
		this.corner.style.height = `${15 * currZoom}px`;

		// Set the actual canvas pixel size to match the zoomed size
		this.corner.width = 50 * currZoom;
		this.corner.height = 15 * currZoom;

		const ctx = this.corner.getContext("2d");
		createLine(
			ctx,
			50 * currZoom - 0.5,
			0 - 0.5,
			50 * currZoom - 0.5,
			15 * currZoom - 0.5,
			1,
			"#bdbdbd"
		);
		createLine(
			ctx,
			0 - 0.5,
			15 * currZoom - 0.5,
			50 * currZoom - 0.5,
			15 * currZoom - 0.5,
			1,
			"#bdbdbd"
		);
	}

	updateCanvasDimensions() {
		this.canvasWidth = 1000 - (1000 % (50 * this.zoomManager.zoom));
		this.canvasHeight = 1000 - (1000 % (15 * this.zoomManager.zoom));
	}

	init() {
		for (let i = 0; i < 12; i++) this.canvasManager.createCanvas();
		for (let i = 0; i < 4; i++) this.columnManager.createColumn();
		for (let i = 0; i < 4; i++) this.rowManager.createRow();
	}

	initMemory() {
		this.variables = new VariableData();
	}

	/**
	 * Handles scroll events for both horizontal and vertical directions.
	 *
	 * Updates internal scroll deltas and triggers column or row scrolling actions
	 * when the accumulated delta exceeds the canvas width threshold.
	 *
	 * @param {number} deltaY - The amount of scroll delta (positive or negative).
	 * @param {boolean} isHorizontal - If true, handles horizontal scrolling; otherwise, vertical.
	 *
	 */
	handleScroll(deltaY, isHorizontal) {
		if (isHorizontal) {
			this.totalDeltaHorizontal += deltaY;
			if (this.totalDeltaHorizontal >= this.canvasWidth) {
				this.scrolledFirstTime += 1;
				if (this.scrolledFirstTime > 1) {
					this.columnManager.scrollColumn(true);
					this.canvasManager.scrollCanvasHorizontal(true);
					// this.SelectCell.handleScrollHorizontal(true);
				}
				this.totalDeltaHorizontal = 0;
			} else if (this.totalDeltaHorizontal <= -this.canvasWidth) {
				this.columnManager.scrollColumn(false);
				this.canvasManager.scrollCanvasHorizontal(false);
				// this.SelectCell.handleScrollHorizontal(false);
				this.totalDeltaHorizontal = 0;
			}
		} else {
			this.totalDeltaVertical += deltaY;
			if (this.totalDeltaVertical >= this.canvasHeight) {
				this.rowManager.scrollRow(true);
				this.canvasManager.scrollCanvasVertical(true);
				// this.SelectCell.handleScrollHorizontal(true);
				this.totalDeltaVertical = 0;
			} else if (this.totalDeltaVertical <= -this.canvasHeight) {
				this.rowManager.scrollRow(false);
				this.canvasManager.scrollCanvasVertical(false);
				// this.SelectCell.handleScrollHorizontal(false);
				this.totalDeltaVertical = 0;
			}
		}
	}

	/**
	 * Sets the zoom level for all canvases and updates related managers.
	 *
	 * @param {number} currZoom - The zoom level to apply to all canvases.
	 */
	zoomEachCanvas(currZoom) {
		this.zoomManager.setZoom(currZoom);
		this.canvasManager.zoomAll();
		this.columnManager.zoomAll();
		this.rowManager.zoomAll();
		this.updateCornerBoxSize();
		this.SelectCell.setZoom(this.zoomManager.zoom);
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
		this.updateCanvasDimensions();
		this.zoomEachCanvas(e.deltaY < 0 ? 0.2 : -0.2);
	}

	/**
	 * Adds event listeners for mouse wheel interactions on the document.
	 * Handles scrolling and zooming based on modifier keys:
	 * - Shift key: triggers horizontal scroll.
	 * - Ctrl key: triggers zoom.
	 * - No modifier: triggers vertical scroll.
	 * Uses passive: false to allow preventDefault in handlers.
	 */
	addEventListeners() {
		document.addEventListener(
			"wheel",
			(e) => {
				if (e.shiftKey) {
					this.handleScroll(e.deltaY, true);
				} else if (e.ctrlKey) {
					this.handleZoom(e);
				} else {
					this.handleScroll(e.deltaY, false);
				}
			},
			{ passive: false }
		);
	}
}

new Spreadsheet(0);
