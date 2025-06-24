/**
 * creating numbering rows
 */
let lastRowEnd = 0;
export class rowsCanvas {
	constructor(parent, totalCanvas, lastRowEnd, zoom) {
		const parentDiv = document.querySelector(".rows");
		if (!parentDiv) throw new Error("Parent .columns element not found");

		this.canvas = document.createElement("canvas");
		this.canvas.width = 50;
		this.canvas.height = 1000;
		this.canvas.classList.add("canvas");
		parentDiv.appendChild(this.canvas);

		this.ctx = this.canvas.getContext("2d");
		this.cellHeight = 20;

		console.log(
			`\n🟢 Creating sheet ${sheetIndex}, starting at global index ${lastColumnEnd}`
		);
		this.drawRows();
	}

	drawRows() {
		const rowsFit = Math.floor(this.canvas.height / this.cellHeight);
		const startIdx = lastRowEnd;
		const endIdx = startIdx + rowsFit;

		console.log("→ Will draw indices", startIdx, "to", endIdx - 1);

		// let maxWidth = this.ctx.measureText(endIdx).width + 15;
		let maxWidth = this.canvas.width;

		createLine(
			this.ctx,
			maxWidth,
			0,
			maxWidth,
			this.canvas.height,
			1,
			"#d0d0d0"
		);

		for (let i = startIdx; i < endIdx; i++) {
			let y = (i - startIdx) * this.cellHeight;
			console.log("y", y);

			createLine(this.ctx, 0, y, maxWidth, y, 1, "#ccc");

			const label = i;
			this.ctx.font = "15px monospace";
			this.ctx.textAlign = "center";

			this.ctx.fillText(label, maxWidth / 2, y + this.cellHeight / 2 + 5);

			// const textLength = this.ctx.measureText(label).width;
			// maxWidth = Math.max(Math.floor(textLength), maxWidth);
			console.log("i: ", i);
			// console.log("Math.floor(textLength): ", Math.floor(textLength));
		}

		console.log("Maxwidth", maxWidth);
		// this.canvas.width = maxWidth;

		lastRowEnd = endIdx;
		console.log("✅ Updated lastRowEnd to", lastRowEnd);
	}
}
