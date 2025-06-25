import { createLine, handleDynamicDPI } from "./canvasComponents.js";
import { Grid } from "./CreateGrid.js";

/**
 * Class representing a canvas for numbering rows.
 */
export class RowsCanvas extends Grid {
    constructor (parent, gridIndex, height, width, zoom = 1) {
        super(parent, gridIndex, height, width, zoom);
        this.drawRows();
    }

    setZoom(zoom) {
        this.zoom = zoom;

        super._initDimensions(this.canvas.height, this.canvas.width);

        this.ctx.font = `${15 * this.zoom}px monospace`;
        this.drawRows();
    }

    drawRows() {
        const rowsFit = Math.floor(this.canvas.height / this.rowHeight);
        const startIdx = this.gridIndex * rowsFit;
        const endIdx = startIdx + rowsFit;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#e9e9e9";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const maxWidth = this.canvas.width + 0.5;
        createLine(this.ctx, maxWidth, 0, maxWidth, this.canvas.height, 1, "#d0d0d0");

        this.ctx.font = `${15 * this.zoom}px monospace`;
        this.ctx.textAlign = "right";
        this.ctx.fillStyle = "#5c6b72";

        for (let i = startIdx; i < endIdx; i++) {
            const y = (i - startIdx) * this.rowHeight + 0.5;
            createLine(this.ctx, 0, y, maxWidth, y, 1, "#ccc");
            this.ctx.fillText(
                i + 1,
                maxWidth - 5,
                y + this.rowHeight / 2 + 5 * this.zoom
            );
        }

        this.lastRowEnd = endIdx;
    }
}

export const allRows = [];
