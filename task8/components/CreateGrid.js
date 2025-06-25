import { createLine, handleDynamicDPI } from "./canvasComponents.js";

/**
 * Draws an excel grid pattern canvas, and contains methods to handle various functionalities.
 *
 * @param {HTMLDivElement} parent - The parent element in which to draw the canvas.
 */
export class Grid {
    constructor (parent, gridIndex, height, width, zoom) {
        this.parent = parent;
        this.zoom = zoom;
        this.gridIndex = gridIndex;
        this.dpr = window.devicePixelRatio || 1;

        this.canvas = this._createCanvas(gridIndex);
        this.ctx = this.canvas.getContext("2d");

        this._initDimensions(height, width);
        this._appendCanvas();

        this.outlinedCell = null;

        this.drawGrid();
    }

    _createCanvas(totalCanvas) {
        const canvas = document.createElement("canvas");
        canvas.id = `canvas_${totalCanvas}`;
        canvas.classList.add("canvas");
        return canvas;
    }

    _appendCanvas() {
        this.parent.appendChild(this.canvas);
    }

    _initDimensions(height, width) {
        this.rowHeight = 20 * this.zoom;
        this.colWidth = 50 * this.zoom;
        if (height < 800) {
            this.canvas.height = height * this.zoom;
        }
        else {
            this.canvas.height = height - (height % this.rowHeight);
        }

        if (width < 800) {
            this.canvas.width = width * this.zoom;
        }
        else {
            this.canvas.width = width - (width % this.colWidth);
        }

        this.updateCanvasOffsets();
    }

    updateCanvasOffsets() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvasOffsetX = rect.left;
        this.canvasOffsetY = rect.top;
    }

    setZoom(zoom) {
        this.zoom = zoom;
        this._initDimensions();
        this.drawGrid();
    }

    drawGrid() {
        this.updateCanvasOffsets();
        const { ctx, canvas, rowHeight, colWidth, dpr } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rows = Math.ceil(canvas.height / rowHeight);
        const cols = Math.ceil(canvas.width / colWidth);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#d0d0d0";

        for (let i = 0; i <= cols; i++) {
            const x = Math.round(i * colWidth) + 0.5;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let j = 0; j <= rows; j++) {
            const y = Math.round(j * rowHeight) + 0.5;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

}

export const allCanvases = [];
