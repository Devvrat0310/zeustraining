export class RowSelectionHandler {
	constructor() {
		this.selectionScrollAnimationFrameId = null;
	}

	/**
	 * Handles column resizing "Hit Test"
	 *
	 */
	hitTest(e, spreadsheet) {
		const rowContainer = spreadsheet.container.querySelector(
			".row-header-container"
		);
		return rowContainer.contains(e.target);
	}

	onPointerDown(e, spreadsheet) {
		e.target.setPointerCapture(e.pointerId);

		const rowContainer = spreadsheet.container.querySelector(
			".row-header-container"
		);
		const rect = rowContainer.getBoundingClientRect();
		spreadsheet.model.rowSidebarSelecting = true;
		spreadsheet.model.rowSidebarSelected = true;
		spreadsheet.model.columnHeaderSelected = false;

		const endColPixel =
			spreadsheet.viewport.scrollLeft + spreadsheet.viewport.width;

		console.log("e.clientY", e.clientY);

		const endColCoord = spreadsheet.model.getCellCoordsFromPosition(
			endColPixel,
			e.clientY + spreadsheet.viewport.scrollTop - rect.top
		);

		const coord = spreadsheet.model.getCellCoordsFromPosition(
			e.clientX,
			e.clientY + spreadsheet.viewport.scrollTop - rect.top
		);

		console.log("coord", coord);

		// console.log("rect.top", rect.top);

		// console.log(
		// 	"e.clientY , spreadsheet.viewport.scrollTop , rect.top",
		// 	e.clientY + spreadsheet.viewport.scrollTop - rect.top
		// );

		// console.log(
		// 	"rowHeights[coord.row]",
		// 	spreadsheet.model.rowHeights[coord.row]
		// );
		// console.log(
		// 	"cumulativeRowHeights[coord.row]",
		// 	spreadsheet.model.cumulativeRowHeights[coord.row]
		// );

		spreadsheet.model.selection = {
			start: { row: coord.row, col: 0 },
			end: {
				row: coord.row,
				col: endColCoord.col - 1,
			},
		};

		spreadsheet.model.activeCell = {
			row: spreadsheet.model.selection.start.row,
			col: 0,
		};
		spreadsheet.render();
	}

	onPointerMove(e, spreadsheet) {
		if (this.selectionScrollAnimationFrameId) {
			cancelAnimationFrame(this.selectionScrollAnimationFrameId);
			this.selectionScrollAnimationFrameId = null;
		}

		const updateSelection = () => {
			const coords = spreadsheet.model.getCellCoordsFromPosition(
				e.offsetX,
				e.offsetY + spreadsheet.viewport.scrollTop
			);
			spreadsheet.model.selection.end.row = coords.row;
		};

		const mainGridContainer =
			spreadsheet.container.querySelector(".canvases");
		const rect = mainGridContainer.getBoundingClientRect();

		// Extra offset for the content bar need to be factored in the calculation while scrolling down
		const contentBar = spreadsheet.container.querySelector(".content-bar");

		const contentBarRect = contentBar.getBoundingClientRect();

		let scrollDx = 0;
		let scrollDy = 0;
		const scrollMargin = 30;
		const maxScrollSpeed = 20;

		if (e.clientY < rect.top + scrollMargin) {
			scrollDy = -Math.min(
				maxScrollSpeed,
				(rect.top + scrollMargin - e.clientY) / 2
			);
		} else if (
			e.clientY + contentBarRect.bottom >
			rect.bottom - scrollMargin
		) {
			scrollDy = Math.min(
				maxScrollSpeed,
				(e.clientY +
					contentBarRect.bottom -
					(rect.bottom - scrollMargin)) /
					2
			);
		}

		if (scrollDx !== 0 || scrollDy !== 0) {
			const autoScrollLoop = () => {
				spreadsheet.scrollBy(scrollDx, scrollDy);
				updateSelection();
				this.selectionScrollAnimationFrameId =
					requestAnimationFrame(autoScrollLoop);
			};
			autoScrollLoop();
		} else {
			updateSelection();
			spreadsheet.render();
		}
	}

	onPointerUp(e, spreadsheet) {
		e.target.releasePointerCapture(e.pointerId);
		spreadsheet.model.rowSidebarSelecting = false;
		if (this.selectionScrollAnimationFrameId) {
			cancelAnimationFrame(this.selectionScrollAnimationFrameId);
			this.selectionScrollAnimationFrameId = null;
		}
	}
}
