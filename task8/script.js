import { ColumnsCanvas, ColumnManager } from "./components/columnHeader.js";
import { createLine, handleDynamicDPI } from "./components/canvasComponents.js";
import { RowsCanvas, RowManager } from "./components/RowSidebar.js";
import { ExcelGrid, CanvasManager } from "./components/ExcelGrid.js";
import { SelectCell } from "./components/SelectCell.js";

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
    constructor () {
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
 * @method updateCanvasDimensions - Updates the canvas width based on the current zoom level.
 * @method init - Initializes the spreadsheet by creating canvases, columns, and rows.
 * @method handleScroll - Handles scroll events for both horizontal and vertical directions.
 * @method zoomEachCanvas - Applies zoom to all canvases, columns, and rows.
 * @method handleZoom - Handles zoom events triggered by user input.
 * @method addEventListeners - Adds event listeners for wheel events to handle scrolling and zooming.
 */
class Spreadsheet {
    constructor (index) {
        this.spreadsheetIndex = index;
        this.zoomManager = new ZoomManager();
        this.mainCanvas = document.querySelector(".main-canvas");
        this.columnsDiv = document.getElementsByClassName("columns")[ 0 ];
        this.pushedOverlayColumns = document.querySelectorAll(
            ".pushed-overlay-column"
        )[ index ];
        this.pushedOverlayRows = document.querySelectorAll(
            ".pushed-overlay-row"
        )[ index ];

        this.SelectCell = new SelectCell(index, this.zoomManager.zoom);

        this.excelLeftSpace =
            document.querySelectorAll(".excel-left-space")[ index ];
        this.excelTopSpace =
            document.querySelectorAll(".excel-top-space")[ index ];

        console.log("this.excelLeftSpace", this.excelLeftSpace);

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

        this.init();
        this.addEventListeners();
    }

    createHTML() {
        const templateString = `
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
					<div class="excel-left-space excel-top-space"></div>
					<div class="main-canvas"></div>
				</div>
			</div>
		`;

        const body = document.querySelector("body");

        body.innerHTML += templateString;
    }

    updateCornerBoxSize() {
        const currZoom = this.zoomManager.zoom;
        this.corner.style.width = `${50 * currZoom}px`;
        this.corner.style.height = `${15 * currZoom}px`;

        // Set the actual canvas pixel size to match the zoomed size
        this.corner.width = 50 * currZoom;
        this.corner.height = 15 * currZoom;

        console.log("50 * currZoom", 50 * currZoom);
        console.log("15 * currZoom", 15 * currZoom);

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
                    this.canvasManager.scrollCanvasHorizontal(true);
                }
                this.totalDeltaHorizontal = 0;
            } else if (this.totalDeltaHorizontal <= -this.canvasWidth) {
                this.columnManager.scrollColumn(false);
                this.canvasManager.scrollCanvasHorizontal(false);
                this.totalDeltaHorizontal = 0;
            }
        } else {
            this.totalDeltaVertical += deltaY;
            if (this.totalDeltaVertical >= this.canvasHeight) {
                this.rowManager.scrollRow(true);
                this.canvasManager.scrollCanvasVertical(true);
                this.totalDeltaVertical = 0;
            } else if (this.totalDeltaVertical <= -this.canvasHeight) {
                this.rowManager.scrollRow(false);
                this.canvasManager.scrollCanvasVertical(false);
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
        this.SelectCell.setZoom(this.zoomManager.zoom);
    }

    handleZoom(e) {
        e.preventDefault();
        this.updateCanvasDimensions();
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

new Spreadsheet(0);
