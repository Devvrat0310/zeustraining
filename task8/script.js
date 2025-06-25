import { columnsCanvas, allColumns } from "./components/columnHeader.js";

import { createLine, handleDynamicDPI } from "./components/canvasComponents.js";
import { allRows, rowsCanvas } from "./components/rowSidebar.js";
import { createExcelGrid, allCanvases } from "./components/excelGrid.js";

let zoom = 1;
let totalCanvas = 0;

let startColumnInView = 0;

/**
 * Checks if a zoom value is stored in localstorage and zooms in the page.
 */
function getZoom() {
	let temp = window.localStorage.getItem("zoom");

	console.log("temp zoom : ", temp);
	if (!temp) {
		zoom = 1;
		window.localStorage.setItem("zoom", 1);
	} else {
		zoom = parseFloat(temp);
	}

	console.log("updated zoom", zoom);
}

getZoom();

const mainCanvas = document.querySelector(".main-canvas");

/**
 * Creates a new canvas and updates the calue of total number of canvases
 */
function createNewCanvas() {
	allCanvases.push(new createExcelGrid(mainCanvas, totalCanvas, zoom));
	totalCanvas++;
}

for (let i = 0; i < 5; i++) {
	createNewCanvas();
}

let totalColumnSheet = 0;

let lastColumnEnd = 0;

const columnsDiv = document.getElementsByClassName("columns")[0];

const pushedOverlayColumns = document.querySelector(".pushed-overlay");

/**
 * Create a new column header canvas, updates lastColumnEnd value
 */
function createNewColumn() {
	let columnInstant = new columnsCanvas(
		columnsDiv,
		totalColumnSheet,
		lastColumnEnd,
		zoom
	);
	totalColumnSheet++;
	lastColumnEnd = columnInstant.lastColumnEnd;
	allColumns.push(columnInstant.this);
}

/**
 * Handles virtual scrolling effect for column header, scrolling towards right.
 */
function virtualScrollingColumnUp() {
	let width = 0;

	if (allColumns.length > 3) {
		allColumns.shift();
		const currentColumn = columnsDiv.removeChild(
			columnsDiv.firstElementChild
		);

		// console.log("currentColumn", currentColumn);
		// console.log("currentColumn.width", currentColumn.width);

		width += currentColumn.width;
		startColumnInView++;
	}

	if (pushedOverlayColumns.style.width) {
		let tempWidth = pushedOverlayColumns.style.width;

		let resWidth = tempWidth.slice(0, tempWidth.length - 2);

		width += parseInt(resWidth);
	}

	pushedOverlayColumns.style.width = `${width}px`;
}

/**
 * Handles virtual scrolling effect for header column, scrolling towards left
 *
 * @param {number} canvasWidth - Width of a canvas
 * @param {number} colWidth - Width of a column in a canvas
 * @param {number} totalColumnSheet - Total number of columns
 */
function virtualScrollingColumnDown(canvasWidth, colWidth, totalColumnSheet) {
	console.log(
		"canvasWidth, colWidth, totalColumnSheet",
		canvasWidth,
		colWidth,
		totalColumnSheet
	);

	let width = 0;

	if (allColumns.length > 3) {
		allColumns.pop();
	}
}

for (let i = 0; i < 3; i++) {
	createNewColumn();
}

let lastRowEnd = 0;
let totalRowSheet = 0;
const rowsDiv = document.querySelector(".rows");

function createNewRow() {
	let rowInstant = new rowsCanvas(rowsDiv, totalRowSheet, lastRowEnd, zoom);

	totalRowSheet++;
	lastRowEnd = rowInstant.lastRowEnd;
	allRows.push(rowInstant.this);
}

for (let i = 0; i < 2; i++) {
	createNewRow();
}

let totalDeltaHorizontal = 0;
let totalDeltaVertical = 0;

/**
 * Adds and removes canvas in view as per scrolling.
 *
 * @param {number} deltaY - delta scroll in either direction vertically or horizontally.
 * @param {boolean} isHorizontalScrolling - True if shift is pressed, false if not.
 */
function handleScroll(deltaY, isHorizontalScrolling) {
	console.log("deltaY", deltaY);
	if (isHorizontalScrolling) {
		totalDeltaHorizontal += deltaY;
		if (totalDeltaHorizontal >= 900) {
			// virtualScrollingColumnUp();
			createNewColumn();
			createNewCanvas();
			totalDeltaHorizontal = 0;
			console.log("totalColumnSheet", totalColumnSheet);
		} else if (totalDeltaHorizontal <= -900) {
			let len = columnsDiv.children.length;

			if (len > 2) {
				const childElement = columnsDiv.removeChild(
					columnsDiv.children[len - 1]
				);

				const columnClass = allColumns.pop();

				let canvasWidth = childElement.width;
				let colWidth = columnClass.colWidth;

				totalColumnSheet--;
				lastColumnEnd -= canvasWidth / colWidth;
			}
			totalDeltaHorizontal = 0;
			console.log("totalColumnSheet", totalColumnSheet);
		}
	} else {
		totalDeltaVertical += deltaY;
		if (totalDeltaVertical >= 900) {
			totalDeltaVertical = 0;
			createNewRow();
			createNewCanvas();
			createNewCanvas();
			totalDeltaVertical = 0;
		} else if (totalDeltaVertical <= -900) {
			let len = rowsDiv.children.length;
			if (len > 2) {
				rowsDiv.removeChild(rowsDiv.children[len - 1]);
			}
			lastRowEnd--;
			totalRowSheet--;
			totalDeltaVertical = 0;
		}
	}
}

/**
 *
 * @param {number} currZoom - Amount of zoom
 */
function zoomEachCanvas(currZoom) {
	zoom += currZoom;
	zoom = Math.min(3, Math.max(0.6, zoom));
	zoom = parseFloat(zoom.toFixed(1));

	window.localStorage.setItem("zoom", zoom);

	getZoom();

	lastColumnEnd = 0;
	lastRowEnd = 0;

	allCanvases.forEach((element) => {
		element.setZoom(zoom);
	});

	allColumns.forEach((element) => {
		lastColumnEnd = element.setZoom(zoom, lastColumnEnd);
	});

	allRows.forEach((element) => {
		lastRowEnd = element.setZoom(zoom, lastRowEnd);
	});
}

/**
 *
 * @param {Event} e - event listener for wheel event
 */
function handleZoom(e) {
	e.preventDefault();

	// Zoom in
	if (e.deltaY < 0) {
		zoomEachCanvas(0.2);
	}

	// Zoom Out
	else {
		zoomEachCanvas(-0.2);
	}
}

document.addEventListener(
	"wheel",
	(e) => {
		if (e.shiftKey) {
			handleScroll(e.deltaY, true);
		} else if (e.ctrlKey) {
			handleZoom(e);
		} else {
			console.log("unshifted");
			handleScroll(e.deltaY, false);
		}
	},
	{ passive: false }
);
