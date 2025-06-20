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
