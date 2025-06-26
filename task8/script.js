import { ColumnsCanvas, ColumnManager } from "./components/columnHeader.js";
import { createLine, handleDynamicDPI } from "./components/canvasComponents.js";
import { RowsCanvas, RowManager } from "./components/RowSidebar.js";
import { ExcelGrid, allCanvases } from "./components/ExcelGrid.js";

const EXCELWIDTH = 1000;
const EXCELHEIGHT = 1000;

/**
 * Manages zoom level state and persistence using localStorage.
 *
 * @class ZoomManager
 * @property {number} zoom - The current zoom level (between 0.6 and 3.0).
 *
 * @example
 * const manager = new ZoomManager();
 * manager.setZoom(0.2); // Increase zoom by 0.2
 */
class ZoomManager {
	constructor() {
		this.zoom = 1;
		this.loadZoom();
	}

	loadZoom() {
		const temp = window.localStorage.getItem("zoom");
		this.zoom = temp ? parseFloat(temp) : 1;
		window.localStorage.setItem("zoom", this.zoom);
	}

	setZoom(delta) {
		this.zoom = Math.min(3, Math.max(0.6, this.zoom + delta));
		this.zoom = parseFloat(this.zoom.toFixed(1));
		window.localStorage.setItem("zoom", this.zoom);
		this.loadZoom();
	}
}

/**
 * Manages multiple ExcelGrid canvas instances within a main canvas element,
 * providing creation and zoom synchronization functionality.
 *
 * @class CanvasManager
 * @param {HTMLCanvasElement} mainCanvas - The main canvas DOM element to render on.
 * @param {Object} zoomManager - An object managing the current zoom level.
 * @param {number} zoomManager.zoom - The current zoom factor.
 *
 * @property {HTMLCanvasElement} mainCanvas - The main canvas DOM element.
 * @property {Object} zoomManager - The zoom manager object.
 * @property {number} totalCanvas - The total number of canvases created.
 * @property {Array<ExcelGrid>} canvases - Array of managed ExcelGrid instances.
 *
 * @method createCanvas - Creates a new ExcelGrid canvas, adds it to the manager, and increments the count.
 * @method zoomAll - Applies the current zoom level to all managed canvases.
 */
class CanvasManager {
	constructor(mainCanvas, zoomManager) {
		this.mainCanvas = mainCanvas;
		this.zoomManager = zoomManager;
		this.totalCanvas = 0;
		this.canvases = [];
	}

	createCanvas() {
		const canvas = new ExcelGrid(
			this.mainCanvas,
			this.totalCanvas,
			1000,
			1000,
			this.zoomManager.zoom
		);
		this.canvases.push(canvas);
		allCanvases.push(canvas);
		this.totalCanvas++;
	}

	zoomAll() {
		this.canvases.forEach((canvas) =>
			canvas.setZoom(this.zoomManager.zoom)
		);
	}
}

/**
 * Represents a spreadsheet application with zoom, scroll, and dynamic row/column management.
 * Handles user interactions for scrolling and zooming, and manages the main canvas, columns, and rows.
 *
 * @class Spreadsheet
 * @constructor
 *
 * @property {ZoomManager} zoomManager - Manages the zoom level of the spreadsheet.
 * @property {HTMLCanvasElement} mainCanvas - The main canvas element for rendering.
 * @property {HTMLElement} columnsDiv - The container element for columns.
 * @property {HTMLElement} pushedOverlayColumns - The overlay element for pushed width before columns.
 * @property {HTMLElement} rowsDiv - The container element for rows.
 * @property {number} canvasWidth - The current width of the canvas, adjusted for zoom.
 * @property {CanvasManager} canvasManager - Manages canvas creation and zooming.
 * @property {ColumnManager} columnManager - Manages column creation, scrolling, and zooming.
 * @property {RowManager} rowManager - Manages row creation, scrolling, and zooming.
 * @property {number} totalDeltaHorizontal - Accumulated horizontal scroll delta.
 * @property {number} totalDeltaVertical - Accumulated vertical scroll delta.
 * @property {number} scrolledFirstTime - Tracks the number of initial horizontal scrolls.
 *
 * @method updateCanvasWidth - Updates the canvas width based on the current zoom level.
 * @method init - Initializes the spreadsheet by creating canvases, columns, and rows.
 * @method handleScroll - Handles scroll events for both horizontal and vertical directions.
 * @method zoomEachCanvas - Applies zoom to all canvases, columns, and rows.
 * @method handleZoom - Handles zoom events triggered by user input.
 * @method addEventListeners - Adds event listeners for wheel events to handle scrolling and zooming.
 */
