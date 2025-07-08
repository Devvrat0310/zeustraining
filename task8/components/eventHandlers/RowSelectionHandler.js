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

		const rect = spreadsheet.spreadsheetElement.getBoundingClientRect();
		spreadsheet.model.rowSidebarSelecting = true;
		spreadsheet.model.rowSidebarSelected = true;
		spreadsheet.model.columnHeaderSelected = false;

		const endColPixel =
			spreadsheet.viewport.scrollLeft + spreadsheet.viewport.width;

		const endColCoord = spreadsheet.model.getCellCoordsFromPosition(
			endColPixel,
			e.clientY + spreadsheet.viewport.scrollTop - rect.top
		);

		const coord = spreadsheet.model.getCellCoordsFromPosition(
			e.clientX,
			e.clientY + spreadsheet.viewport.scrollTop - rect.top
		);

		console.log("coord", coord);

		console.log("rect.top", rect.top);

		console.log(
			"e.clientY , spreadsheet.viewport.scrollTop , rect.top",
			e.clientY + spreadsheet.viewport.scrollTop - rect.top
		);

		console.log(
			"rowHeights[coord.row]",
			spreadsheet.model.rowHeights[coord.row]
		);
		console.log(
			"cumulativeRowHeights[coord.row]",
			spreadsheet.model.cumulativeRowHeights[coord.row]
		);

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

		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);
		const rect = mainGridContainer.getBoundingClientRect();

		let scrollDx = 0;
		let scrollDy = 0;
		const scrollMargin = 30;
		const maxScrollSpeed = 20;

		if (e.clientX < rect.left + scrollMargin) {
			scrollDx = -Math.min(
				maxScrollSpeed,
				(rect.left + scrollMargin - e.clientX) / 2
			);
		} else if (e.clientX > rect.right - scrollMargin) {
			scrollDx = Math.min(
				maxScrollSpeed,
				(e.clientX - (rect.right - scrollMargin)) / 2
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
