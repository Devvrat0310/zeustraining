export class Scrollbar {
	/**
	 * Creates an instance of the Scrollbar class.
	 * Initializes references to the main controller, container, model, and viewport.
	 * Sets up DOM elements for horizontal and vertical scrollbars, and initializes
	 * state variables for dragging and auto-scrolling.
	 * Also attaches necessary event listeners for scrollbar interaction.
	 *
	 * @param {Object} mainController - The main controller object containing references to the container, model, and viewport.
	 */
	constructor(mainController) {
		this.mainController = mainController;
		this.container = mainController.container;
		this.model = mainController.model;
		this.viewport = mainController.viewport;

		// DOM Elements
		this.hScrollTrack = this.container.querySelector(
			".scrollbar-track-horizontal"
		);
		this.hScrollThumb = this.container.querySelector(
			".scrollbar-thumb-horizontal"
		);
		this.vScrollTrack = this.container.querySelector(
			".scrollbar-track-vertical"
		);
		this.vScrollThumb = this.container.querySelector(
			".scrollbar-thumb-vertical"
		);

		this.isDraggingHScroll = false;
		this.isDraggingVScroll = false;
		this.scrollDragStartX = 0;
		this.scrollDragStartY = 0;
		this.autoScrollDirection = null;
		this.animationFrameId = null;

		this.addEventListeners();
	}

	/**
	 * Attaches all necessary event listeners for custom scrollbar functionality.
	 *
	 * - Handles pointer events for dragging horizontal and vertical scroll thumbs.
	 * - Handles pointer events for clicking and holding on scroll tracks.
	 * - Listens for pointer up and pointer leave events to stop auto-scrolling.
	 * - Handles pointer move events to support dragging the thumb outside the original element.
	 *
	 */
	addEventListeners() {
		// Thumb Drag Listeners
		this.hScrollThumb.addEventListener(
			"pointerdown",
			this.handleHScrollMouseDown.bind(this)
		);
		this.vScrollThumb.addEventListener(
			"pointerdown",
			this.handleVScrollMouseDown.bind(this)
		);

		// Track Click Listeners (for press-and-hold)
		this.hScrollTrack.addEventListener(
			"pointerdown",
			this.handleHScrollTrackMouseDown.bind(this)
		);
		this.vScrollTrack.addEventListener(
			"pointerdown",
			this.handleVScrollTrackMouseDown.bind(this)
		);

		// Listeners to stop auto-scrolling on pointer up/leave from the tracks
		document.addEventListener("pointerup", this.stopAutoScroll.bind(this));
		this.hScrollTrack.addEventListener(
			"pointerleave",
			this.stopAutoScroll.bind(this)
		);
		this.vScrollTrack.addEventListener(
			"pointerleave",
			this.stopAutoScroll.bind(this)
		);

		// It handles dragging the thumb outside the window or original element.
		document.addEventListener(
			"pointermove",
			this.handlePointerMove.bind(this)
		);
	}

	//  Rendering
	render() {
		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		const viewWidth = mainGridContainer.clientWidth;
		const viewHeight = mainGridContainer.clientHeight;

		const actualTotalWidth =
			this.model.cumulativeColWidths[this.model.colCount - 1] ||
			viewWidth;
		const actualTotalHeight =
			this.model.cumulativeRowHeights[this.model.rowCount - 1] ||
			viewHeight;

		const virtualTotalWidth = Math.max(
			actualTotalWidth,
			this.viewport.scrollLeft + viewWidth * 5
		);
		const virtualTotalHeight = Math.max(
			actualTotalHeight,
			this.viewport.scrollTop + viewHeight * 5
		);

		// Horizontal Scrollbar
		const thumbWidth =
			(viewWidth / virtualTotalWidth) * this.hScrollTrack.clientWidth;
		const thumbX =
			(this.viewport.scrollLeft / virtualTotalWidth) *
			this.hScrollTrack.clientWidth;
		this.hScrollThumb.style.width = `${Math.max(thumbWidth, 20)}px`;
		this.hScrollThumb.style.transform = `translateX(${thumbX}px)`;
		this.hScrollTrack.style.display =
			actualTotalWidth <= viewWidth ? "none" : "block";

		// Vertical Scrollbar
		const thumbHeight =
			(viewHeight / virtualTotalHeight) * this.vScrollTrack.clientHeight;
		const thumbY =
			(this.viewport.scrollTop / virtualTotalHeight) *
			this.vScrollTrack.clientHeight;
		this.vScrollThumb.style.height = `${Math.max(thumbHeight, 20)}px`;
		this.vScrollThumb.style.transform = `translateY(${thumbY}px)`;
		this.vScrollTrack.style.display =
			actualTotalHeight <= viewHeight ? "none" : "block";
	}

	//  Event Handlers (moved from Spreadsheet.js)

	handleHScrollMouseDown(e) {
		e.stopPropagation();
		this.isDraggingHScroll = true;
		this.scrollDragStartX = e.clientX;
		this.hScrollThumb.setPointerCapture(e.pointerId);
	}

	handleVScrollMouseDown(e) {
		e.stopPropagation();
		this.isDraggingVScroll = true;
		this.scrollDragStartY = e.clientY;
		this.vScrollThumb.setPointerCapture(e.pointerId);
	}

	handlePointerMove(e) {
		if (this.isDraggingHScroll) {
			const trackWidth = this.hScrollTrack.clientWidth;
			const viewWidth = this.container.querySelector(
				".main-grid-container"
			).clientWidth;
			const actualTotalWidth =
				this.model.cumulativeColWidths[this.model.colCount - 1];
			const virtualTotalWidth = Math.max(
				actualTotalWidth,
				this.viewport.scrollLeft + viewWidth * 5
			);
			const dx = e.clientX - this.scrollDragStartX;
			this.scrollDragStartX = e.clientX;
			const scrollDx = (dx / trackWidth) * virtualTotalWidth;

			// Communicate back to the main controller
			this.mainController.scrollBy(scrollDx, 0);
			return;
		}

		if (this.isDraggingVScroll) {
			const trackHeight = this.vScrollTrack.clientHeight;
			const viewHeight = this.container.querySelector(
				".main-grid-container"
			).clientHeight;
			const actualTotalHeight =
				this.model.cumulativeRowHeights[this.model.rowCount - 1];
			const virtualTotalHeight = Math.max(
				actualTotalHeight,
				this.viewport.scrollTop + viewHeight * 5
			);
			const dy = e.clientY - this.scrollDragStartY;
			this.scrollDragStartY = e.clientY;
			const scrollDy = (dy / trackHeight) * virtualTotalHeight;

			// Communicate back to the main controller
			this.mainController.scrollBy(0, scrollDy);
			return;
		}
	}

	/**
	 * Now triggers startAutoScroll instead of a single jump.
	 */
	handleHScrollTrackMouseDown(e) {
		if (e.target === this.hScrollThumb) return;
		const thumbRect = this.hScrollThumb.getBoundingClientRect();
		if (e.clientX < thumbRect.left) {
			this.startAutoScroll("left");
		} else {
			this.startAutoScroll("right");
		}
	}

	/**
	 * Now triggers startAutoScroll instead of a single jump.
	 */
	handleVScrollTrackMouseDown(e) {
		if (e.target === this.vScrollThumb) return;
		const thumbRect = this.vScrollThumb.getBoundingClientRect();
		if (e.clientY < thumbRect.top) {
			this.startAutoScroll("up");
		} else {
			this.startAutoScroll("down");
		}
	}

	//  Auto-Scroll Logic (moved from Spreadsheet.js)

	/**
	 * Starts the auto-scrolling process.
	 * @param {string} direction - {'up'|'down'|'left'|'right'}
	 */
	startAutoScroll(direction) {
		if (this.animationFrameId) return;
		this.autoScrollDirection = direction;
		this.autoScrollStep();
	}

	/**
	 * Stops the auto-scrolling loop.
	 */
	stopAutoScroll() {
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
		this.autoScrollDirection = null;
	}

	autoScrollStep() {
		if (!this.autoScrollDirection) return;

		const mainGridContainer = this.container.querySelector(
			".main-grid-container"
		);
		const pageAmountX = mainGridContainer.clientWidth * 0.1;
		const pageAmountY = mainGridContainer.clientHeight * 0.1;

		let dx = 0;
		let dy = 0;
		switch (this.autoScrollDirection) {
			case "left":
				dx = -pageAmountX;
				break;
			case "right":
				dx = pageAmountX;
				break;
			case "up":
				dy = -pageAmountY;
				break;
			case "down":
				dy = pageAmountY;
				break;
		}

		// Communicate back to the main controller
		this.mainController.scrollBy(dx, dy);

		this.animationFrameId = requestAnimationFrame(
			this.autoScrollStep.bind(this)
		);
	}

	/**
	 * Public method to be called when the main pointer up event happens in the app
	 */
	handlePointerUp(e) {
		if (this.isDraggingHScroll) {
			this.isDraggingHScroll = false;
			this.hScrollThumb.releasePointerCapture(e.pointerId);
		}
		if (this.isDraggingVScroll) {
			this.isDraggingVScroll = false;
			this.vScrollThumb.releasePointerCapture(e.pointerId);
		}
		this.stopAutoScroll();
	}
}