class Spreadsheet {
	constructor() {
		this.zoomManager = new ZoomManager();
		this.mainCanvas = document.querySelector(".main-canvas");
		this.columnsDiv = document.getElementsByClassName("columns")[0];
		this.pushedOverlayColumns = document.querySelector(
			".pushed-overlay-column"
		);
		this.pushedOverlayRows = document.querySelector(".pushed-overlay-row");
		this.rowsDiv = document.querySelector(".rows");

		this.corner = document.querySelector(".corner");

		this.canvasWidth = 1000 - (1000 % (50 * this.zoomManager.zoom));
		this.updateCornerBoxSize();

		this.canvasManager = new CanvasManager(
			this.mainCanvas,
			this.zoomManager
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

		this.totalDeltaHorizontal = 0;
		this.totalDeltaVertical = 0;

		this.scrolledFirstTime = 0;

		this.init();
		this.addEventListeners();
	}

	updateCornerBoxSize() {
		const currZoom = this.zoomManager.zoom;
		this.corner.style.width = `${50 * currZoom}px`;
		this.corner.style.height = `${20 * currZoom}px`;

		// Set the actual canvas pixel size to match the zoomed size
		this.corner.width = 50 * currZoom;
		this.corner.height = 20 * currZoom;

		console.log("50 * currZoom", 50 * currZoom);
		console.log("20 * currZoom", 20 * currZoom);

		const ctx = this.corner.getContext("2d");
		createLine(
			ctx,
			50 * currZoom - 0.5,
			0 - 0.5,
			50 * currZoom - 0.5,
			20 * currZoom - 0.5,
			1,
			"#bdbdbd"
		);
		createLine(
			ctx,
			0 - 0.5,
			20 * currZoom - 0.5,
			50 * currZoom - 0.5,
			20 * currZoom - 0.5,
			1,
			"#bdbdbd"
		);
	}

	updateCanvasWidth() {
		this.canvasWidth = 1000 - (1000 % (50 * this.zoomManager.zoom));
	}

	init() {
		for (let i = 0; i < 5; i++) this.canvasManager.createCanvas();
		for (let i = 0; i < 4; i++) this.columnManager.createColumn();
		for (let i = 0; i < 4; i++) this.rowManager.createRow();
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
	 * @returns {void}
	 */
	handleScroll(deltaY, isHorizontal) {
		if (isHorizontal) {
			this.totalDeltaHorizontal += deltaY;
			if (this.totalDeltaHorizontal >= this.canvasWidth) {
				this.scrolledFirstTime += 1;
				if (this.scrolledFirstTime > 1) {
					this.columnManager.scrollColumn(true);
				}
				this.totalDeltaHorizontal = 0;
			} else if (this.totalDeltaHorizontal <= -this.canvasWidth) {
				this.columnManager.scrollColumn(false);
				this.totalDeltaHorizontal = 0;
			}
		} else {
			this.totalDeltaVertical += deltaY;
			if (this.totalDeltaVertical >= this.canvasWidth) {
				this.rowManager.scrollRow(true);
				this.totalDeltaVertical = 0;
			} else if (this.totalDeltaVertical <= -this.canvasWidth) {
				this.rowManager.scrollRow(false);
				this.totalDeltaVertical = 0;
			}
		}
	}

	/**
	 * Sets the zoom level for all canvases and updates related managers.
	 *
	 * @param {number} currZoom - The zoom level to apply to all canvases.
	 * @returns {void}
	 */
	zoomEachCanvas(currZoom) {
		this.zoomManager.setZoom(currZoom);
		this.canvasManager.zoomAll();
		this.columnManager.zoomAll();
		this.rowManager.zoomAll();
		this.updateCornerBoxSize();
	}

	handleZoom(e) {
		e.preventDefault();
		this.updateCanvasWidth();

		this.zoomEachCanvas(e.deltaY < 0 ? 0.2 : -0.2);
	}

	addEventListeners() {
		document.addEventListener(
			"wheel",
			(e) => {
				// console.log("window.scrollX", e.deltaY);
				// console.log("e.deltaY", e.deltaY);
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

new Spreadsheet();
