import { handleDynamicDPI } from "./canvasComponents.js";

// Class to handle cell selection in a spreadsheet UI
/**
 * Class representing a cell selection handler for a spreadsheet.
 * Handles pointer events to allow users to select cells visually,
 * draws selection rectangles on a canvas, and manages selection state.
 */
export class SelectCell {
    /**
     * Create a SelectCell instance.
     * @param {number} sheetIndex - Index of the spreadsheet to attach to.
     * @param {number} [zoom=1] - Initial zoom level for cell selection.
     */
    constructor (sheetIndex, zoom = 1) {
        this.sheetIndex = sheetIndex; // Index of the spreadsheet
        this.zoom = zoom; // Zoom level

        this.selectedCellRange = new Set(); // Stores selected cell(s)

        // Get the spreadsheet DOM element for this sheet
        this.spreadsheet =
            document.querySelectorAll(".spreadsheet")[ sheetIndex ];

        console.log(
            "SelectCell initialized for sheet index:",
            this.spreadsheet
        );

        // Get the canvas for drawing selection rectangles
        this.canvas = document.querySelectorAll(".select-cell-canvas")[
            sheetIndex
        ];

        this.canvas.id = `select_cell_canvas_${sheetIndex}`;

        console.log("window.innerHeight", window.innerHeight);
        // Set canvas size based on window size and zoom
        this.canvas.width = window.innerWidth * this.zoom;
        // Adjust canvas size for device pixel ratio (DPR)
        this.ctx = this.canvas.getContext("2d"); // Canvas 2D context
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * this.zoom * this.dpr;
        this.canvas.height = window.innerHeight * this.zoom * this.dpr;
        this.canvas.style.width = `${window.innerWidth * this.zoom}px`;
        this.canvas.style.height = `${window.innerHeight * this.zoom}px`;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);


        // Append canvas to spreadsheet if not already present
        if (!this.canvas.parentElement) {
            this.spreadsheet.appendChild(this.canvas);
        }

