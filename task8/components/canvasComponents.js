export function createLine(ctx, startX, startY, endX, endY, width, color) {
	ctx.beginPath();
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
}

export function handleDynamicDPI(canvas, context) {
	const dpr = window.devicePixelRatio || 1;
	const rect = canvas.getBoundingClientRect();

	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;

	context.scale(dpr, dpr);
	return dpr;
	// return { canvas, context };
}
