function drawRect() {
	const canvas = document.getElementById("test1");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgb(200 0 0)";
		ctx.fillRect(10, 10, 100, 100);

		ctx.clearRect(20, 20, 10, 10);
		ctx.strokeRect(9, 9, 102, 102);
	}
}
window.addEventListener("load", drawRect);

function drawUsingPath() {
	const canvas = document.getElementById("test2");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");

		// ctx.beginPath();

		// ctx.moveTo(75, 50);
		// ctx.LineTo(100, 25);
		// ctx.LineTo(100, 75);
		// ctx.fill();
		ctx.beginPath();
		ctx.moveTo(75, 50);
		ctx.lineTo(100, 75);
		ctx.lineTo(100, 25);
		// ctx.fill();

		// ctx.moveTo(200, 0);
		// ctx.lineTo(100, 75);
		// ctx.lineTo(100, 25);
		ctx.closePath();
		ctx.stroke();
	}
}
drawUsingPath();

function arcs() {
	const canvas = document.getElementById("test3");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");

		ctx.beginPath();
		ctx.arc(100, 100, 50, 0, 0.000000000000000000001, true);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(80, 85, 10, 0, Math.PI * 2, true);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(120, 85, 10, 0, Math.PI * 2, true);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(100, 100, 5, 0, Math.PI * 2, true);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(100, 100, 35, Math.PI / 6, (Math.PI / 6) * 5, false);
		ctx.stroke();
		ctx.fill();
	}
}
arcs();

function curves() {
	const canvas = document.getElementById("test4");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");

		ctx.beginPath();
		ctx.moveTo(100, 100);
		ctx.bezierCurveTo(110, 30, 190, 60, 100, 150);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(100, 100);
		ctx.bezierCurveTo(90, 30, 10, 60, 100, 150);
		ctx.stroke();
	}
}
curves();

function holes() {
	const canvas = document.getElementById("test5");
	if (canvas.getContext) {
		// const ctx = canvas.getContext("2d");
		// ctx.fillStyle = "red";

		// ctx.beginPath();

		// ctx.moveTo(50, 50);
		// ctx.lineTo(150, 50);
		// ctx.lineTo(100, 150);
		// ctx.lineTo(50, 50);

		// ctx.lineTo(75, 100);
		// ctx.lineTo(120, 100);
		// ctx.lineTo(100, 60);
		// ctx.lineTo(80, 100);
		// ctx.lineTo(120, 100);
		// ctx.lineTo(75, 100);
		// // ctx.lineTo(50, 50);

		// ctx.stroke();
		// ctx.fill();

		// const circle = new Path2D();
		// // circle.moveTo(150, 150);
		// circle.fillStyle = "red";
		// circle.arc(150, 150, 50, 0, Math.PI * 2, true);

		// ctx.fill(circle);
		// circle.fillStyle = "red";
		const ctx = canvas.getContext("2d");

		// draw background
		// ctx.fillStyle = "#FD0";
		// ctx.fillRect(0, 0, 75, 75);
		// ctx.fillStyle = "#6C0";
		// ctx.fillRect(75, 0, 75, 75);
		// ctx.fillStyle = "#09F";
		// ctx.fillRect(0, 75, 75, 75);
		// ctx.fillStyle = "#F30";
		// ctx.fillRect(75, 75, 75, 75);
		// ctx.fillStyle = "#FFF";

		// // set transparency value
		// // ctx.globalAlpha = 0.2;

		// // Draw semi transparent circles
		// for (let i = 0; i < 70; i++) {
		// 	ctx.beginPath();
		// 	// ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
		// 	ctx.strokeStyle = `rgba(255, 255, 255, 0.0${i})`;
		// 	ctx.arc(75, 75, i, 0, Math.PI * 2, true);
		// 	ctx.stroke();
		// }
		// ctx.strokeStyle = "#09f";
		// ctx.beginPath();
		// ctx.moveTo(10, 10);
		// ctx.lineTo(140, 10);
		// ctx.moveTo(10, 140);
		// ctx.lineTo(140, 140);
		// ctx.stroke();

		// ctx.strokeStyle = "black";
		// ["square", "round", "square"].forEach((lineCap, i) => {
		// 	ctx.lineWidth = 15;
		// 	ctx.lineCap = lineCap;
		// 	ctx.beginPath();
		// 	ctx.moveTo(25 + i * 50, 10);
		// 	ctx.lineTo(25 + i * 50, 140);
		// 	ctx.stroke();
		// });
		let offset = 0;

		function drawRect(offset) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.setLineDash([4, 2]);
			// ctx.lineDashOffset = -offset;
			ctx.strokeRect(10, 10, 100, 100);
		}

		drawRect(offset);
		function march() {
			offset++;
			// if (offset > 5) {
			// 	offset = 0;
			// }
			drawRect(offset);
			setTimeout(march, 100);
		}

		// march();

		// let offset = 0;

		// function draw() {
		// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
		// 	ctx.setLineDash([4, 2]);
		// 	ctx.lineDashOffset = -offset;
		// 	ctx.strokeRect(10, 10, 100, 100);
		// }

		// function march() {
		// 	offset++;
		// 	if (offset > 5) {
		// 		offset = 0;
		// 	}
		// 	draw();
		// 	setTimeout(march, 20);
		// }

		// march();
	}
}
holes();
