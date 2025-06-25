import { createLine, handleDynamicDPI } from "./canvasComponents.js";
import { Grid } from "./CreateGrid.js";
export class ColumnsCanvas extends Grid {
    constructor (parent, gridIndex, height, width, zoom) {
        super(parent, gridIndex, height, width, zoom);
        this.drawCols();
        this.handleColumnOffset();
    }

    colCoordinate(idx) {
        let n = idx + 1;
        let label = "";
        while (n > 0) {
            n -= 1;
            label = String.fromCharCode(65 + (n % 26)) + label;
            n = Math.floor(n / 26);
        }
        return label;
    }

    handleColumnOffset() {
        this.parent.style.marginLeft = `${this.colWidth}px`;
    }

    setZoom(zoom) {
        this.zoom = zoom;
        this.colWidth = 50 * this.zoom;
        this.rowHeight = 20 * this.zoom;

        this.canvas.width = this.canvas.width - (this.canvas.width % this.colWidth);
        this.canvas.height = this.canvas.height * this.zoom;

        this.ctx.font = `${10 * this.zoom}px arial`;

        this.drawCols();
    }

    drawCols() {
        const colsFit = Math.floor(this.canvas.width / this.colWidth);
        const startIdx = this.gridIndex * colsFit;
        const endIdx = startIdx + colsFit;

        console.log("Drawing columns from", startIdx, "to", endIdx);

        this.updateCanvasOffsets();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#e9e9e9";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = startIdx; i <= endIdx; i++) {
            const x = (i - startIdx) * this.colWidth;
            createLine(this.ctx, x + 0.5, 0, x + 0.5, this.canvas.height, 1, "#ccc");

            const label = this.colCoordinate(i);
            this.ctx.fillStyle = "#5c6b72";
            this.ctx.font = `${10 * this.zoom}px arial`;
            this.ctx.textAlign = "center";
            this.ctx.fillText(label, x + this.colWidth / 2, 15 * this.zoom);
        }

        this.lastColumnEnd = endIdx;
        return this.lastColumnEnd;
    }

    initResizeHandlers() {
        this.colLine = 50;
        this.rowLine = 20;
        this.hoverColLine = false;
        this.hoverRowLine = false;
        this.dragColLine = false;
        this.dragRowLine = false;

        this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.handleDragMove.bind(this));
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    handleMouseMove(e) {
        const x = e.clientX - this.canvasOffsetX;
        const y = e.clientY - this.canvasOffsetY;

        this.hoverColLine = false;
        this.hoverRowLine = false;

        if (Math.floor(y / 20) === 0 && x % 50 === 0) {
            this.colLine = x - (x % 50);
            this.canvas.style.cursor = "col-resize";
            this.hoverColLine = true;
        } else if (Math.floor(x / 50) === 0 && y % 20 === 0) {
            this.rowLine = y - (y % 20);
            this.canvas.style.cursor = "row-resize";
            this.hoverRowLine = true;
        } else {
            this.canvas.style.cursor = "auto";
        }
    }

    handleMouseDown() {
        if (this.hoverColLine) this.dragColLine = true;
        if (this.hoverRowLine) this.dragRowLine = true;
    }

    handleDragMove(e) {
        if (!this.dragColLine && !this.dragRowLine) return;

        const x = e.clientX - this.canvasOffsetX;
        const y = e.clientY - this.canvasOffsetY;

        if (this.dragColLine) {
            this.eraseLine(this.colLine, 0, this.colLine, this.canvas.height);
            this.drawLine(x, 0, x, this.canvas.height, "#d0d0d0");
            this.colLine = x;
        } else if (this.dragRowLine) {
            this.eraseLine(0, this.rowLine, this.canvas.width, this.rowLine);
            this.drawLine(0, y, this.canvas.width, y, "#d0d0d0");
            this.rowLine = y;
        }
    }

    handleMouseUp() {
        this.dragColLine = false;
        this.dragRowLine = false;
    }

    drawLine(x1, y1, x2, y2, color) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    eraseLine(x1, y1, x2, y2) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = "destination-out";
        this.drawLine(x1, y1, x2, y2, "white");
        this.ctx.restore();
    }
}

export let allColumns = [];
