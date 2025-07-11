export class ColumnSelectionHandler {
	constructor() {
		this.selectionScrollAnimationFrameId = null;
	}

	/**
	 * Handles column resizing "Hit Test"
	 *
	 */
	hitTest(e, spreadsheet) {
		const headerContainer = spreadsheet.container.querySelector(
			".column-header-container"
		);
		return headerContainer.contains(e.target);
	}

	/**
	 * Handles pointer down function, calculates column coordinates and sets selected column in cell selection and updates variable that column is being selected.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerDown(e, spreadsheet) {
		e.target.setPointerCapture(e.pointerId);
		spreadsheet.model.columnHeaderSelecting = true;
		spreadsheet.model.columnHeaderSelected = true;
		spreadsheet.model.rowSidebarSelected = false;

		const headerContainer = spreadsheet.container.querySelector(
			".column-header-container"
		);

		const rect = headerContainer.getBoundingClientRect();

		const endRowPixel =
			spreadsheet.viewport.scrollTop + spreadsheet.viewport.height;

		const endRowCoord = spreadsheet.model.getCellCoordsFromPosition(
			e.clientX +
				spreadsheet.viewport.scrollLeft -
				spreadsheet.rowSidebar.requiredWidth,
			endRowPixel
		);

		const coord = spreadsheet.model.getCellCoordsFromPosition(
			e.clientX +
				spreadsheet.viewport.scrollLeft -
				spreadsheet.rowSidebar.requiredWidth,
			e.clientY - rect.top
		);

		spreadsheet.model.selection.start = { col: coord.col, row: 0 };
		spreadsheet.model.selection.end = {
			col: coord.col,
			row: endRowCoord.row - 1,
		};

		spreadsheet.model.activeCell = {
			col: spreadsheet.model.selection.start.col,
			row: 0,
		};

		spreadsheet.render();
	}

	/**
	 * Handles column selection and screen scrolling as we click and drag.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerMove(e, spreadsheet) {
		if (this.selectionScrollAnimationFrameId) {
			cancelAnimationFrame(this.selectionScrollAnimationFrameId);
			this.selectionScrollAnimationFrameId = null;
		}

		const updateSelection = () => {
			const coords = spreadsheet.model.getCellCoordsFromPosition(
				e.offsetX + spreadsheet.viewport.scrollLeft,
				e.offsetY
			);
			spreadsheet.model.selection.end.col = coords.col;
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

	/**
	 * Handles freeing of animationFrame variable and releasing pointer capture
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerUp(e, spreadsheet) {
		e.target.releasePointerCapture(e.pointerId);

		spreadsheet.model.columnHeaderSelecting = false;
		if (this.selectionScrollAnimationFrameId) {
			cancelAnimationFrame(this.selectionScrollAnimationFrameId);
			this.selectionScrollAnimationFrameId = null;
		}

		spreadsheet.setFunctionValues.getSelectionResult(spreadsheet, "col");
	}
}