        // Bind event handler methods to ensure correct `this` context
        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);
        this._onDoubleClick = this._onDoubleClick.bind(this);

        this._bindEvents(); // Bind pointer events
    }

    /**
     * Bind pointer events for cell selection to the spreadsheet element.
     * @private
     */
    _bindEvents() {
        this.spreadsheet.addEventListener("pointerdown", this._onPointerDown);
        this.spreadsheet.addEventListener("pointermove", this._onPointerMove);
        this.spreadsheet.addEventListener("pointerup", this._onPointerUp);
        this.spreadsheet.addEventListener("dblclick", this._onDoubleClick);
    }

    /**
     * Handle double-click event.
     * @param {PointerEvent} e - The double-click event.
     * @private
     */
    _onDoubleClick(e) {
        console.log("Double clicked at:", e.offsetX, e.offsetY);
    }

    /**
     * Handle pointer down event to start cell selection.
     * Snaps the selection start to the cell grid and captures the pointer.
     * @param {PointerEvent} e - The pointer down event.
     * @private
     */
    _onPointerDown(e) {
        if (e.offsetX <= 50 * this.zoom || e.offsetY <= 15 * this.zoom) {
            return;
        }
        this.selectedCellRange = new Set(); // Reset selected cell range
        console.log("Pointer down at:", e.offsetX, e.offsetY);
        this.isSelecting = true;
        // Snap to cell grid (50x15 size)
        this.startX = e.offsetX - Math.floor(e.offsetX % (50 * this.zoom));
        this.startY = e.offsetY - Math.floor(e.offsetY % (15 * this.zoom));
        this.currentX = this.startX;
        this.currentY = this.startY;

        console.log("Snapped start coordinates:", this.startX, this.startY);
        console.log("Current coordinates:", this.currentX, this.currentY);


        this._drawSelection(e); // Draw initial selection rectangle

        // Capture pointer to ensure events are received even outside the element
        try {
            this.spreadsheet.setPointerCapture(e.pointerId);
        } catch (err) {
            console.error("Failed to set pointer capture:", err);
        }
        console.log("Snapped start coordinates:", this.startX, this.startY);
    }

    /**
     * Handle pointer move event to update the selection rectangle.
     * Updates the current selection endpoint and redraws the selection.
     * @param {PointerEvent} e - The pointer move event.
     * @private
     */
    _onPointerMove(e) {
        if (e.offsetX <= 50 * this.zoom && e.offsetY <= 15 * this.zoom) {
            // handle diagonal
        }

        if (e.offsetX <= 50 * this.zoom) {
            console.log("Pointer moved to left edge, resizing horizontally");
            this.canvas.style.cursor = "";
        }

        if (this.isSelecting) {
            // Clamp coordinates to canvas bounds to prevent invalid selections
            this.currentX = Math.max(
                50 * this.zoom,
                Math.min(
                    this.canvas.width - 50 * this.zoom,
                    e.offsetX - Math.floor(e.offsetX % (50 * this.zoom))
                )
            );
            this.currentY = Math.max(
                15 * this.zoom,
                Math.min(
                    this.canvas.height - 15 * this.zoom,
                    e.offsetY - Math.floor(e.offsetY % (15 * this.zoom))
                )
            );
            this._drawSelection(e);
        }
    }

    /**
     * Handle pointer up event to finish the selection.
     * Finalizes the selection rectangle and releases the pointer.
     * @param {PointerEvent} e - The pointer up event.
     * @private
     */
    _onPointerUp(e) {
        if (this.isSelecting) {
            this.isSelecting = false;
            console.log("Pointer up at:", e.offsetX, e.offsetY);
            try {
                this.spreadsheet.releasePointerCapture(e.pointerId); // Release pointer capture
            } catch (err) {
                console.error("Failed to release pointer capture:", err);
            }
        }
    }

    /**
     * Draw the selection rectangle on the canvas based on current selection state.
     * Clears previous selection and draws a new rectangle if selecting.
     * @param {PointerEvent} e - The pointer event.
     * @private
     */
    _drawSelection(e) {
        this.dpr = handleDynamicDPI(this.canvas, this.ctx);
        if (!this.isSelecting) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "green"; // Selection border color
        this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);

        // Draw rectangle around selected cell range
        const x = Math.min(this.startX, this.currentX);
        const y = Math.min(this.startY, this.currentY);
        const width = Math.abs(this.currentX - this.startX) + 50 * this.zoom;
        const height = Math.abs(this.currentY - this.startY) + 15 * this.zoom;

        this.ctx.strokeRect(x - 1, y - 1, width, height);

        this.ctx.fillStyle = "rgba(127, 172, 127, 0.2)"; // Fill color for selection
        this.ctx.fillRect(x, y, width, height);

        // Make the first cell in the selection white
        this.ctx.fillStyle = "rgb(255, 255, 255)"; //
        this.ctx.fillRect(x + 1, y + 1, 50 * this.zoom - 3, 15 * this.zoom - 3);

        this.updateSelectionRange();
        console.log("Selected cell range:", this.selectedCellRange);
        this.updateSelectionRange();
        console.log("Selected cell range:", this.selectedCellRange);
    }

    /**
     * Update the selection range based on current start and end coordinates.
     */
    updateSelectionRange() {
        // Add all cells in the selected range to the set
        const startRow = Math.min(
            Math.floor(this.startY / (15 * this.zoom)),
            Math.floor(this.currentY / (15 * this.zoom))
        );
        const endRow = Math.max(
            Math.floor(this.startY / (15 * this.zoom)),
            Math.floor(this.currentY / (15 * this.zoom))
        );
        const startCol = Math.min(
            Math.floor(this.startX / (50 * this.zoom)),
            Math.floor(this.currentX / (50 * this.zoom))
        );
        const endCol = Math.max(
            Math.floor(this.startX / (50 * this.zoom)),
            Math.floor(this.currentX / (50 * this.zoom))
        );

        this.selectedCellRange = new Set();
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                this.selectedCellRange.add(`${row}_${col}`);
            }
        }
    }

    /**
     * Set the zoom level for cell selection and redraw the selection.
     * @param {number} zoom - The new zoom level.
     */
    setZoom(zoom) {
        this.zoom = zoom;
        this._initDimensions();
        this._drawSelection();
    }

    /**
     * Initialize canvas dimensions based on current zoom and window size.
     * @private
     */
    _initDimensions() {
        this.canvas.width = window.innerWidth * this.zoom;
        this.canvas.height = window.innerHeight * this.zoom;
        this.dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * this.zoom * this.dpr;
        this.canvas.height = window.innerHeight * this.zoom * this.dpr;
        this.canvas.style.width = `${window.innerWidth * this.zoom}px`;
        this.canvas.style.height = `${window.innerHeight * this.zoom}px`;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);
    }
}