/**
 * @params
 */
class createCanvas {
	constructor(parent) {
		this.parent = parent;

		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("height", window.innerHeight * 2);
		this.canvas.setAttribute("width", window.innerWidth * 2);
		this.canvas.classList.add("canvas");

		document.body.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");

		this.rowHeight = 25;
		this.rowWidth = 50;
		this.drawGrid();
		this.selectCell();
	}

	drawGrid() {
		let i = 0;
		while (i * 10 < this.canvas.width) {
			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.moveTo(i * 50, 0);
			this.ctx.lineTo(i * 50, this.canvas.height);
			this.ctx.stroke();
			i++;
		}

		i = 0;

		while (i * 10 < this.canvas.height) {
			this.ctx.beginPath();
			this.ctx.lineWidth = 1;
			this.ctx.moveTo(0, i * 25);
			this.ctx.lineTo(this.canvas.width, i * 25);
			this.ctx.stroke();
			i++;
		}
	}

	handleScroll(deltaY, isHorizontalScrolling) {
		if (isHorizontalScrolling) {
			this.canvas.setAttribute(
				"width",
				Math.max(this.canvas.width + deltaY, window.innerWidth * 2)
			);
		} else {
			this.canvas.setAttribute(
				"height",
				Math.max(this.canvas.height + deltaY, window.innerHeight * 2)
			);
		}
		this.drawGrid();
	}

	selectCell() {
		this.canvas.addEventListener("click", (e) => {
			console.log("hehe");
			const x = e.clientX;
			const y = e.clientY;

			console.log("x, y", x, y);

			let originX = x - (x % 50);
			let originY = y - (y % 50);

			console.log("originX, originY", originX, originY);

			this.ctx.strokeStyle = "green";
			this.ctx.fillStyle = "#e8f2ec";
			this.ctx.lineWidth = 2;
			// this.ctx.beginPath();
			this.ctx.moveTo(originX - 1, originY);

			this.ctx.lineTo(originX + 50, originY);
			this.ctx.lineTo(originX + 50, originY + 25);
			this.ctx.lineTo(originX, originY + 25);
			this.ctx.lineTo(originX, originY);
			this.ctx.fill();
			this.ctx.stroke();
		});
	}

	resizeRow() {}
}

const body = document.getElementsByTagName("body");
const newCanvas = new createCanvas(body);

console.log(document.documentElement.scrollHeight);

document.addEventListener("wheel", (e) => {
	console.log("e.deltaX, e.deltaY", e.deltaX, e.deltaY);

	if (e.shiftKey) {
		console.log("shifted");
		newCanvas.handleScroll(e.deltaY, true);
	} else {
		console.log("unshifted");
		newCanvas.handleScroll(e.deltaY, false);
	}
});

// function dynamicSize() {
// 	const test6 = document.getElementById("test6");

// 	const ctx = test6.getContext("2d");

// 	let height = test6.clientHeight;
// 	let width = test6.clientWidth;

// 	console.log(height, width, "height, width");

// 	let startX;
// 	let startY;

// 	let resize = false;
// 	let resizeW = false;
// 	let resizeH = false;

// 	test6.addEventListener("pointerdown", (e) => {
// 		const rect = test6.getBoundingClientRect();

// 		startX = e.clientX - rect.left;
// 		startY = e.clientY - rect.top;

// 		const rightBound = rect.right - rect.left;
// 		const bottomBound = rect.bottom - rect.top;

// 		if (Math.floor(startX / 10) === 0 && Math.floor(startY / 10) === 0) {
// 			resize = true;
// 			resizeW = true;
// 			resizeH = true;
// 		} else if (Math.floor(startX / 10) === 0) {
// 			resize = true;
// 			resizeW = true;
// 		} else if (Math.floor(startY / 10) === 0) {
// 			resize = true;
// 			resizeH = true;
// 		} else if (
// 			Math.floor((rightBound - startX) / 10) === 0 &&
// 			Math.floor((bottomBound - startY) / 10) === 0
// 		) {
// 			resize = true;
// 			resizeW = true;
// 			resizeH = true;
// 		} else if (Math.floor((rightBound - startX) / 10) === 0) {
// 			resize = true;
// 			resizeW = true;
// 		} else if (Math.floor((bottomBound - startY) / 10) === 0) {
// 			resize = true;
// 			resizeH = true;
// 		}

// 		test6.setPointerCapture(e.pointerId);
// 	});

// 	test6.addEventListener("pointermove", (e) => {
// 		// if (!resize) return false;

// 		const rect = test6.getBoundingClientRect();
// 		const rightBound = rect.right - rect.left;
// 		const bottomBound = rect.bottom - rect.top;

// 		startX = e.clientX - rect.left;
// 		startY = e.clientY - rect.top;

// 		// cursor pointer style logic
// 		if (
// 			Math.floor((rightBound - startX) / 10) === 0 &&
// 			Math.floor((bottomBound - startY) / 10) === 0
// 		) {
// 			test6.style.cursor = "se-resize";
// 		} else if (Math.floor((rightBound - startX) / 10) === 0) {
// 			test6.style.cursor = "e-resize";
// 		} else if (Math.floor((bottomBound - startY) / 10) === 0) {
// 			test6.style.cursor = "s-resize";
// 		} else if (!test6.hasPointerCapture(e.pointerId)) {
// 			test6.style.cursor = "auto";
// 		}

// 		// resize logic

// 		let currX = e.clientX - rect.left;
// 		let currY = e.clientY - rect.top;

// 		currX = width - currX;
// 		currY = height - currY;

// 		console.log(currX, currY, "currX, currY");
// 		console.log(
// 			test6.hasPointerCapture(e.pointerId),
// 			"test6.hasPointerCapture()"
// 		);

// 		// height -= currY;
// 		if (resizeW) {
// 			let newWidth = width - currX;
// 			newWidth = Math.max(0, newWidth);
// 			test6.setAttribute("width", newWidth);
// 			console.log("currX, currY, width", currX, currY, newWidth);
// 		}
// 		if (resizeH) {
// 			let newHeight = height - currY;
// 			newHeight = Math.max(0, newHeight);
// 			test6.setAttribute("height", newHeight);
// 			console.log("currX, currY, width", currX, currY, newHeight);
// 		}
// 	});

// 	test6.addEventListener("pointerup", (e) => {
// 		if (resize) console.log("removed drag");
// 		resize = false;
// 		resizeW = false;
// 		resizeH = false;
// 		test6.releasePointerCapture(e.pointerId);
// 	});

// 	// ctx.fillRect(10, 10, 15, 40);
// }
// dynamicSize();
