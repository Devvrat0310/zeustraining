class BackgroundBox {
	constructor() {
		this.backgroundDiv = document.createElement("div");
		this.backgroundDiv.classList.add("bg-screen");
		document.body.appendChild(this.backgroundDiv);
	}

	get element() {
		return this.backgroundDiv;
	}
}

class ChildBox {
	constructor(parent) {
		this.parent = parent;
		this.draggableDiv = document.createElement("div");
		this.draggableDiv.classList.add("draggable-div");

		this.parent.appendChild(this.draggableDiv);
	}

	get element() {
		return this.draggableDiv;
	}

	get enableDrag() {
		const wrapperDiv = this.parent;
		const draggableDivCurr = this.draggableDiv;

		console.log(draggableDivCurr);

		console.log(draggableDivCurr.offsetLeft);
		console.log(draggableDivCurr.offsetTop);

		const ensureBoxInBounds = () => {
			console.log("resiszing");

			const containerRect = wrapperDiv.getBoundingClientRect();

			let divLeft = draggableDivCurr.offsetLeft;
			let divTop = draggableDivCurr.offsetTop;

			// divTop = Math.max(
			// 	0,
			// 	Math.min(divTop, boundBottom - draggableDivCurr.clientHeight)
			// );

			// divLeft = Math.max(
			// 	0,
			// 	Math.min(divLeft, containerRect.width - draggableDivCurr.clientWidth)
			// );

			let needsCorrection = false;
			if (divLeft + draggableDivCurr.offsetWidth > containerRect.width) {
				divLeft = containerRect.width - draggableDivCurr.offsetWidth;
				needsCorrection = true;
			}
			if (divTop + draggableDivCurr.offsetHeight > containerRect.height) {
				divTop = containerRect.height - draggableDivCurr.offsetHeight;
				needsCorrection = true;
			}
			if (divLeft < 0) {
				divLeft = 0;
				needsCorrection = true;
			}
			if (divTop < 0) {
				divTop = 0;
				needsCorrection = true;
			}
			if (needsCorrection) {
				draggableDivCurr.style.left = `${divLeft}px`;
				draggableDivCurr.style.top = `${divTop}px`;
			}
		};

		window.addEventListener("resize", ensureBoxInBounds);

		let topOffset;
		let leftOffset;

		let isDraggable = false;

		function handleStart(e) {
			const wrapperRect = wrapperDiv.getBoundingClientRect();
			const boundTop = wrapperRect.top;
			const boundLeft = wrapperRect.left;

			e.preventDefault();

			let pointerTop;
			let pointerLeft;
			const rect = draggableDivCurr.getBoundingClientRect();

			if (e.type === "touchstart") {
				pointerTop = e.touches[0].clientY;
				pointerLeft = e.touches[0].clientX;
			} else if (e.type === "pointerdown") {
				isDraggable = true;
				pointerTop = e.clientY;
				pointerLeft = e.clientX;
				draggableDivCurr.setPointerCapture(e.pointerId);
			}

			topOffset = pointerTop - (rect.top - boundTop);
			leftOffset = pointerLeft - (rect.left - boundLeft);
		}

		function handleMove(e) {
			e.preventDefault();
			let pointerTop;
			let pointerLeft;

			if (e.type === "touchmove") {
				pointerTop = e.touches[0].clientY;
				pointerLeft = e.touches[0].clientX;
			} else if (e.type === "pointermove") {
				if (!isDraggable) return;
				pointerTop = e.clientY;
				pointerLeft = e.clientX;
			}

			let divTop = pointerTop - topOffset;
			let divLeft = pointerLeft - leftOffset;

			const wrapperRect = wrapperDiv.getBoundingClientRect();

			const boundRight =
				wrapperRect.right -
				(wrapperRect.right - wrapperDiv.clientWidth);
			const boundBottom =
				wrapperRect.bottom -
				(wrapperRect.bottom - wrapperDiv.clientHeight);

			divTop = Math.max(
				0,
				Math.min(divTop, boundBottom - draggableDivCurr.clientHeight)
			);

			divLeft = Math.max(
				0,
				Math.min(divLeft, boundRight - draggableDivCurr.clientWidth)
			);

			// console.log(divTop, divLeft, "top, left before");

			// if (divLeft < 0) divLeft = 0;
			// if (divTop < 0) divTop = 0;

			// if (divLeft + draggableDivCurr.offsetWidth > wrapperRect.width) {
			// 	divLeft = wrapperRect.width - draggableDivCurr.offsetWidth;
			// 	// needsCorrection = true;
			// }
			// if (divTop + draggableDivCurr.offsetHeight > wrapperRect.height) {
			// 	divTop = wrapperRect.height - draggableDivCurr.offsetHeight;
			// 	// needsCorrection = true;
			// }

			draggableDivCurr.style.top = `${divTop}px`;
			draggableDivCurr.style.left = `${divLeft}px`;
		}

		draggableDivCurr.addEventListener("touchstart", handleStart);
		draggableDivCurr.addEventListener("pointerdown", handleStart);

		draggableDivCurr.addEventListener("touchmove", handleMove);
		draggableDivCurr.addEventListener("pointermove", handleMove);

		draggableDivCurr.addEventListener("touchend", (e) => {
			e.preventDefault();
		});

		draggableDivCurr.addEventListener("pointerup", (e) => {
			e.preventDefault();
			isDraggable = false;
			draggableDivCurr.releasePointerCapture(e.pointerId);
		});
	}
}

const parent = new BackgroundBox().element;
const draggableDiv = new ChildBox(parent);
const draggableDiv3 = new ChildBox(parent);
draggableDiv.enableDrag;
draggableDiv3.enableDrag;

const parent2 = new BackgroundBox().element;
const draggableDiv2 = new ChildBox(parent2);
draggableDiv2.enableDrag;

// const parent3 = new BackgroundBox().element;
// const draggableDiv3 = new ChildBox(parent3);
// draggableDiv3.enableDrag;
