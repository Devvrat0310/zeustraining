import { ColumnsCanvas, allColumns } from "./components/columnHeader.js";
import { createLine, handleDynamicDPI } from "./components/canvasComponents.js";
import { allRows, RowsCanvas } from "./components/RowSidebar.js";
import { ExcelGrid, allCanvases } from "./components/ExcelGrid.js";

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

class CanvasManager {
    constructor (mainCanvas, zoomManager) {
        this.mainCanvas = mainCanvas;
        this.zoomManager = zoomManager;
        this.totalCanvas = 0;
        this.canvases = [];
    }

    createCanvas() {
        const canvas = new ExcelGrid(this.mainCanvas, this.totalCanvas, this.zoomManager.zoom);
        this.canvases.push(canvas);
        allCanvases.push(canvas);
        this.totalCanvas++;
    }

    zoomAll() {
        this.canvases.forEach(canvas => canvas.setZoom(this.zoomManager.zoom));
    }
}

class ColumnManager {
    constructor (columnsDiv, pushedOverlayColumns, zoomManager) {
        this.columnsDiv = columnsDiv;
        this.pushedOverlayColumns = pushedOverlayColumns;
        this.zoomManager = zoomManager;
        this.totalColumnSheet = 0;
        this.lastColumnEnd = 0;
        this.columns = [];
        this.startColumnInView = 0;
    }

    createColumn() {
        const column = new ColumnsCanvas(
            this.columnsDiv,
            this.totalColumnSheet,
            20,
            1000,
            this.zoomManager.zoom
        );
        this.totalColumnSheet++;
        console.log("Creating column:", column);
        this.columns.push(column);
        allColumns.push(column);
    }

    removeLastColumn() {
        if (this.columnsDiv.children.length > 2) {
            const childElement = this.columnsDiv.removeChild(this.columnsDiv.lastElementChild);
            this.columns.pop();
            allColumns.pop();
            this.totalColumnSheet--;
            this.lastColumnEnd -= childElement.width / (this.columns[ this.columns.length - 1 ]?.colWidth || 1);
        }
    }

    zoomAll() {
        console.log("This.columns:", this.columns);
        this.columns.forEach(col => {
            console.log("Zooming column:", col);
            col.setZoom(this.zoomManager.zoom);
        });
    }
}

class RowManager {
    constructor (rowsDiv, zoomManager) {
        this.rowsDiv = rowsDiv;
        this.zoomManager = zoomManager;
        this.totalRowSheet = 0;
        this.lastRowEnd = 0;
        this.rows = [];
    }

    createRow() {
        const row = new RowsCanvas(this.rowsDiv, this.totalRowSheet, 1000, 50, this.zoomManager.zoom);
        this.totalRowSheet++;
        this.lastRowEnd = row.lastRowEnd;
        this.rows.push(row);
        allRows.push(row);
    }

    removeLastRow() {
        if (this.rowsDiv.children.length > 2) {
            this.rowsDiv.removeChild(this.rowsDiv.lastElementChild);
            this.rows.pop();
            allRows.pop();
            this.totalRowSheet--;
        }
    }

    zoomAll() {
        this.rows.forEach(row => {
            row.setZoom(this.zoomManager.zoom);
        });
    }
}

class Spreadsheet {
    constructor () {
        this.zoomManager = new ZoomManager();
        this.mainCanvas = document.querySelector(".main-canvas");
        this.columnsDiv = document.getElementsByClassName("columns")[ 0 ];
        this.pushedOverlayColumns = document.querySelector(".pushed-overlay");
        this.rowsDiv = document.querySelector(".rows");

        this.canvasManager = new CanvasManager(this.mainCanvas, this.zoomManager);
        this.columnManager = new ColumnManager(this.columnsDiv, this.pushedOverlayColumns, this.zoomManager);
        this.rowManager = new RowManager(this.rowsDiv, this.zoomManager);

        this.totalDeltaHorizontal = 0;
        this.totalDeltaVertical = 0;

        this.init();
        this.addEventListeners();
    }

    init() {
        for (let i = 0; i < 5; i++) this.canvasManager.createCanvas();
        for (let i = 0; i < 3; i++) this.columnManager.createColumn();
        for (let i = 0; i < 2; i++) this.rowManager.createRow();
    }

    handleScroll(deltaY, isHorizontal) {
        if (isHorizontal) {
            this.totalDeltaHorizontal += deltaY;
            if (this.totalDeltaHorizontal >= 900) {
                this.columnManager.createColumn();
                this.canvasManager.createCanvas();
                this.totalDeltaHorizontal = 0;
            } else if (this.totalDeltaHorizontal <= -900) {
                this.columnManager.removeLastColumn();
                this.totalDeltaHorizontal = 0;
            }
        } else {
            this.totalDeltaVertical += deltaY;
            if (this.totalDeltaVertical >= 900) {
                this.rowManager.createRow();
                this.canvasManager.createCanvas();
                this.canvasManager.createCanvas();
                this.totalDeltaVertical = 0;
            } else if (this.totalDeltaVertical <= -900) {
                this.rowManager.removeLastRow();
                this.totalDeltaVertical = 0;
            }
        }
    }

    zoomEachCanvas(currZoom) {
        this.zoomManager.setZoom(currZoom);
        this.canvasManager.zoomAll();
        this.columnManager.zoomAll();
        this.rowManager.zoomAll();
    }

    handleZoom(e) {
        e.preventDefault();
        this.zoomEachCanvas(e.deltaY < 0 ? 0.2 : -0.2);
    }

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

new Spreadsheet();
