import { Renderer } from "./Renderer.js";

export class SelectCell extends Renderer {
    render(model, viewport, spreadsheet) {
        this.configure();
        this.clear();

        const gridContainer = this.canvas.parentElement.querySelector(
            ".main-grid-container"
        );
        const gridContainerOffsetLeft = gridContainer.offsetLeft;
        const gridContainerOffsetTop = gridContainer.offsetTop;

        // console.log("gridContainerOffsetLeft", gridContainerOffsetLeft);
        // console.log("gridContainerOffsetTop", gridContainerOffsetTop);
        // console.log("viewport.scrollLeft", viewport.scrollLeft);
        // console.log("viewport.scrollTop", viewport.scrollTop);
        let maxRow;
        let maxCol;
        // 1. Draw the main selection area
        if (model.selection) {
            const { start, end } = model.selection;
            let minRow = Math.min(start.row, end.row);
            // if (model.columnHeaderSelection) minRow = 0;

            maxRow = Math.max(start.row, end.row);

            let minCol = Math.min(start.col, end.col);
            // if (model.rowSidebarSelection) minCol = 0;

            maxCol = Math.max(start.col, end.col);

            const startCell = model.getCellDimensions(minRow, minCol);
            const endCell = model.getCellDimensions(maxRow, maxCol);

            const viewX = startCell.x - viewport.scrollLeft;
            const viewY = startCell.y - viewport.scrollTop;
            const width = endCell.x + endCell.width - startCell.x;
            const height = endCell.y + endCell.height - startCell.y;

            // console.log(
            // 	"minRow, maxRow, minCol, maxCol",
            // 	minRow,
            // 	maxRow,
            // 	minCol,
            // 	maxCol
            // );

            // console.log("startCell, endCell", startCell, endCell);

            // Main selection area fill
            this.ctx.fillStyle = "rgba(127, 172, 127, 0.2)";
            this.ctx.fillRect(
                viewX + gridContainerOffsetLeft,
                viewY + gridContainerOffsetTop,
                width,
                height
            );

            // Main selection area outline
            this.ctx.strokeStyle = "#137e43";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                viewX + gridContainerOffsetLeft - 1,
                viewY + gridContainerOffsetTop - 1,
                width + 1,
                height + 1
            );

            spreadsheet.columnHeader.highlightColumns(
                viewX,
                width,
                model,
                viewport
            );
            spreadsheet.rowSidebar.highlightRows(
                viewY,
                height,
                model,
                viewport
            );

            // Highlight column
            // this.ctx.fillStyle = "#caead8";
            // this.ctx.strokeStyle = "#107c41";

            // console.log(
            // 	"viewX, gridContainerOffsetLeft",
            // 	viewX,
            // 	gridContainerOffsetLeft
            // );

            // this.ctx.fillRect(viewX + gridContainerOffsetLeft, 0, width, 40);
            //
        }

        // 2. Draw a border around the active cell
        if (model.activeCell) {
            const { row, col } = model.activeCell;
            const { x, y, width, height } = model.getCellDimensions(row, col);

            const viewX = x - viewport.scrollLeft;
            const viewY = y - viewport.scrollTop;

            // this.ctx.fillStyle = "#ffffff"; // Same color, could be different
            this.ctx.lineWidth = 2; // Make it a bit thicker or use same width
            this.ctx.clearRect(
                viewX + gridContainerOffsetLeft + 1,
                viewY + gridContainerOffsetTop + 1,
                width - 2,
                height - 2
            );
        }

        if (model.selection) {
            // console.log("maxRow, maxCol", maxRow, maxCol);

            const endColCoord = model.cumulativeColWidths[ maxCol ];
            const endRowCoord = model.cumulativeRowHeights[ maxRow ];

            // console.log(
            // 	"endColCoord , endRowCoord",
            // 	endColCoord + gridContainerOffsetLeft,
            // 	endRowCoord + gridContainerOffsetTop
            // );

            this.ctx.fillStyle = "#137e43";
            this.ctx.fillRect(
                endColCoord + gridContainerOffsetLeft - 2,
                endRowCoord + gridContainerOffsetTop - 2,
                5,
                5
            );

            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1.5;

            const snappedRow = this.snap(endRowCoord);
            const snappedCol = this.snap(endColCoord);

            this.ctx.strokeRect(
                endColCoord + gridContainerOffsetLeft - 2.5,
                endRowCoord + gridContainerOffsetTop - 2.5,
                6,
                6
            );
        }
    }
}
