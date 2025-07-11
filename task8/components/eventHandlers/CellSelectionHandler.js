export class CellSelectionHandler {
	constructor() {
		this.selectionScrollAnimationFrameId = null;
	}

	/**
	 * Checks if the pointerdown event is triggered inside the mainGridContainer
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	hitTest(e, spreadsheet) {
		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);
		return mainGridContainer.contains(e.target);
	}

	/**
	 * Handles pointer down function, calculates cell coordinates and sets active cell selected and range selected to the clicked cell.
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerDown(e, spreadsheet) {
		e.target.setPointerCapture(e.pointerId);

		// Set row and column selection variables to false
		spreadsheet.model.rowSidebarSelected = false;
		spreadsheet.model.columnHeaderSelected = false;
		spreadsheet.model.columnHeaderSelecting = false;
		spreadsheet.model.rowSidebarSelecting = false;

		// spreadsheet.isSelecting = true;
		const gridX = e.offsetX + spreadsheet.viewport.scrollLeft;
		const gridY = e.offsetY + spreadsheet.viewport.scrollTop;
		const coords = spreadsheet.model.getCellCoordsFromPosition(
			gridX,
			gridY
		);
		spreadsheet.model.selection = { start: coords, end: coords };
		spreadsheet.model.activeCell = coords;

		const colCoord = spreadsheet.columnHeader.colCoordinate(coords.col);
		// console.log("colCoord", colCoord);
		spreadsheet.selectedCell.value = `${colCoord}${coords.row}`;

		spreadsheet.render();
		spreadsheet.setFunctionValues.getSelectionResult(spreadsheet, "cell");
	}

	/**
	 * Handles pointer move function, for cell selection handler.
	 * Handles cell selection and screen scrolling as we click and drag.
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

		// console.log("spreadsheet.model.selection", spreadsheet.model.selection);

		/**
		 * Updates the selected cell range to reflect the mouse movement.
		 */
		const updateSelection = () => {
			const gridX =
				e.clientX - rect.left + spreadsheet.viewport.scrollLeft;
			const gridY = e.clientY - rect.top + spreadsheet.viewport.scrollTop;

			// console.log("gridX, gridY", gridX, gridY);

			spreadsheet.model.selection.end =
				spreadsheet.model.getCellCoordsFromPosition(gridX, gridY);
		};

		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);
		const rect = mainGridContainer.getBoundingClientRect();

		// Extra offset for the content bar need to be factored in the calculation while scrolling down
		const contentBar = spreadsheet.container.querySelector(".content-bar");

		const contentBarRect = contentBar.getBoundingClientRect();

		let scrollDx = 0;
		let scrollDy = 0;
		const scrollMargin = 30;

		// Clamp maximum scrolling speed.
		const maxScrollSpeed = 20;

		// Calculated proximity to left and right side of the screens edge to trigger scrolling
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

		// Calculated proximity to top and bottom side of the screens edge to trigger scrolling
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

		// Checks if scroll variables are changed, if so then start scrolling in that direction.
		if (scrollDx !== 0 || scrollDy !== 0) {
			const autoScrollLoop = () => {
				spreadsheet.scrollBy(scrollDx, scrollDy);
				updateSelection();
				this.selectionScrollAnimationFrameId =
					requestAnimationFrame(autoScrollLoop);
			};
			autoScrollLoop();
		} else {
			// Otherwise just update the range of selected cells and re render the spreadsheet
			updateSelection();
			spreadsheet.render();
		}

		// debounce timer
		clearTimeout(spreadsheet.model.debounceTimer);
		spreadsheet.model.debounceTimer = setTimeout(() => {
			spreadsheet.setFunctionValues.getSelectionResult(
				spreadsheet,
				"cell"
			);
		}, 300);
	}

	/**
	 * Handles pointer up function, for cell selection handler.
	 * Handles freeing of animationFrame variable and releasing pointer capture
	 *
	 * @param {PointerEvent} e
	 * @param {Spreadsheet} spreadsheet - The main spreadsheet that integrates each class under it, making an excel spreadsheet.
	 * @returns {boolean}
	 */
	onPointerUp(e, spreadsheet) {
		e.target.releasePointerCapture(e.pointerId);
		// spreadsheet.model.rowSidebarSelecting = false;
		if (this.selectionScrollAnimationFrameId) {
			cancelAnimationFrame(this.selectionScrollAnimationFrameId);
			this.selectionScrollAnimationFrameId = null;
		}
		spreadsheet.setFunctionValues.getSelectionResult(spreadsheet, "cell");
	}

	onKeyDown(e, spreadsheet, isShift) {
		let rowBefore = spreadsheet.model.selection.end.row;
		let colBefore = spreadsheet.model.selection.end.col;

		switch (e.key) {
			case "ArrowDown":
				rowBefore += 1;
				break;
			case "ArrowUp":
				rowBefore -= 1;
				break;
			case "ArrowRight":
				colBefore += 1;
				break;
			case "ArrowLeft":
				colBefore -= 1;
				break;
			default:
				return; // Not a navigation key
		}

		rowBefore = Math.max(0, rowBefore);
		colBefore = Math.max(0, colBefore);

		if (isShift) {
			spreadsheet.model.selection = {
				...spreadsheet.model.selection,
				end: { row: rowBefore, col: colBefore },
			};
		} else {
			spreadsheet.model.activeCell = { row: rowBefore, col: colBefore };
			spreadsheet.model.selection = {
				start: { ...spreadsheet.model.activeCell },
				end: { ...spreadsheet.model.activeCell },
			};
		}

		const { row: endRow, col: endCol } = spreadsheet.model.selection.end;
		const {
			x: cellX,
			y: cellY,
			width: cellWidth,
			height: cellHeight,
		} = spreadsheet.model.getCellDimensions(endRow, endCol);

		const mainGridContainer = spreadsheet.container.querySelector(
			".main-grid-container"
		);
		const viewWidth = mainGridContainer.clientWidth;
		const viewHeight = mainGridContainer.clientHeight;

		const rect = mainGridContainer.getBoundingClientRect();

		let scrollX = 0;
		let scrollY = 0;

		// Check if cell is off-screen to the left
		if (cellX < spreadsheet.viewport.scrollLeft) {
			scrollX = cellX - spreadsheet.viewport.scrollLeft;
		}
		// Check if cell is off-screen to the right
		else if (
			cellX + cellWidth + spreadsheet.rowSidebar.requiredWidth >
			spreadsheet.viewport.scrollLeft + viewWidth
		) {
			scrollX =
				cellX +
				cellWidth +
				spreadsheet.rowSidebar.requiredWidth -
				(spreadsheet.viewport.scrollLeft + viewWidth);
		}

		// Check if cell is off-screen to the top
		if (cellY < spreadsheet.viewport.scrollTop) {
			scrollY = cellY - spreadsheet.viewport.scrollTop;
		}

		// Check if cell is off-screen to the bottom
		else if (
			cellY + cellHeight + rect.top >
			spreadsheet.viewport.scrollTop + viewHeight
		) {
			scrollY =
				cellY +
				cellHeight +
				rect.top -
				(spreadsheet.viewport.scrollTop + viewHeight);
		}

		if (scrollX !== 0 || scrollY !== 0) {
			setTimeout(() => {
				spreadsheet.scrollBy(scrollX, scrollY);
			}, 0);
		}

		spreadsheet.render();

		clearTimeout(spreadsheet.model.debounceTimer);
		spreadsheet.model.debounceTimer = setTimeout(() => {
			spreadsheet.setFunctionValues.getSelectionResult(
				spreadsheet,
				"cell"
			);
		}, 300);
		// spreadsheet.setFunctionValues.getSelectionResult(spreadsheet, "cell");
	}
}
